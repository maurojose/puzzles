import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../route";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const jogosget = await prisma.jogos.findMany();
    return NextResponse.json({ message: "Success", jogosget }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { premio, datafim, ganhador, participantes, arrecadacao, preco } = await req.json();
    await main();
    const jogospost = await prisma.jogos.create({ data: { premio, datafim, ganhador, participantes, arrecadacao, preco  } });
    return NextResponse.json({ message: "Success", jogospost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};