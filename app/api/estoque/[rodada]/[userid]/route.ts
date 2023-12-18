import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

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
      //console.log(`rodada: ${rodada}`);
      //console.log(`userid: ${userid}`);
      await main();
      const estoqueget = await prisma.estoque.findMany({ where: { rodada, userid } });
      return NextResponse.json(estoqueget, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
  

  export const POST = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/estoque/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id, qtd, url } = await req.json();
      await main();
      const estoquepost = await prisma.estoque.create({ data: { id, qtd, rodada, userid, url } });
      return NextResponse.json({ message: "Success", estoquepost }, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
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

      const fetchIdunico = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`);
      const jsonIdunico = await fetchIdunico.json();
      const findIdunico = jsonIdunico.find((item: { rodada: string; id: string; userid: string; }) => item.rodada === rodada && item.id === id && item.userid === userid);
      const idunico = findIdunico.idunico;

      await main();
      const updateEstoque = await prisma.estoque.update({
        data: { qtd },
        where: { idunico: idunico },
      });
      return NextResponse.json({ message: "Success", updateEstoque }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };