import { ID_RODADA } from '../constants';

type idUser = string;

export async function getData(idUserAtual: idUser) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${ID_RODADA}/${idUserAtual}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data;
}

export async function getGabarito() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gabarito/${ID_RODADA}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const gabarito = await res.json();
  return gabarito;
}

export async function checkData(idUserAtual: idUser) {

  const reqGabarito = await getGabarito();
  const requestData = await getData(idUserAtual);
  let arrayCheck = [];

  for (const item of requestData) {
    const { id, rodada, url } = item;
    const check = reqGabarito.find((item: { id: string; url: string; }) => item.id === id && item.url === url);

    if (check) {
      const checkId = check.id;
      arrayCheck.push(checkId);
    } else {
      console.log("quadrinho errado", id);
    }
  }
  return arrayCheck;
};


export async function estoqueData(idUserAtual: idUser) {
  const estoquefetch = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estoque/${ID_RODADA}/${idUserAtual}`, { cache: 'no-store' });

  if (!estoquefetch.ok) {
    throw new Error('Failed to fetch data');
  }

  const estoque = await estoquefetch.json();

  return estoque;
}

export const fetchbootPecas = async (idUserAtual: idUser) => {
  const awaitBootPecas = await estoqueData(idUserAtual);
  const bootPecas = awaitBootPecas.length;
  return bootPecas;
}

export async function carregarSaldo(idUserAtual: idUser) {

  const fetchUsers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${idUserAtual}`);
  const usersJson = await fetchUsers.json();
  const findUser = usersJson.find((objeto: { id: string; }) => objeto.id === idUserAtual);
  const saldoUser = findUser.saldo;

  return saldoUser;
}

export async function verificaGanhador() {

  let ganhador = "0";
  let ganhadorAtual = "0";

  const fetchJogos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos`);
  const jogoData = await fetchJogos.json();
  const jogoAtual = jogoData.find((objeto: { id: string; }) => objeto.id === ID_RODADA);
  if (jogoAtual) {
    ganhadorAtual = jogoAtual.ganhador;
    if (ganhadorAtual !== null) {
      // Se tem um ganhador, vamos nem continuar.
      ganhador = "1";
    } else {
      console.log("iniciando sem ganhadores");
    }
  } else {
    console.log("jogos indisponíveis");
  }
  const resGanhador = { ganhador, ganhadorAtual };
  return resGanhador;
}

export async function Troca(destino: string, idUserAtual: idUser, arraySelect: Array<{ id: string; qtd: string; }>) {
  const requesttroca = { destino, idUserAtual, dados: arraySelect, };
  console.log("requesttroca", requesttroca);
  const body = JSON.stringify(requesttroca);
  console.log("body", body);
  const fetchtroca = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfer`, {
    method: "POST",
    body: JSON.stringify(requesttroca),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (fetchtroca.ok) {
    const respostaTroca = await fetchtroca.json();
    console.log("Resposta da troca bem-sucedida:", respostaTroca);
    return respostaTroca;
  } else {
    console.error("Erro na troca:", fetchtroca.status);
    return false;
  }
}