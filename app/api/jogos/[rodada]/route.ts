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