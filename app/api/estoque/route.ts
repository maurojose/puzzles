import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/route";

export const GET = async (req: Request, res: NextResponse) => {
    try {
      await main();
      const estoquest = await prisma.estoque.findMany();
      return NextResponse.json({ message: "Success", estoquest }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };

  export const POST = async (req: Request, res: NextResponse) => {
    try {
      const { id, qtd, rodada, userid, url } = await req.json();
      await main();
      const estoquest = await prisma.estoque.create({ data: { id, qtd, rodada, userid, url } });
      return NextResponse.json({ message: "Success", estoquest }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };