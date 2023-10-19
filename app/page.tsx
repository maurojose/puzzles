import Quadro from './components/quadro';


async function getData() {
  const res = await fetch('http://localhost:3000/api/status/652f60cf3e496d0aea2eabd0/652f553ac96a451091112e81', { cache: 'no-store' } );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data;
}

async function estoqueData() {
  const estoquefetch = await fetch('http://localhost:3000/api/estoque/652f60cf3e496d0aea2eabd0/652f553ac96a451091112e81', { cache: 'no-store' } );

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
      <div className='botao mt-5'></div>
    </div>
  );
}