import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { destino, idUserAtual, dados, ID_RODADA } = await req.json();

    // Certifique-se de que o corpo da requisição contenha as informações esperadas
    if (!destino || !idUserAtual || !dados || !ID_RODADA) {
      throw new Error("Corpo da requisição incompleto. Certifique-se de fornecer destino, idUserAtual, dados e rodada.");
    }

    await main();
    
    // Condição para verificar se "dados" é um array antes de chamar map
    const dataToUpdate = Array.isArray(dados) ? await Promise.all(dados.map(async (item: { id: string; qtd: string; }) => item)) : [];
    
    console.log("destinatario:", destino, "iduseratual:", idUserAtual, "dados:", dados);
    console.log("datatopudate:", dataToUpdate);
    
    // Encontrar o id do destinatário no banco de dados
    const findIdUser = await prisma.users.findFirst({
      where: {
        nome: destino
      }
    });
    const idUser = findIdUser?.id;
    if (!idUser) {
      throw new Error("Destinatário não existe");
    }

    const fetchIdunico = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/many/${ID_RODADA}/${idUserAtual}`);
    const fetchIdunicoDestinatario = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/many/${ID_RODADA}/${idUser}`);

    if (!fetchIdunico.ok) {
      throw new Error(`Erro ao obter dados do estoque do remetente. Status: ${fetchIdunico.status}`);
    }

    if (!fetchIdunicoDestinatario.ok) {
      throw new Error(`Erro ao obter dados do estoque do destinatário. Status: ${fetchIdunicoDestinatario.status}`);
    }

    const jsonIdunico = await fetchIdunico.json();
    const jsonIdunicoDestinatario = await fetchIdunicoDestinatario.json();

    // Use um loop para percorrer o array e atualizar cada item
    const updates = await Promise.all(dataToUpdate.map(async (item: { id: string; qtd: string; }) => {
      const existingItem = jsonIdunico.find((existingItem: { id: string; }) => existingItem.id === item.id);
      const existingItemDestinatario = jsonIdunicoDestinatario.find((existingItemDestinatario: { id: string; }) => existingItemDestinatario.id === item.id);

      if (!existingItem) {
        throw new Error(`Item com ID ${item.id} não encontrado no banco de dados.`);
      }

      const quantidadeAtual = parseInt(existingItem.qtd, 10);
      const quantidadeUpdate = parseInt(item.qtd, 10);
      const quantidadeNova = quantidadeAtual - quantidadeUpdate;

      // Realize a atualização do item no banco de dados
      const updateRemetente = await prisma.estoque.update({
        data: { qtd: quantidadeNova.toString() },
        where: { idunico: existingItem.idunico },
      });
      console.log(updateRemetente);

      if (!existingItemDestinatario) {
        const estoquepostDestinatario = await prisma.estoque.create({
          data: { id: item.id, qtd: item.qtd, rodada: ID_RODADA, userid: idUser, url: existingItem.url },
        });
        console.log(estoquepostDestinatario);
      }
      else{
      const quantidadeAtualDestinatario = parseInt(existingItemDestinatario.qtd, 10);
      const quantidadeUpdateDestinatario = parseInt(item.qtd, 10);
      const quantidadeNovaDestinatario = quantidadeAtualDestinatario + quantidadeUpdateDestinatario;

      const updateDestinatario = await prisma.estoque.update({
        data: { qtd: quantidadeNovaDestinatario.toString() },
        where: { idunico: existingItemDestinatario.idunico },
      });
      console.log(updateDestinatario);
      }

      const updateRes = true;

      return updateRes;
    }));

    return NextResponse.json({ message: "Success", updates }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
