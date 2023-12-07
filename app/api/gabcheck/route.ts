import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../route";

export const POST = async (req: Request, res: NextResponse) => {
    try {
      const { id, rodada, url } = await req.json();
      await main();
      const gabarito = await prisma.gabarito.findMany({where: {rodada}});
      const check = gabarito.find(item => item.id === id && item.url === url);

      if(check){
        const resultado = "1";
        console.log("no servidor",resultado);
        return NextResponse.json({ resultado });
      } else {
        const resultado = "0";
        console.log("no servidor",resultado);
        return NextResponse.json({ resultado });
      }

    } catch (err) {
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };