import { NextResponse } from "next/server";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    const parts = req.url.split("/compras/")[1].split("/");
    const rodada = parts[0];
    const userid = parts[1];
    const ID_RODADA = rodada;
    const USER_ID = userid;

    // atualizar o saldo do usuário
    //primeiro acho o saldo
    const fetchUsers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${USER_ID}`);
    const usersJson = await fetchUsers.json();
    const findUser = usersJson.find(objeto => objeto.id === USER_ID);
    const saldoUser = findUser.saldo;

    // ID da peça
    const idCompra = Math.floor(Math.random() * 66); // Define uma ID aleatória entre 0 e 65
    const id = idCompra.toString(); // Converte a ID para string

    // URL do quadrinho aleatorio
    const fetchUrl = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gabarito`); // Faz requisição do gabarito para buscar URL do ID
    const urlStatus = await fetchUrl.json(); // Transforma a resposta em um JSON
    const urlAtual = urlStatus.find(item => item.id === id); // Pega o objeto que tem o ID igual à ID gerada aleatoriamente
    const url = urlAtual.url; // Pega a chave "url" desse objeto

    // Verifica aqui se o jogo atual existe
    const fetchJogos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos`, { cache: 'no-store' });
    const jogoData = await fetchJogos.json();
    const jogoAtual = jogoData.find(objeto => objeto.id === ID_RODADA);
    //se o saldo for 0, para aqui mesmo.
    if(saldoUser === null || saldoUser === '0'){
      const vencedor = "10"; //só pra identificar esse trecho
      const saldo = "0"; // só pra identificar esse trecho
      const resCompra = {vencedor, saldo};
      return NextResponse.json(resCompra, { status: 200 });
    }
    else{
    // Se existe, tem um ganhador?
    if (jogoAtual) {
      const ganhadorAtual = jogoAtual.ganhador;
      if (ganhadorAtual !== null) {
        // Se tem um ganhador, vamos nem continuar.
        const vencedor = "1";
        const saldo = saldoUser.toString();
        const resCompra = { vencedor, saldo };
        return NextResponse.json(resCompra, { status: 200 });
      } else {
        // Se não tem um ganhador, podemos prosseguir.
        console.log("Não temos um ganhador");
        // Ao comprar, temos que atualizar a tabela de estoque. Verificamos se tem um objeto que já tem o ID aleatório gerado aqui.
        const fetchEstoque = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${ID_RODADA}/${USER_ID}`, { cache: 'no-store' });
        const estoqueStatus = await fetchEstoque.json();
        const estoqueAtual = estoqueStatus.find(objeto => objeto.id === id);

        // Se tem, pegue a quantidade
        if (estoqueAtual !== undefined) {
          const fetchqtd = parseInt(estoqueAtual.qtd, 10);
          const sumqtd = fetchqtd + 1; // Soma 1
          const qtd = sumqtd.toString();
          console.log("Já tem uma peça igual ao", idCompra);

          // Atualiza o estoque usando uma requisição PUT
          const requestput = { id, qtd };
          const putPeca = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${ID_RODADA}/${USER_ID}`, {
            method: "PUT",
            body: JSON.stringify(requestput),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (putPeca.ok) {
            console.log("Peça atualizada com sucesso, agora tem", qtd);
          } else {
            console.log("Erro ao atualizar a peça");
          }
        } else {
          // se não tem um igual, vou adicionar
          console.log("Não há uma peça igual a", idCompra, "no estoque.");
          const qtd = "1";
          const requestBody = { id, qtd, url };

          // Adiciona a peça ao estoque usando uma requisição POST
          const addPeca = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${ID_RODADA}/${USER_ID}`, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (addPeca.ok) {
            console.log("Peça adicionada com sucesso");
          } else {
            console.log("Erro ao adicionar a peça");
          }
        }

        //depois acho o preço da peça pra descontar do saldo
        const fetchPreco = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos`);
        const precoJson = await fetchPreco.json();
        const findPreco = precoJson.find(objeto => objeto.id === ID_RODADA);
        const precoAtual = findPreco.preco;
        //desconto o preço do saldo
        const setSaldoUser = saldoUser - precoAtual;
        const saldo = setSaldoUser.toString();
        const vencedor = "0";
        //insiro o valor na tabela

        const fetchPutSaldo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${USER_ID}`, {
          method: "PUT",
          body: JSON.stringify({saldo}),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const verificafetch = await fetchPutSaldo.json();
        console.log(verificafetch);

        if (fetchPutSaldo.ok) {
          console.log("seu saldo agora é ", saldo);
          const resCompra = { vencedor, saldo };
          return NextResponse.json(resCompra, { status: 200 });
        } else {
          console.log("Erro ao atualizar o saldo");
        }
      }
    } else {
      console.log("Erro 404 - esse jogo não existe");
    }

  }

  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  }
};