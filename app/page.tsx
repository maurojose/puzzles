import Quadro from './components/quadro';
import { USER_ID, ID_RODADA } from './constants';

export async function getData() {
  const res = await fetch(`http://localhost:3000/api/status/${ID_RODADA}/${USER_ID}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data;
}

export async function getGabarito() {
  const res = await fetch(`http://localhost:3000/api/gabarito/${ID_RODADA}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const gabarito = await res.json();
  return gabarito;
}

export async function checkData() {

  const reqGabarito = await getGabarito();
  const requestData = await getData();
  let arrayCheck = [];

  for (const item of requestData) {
    const { id, rodada, url } = item;
    const check = reqGabarito.find(item => item.id === id && item.url === url);

    if (check) {
      const checkId = check.id;
      arrayCheck.push(checkId);
    } else {
      console.log("quadrinho errado", id);
    }
  }
  return arrayCheck;
};


export async function estoqueData() {
  const estoquefetch = await fetch(`http://localhost:3000/api/estoque/${ID_RODADA}/${USER_ID}`, { cache: 'no-store' });

  if (!estoquefetch.ok) {
    throw new Error('Failed to fetch data');
  }

  const estoque = await estoquefetch.json();

  return estoque;
}

export const fetchbootPecas = async () => {
  const awaitBootPecas = await estoqueData();
  const bootPecas = awaitBootPecas.length;
  return bootPecas;
}

export async function carregarSaldo() {

  const fetchUsers = await fetch(`http://localhost:3000/api/users/${USER_ID}`);
  const usersJson = await fetchUsers.json();
  const findUser = usersJson.find(objeto => objeto.id === USER_ID);
  const saldoUser = findUser.saldo;

  return saldoUser;
}

export async function verificaGanhador(){

  let ganhador = "0";
  let ganhadorAtual = "0";

  const fetchJogos = await fetch(`http://localhost:3000/api/jogos`);
  const jogoData = await fetchJogos.json();
  const jogoAtual = jogoData.find(objeto => objeto.id === ID_RODADA);
  if(jogoAtual){
    ganhadorAtual = jogoAtual.ganhador;
      if (ganhadorAtual !== null) {
        // Se tem um ganhador, vamos nem continuar.
        ganhador = "1";
      }else{
        console.log("iniciando sem ganhadores");
      }
    }else{
      console.log("jogos indisponíveis");
    }
    const resGanhador = {ganhador, ganhadorAtual};
    return resGanhador;
}

export default async function Home() {
  const data = await getData();
  const listaEstoque = await estoqueData();
  const bootPecas = await fetchbootPecas();
  const startSaldo = await carregarSaldo();
  const dataCheck = await checkData();
  const ganhadorCheck = await verificaGanhador();
  console.log(dataCheck);
  console.log("retorno de ganhador:", ganhadorCheck);

  return (
<div className='conteudo mb-8'>
  {ganhadorCheck.ganhador === "1" ? (
    <>
      <h1>temos um ganhador, jogo encerrado</h1>
      {ganhadorCheck.ganhadorAtual === USER_ID ? (
        <h2>e o ganhador é você!</h2>
      ) : (
        <h2>mais sorte no próximo</h2>
      )}
    </>
  ) : (
    <Quadro data={data} bootPecas={bootPecas} startSaldo={startSaldo} listaEstoque={listaEstoque} dtchck={dataCheck} />
  )}
</div>


  );
}