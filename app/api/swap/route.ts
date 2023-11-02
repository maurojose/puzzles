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
      const putStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`, {
        method: "PUT",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("ja tinha correspondencia", putStatus);
    }

    else { //senão, faz um post na tabela status com id e url novos com dados pegos na tabela gabarito
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


/*export const GET = async (req: Request, res: NextResponse) => {
  try {
   const parts = req.url.split("/swap/")[2].split("/");
    const rodada = parts[0];
    const userid = parts[1];
    const idClicado = parts[2];
    const resposta = {rodada,userid,idClicado};

    const fetchGabarito = await fetch('http://localhost:3000/api/gabarito');
    const jsonGabarito = await fetchGabarito.json();
    const findRodada = jsonGabarito.find(item => item.rodada === rodada);
    const findUrl = findRodada.find(item => item.id === idClicado);
    const urlStatus = findUrl.url;

    const fetchStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
    const jsonStatus = await fetchStatus.json();
    const findID = jsonStatus.find(item => item.id === idClicado);
    const requestStatus = { idClicado, urlStatus };


    if (findID) { //se ja tem uma correspondencia de idClicado no id da tabela Status, então faz put na tabela status com novo url que pegou da tabela gabarito
      const putStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`, {
        method: "PUT",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("ja tinha correspondencia", putStatus);
    } else { //senão, faz um post na tabela status com id e url novos com dados pegos na tabela gabarito
      const postStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`, {
        method: "POST",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log("não tinha correspondencia", postStatus);
    }

    //depois desconta 1 no campo qtd da tabela estoque no item = idClicado
    const fetchQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`);
    const qtdJson = await fetchQtd.json();
    const findQtd = qtdJson.find(item => item.id === idClicado);
    const quantidade = parseInt(findQtd.qtd, 10);
    const intQtd = quantidade-1;
    const qtd = intQtd.toString();
    const id = idClicado;

    const requestPutQtd = { id, qtd };
          const putQtd = await fetch(`http://localhost:3000/api/estoque/${rodada}/${userid}`, {
            method: "PUT",
            body: JSON.stringify(requestPutQtd),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (putQtd.ok) {
            console.log("ida da peça:", id, "quntidade:", qtd);
          } else {
            console.log("Erro ao atualizar a peça");
          }


    //depois verifica se o novo status bate com o gabarito e decide se o usuário é o ganhador ou nao
    const numGabarito = jsonGabarito.length;
    const fetchNovoStatus = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
    const novoStatus = await fetchNovoStatus.json();
    const numNovoStatus = novoStatus.length;

    const fetchJogos = await fetch('http://localhost:3000/api/jogos');
    const jogoData = await fetchJogos.json();
    const jogoAtual = jogoData.find(objeto => objeto.id === rodada);
    const ganhadorAtual = jogoAtual.find(objeto => objeto.ganhador);

    let isGanhador = "0";

    if(ganhadorAtual){
      return NextResponse.json(isGanhador, { status: 200 });
    }else{

      if (numGabarito !== numNovoStatus){
        return NextResponse.json(isGanhador, { status: 200 });
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
  
      return NextResponse.json(resultado, { status: 200 });
    }

    }


    //se o novo status bate, e na tabela jogos a rodada nao tem um ganhador, coloca na tabela jogos o id do usuario como ganhador
    return NextResponse.json(resposta,  { status: 200 });

  } catch (err) {
    return NextResponse.json("erro de status", { status: 500 });
  }
}
*/