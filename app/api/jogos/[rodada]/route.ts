import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../../route";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    const parts = req.url.split("/jogos/")[1].split("/");
    const id = parts[0];
    console.log(id);
    await main();
    const jogosget = await prisma.jogos.findMany({ where: { id } });
    console.log(jogosget);
    return NextResponse.json(jogosget, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const parts = req.url.split("/jogos/")[1].split("/");
    const rodada = parts[0];
    const { userid } = await req.json();

    await main();
    const updateJogos = await prisma.jogos.update({
      data: { ganhador: userid },
      where: { id: rodada },
    });
    return NextResponse.json({ message: "Success put status", updateJogos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error put status", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};