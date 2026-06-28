import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data: parsed.data,
      select: { id: true, email: true, name: true, bio: true, location: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unable to update profile" }, { status: 500 });
  }
}
