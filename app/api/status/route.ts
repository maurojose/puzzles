import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../route";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const jogostat = await prisma.jogostatus.findMany();
    return NextResponse.json(jogostat, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { id, url, rodada, userid } = await req.json();
    await main();
    const jogost = await prisma.jogostatus.create({ data: { id, url, rodada, userid } });
    return NextResponse.json({ message: "Success", jogost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};