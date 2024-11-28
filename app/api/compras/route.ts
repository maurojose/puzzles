import { NextResponse } from "next/server";

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const fetchJson = async (url: RequestInfo | URL) => {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
};

const handleErrors = (response: Response, errorMessage: string) => {
  if (!response.ok) {
    console.error(errorMessage);
    throw new Error("Request failed");
  }
  return response;
};

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    type DadosReq = {
      ID_RODADA: string;
      userid: string;
      valorQtd: string;
    };
    type DadosUser = {
    id: string;
    saldo: string | null;
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

    type GabaritoData = {
      idunico: string;
      id: string;
      rodada: string;
      url: string;
    };

    type EstoqueData = {
      idunico: string;
      id: string;
      qtd: string;
      rodada: string;
      userid: string;
      url: string;
      data: string;
    };

    type RequestItem = {
      id: string;
      qtd: string;
      url?: string;
    };

    const { ID_RODADA, userid, valorQtd }: DadosReq = await req.json();
    const USER_ID = userid;

    // Primeiro, acho o saldo do usuário
    const usersUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${USER_ID}`;
    const usersJson: DadosUser[] = await fetchJson(usersUrl);
    const findUser = usersJson.find((objeto: { id: string; }) => objeto.id === USER_ID);
    const saldoUser = findUser?.saldo || "0";

    // Acha o preço da peça no jogo atual
    const jogoUrl = `${process.env.NEXT_PUBLIC_API_URL}/jogos`;
    const precoJson: JogosData[] = await fetchJson(jogoUrl);
    const findPreco = precoJson.find((objeto: { id: string; }) => objeto.id === ID_RODADA);
    const precoAtual = findPreco?.preco || 0;
    const saldoNumber = parseInt(saldoUser,10);
    const valorQtdNumber = parseInt(valorQtd,10);

    const saldoUserNum = parseInt(saldoUser,10);
    const valorQtdNum = parseInt(valorQtd,10);

    if (saldoUser === null || saldoNumber < valorQtdNumber * precoAtual) {
      // Se o saldo for insuficiente, pare aqui
      const vencedor = "171";
      const saldo = "saldo menor que a quantidade de peças";
      return NextResponse.json({ vencedor, saldo }, { status: HTTP_STATUS.OK });
    } else {
      // O saldo é suficiente, continue

      // Verifica se o jogo atual existe
      const jogoData: JogosData[] = await fetchJson(jogoUrl);
      const jogoAtual = jogoData.find((objeto: { id: string; }) => objeto.id === ID_RODADA);

      if (jogoAtual) {
        const ganhadorAtual = jogoAtual.ganhador;

        if (ganhadorAtual !== null) {
          // Se já tem um ganhador, não continue
          const vencedor = "1";
          const saldo = saldoUser.toString();
          return NextResponse.json({ vencedor, saldo }, { status: HTTP_STATUS.OK });
        } else {
          console.log("Não temos um ganhador");


          let arrayPut: RequestItem[] = [];
          let arrayPost: RequestItem[] = [];
          let arrayUnicos: string[] = [];
          
          for (let i = 1; i <= valorQtdNum; i++) {
            // ID da peça
            const id = Math.floor(Math.random() * 66).toString();

            //se o valor de idCompra for encontrado em arrayunicos, verifique se o valor se encontra tb em arrayput.
            //se estiver, aumenta 1 (ou seja, qtd+1) em arrayput
            // se for encontrado em arrayunicos, mas nao em arrayput, procurar em arroypost
            //se estiver, aumenta 1 (ou seja, qtd+1) em arraypost
            //se nao for encontrado em arryunicos, segue o baile normal e adiciona o idcompra em arrayunicos.

            if(arrayUnicos.includes(id)){

              const findPut = arrayPut.find(item => item.id === id);

              if(findPut){
                const parsePut = parseInt(findPut.qtd, 10);
                const addOnePut = parsePut + 1;
                findPut.qtd = addOnePut.toString();
                console.log("mais um", id, "foi adicionado no PUT");

              } else{

                const findPost = arrayPost.find(item => item.id === id);

                if (findPost){
                  const parsePost = parseInt(findPost.qtd, 10);
                  const addOnePost = parsePost + 1;
                  findPost.qtd = addOnePost.toString();
                  console.log("mais um", id, "foi adicionado no POST");
                } else{
                  console.log("esse numero ja foi sorteado, mas nao achei no put nem no post, deu algum erro sinistro, mas num sei qual")
                }
              }


            }else{

              // URL do quadrinho aleatório
            const gabaritoUrl = `${process.env.NEXT_PUBLIC_API_URL}/gabarito`;
            const fetchUrl: GabaritoData[] = await fetchJson(gabaritoUrl);
            const urlAtual = fetchUrl.find((item: { id: string, rodada: string }) => item.id === id && item.rodada === ID_RODADA);
            const url = urlAtual?.url;

            // Verifica na tabela estoque se tem um objeto com a mesma ID
            const estoqueUrl = `${process.env.NEXT_PUBLIC_API_URL}/estoque/many/${ID_RODADA}/${USER_ID}`;
            const fetchEstoque: EstoqueData[] = await fetchJson(estoqueUrl);
            const estoqueAtual = fetchEstoque.find((objeto: { id: string; }) => objeto.id === id);

            // Se tem, pegue a quantidade
            if (estoqueAtual !== undefined) {
              const fetchqtd = parseInt(estoqueAtual.qtd, 10);
              const sumqtd = fetchqtd + 1;
              const qtd = sumqtd.toString();
              console.log("Já tem uma peça igual ao", id);

              // Atualiza o estoque usando uma requisição PUT
              const requestput = { id: id, qtd: qtd };
              arrayPut.push(requestput);
            } else {
              console.log("Não há uma peça igual a", id, "no estoque.");
              const qtd = "1";
              const requestPost = { id: id, qtd: qtd, url: url };
              arrayPost.push(requestPost);
            }
              console.log("esse numero nao foi sorteado antes");
              arrayUnicos.push(id);
              console.log("numeros sorteados:", arrayUnicos)
            }
          }

          if (arrayPut.length > 0) {
            const estoqueManyUrl = `${process.env.NEXT_PUBLIC_API_URL}/estoque/many/${ID_RODADA}/${USER_ID}`;
            const putPeca = await fetch(estoqueManyUrl, {
              method: "PUT",
              body: JSON.stringify(arrayPut),
              headers: {
                "Content-Type": "application/json",
              },
            });
            handleErrors(putPeca, "Erro ao atualizar as peças");

            console.log("Peças atualizadas com sucesso.");
          } else {
            console.log("Não há atualizações para fazer.");
          }

          if (arrayPost.length > 0) {
            const estoqueManyUrl = `${process.env.NEXT_PUBLIC_API_URL}/estoque/many/${ID_RODADA}/${USER_ID}`;
            const addPeca = await fetch(estoqueManyUrl, {
              method: "POST",
              body: JSON.stringify(arrayPost),
              headers: {
                "Content-Type": "application/json",
              },
            });
            handleErrors(addPeca, "Erro ao adicionar a peça");

            console.log("Peças adicionadas com sucesso.");
          } else {
            console.log("Não há adições para fazer.");
          }

          // Desconto o preço do saldo
          const setSaldoUser = saldoUserNum - precoAtual * valorQtdNum;
          const saldo = setSaldoUser.toString();
          const vencedor = "0";

          // Insira o saldo do usuário na tabela 'users' usando PUT
          const updateSaldoUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${USER_ID}`;
          const fetchPutSaldo = await fetch(updateSaldoUrl, {
            method: "PUT",
            body: JSON.stringify({ saldo }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          handleErrors(fetchPutSaldo, "Erro ao atualizar o saldo");

          console.log("Seu saldo agora é", saldo);
          const resCompra = { vencedor, saldo };
          return NextResponse.json(resCompra, { status: HTTP_STATUS.OK });
        }
      } else {
        console.log("Erro 404 - esse jogo não existe");
        return NextResponse.json({ message: "Erro 404 - esse jogo não existe" }, { status: HTTP_STATUS.NOT_FOUND });
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro", err }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
};
