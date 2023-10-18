import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../route";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const usersget = await prisma.users.findMany();
    return NextResponse.json({ message: "Success", usersget }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { nome, saldo } = await req.json();
    await main();
    const userspost = await prisma.users.create({ data: { nome, saldo } });
    return NextResponse.json({ message: "Success", userspost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};