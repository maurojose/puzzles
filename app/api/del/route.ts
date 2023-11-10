import { NextResponse } from "next/server";

export const POST = async (req: Request, res: NextResponse) => {
  try {

    const { rodada, userid, idClicado } = await req.json();

    // adicionar 1 de novo no campo qtd da tabela estoque do item que já está no status

    //acho o url do item
    const fetchItemStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
    const jsonItemStatus = await fetchItemStatus.json();
    const findItemStatus = jsonItemStatus.find(item => item.id === idClicado);
    const findUrlItem = findItemStatus.url;

    //consulto a tabela estoque pra pegar o item que tem esse url
    const fetchQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`);
    const qtdJson = await fetchQtd.json();
    const findQtd = qtdJson.find(item => item.url === findUrlItem);

    //somo 1
    const quantidade = parseInt(findQtd.qtd, 10);
    const intQtd = quantidade + 1;
    const qtd = intQtd.toString();
    const id = findQtd.id;

    //put na tabela estoque com a nova quantidade
    const requestPutQtd = { id, qtd };
    const putQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`, {
      method: "PUT",
      body: JSON.stringify(requestPutQtd),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (putQtd.ok) {
      console.log("id da peça atual do status:", id, "nova quntidade (era pra ser + 1):", qtd);
    } else {
      console.log("Erro ao atualizar a peça atual do status");
    }

    //delete o item na tabela status

    const deleteStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`, {
      method: "DELETE",
      body: JSON.stringify({ id: idClicado }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteStatus.ok) {
        console.log("peça do status deletado");
        const sucesso = 1;
        return NextResponse.json(sucesso, { status: 200 });

      } else {
        console.log("Erro ao deletar a peça atual do status");
        const sucesso = 0;
        return NextResponse.json(sucesso, { status: 200 });
      }


} catch (err) {
    return NextResponse.json({ message: "Erro deletando a peça", err }, { status: 500 });
  }
};