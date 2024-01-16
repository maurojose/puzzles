import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

export const POST = async (req: Request, res: NextResponse) => {
    try {
        const {destino, idUserAtual, dados} = await req.json();
        await main();
        const dadosItems = await Promise.all(dados.map(async (item: { id: string; qtd: string; }) => {
            const { id, qtd } = item;
            return NextResponse.json({ message: "Success"}, { status: 201 });
        }));

        //acha o id do destinatario
        const findIdUser = await prisma.users.findFirst({
          where: {
            nome: destino
          }
         });
         const idUser = findIdUser?.id;

         //percorre o dadosItems e, na tabela estoque do remetente retira a "qtd" do item "id"
         //percorre o dadosItems e, na tabela estoque do destinatario adiciona a "qtd" do item "id"


    }catch (err) {
        console.error(err);
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
      }
    };