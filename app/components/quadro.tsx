'use client'

import React, { useState } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import { USER_ID, ID_RODADA } from '../constants';
import { carregarSaldo, estoqueData, getData, verificaGanhador } from '../dashboard/page';

//Aqui to atualizando o numero de peças que o usuario comprou
const fetchPecas = async (setPecas, setPecasCarregando, idUserAtual) => {
  setPecasCarregando(true);
  let fetchNumPecas = await estoqueData(idUserAtual);
  let nPecas = fetchNumPecas.length;
  setPecas(nPecas);
  setPecasCarregando(false);
}

//função para retirar peça do status

async function handleDelete(idClicado, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando, dataLoad, setModalAberto, setIdMudanca, idUserAtual) {
  //setLoadSwap(true);
  //setEstoqueCarregando(true);
  const dataLoadFind = dataLoad.find(item => item.id === idClicado);
  setIdMudanca(idClicado);

  if (dataLoadFind) {
    // Se o item com o ID desejado for encontrado
    const updateData = dataLoad.filter(item => item.id !== idClicado);
    setDataLoad(updateData);

  } else {
    console.log("Item não encontrado");
  }

  /*const requestDelete = {rodada: ID_RODADA, userid: USER_ID, idClicado: idClicado.toString()};
  const fetchDelete = await fetch('http://localhost:3000/api/del', {
    method: "POST",
    body: JSON.stringify(requestDelete),
    headers: {
      "Content-Type": "application/json",
    },
  }
  
  );

  const dataDelete = await fetchDelete.json();
  if(dataDelete === 1){
    console.log("peça deletada com sucesso");
  }else{ console.log("peça não deletada - erro");}

  getData();*/
  const getListaEstoque = await estoqueData(idUserAtual);
  setlistaEstoqueLoad(getListaEstoque);
  //setEstoqueCarregando(false);
  //setLoadSwap(false);
}


