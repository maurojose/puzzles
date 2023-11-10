import { NextResponse } from "next/server";

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { rodada, userid, idClicado, imgEstoqueUrl, imgsEstoqueId } = await req.json();

    const resposta1 = { rodada, userid, idClicado, imgEstoqueUrl, imgsEstoqueId };//teste 1
    console.log(resposta1); //teste 1 resposta

    //pega a url do quadrinho clicado no modal
    const urlStatus = imgEstoqueUrl;
    console.log(urlStatus);
    

    //vamos ver agora na tabela "status" se já tem um item com id igual ao do id da peça clicada
    const fetchStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
    const jsonStatus = await fetchStatus.json();
    const findIDStatus = jsonStatus.find(item => item.id === idClicado);
    console.log("find id status:", findIDStatus);

    const requestStatus = { id: idClicado, url: urlStatus, };

    if (findIDStatus) { //se ja tem uma correspondencia de idClicado no id da tabela Status, então faz put na tabela status com novo url que pegou da tabela gabarito
      
      //mas antes tem que adicionar 1 de novo no campo qtd da tabela estoque do item que já está no status
      const fetchItemStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
      const jsonItemStatus = await fetchItemStatus.json();
      const findItemStatus = jsonItemStatus.find(item => item.id === idClicado);
      const findUrlItem = findItemStatus.url;

      const fetchQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`);
      const qtdJson = await fetchQtd.json();
      const findQtd = qtdJson.find(item => item.url === findUrlItem);
      const quantidade = parseInt(findQtd.qtd, 10);
      const intQtd = quantidade + 1;
      const qtd = intQtd.toString();
      const id = findQtd.id;
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
      
      const putStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`, {
        method: "PUT",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("ja tinha correspondencia", putStatus);

    }

    else { //senão, faz um post na tabela status com id e url novos
      const postStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`, {
        method: "POST",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log("não tinha correspondencia", postStatus, requestStatus);
    }

    //depois desconta 1 no campo qtd da tabela estoque no item = imgsEstoqueId (id do quadrinho clicado no modal)
    const fetchQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`);
    const qtdJson = await fetchQtd.json();
    const findQtd = qtdJson.find(item => item.id === imgsEstoqueId);
    const quantidade = parseInt(findQtd.qtd, 10);
    const intQtd = quantidade - 1;
    const qtd = intQtd.toString();
    const id = imgsEstoqueId;
    const requestPutQtd = { id, qtd };
    const putQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`, {
      method: "PUT",
      body: JSON.stringify(requestPutQtd),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (putQtd.ok) {
      console.log("id da peça:", id, "nova quntidade:", qtd);
    } else {
      console.log("Erro ao atualizar a peça");
    }

    //depois verifica se o novo status bate com o gabarito e decide se o usuário é o ganhador ou nao
    const fetchGabarito = await fetch('http://localhost:3000/api/gabarito');
    const jsonGabarito = await fetchGabarito.json();
    const numGabarito = jsonGabarito.length;
    const fetchNovoStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
    const novoStatus = await fetchNovoStatus.json();
    const numNovoStatus = novoStatus.length;
    console.log("qtd gabarito", numGabarito);
    console.log("novo status", novoStatus);
    console.log("qtd novo status:", numNovoStatus);

    const fetchJogos = await fetch(`http://localhost:3000/api/jogos/${rodada}`);
    const jogoData = await fetchJogos.json();
    const ganhadorAtual = jogoData.ganhador;
    console.log("valor do ganhador", ganhadorAtual);

    let isGanhador = "0";

    if (ganhadorAtual !== null && ganhadorAtual !== userid)
    { //se ja tem ganhador registrado e nao é o usuário, ele nao é o ganhador
      console.log("é ganhador?", isGanhador);
    }
    else
    {//mas se nao existe, vejamos se o usuario pode ser

      if (numGabarito !== numNovoStatus) 
      {
        console.log("não é, pq gabarito != novos status", isGanhador);
      }
      else{
  
        const verificarIgualdade = (obj1: any, obj2: any): boolean =>{
          return obj1.id === obj2.id && obj1.rodada === obj2.rodada && obj1.url === obj2.url;
        }
  
        const verificaVitoria = (status: any[], gabarito: any[]): string =>{
        for (let i = 0; i <= numGabarito; i++) {
          if (!verificarIgualdade(status[i], gabarito[i])) {
            return isGanhador;
          }
        }
        isGanhador = "1";
        return isGanhador;
      }

      const resultado = verificaVitoria(novoStatus, jsonGabarito);
  
      console.log("resultado da verificação", resultado);

    }
  }

    return NextResponse.json(isGanhador, { status: 201 });


  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  }
};