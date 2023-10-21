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

export default async function Home() {
  const data = await getData();
  const listaEstoque = await estoqueData();
  const nCartas = listaEstoque.length;
  console.log(data);
  console.log(listaEstoque);

  return (
    <div className='conteudo my-10'>
      <Quadro data={data} nCartas={nCartas} listaEstoque={listaEstoque}/>
    </div>
    
  );
}