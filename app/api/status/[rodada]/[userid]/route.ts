import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/route";

/*export const GET = async (req: Request, res: NextResponse) => {
    try {
        const parts = req.url.split("/status/")[1].split("/");
    const rodada = parts[0];
    const userid = parts[1];
    console.log(`rodada: ${rodada}`);
    console.log(`userid: ${userid}`);
      await main();
      const jogostat = await prisma.jogostatus.findMany({where: {rodada, userid}});
      return NextResponse.json({ message: "Success", jogostat }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };*/

  export const GET = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/status/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      console.log(`rodada: ${rodada}`);
      console.log(`userid: ${userid}`);
      await main();
      const jogostat = await prisma.jogostatus.findMany({ where: { rodada, userid } });
      return NextResponse.json(jogostat, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
  