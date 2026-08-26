import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.media.findMany({
      where: { type: "MOVIE" },
      orderBy: { releaseYear: "desc" },
      take: 20
    });
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
