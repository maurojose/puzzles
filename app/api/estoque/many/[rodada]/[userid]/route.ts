import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

  export const GET = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/estoque/many/")[1].split("/");
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
      const parts = req.url.split("/estoque/many/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const dataToCreate = await req.json(); // Agora é um array de objetos
  
      await main();
      
      // Use um loop para percorrer o array e criar cada item
      const createdItems = await Promise.all(dataToCreate.map(async (item) => {
        const { id, qtd, url } = item;
  
        // Crie o item no banco de dados
        const estoquepost = await prisma.estoque.create({ data: { id, qtd, rodada, userid, url } });
  
        return estoquepost;
      }));
  
      return NextResponse.json({ message: "Success", createdItems }, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
  

  export const PUT = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/estoque/many/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const dataToUpdate = await req.json(); // Agora é um array de objetos
  
      const fetchIdunico = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/many/${rodada}/${userid}`);
      const jsonIdunico = await fetchIdunico.json();
      
      // Use um loop para percorrer o array e atualizar cada item
      const updates = await Promise.all(dataToUpdate.map(async (item) => {
        // Encontre o item no banco de dados com base no `id` do objeto da requisição
        const existingItem = jsonIdunico.find(existingItem => existingItem.id === item.id);
  
        if (!existingItem) {
          throw new Error(`Item com ID ${item.id} não encontrado no banco de dados.`);
        }
  
        // Realize a atualização do item no banco de dados
        return prisma.estoque.update({
          data: { qtd: item.qtd }, // Use a quantidade do objeto da requisição
          where: { idunico: existingItem.idunico }, // Use o idunico do item no banco de dados
        });
      }));
  
      return NextResponse.json({ message: "Success", updates }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };