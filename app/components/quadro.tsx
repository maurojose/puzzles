'use client'

import React, { useState } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import { USER_ID, ID_RODADA } from '../constants';
import { estoqueData, getData } from '../page';

//Aqui to atualizando o numero de peças que o usuario comprou
const fetchPecas = async (setPecas, setPecasCarregando) => {
  setPecasCarregando(true);
  let fetchNumPecas = await estoqueData();
  let nPecas = fetchNumPecas.length;
  setPecas(nPecas);
  setPecasCarregando(false);
}

//função para retirar peça do status

async function handleDelete(idClicado, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando,){
  setLoadSwap(true);
  setEstoqueCarregando(true);
  const requestDelete = {rodada: ID_RODADA, userid: USER_ID, idClicado: idClicado.toString()};
  const fetchDelete = await fetch('http://localhost:3000/api/del', {
    method: "POST",
    body: JSON.stringify(requestDelete),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataDelete = await fetchDelete.json();
  if(dataDelete === 1){
    console.log("peça deletada com sucesso");
  }else{ console.log("peça não deletada - erro");}

  const getDataLoad = await getData();
  const getListaEstoque = await estoqueData();
  setlistaEstoqueLoad(getListaEstoque);
  setEstoqueCarregando(false);
  setDataLoad(getDataLoad);
  setLoadSwap(false);
}


//aqui é o que o sistema faz quando clico em compra. Ele faz requisição pra api/compras, que volta dizendo se já existe tem vencedor, e, se nao tiver, depois da compra, qual o saldo.
async function handleCompra(event, setSaldo, setSaldoCarregando, setPecas, setPecasCarregando, setlistaEstoqueLoad, setEstoqueCarregando) {
  event.preventDefault();
  const valorQtd = event.target.elements.qtd.value;
  console.log('Valor:', valorQtd);

  setSaldoCarregando(true);
  setEstoqueCarregando(true);
  const requestCompra = {rodada:ID_RODADA, userid: USER_ID, valorQtd: valorQtd};
  const fetchCompra = await fetch('http://localhost:3000/api/compras', {
    method: "POST",
    body: JSON.stringify(requestCompra),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respostaCompra = await fetchCompra.json();
  const vencedor = respostaCompra.vencedor;
  const saldo = respostaCompra.saldo;
  console.log(vencedor, saldo);
  fetchPecas(setPecas, setPecasCarregando);
  // Atualize o saldo na interface após a compra
  setSaldo(saldo);
  setSaldoCarregando(false);
  const getListaEstoque = await estoqueData();
  setlistaEstoqueLoad(getListaEstoque);
  setEstoqueCarregando(false);
}

async function handleSwap(idClicado, setDataLoad, setLoadSwap, imgsEstoque, imgsEstoqueId, setlistaEstoqueLoad, setEstoqueCarregando, setModalAberto){
  setLoadSwap(true);
  //setModalAberto(false);
  setEstoqueCarregando(true);
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
  const getListaEstoque = await estoqueData();
  setlistaEstoqueLoad(getListaEstoque);
  setEstoqueCarregando(false);
  setDataLoad(getDataLoad);
  setLoadSwap(false);
  console.log("vc é ganhador?", dataSwap);
}


type QuadroProps = {
  data: Array<{ id: string; url: string }>;
  bootPecas: string;
  startSaldo: string;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
};

const Quadro: React.FC<QuadroProps> = ({ data, bootPecas, listaEstoque, startSaldo }) => {
  const [idClicado, setidClicado] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(startSaldo); // Inicia com 0
  const [saldoCarregando, setSaldoCarregando] = useState(false); // Para controlar o carregamento do saldo
  const [PecasCarregando, setPecasCarregando] = useState(false); // Para controlar o carregamento do saldo de Pecas
  const [Pecas, setPecas] = useState(bootPecas);
  //console.log("data começa assim: ", data);
  const [dataLoad, setDataLoad] = useState(data);
  const [loadSwap, setLoadSwap] = useState(false);
  const [listaEstoqueLoad, setlistaEstoqueLoad] = useState(listaEstoque);
  const [estoqueCarregando, setEstoqueCarregando] = useState(false);

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
      <div className='contadorpecas mb-0 flex justify-center'>
      {PecasCarregando || Pecas === null? (
        <h1>carregando saldo de Pecas...</h1>
        ): (<h1>PEÇAS: {Pecas}/66</h1>)}
      </div>
      {loadSwap?(<h3>atualizando as peças</h3>):(<h3>atualizado</h3>)}
      <div className='quadro flex justify-center'>
        <ul className='quadrinhos grid grid-cols-6 grid-rows-11'>
          {quadrinhos}
        </ul>
        <Modalquadrinho
        idClicado={idClicado}
        pecas = {Pecas}
        isOpen={abreModal}
        setModalAberto={() => setAbreModal(!abreModal)}
        listaEstoque={listaEstoqueLoad}
        handleSwap={handleSwap}
        handleDelete={handleDelete}
        setlistaEstoqueLoad = {setlistaEstoqueLoad}
        setDataLoad = {setDataLoad}
        setLoadSwap = {setLoadSwap}
        setEstoqueCarregando = {setEstoqueCarregando}
        estoqueCarregando = {estoqueCarregando}
        >

          {saldoCarregando || saldo === null ? (<h2 className='saldo mt-4'>carregando saldo...</h2>):( <h2 className='saldo mt-4'>Seu saldo é: R${saldo}</h2>)}
          {/* <button
          disabled={saldoCarregando || saldo === '0'}
          className='botao mt-5'
          onClick=
            {
              () => handleCompra(setSaldo, setSaldoCarregando, setPecas, setPecasCarregando, setlistaEstoqueLoad, setEstoqueCarregando)
            }>
            COMPRAR NOVA PEÇA POR R$1
          </button> */}
          <form onSubmit={(event) => handleCompra(event, setSaldo, setSaldoCarregando, setPecas, setPecasCarregando, setlistaEstoqueLoad, setEstoqueCarregando)}>
      <label>
        Quantas peças quer comprar?
        <input type="text" name="qtd" defaultValue={1} className='border-solid border mx-3 inputqtd' />
      </label>
      <button disabled={saldoCarregando || saldo === '0'} className='botao mt-5' type="submit">COMPRAR PEÇAS</button>
    </form>
          

        </Modalquadrinho>
      </div>
    </>
  );
};

export default Quadro;


// comprar em lote
// clicar e arrastar pra organizar os quadrinhos
// mostrar premio e objetivo
// esta lento
// vender dicas
