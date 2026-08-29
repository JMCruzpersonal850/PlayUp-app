import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getEnv } from "./env";
import { prisma } from "./prisma";

const AUTH_COOKIE = "playup_session";

function getJwtSecret() {
  return new TextEncoder().encode(getEnv().jwtSecret);
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export async function createSession(
  user: SessionUser,
  options?: { secure?: boolean },
) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  const secure =
    options?.secure ??
    (process.env.PLAYUP_SECURE_COOKIES === "true" ||
      process.env.NODE_ENV === "production");

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const id = payload.sub;
    if (!id || typeof id !== "string") return null;

    return {
      id,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSessionUser();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, name: true, bio: true, location: true },
  });

  return user;
}

export function isSecureRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() === "https";
  }
  return request.url.startsWith("https://");
}

export async function hashPassword(password: string) {
  const { hash } = await import("bcryptjs");
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  const { compare } = await import("bcryptjs");
  return compare(password, passwordHash);
}
