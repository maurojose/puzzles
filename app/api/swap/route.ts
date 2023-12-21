import { NextResponse } from "next/server";

// jogostatus: tabela que tem as peças que a pessoa já organizou. Ele alimenta o quadro principal.
// estoque: tabela onde estão todas as peças que o usuário tem, nao organizadas. Ele alimenta o modal.
// gabarito é a tabela da resposta certa
// jogos: tabela onde se organiza as rodadas de jogo

export const POST = async (req: Request, res: NextResponse) => {
  try {

    interface DadosReq {
      rodada: string;
      userid: string;
      idClicado: string;
      imgEstoqueUrl: string;
      imgsEstoqueId: string;
    }

    type EstoqueData = {
      idunico: string;
      id: string;
      qtd: string;
      rodada: string;
      userid: string;
      url: string;
      data: string;
    };

    type GameStatusData = {
      idunico: string;
      id: string;
      url: string;
      rodada: string;
      userid: string;
    };

    type GabaritoData = {
      idunico: string;
      id: string;
      rodada: string;
      url: string;
    };

    type JogosData = {
      id: string;
      premio: number;
      datacomeco: Date;
      datafim: Date | null;
      ganhador: string | null;
      participantes: number | null;
      arrecadacao: number | null;
      preco: number;
    };

    type DadosUser = {
      id: string;
      saldo: string | null;
      };

    const { rodada, userid, idClicado, imgEstoqueUrl, imgsEstoqueId }: DadosReq = await req.json();

    // Verifica na tabela "jogostatus" se já existe um item com id igual ao id da peça clicada
    const fetchStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
    const jsonStatus: GameStatusData[] = await fetchStatus.json();
    const findIDStatus = jsonStatus.find((item: { id: string; }) => item.id === idClicado);

    // Pega a URL do quadrinho clicado no modal
    const urlStatus = imgEstoqueUrl;
    const requestStatus = { id: idClicado, url: urlStatus };
    
    // verifica se já existe correspondência de idClicado na tabela Status
    if (findIDStatus) {

      //readiciona 1 no quadrinho que ta devolvendo pro estoque
      const findUrlItem = findIDStatus?.url;
      const fetchQtd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`);
      const qtdJson: EstoqueData[] = await fetchQtd.json();
      const findQtd = qtdJson.find((item: { url: string; }) => item.url === findUrlItem);
      const defineQtd = findQtd?.qtd || "0";
      const quantidade = parseInt(defineQtd, 10);
      const intQtd = quantidade + 1;
      const qtd = intQtd.toString();
      const id = findQtd?.id;
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
      console.log("já tinha correspondência");
    } else {
      // Caso contrário, faz um POST na tabela Status com novos id e URL
      const postStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`, {
        method: "POST",
        body: JSON.stringify(requestStatus),
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("não tinha correspondência");
    }

    // Depois subtrai 1 no campo qtd da tabela estoque no item = imgsEstoqueId (id do quadrinho clicado no modal)
    const fetchQtd2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${rodada}/${userid}`);
    const qtdJson2: EstoqueData[] = await fetchQtd2.json();
    const findQtd2 = qtdJson2.find((item: { id: string; }) => item.id === imgsEstoqueId);
    const defineQtd2 = findQtd2?.qtd || "0";
    const quantidade2 = parseInt(defineQtd2, 10);
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
    const jsonGabarito: GabaritoData[] = await fetchGabarito.json();
    const numGabarito = jsonGabarito.length;
    const fetchNovoStatus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
    const novoStatus: GameStatusData[] = await fetchNovoStatus.json();
    const numNovoStatus = novoStatus.length;
    console.log("qtd gabarito", numGabarito);
    console.log("novo status", novoStatus);
    console.log("qtd novo status:", numNovoStatus);

    const fetchJogos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${rodada}`);
    const jogoData: JogosData = await fetchJogos.json();
    console.log("jogoData:", jogoData);
    const ganhadorAtual = jogoData.ganhador;
    console.log("valor do ganhador", ganhadorAtual);

    let isGanhador = "0";

    if (ganhadorAtual != null && ganhadorAtual !== userid) {
      // Se já existe ganhador registrado e não é o usuário, ele não é o ganhador
      console.log("é ganhador?", isGanhador);
    } else {
      // Mas se não existe, vejamos se o usuário pode ser
      console.log("ganhador nao existe");
      let resultado = 0;

      if (numGabarito === numNovoStatus) {
        for (let i = 0; i < numGabarito; i++) {
          const verItemGabarito = jsonGabarito.find((item: { id: string; }) => item.id === `${i}`);
          const verUrlItemGabarito = verItemGabarito?.url;

          const verItemStatus = novoStatus.find((item: { id: string; }) => item.id === `${i}`);
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
        const premioJson: JogosData[] = await fetchPremio.json();
        const findPremio = premioJson.find((objeto: { id: string; }) => objeto.id === rodada);
        const premioAtual =  findPremio?.premio || 0;

        console.log("premio atual é:", premioAtual);

        const fetchSaldoUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userid}`);
        const saldoUserJson: DadosUser[] = await fetchSaldoUser.json();
        const findUser = saldoUserJson.find((objeto: { id: string; }) => objeto.id === userid);
        const saldostring = findUser?.saldo || "0";
        const saldoUser =  parseInt(saldostring,10);

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