//aqui é o que o sistema faz quando clico em compra. Ele faz requisição pra api/compras, que volta dizendo se já existe tem vencedor, e, se nao tiver, depois da compra, qual o saldo.
async function handleCompra(event, setSaldo, setSaldoCarregando, setPecas, setPecasCarregando, setlistaEstoqueLoad, setEstoqueCarregando, idUserAtual) {
  event.preventDefault();
  const valorQtd = event.target.elements.qtd.value;
  console.log('Valor:', valorQtd);

  setSaldoCarregando(true);
  setEstoqueCarregando(true);
  const requestCompra = { rodada: ID_RODADA, userid: idUserAtual, valorQtd: valorQtd };
  const fetchCompra = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compras`, {
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
  fetchPecas(setPecas, setPecasCarregando, idUserAtual);
  // Atualize o saldo na interface após a compra
  setSaldo(saldo);
  setSaldoCarregando(false);
  const getListaEstoque = await estoqueData(idUserAtual);
  setlistaEstoqueLoad(getListaEstoque);
  setEstoqueCarregando(false);
}

async function handleSwap(
  idClicado,
  setDataLoad,
  imgsEstoque,
  imgsEstoqueId,
  setlistaEstoqueLoad,
  setEstoqueCarregando,
  dataLoad,
  setIdMudanca,
  setCheckItem,
  checkItem,
  setidClicado,
  setSaldo,
  setGanhador,
  setIdGanhador,
  idUserAtual) {
  setEstoqueCarregando(true);
  const dataLoadFind = dataLoad.find(item => item.id === idClicado);
  setIdMudanca(idClicado);

  if (dataLoadFind) {
    // Se o item com o ID desejado for encontrado
    const updateData = dataLoad.filter(item => item.id !== idClicado);
    const requestUpdate = { id: idClicado, url: imgsEstoque };
    updateData.push(requestUpdate);
    console.log("dataload:", dataLoad);
    console.log("requestupdate:", requestUpdate);
    console.log("updatedata", updateData);
    setDataLoad(updateData);

  } else {
    console.log("Item não encontrado");
    const updateData = dataLoad;
    const requestUpdate = { id: idClicado, url: imgsEstoque };
    updateData.push(requestUpdate);
    console.log("dataload:", dataLoad);
    console.log("requestupdate:", requestUpdate);
    console.log("updatedata", updateData);
    setDataLoad(updateData);
  }

  const requestCheck = { id: idClicado.toString(), rodada: ID_RODADA, url: imgsEstoque };
  const fetchCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gabcheck`, {
    method: "POST",
    body: JSON.stringify(requestCheck),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataCheck = await fetchCheck.json();
  //const dataCheck = await checkDataIndividual(idClicado, imgsEstoque);
  console.log("resultado da checagem:", dataCheck.resultado);

  let arrayCheck = checkItem;


  if (dataCheck.resultado === "1") {
    const newId = parseInt(idClicado, 10) + 1;
    const newIdString = newId.toString();
    setidClicado(newIdString);
    setEstoqueCarregando(false);
    arrayCheck.push(idClicado);
    setCheckItem(arrayCheck);
    console.log("quadrinho certo:", arrayCheck);
    const requestSwap = { rodada: ID_RODADA, userid: idUserAtual, idClicado: idClicado.toString(), imgEstoqueUrl: imgsEstoque, imgsEstoqueId };
    const fetchSwap = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/swap`, {
      method: "POST",
      body: JSON.stringify(requestSwap),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataSwap = await fetchSwap.json();
    getData(idUserAtual);
    console.log("vc é ganhador?", dataSwap);
    if(dataSwap === "1"){

      const loadSaldo = await carregarSaldo(idUserAtual);
      setSaldo(loadSaldo);

      setGanhador(true);
      const AwaitGanhador = await verificaGanhador();
      const findGanhador = AwaitGanhador.ganhadorAtual;
      setIdGanhador(findGanhador);

    }

  } else {
    setEstoqueCarregando(false);
  }
  const getListaEstoque = await estoqueData(idUserAtual);
  setlistaEstoqueLoad(getListaEstoque);
  //setLoadSwap(false);
}


type QuadroProps = {
  data: Array<{ id: string; url: string }>;
  idUserAtual: string;
  bootPecas: string;
  startSaldo: string;
  dtchck: string[] | null;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
};

const Quadro: React.FC<QuadroProps> = ({ data, bootPecas, listaEstoque, startSaldo, dtchck, idUserAtual }) => {

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
  const [idMudanca, setIdMudanca] = useState<string | null>(null);
  const [checkItem, setCheckItem] = useState<Array<string> | null>(dtchck);
  const [ganhador, setGanhador] = useState(false);
  const [idganhador, setIdGanhador] = useState<string | null>(null);

  const handleItemClicado = (id: string) => {
    setidClicado(id);
    setAbreModal(true);
  };

  const [abreModal, setAbreModal] = useState(false);

  const quadrinhos = [];
  for (let i = 0; i < 66; i++) {
    quadrinhos.push(
      <Quadrinho
        key={i}
        checkItem={checkItem}
        data={dataLoad}
        idClicado={idClicado}
        id={`${i}`}
        onClick={() => handleItemClicado(`${i}`)}


        setidClicado={setidClicado}
        idMudanca={idMudanca}
        setIdMudanca={setIdMudanca}
        pecas={Pecas}
        isOpen={abreModal}
        setModalAberto={() => setAbreModal(!abreModal)}
        listaEstoque={listaEstoqueLoad}
        handleSwap={handleSwap}
        handleDelete={handleDelete}
        setlistaEstoqueLoad={setlistaEstoqueLoad}
        setDataLoad={setDataLoad}
        setLoadSwap={setLoadSwap}
        setEstoqueCarregando={setEstoqueCarregando}
        estoqueCarregando={estoqueCarregando}
        setCheckItem={setCheckItem}
        idUserAtual={idUserAtual}
      />
    );
  }
  //console.log('o dataload ta aqui ó:', dataLoad); 
  return (
    <>
    
      {ganhador ? (
        <h1>
          temos um vencedor! {idganhador === idUserAtual ? (
            `Você, parabéns! Seu saldo é ${saldo}`
          ) : (
            'Mas não foi você, melhor sorte da próxima vez.'
          )}
        </h1>
      ) : (
        <div>
          <div className='contadorpecas mb-0 flex justify-center'>
            {PecasCarregando || Pecas === null ? (
              <h1>Carregando saldo de peças...</h1>
            ) : (
              <h1>PEÇAS: {Pecas}/66</h1>
            )}
          </div>
          <div className='quadro flex justify-center'>
            <ul className='quadrinhos grid grid-cols-6 grid-rows-11'>
              {quadrinhos}
            </ul>
            <Modalquadrinho
              idClicado={idClicado}
              setidClicado={setidClicado}
              idMudanca={idMudanca}
              setIdMudanca={setIdMudanca}
              pecas={Pecas}
              isOpen={abreModal}
              setModalAberto={() => setAbreModal(!abreModal)}
              listaEstoque={listaEstoqueLoad}
              handleSwap={handleSwap}
              handleDelete={handleDelete}
              setlistaEstoqueLoad={setlistaEstoqueLoad}
              setDataLoad={setDataLoad}
              dataLoad={dataLoad}
              setLoadSwap={setLoadSwap}
              setEstoqueCarregando={setEstoqueCarregando}
              estoqueCarregando={estoqueCarregando}
              checkItem={checkItem}
              setCheckItem={setCheckItem}
              setSaldo={setSaldo}
              setGanhador={setGanhador}
              setIdGanhador={setIdGanhador}
              idUserAtual={idUserAtual}
            />
          </div>
          <div className='compras flex flex-wrap justify-center p-4'>
            {saldoCarregando || saldo === null ? (
              <h2 className='saldo'>Carregando saldo...</h2>
            ) : (
              <h2 className='saldo mt-4'>Seu saldo é: R${saldo}</h2>
            )}
            <form className='compras_form flex flex-wrap justify-center' onSubmit={(event) => handleCompra(event, setSaldo, setSaldoCarregando, setPecas, setPecasCarregando, setlistaEstoqueLoad, setEstoqueCarregando, idUserAtual)}>
              <label className='flex justify-center mt-5'>
                Quantas peças quer comprar?
                <input type="text" name="qtd" defaultValue={1} className='border-solid border mx-3 inputqtd flex text-black' />
              </label>
              <button disabled={saldoCarregando || saldo === '0'} className='flex botao mt-5' type="submit">COMPRAR PEÇAS</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
  
};

export default Quadro;


// comprar em lote
// clicar e arrastar pra organizar os quadrinhos
// mostrar premio e objetivo
// esta lento
// vender dicas
