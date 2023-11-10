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

export async function estoqueData() {
  const estoquefetch = await fetch(`http://localhost:3000/api/estoque/${ID_RODADA}/${USER_ID}`, { cache: 'no-store' });

  if (!estoquefetch.ok) {
    throw new Error('Failed to fetch data');
  }

  const estoque = await estoquefetch.json();

  return estoque;
}

export const fetchbootPecas = async () =>
{ const awaitBootPecas = await estoqueData(); 
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

export default async function Home() {
  const data = await getData();
  const listaEstoque = await estoqueData();
  const bootPecas = await fetchbootPecas();
  const startSaldo = await carregarSaldo();

  return (
    <div className='conteudo mb-8'>
      <Quadro data={data} bootPecas = {bootPecas} startSaldo={startSaldo} listaEstoque={listaEstoque} />
    </div>

  );
}