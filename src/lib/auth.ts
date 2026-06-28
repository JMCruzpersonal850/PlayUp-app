import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const AUTH_COOKIE = "playup_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "playup-dev-secret-change-in-production",
);

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
    const { payload } = await jwtVerify(token, JWT_SECRET);
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

export async function hashPassword(password: string) {
  const { hash } = await import("bcryptjs");
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  const { compare } = await import("bcryptjs");
  return compare(password, passwordHash);
}
