'use client'

import React, { useState } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import Image from 'next/image';
import { USER_ID, ID_RODADA } from '../constants';
import { estoqueData, getData } from '../page';

//chamei de cartas, mas é peças. Aqui to atualizando o numero de peças que o usuario comprou
const fetchCartas = async (setCartas, setCartasCarregando) => {
  setCartasCarregando(true);
  let fetchNumCartas = await estoqueData();
  let ncartas = fetchNumCartas.length;
  setCartas(ncartas);
  setCartasCarregando(false);
}


//aqui é o que o sistema faz quando clico em compra. Ele faz requisição pra api/compras, que volta dizendo se já existe tem vencedor, e, se nao tiver, depois da compra, qual o saldo.
async function handleCompra(setSaldo, setSaldoCarregando, setCartas, setCartasCarregando) {

  const fetchCompra = await fetch(`http://localhost:3000/api/compras/${ID_RODADA}/${USER_ID}`);
  const respostaCompra = await fetchCompra.json();
  const vencedor = respostaCompra.vencedor;
  const saldo = respostaCompra.saldo;
  console.log(vencedor, saldo);
  fetchCartas(setCartas, setCartasCarregando);
  // Atualize o saldo na interface após a compra
  setSaldoCarregando(true);
  setSaldo(saldo);
  setSaldoCarregando(false);
}

async function handleSwap(idClicado, setDataLoad, setLoadSwap, imgsEstoque, imgsEstoqueId){
  setLoadSwap(true);
  const requestSwap = {rodada: ID_RODADA, userid: USER_ID, idClicado: idClicado.toString(), imgEstoqueUrl: imgsEstoque, imgsEstoqueId};
  const fetchSwap = await fetch('http://localhost:3000/api/swap', {
    method: "POST",
    body: JSON.stringify(requestSwap),
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  const dataSwap = await fetchSwap.json();
  const getDataLoad = await getData();
  setDataLoad(getDataLoad);
  setLoadSwap(false);
  console.log("vc é ganhador?", dataSwap);
}


type QuadroProps = {
  data: Array<{ id: string; url: string }>;
  bootCartas: string;
  startSaldo: string;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
};

const Quadro: React.FC<QuadroProps> = ({ data, bootCartas, listaEstoque, startSaldo }) => {
  const [idClicado, setidClicado] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(startSaldo); // Inicia com 0
  const [saldoCarregando, setSaldoCarregando] = useState(false); // Para controlar o carregamento do saldo
  const [cartasCarregando, setCartasCarregando] = useState(false); // Para controlar o carregamento do saldo de cartas
  const [cartas, setCartas] = useState(bootCartas);
  console.log("data começa assim: ", data);
  const [dataLoad, setDataLoad] = useState(data);
  const [loadSwap, setLoadSwap] = useState(false);

  const handleItemClicado = (id: string) => {
    setidClicado(id);
    setAbreModal(true);
  };

  const quadrinhos = [];
  for (let i = 0; i < 66; i++) {
    quadrinhos.push(
      <Quadrinho key={i} data={dataLoad} id={`${i}`} onClick={() => handleItemClicado(`${i}`)} />
    );
  }
  //console.log('o dataload ta aqui ó:', dataLoad); 
  const [abreModal, setAbreModal] = useState(false);

  return (
    <>
      <div className='contadorpecas mb-5 flex justify-center'>
      {cartasCarregando || cartas === null? (
        <h1>carregando saldo de cartas...</h1>
        ): (<h1>{cartas}/66</h1>)}
      </div>
      {loadSwap?(<h3>atualizando as peças</h3>):(<h3>atualizado</h3>)}
      <div className='quadro flex justify-center'>
        <ul className='quadrinhos grid grid-cols-6 grid-rows-11'>
          {quadrinhos}
        </ul>
        <Modalquadrinho idClicado={idClicado} isOpen={abreModal} setModalAberto={() => setAbreModal(!abreModal)}>
  <ul className=' grid grid-cols-6 grid-rows-11'>
    {listaEstoque
      .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0) // Converte qtd para número e faz a comparação
      .map((imgsEstoque) => (
        <li className='m2' key={imgsEstoque.id}>
          <Image
            onClick={() => handleSwap(idClicado, setDataLoad, setLoadSwap, imgsEstoque.url, imgsEstoque.id)}
            priority={true}
            src={`/PuzzleCompleto/${imgsEstoque.url}`}
            width={60}
            height={60}
            alt='#'
            style={{ cursor: 'pointer' }}
          />
          <p>qtd: {imgsEstoque.qtd}</p>
        </li>
      ))}
  </ul>
</Modalquadrinho>
      </div>
      {saldoCarregando || saldo === null ? (<h2 className='saldo mt-4'>carregando saldo...</h2>):( <h2 className='saldo mt-4'>Seu saldo é: {saldo}</h2>)}
      <button disabled={saldoCarregando || saldo === '0'} className='botao mt-5' onClick={() => handleCompra(setSaldo, setSaldoCarregando, setCartas, setCartasCarregando)}>
        Comprar
      </button>
    </>
  );
};

export default Quadro;