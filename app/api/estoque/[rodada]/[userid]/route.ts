import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/route";

/*export const GET = async (req: Request, res: NextResponse) => {
    try {
        const parts = req.url.split("/estoque/")[1].split("/");
    const rodada = parts[0];
    const userid = parts[1];
    console.log(`rodada: ${rodada}`);
    console.log(`userid: ${userid}`);
      await main();
      const estoquest = await prisma.estoque.findMany({where: {rodada, userid}});
      return NextResponse.json({ message: "Success", estoquest }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };*/

  export const GET = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/estoque/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      console.log(`rodada: ${rodada}`);
      console.log(`userid: ${userid}`);
      await main();
      const estoqueget = await prisma.estoque.findMany({ where: { rodada, userid } });
  
      // Mapeie o array jogostat para retornar apenas as chaves desejadas
      const estoquemap = estoqueget.map((item) => {
        return {
          id: item.id,
          qtd: item.qtd,
          rodada: item.rodada,
          userid: item.userid,
          url: item.url,
          data: item.data,
        };
      });
  
      return NextResponse.json(estoquemap, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };

  export const PUT = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/estoque/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id, qtd } = await req.json();
      await main();
      const updateEstoque = await prisma.estoque.update({
        data: { qtd },
        where: { id, rodada, userid },
      });
      return NextResponse.json({ message: "Success", updateEstoque }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };