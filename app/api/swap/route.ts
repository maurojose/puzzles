import { NextResponse } from "next/server";

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { rodada, userid, idClicado, imgEstoqueUrl, imgsEstoqueId } = await req.json();

    const resposta1 = { rodada, userid, idClicado, imgEstoqueUrl, imgsEstoqueId }; // Teste 1
    console.log(resposta1); // Teste 1 resposta

    // Pega a URL do quadrinho clicado no modal
    const urlStatus = imgEstoqueUrl;
    console.log(urlStatus);

    // Verifica na tabela "status" se já existe um item com id igual ao id da peça clicada
    const fetchStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
    const jsonStatus = await fetchStatus.json();
    const findIDStatus = jsonStatus.find(item => item.id === idClicado);
    console.log("find id status:", findIDStatus);

    const requestStatus = { id: idClicado, url: urlStatus };

    if (findIDStatus) {
      // Se já existe correspondência de idClicado na tabela Status, faz PUT na tabela Status com novo URL
      const fetchItemStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
      const jsonItemStatus = await fetchItemStatus.json();
      const findItemStatus = jsonItemStatus.find(item => item.id === idClicado);
      const findUrlItem = findItemStatus.url;

      const fetchQtd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`);
      const qtdJson = await fetchQtd.json();
      const findQtd = qtdJson.find(item => item.url === findUrlItem);
      const quantidade = parseInt(findQtd.qtd, 10);
      const intQtd = quantidade + 1;
      const qtd = intQtd.toString();
      const id = findQtd.id;
      const requestPutQtd = { id, qtd };
      const putQtd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`, {
        method: "PUT",
        body: JSON.stringify(requestPutQtd),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (putQtd.ok) {
        console.log("id da peça atual do status:", id, "nova quantidade (era para ser +1):", qtd);
      } else {
        console.log("Erro ao atualizar a peça atual do status");
      }

      const putStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`, {
        method: "PUT",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("já tinha correspondência", putStatus);
    } else {
      // Caso contrário, faz um POST na tabela Status com novos id e URL
      const postStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`, {
        method: "POST",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("não tinha correspondência", postStatus, requestStatus);
    }

    // Depois subtrai 1 no campo qtd da tabela estoque no item = imgsEstoqueId (id do quadrinho clicado no modal)
    const fetchQtd2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`);
    const qtdJson2 = await fetchQtd2.json();
    const findQtd2 = qtdJson2.find(item => item.id === imgsEstoqueId);
    const quantidade2 = parseInt(findQtd2.qtd, 10);
    const intQtd2 = quantidade2 - 1;
    const qtd2 = intQtd2.toString();
    const id2 = imgsEstoqueId;
    const requestPutQtd2 = { id: id2, qtd: qtd2 };
    const putQtd2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`, {
      method: "PUT",
      body: JSON.stringify(requestPutQtd2),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (putQtd2.ok) {
      console.log("id da peça:", id2, "nova quantidade:", qtd2);
    } else {
      console.log("Erro ao atualizar a peça");
    }

    // Verifica se o novo status bate com o gabarito e decide se o usuário é o ganhador ou não
    const fetchGabarito = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gabarito/${rodada}`);
    const jsonGabarito = await fetchGabarito.json();
    const numGabarito = jsonGabarito.length;
    const fetchNovoStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
    const novoStatus = await fetchNovoStatus.json();
    const numNovoStatus = novoStatus.length;
    console.log("qtd gabarito", numGabarito);
    console.log("novo status", novoStatus);
    console.log("qtd novo status:", numNovoStatus);

    const fetchJogos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${rodada}`);
    const jogoData = await fetchJogos.json();
    const ganhadorAtual = jogoData.ganhador;
    console.log("valor do ganhador", ganhadorAtual);

    let isGanhador = "0";

    if (ganhadorAtual !== undefined && ganhadorAtual !== userid) {
      // Se já existe ganhador registrado e não é o usuário, ele não é o ganhador
      console.log("é ganhador?", isGanhador);
    } else {
      // Mas se não existe, vejamos se o usuário pode ser

      let resultado = 0;

      if (numGabarito !== numNovoStatus) {
        console.log("não é, porque gabarito != novos status", isGanhador);
      } else {
        for (let i = 0; i < numGabarito; i++) {
          const verItemGabarito = jsonGabarito.find(item => item.id === i);
          const verUrlItemGabarito = verItemGabarito?.url;

          const verItemStatus = novoStatus.find(item => item.id === i);
          const verUrlItemStatus = verItemStatus?.url;

          if (verUrlItemGabarito === verUrlItemStatus) {
            resultado++;
          }
        }
        console.log("resultado da verificação de número de itens corretos:", resultado);
        if (resultado === 66) {
          const novoGanhador = {userid: userid};

          const putGanhador = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${rodada}`, {
          method: "PUT",
          body: JSON.stringify(novoGanhador),
          headers: {
          "Content-Type": "application/json"
        }
      });
      if (putGanhador.ok) {
        console.log("parabéns");
        isGanhador = "1";

        const fetchPremio = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos`);
        const premioJson = await fetchPremio.json();
        const findPremio = premioJson.find(objeto => objeto.id === rodada);
        const premioAtual =  findPremio.premio;

        console.log("premio atual é:", premioAtual);

        const fetchSaldoUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userid}`);
        const saldoUserJson = await fetchSaldoUser.json();
        const findUser = saldoUserJson.find(objeto => objeto.id === userid);
        const saldoUser =  parseInt(findUser.saldo,10);

        console.log("saldo atual do usuario é:", saldoUser);

        //coloco o premio no saldo
        const setSaldoUser = saldoUser + premioAtual;
        const saldo = setSaldoUser.toString();
        //insiro o valor na tabela

        const fetchPutSaldo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userid}`, {
          method: "PUT",
          body: JSON.stringify({saldo}),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const verificafetch = await fetchPutSaldo.json();
        console.log(verificafetch);

        if (fetchPutSaldo.ok) {
          console.log("boa, vc venceu e seu saldo agora é ", saldo);
        } else {
          console.log("Erro ao atualizar o saldo do ganhador");
        }


      } else {
        console.log("Erro ao atualizar o saldo do ganhador");
      }
        
        }
      }
    }
    return NextResponse.json(isGanhador, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  }
};

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
    const fetchGabarito = await fetch(`http://localhost:3000/api/gabarito/${rodada}`);
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

    if (ganhadorAtual !== undefined && ganhadorAtual !== userid)
    { //se ja tem ganhador registrado e nao é o usuário, ele nao é o ganhador
      console.log("é ganhador?", isGanhador);
    }
    else
    {//mas se nao existe, vejamos se o usuario pode ser

      let resultado = 0;

      if (numGabarito !== numNovoStatus) 
      {
        console.log("não é, pq gabarito != novos status", isGanhador);
      }
      else{
        for (let i = 0; i = numGabarito; i++) {
          const verItemGabarito = jsonGabarito.find(item => item.id === i);
          const verUrlItemGabarito = verItemGabarito.url;

          const verItemStatus = novoStatus.find(item => item.id === i);
          const verUrlItemStatus = verItemStatus.url;

          if (verUrlItemGabarito === verUrlItemStatus){

            resultado++;

          }
        }
        console.log("resultado da verificação de numero de itens corretos:", resultado)
        if(resultado === 65 ){
          isGanhador = "1";
        }
  }
    }
    return NextResponse.json(isGanhador, { status: 201 });


  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  }
};*/