import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

export const POST = async (req: Request, res: NextResponse) => {
    try {
        const {nome, dados} = await req.json();
        await main();
        const dadosItems = await Promise.all(dados.map(async (item: { id: string; qtd: string; }) => {
            const { id, qtd } = item;
            return NextResponse.json({ message: "Success"}, { status: 201 });
        }));

    }catch (err) {
        console.error(err);
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
      }
    };