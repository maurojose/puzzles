import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../../main";

export const GET = async (req: Request, res: NextResponse) => {
  
  try {
    const parts = req.url.split("/gabarito/")[1].split("/");
    const rodada = parts[0];
    await main();
    const gabaritoget = await prisma.gabarito.findMany({where: {rodada}});
    return NextResponse.json(gabaritoget, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
  }
};