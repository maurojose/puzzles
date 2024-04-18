'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import { carregarSaldo, estoqueData, getData, verificaGanhador, fetchbootPecas } from '../dashboard/functions';
import Icon from '@mdi/react';
import { mdiWalletOutline } from '@mdi/js';
import { mdiImageOutline } from '@mdi/js';

//Aqui to atualizando o numero de peças que o usuario comprou
const fetchPecas = async (setPecas: React.Dispatch<React.SetStateAction<string>>, setPecasCarregando: React.Dispatch<React.SetStateAction<boolean>>, idUserAtual: string, ID_RODADA:string) => {
  setPecasCarregando(true);
  let numPecas = await fetchbootPecas(idUserAtual, ID_RODADA);
  let numPecasString = numPecas.toString();
  setPecas(numPecasString);
  setPecasCarregando(false);
}

//função para retirar peça do status

async function handleDelete(
  idClicado: string,
  setDataLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    url: string;
}[]>>,
  setlistaEstoqueLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    qtd: string;
    url: string;
}[]>>,
  dataLoad: {
    id: string;
    url: string;
}[],
  setIdMudanca: React.Dispatch<React.SetStateAction<string | null>>,
  idUserAtual: string,
  ID_RODADA:string) {
  //setLoadSwap(true);
  //setEstoqueCarregando(true);
  console.log('delete: dataload -', dataLoad ); 
  const dataLoadFind = dataLoad.find((item: { id: string; }) => item.id === idClicado);
  setIdMudanca(idClicado);

  if (dataLoadFind) {
    // Se o item com o ID desejado for encontrado
    const updateData = dataLoad.filter((item: { id: string; }) => item.id !== idClicado);
    setDataLoad(updateData);

  } else {
    console.log("Item não encontrado");
  }
  const getListaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }> = await estoqueData(idUserAtual, ID_RODADA);
  setlistaEstoqueLoad(getListaEstoque);
}


//aqui é o que o sistema faz quando clico em compra. Ele faz requisição pra api/compras, que volta dizendo se já existe tem vencedor, e, se nao tiver, depois da compra, qual o saldo.
async function handleCompra(
  event: React.FormEvent<HTMLFormElement>,
  setSaldo: React.Dispatch<React.SetStateAction<string>>,
  setSaldoCarregando: React.Dispatch<React.SetStateAction<boolean>>,
  setPecas: React.Dispatch<React.SetStateAction<string>>,
  setPecasCarregando: React.Dispatch<React.SetStateAction<boolean>>,
  setlistaEstoqueLoad: React.Dispatch<React.SetStateAction<{ id: string; qtd: string; url: string; }[]>>,
  setEstoqueCarregando: React.Dispatch<React.SetStateAction<boolean>>,
  setSomaestoque: React.Dispatch<React.SetStateAction<number>>,
  idUserAtual: string,
  calcularSomaQtd: () => number,
  ID_RODADA:string) {
  event.preventDefault();
  const qtdElement = event.currentTarget.querySelector('input[name="qtd"]') as HTMLInputElement | null;
  if (qtdElement) {
    const valorQtd = qtdElement.value;

  setSaldoCarregando(true);
  setEstoqueCarregando(true);
  const requestCompra = { ID_RODADA, userid: idUserAtual, valorQtd: valorQtd };
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
  fetchPecas(setPecas, setPecasCarregando, idUserAtual, ID_RODADA);
  // Atualize o saldo na interface após a compra
  setSaldo(saldo);
  setSaldoCarregando(false);
  const getListaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }> = await estoqueData(idUserAtual, ID_RODADA);
  setlistaEstoqueLoad(getListaEstoque);
  setEstoqueCarregando(false);
  const soma = calcularSomaQtd();
  setSomaestoque(soma);
}
}

async function handleSwap(
  idClicado: string,
  setDataLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    url: string;
}[]>>,
  imgsEstoque: string,
  imgsEstoqueId: string,
  setlistaEstoqueLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    qtd: string;
    url: string;
}[]>>,
  setEstoqueCarregando: React.Dispatch<React.SetStateAction<boolean>>,
  dataLoad: {
    id: string;
    url: string;
}[],
  setIdMudanca: React.Dispatch<React.SetStateAction<string | null>>,
  setCheckItem: React.Dispatch<React.SetStateAction<string[] | null>>,
  checkItem: string[] | null,
  setidClicado: React.Dispatch<React.SetStateAction<string>>,
  setSaldo: React.Dispatch<React.SetStateAction<string>>,
  setGanhador: React.Dispatch<React.SetStateAction<boolean>>,
  setIdGanhador: React.Dispatch<React.SetStateAction<string | null>>,
  setSomaestoque: React.Dispatch<React.SetStateAction<number>>,
  idUserAtual: string,
  calcularSomaQtd: () => number,
  ID_RODADA:string)
  
  {

  setEstoqueCarregando(true);
  const dataLoadFind = dataLoad.find((item: { id: string; }) => item.id === idClicado);
  setIdMudanca(idClicado);

  if (dataLoadFind) {
    // Se o item com o ID desejado for encontrado
    const updateData = dataLoad.filter((item: { id: string; }) => item.id !== idClicado);
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

    if(arrayCheck !== null){
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
    getData(idUserAtual, ID_RODADA);
    console.log("vc é ganhador?", dataSwap);
    if(dataSwap === "1"){

      const loadSaldo = await carregarSaldo(idUserAtual);
      setSaldo(loadSaldo);

      setGanhador(true);
      const AwaitGanhador = await verificaGanhador(ID_RODADA);
      const findGanhador = AwaitGanhador.ganhadorAtual;
      setIdGanhador(findGanhador);

    }}

  } else {
    setEstoqueCarregando(false);
  }
  const getListaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }> = await estoqueData(idUserAtual, ID_RODADA);
  setlistaEstoqueLoad(getListaEstoque);
  setSomaestoque(calcularSomaQtd());
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
  ID_RODADA: string;
};

const Quadro: React.FC<QuadroProps> = ({ data, bootPecas, listaEstoque, startSaldo, dtchck, idUserAtual, ID_RODADA }) => {

  const [idClicado, setidClicado] = useState('');
  const [saldo, setSaldo] = useState(startSaldo); // Inicia com 0
  const [saldoCarregando, setSaldoCarregando] = useState(false); // Para controlar o carregamento do saldo
  const [PecasCarregando, setPecasCarregando] = useState(false); // Para controlar o carregamento do saldo de Pecas
  const [Pecas, setPecas] = useState(bootPecas);
  console.log("data começa assim: ", data);
  const [dataLoad, setDataLoad] = useState(data);
  const [loadSwap, setLoadSwap] = useState(false);
  const [listaEstoqueLoad, setlistaEstoqueLoad] = useState(listaEstoque);
  const [estoqueCarregando, setEstoqueCarregando] = useState(false);
  const [idMudanca, setIdMudanca] = useState<string | null>(null);
  const [checkItem, setCheckItem] = useState<Array<string> | null>(dtchck);
  const [ganhador, setGanhador] = useState(false);
  const [idganhador, setIdGanhador] = useState<string | null>(null);


  const calcularSomaQtd = () => {
    // Use a função reduce para somar as quantidades (qtd) de todos os elementos
    const somaQtd = listaEstoqueLoad.reduce((total, item) => {
      console.log("listaEstoque na funcao soma", listaEstoqueLoad);
      // Converte a quantidade para um número e adiciona ao total
      return total + parseInt(item.qtd, 10);
    }, 0); // O segundo argumento de reduce é o valor inicial do total
  
    return somaQtd;
  };

  const [somaestoque, setSomaestoque] = useState(() => calcularSomaQtd());;
  console.log("soma:", somaestoque);

  useEffect(() => {
    setSomaestoque(calcularSomaQtd());
  }, [listaEstoqueLoad]);

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
        isOpen={abreModal}
        setModalAberto={() => setAbreModal(!abreModal)}
        listaEstoque={listaEstoqueLoad}
        handleDelete={handleDelete}
        setlistaEstoqueLoad={setlistaEstoqueLoad}
        setDataLoad={setDataLoad}
        setLoadSwap={setLoadSwap}
        setEstoqueCarregando={setEstoqueCarregando}
        estoqueCarregando={estoqueCarregando}
        setCheckItem={setCheckItem}
        idUserAtual={idUserAtual}
        ID_RODADA={ID_RODADA}
      />
    );
  }

    const [quantity, setQuantity] = useState(1);
    const variaveladefinir = 1; // Substitua este valor pela variável desejada
  
    const handleQuantityChange = (e: { target: { value: string; }; }) => {
      const newQuantity = parseInt(e.target.value);
      setQuantity(newQuantity);
    };
  
    const calculateTotal = () => {
      return quantity * variaveladefinir;
    };

  return (
    <>
    
      {ganhador ? (
        <h1>
          We have a winner! {idganhador === idUserAtual ? (
            `It's you, Congratulations! Now you have ${saldo} coins`
          ) : (
            'Hurry, go to other game to win!'
          )}
        </h1>
      ) : (
        <div>
          {/*<div className='contadorpecas mb-0 flex justify-center'>
            {PecasCarregando || Pecas === null ? (
              <h1>Carregando saldo de peças...</h1>
            ) : (
              <h1>PEÇAS: {Pecas}/66</h1>
            )}
            </div>*/}
          <div className='quadro flex mt-10 justify-center'>
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
              setSomaestoque={setSomaestoque}
              calcularSomaQtd={calcularSomaQtd}
              ID_RODADA={ID_RODADA}
            />
          </div>
          <div className='compras flex flex-wrap justify-center mt-5'>
            <div className='status flex flex-wrap w-full justify-center px-3 py-1'>
          {saldoCarregando || saldo === null ? (
               <p className='saldo flex items-center font-bold'><Icon className='mr-2' path={mdiWalletOutline} size={1} /> Loading</p>
            ) : (
              <p className='saldo flex items-center font-bold'><Icon className='mr-2' path={mdiWalletOutline} size={1} /> ${saldo}</p>
            )}

            <p className='mx-3'>|</p>

<div className='contadorpecas flex'>
            
              <h1 className='flex gap-2' title='Número de peças únicas e repetidas'> <Icon path={mdiImageOutline} size={1} /> {Pecas}/66 - total:{somaestoque}</h1>
            
            </div>
            </div>

            <form className='compras_form flex justify-center' onSubmit={(event) => handleCompra(event, setSaldo, setSaldoCarregando, setPecas, setPecasCarregando, setlistaEstoqueLoad, setEstoqueCarregando, setSomaestoque, idUserAtual, calcularSomaQtd, ID_RODADA)}>
                <div className='flex mt-5 mb-3 justify-between'>
                <div className='flex justify-start items-center'>
                  <h3 className='mr-3 items-center'>Quantity:</h3>
                <input type="number" min={1} max={10} value={quantity}
        onChange={handleQuantityChange} name="qtd" className=' w-full inputqtd flex text-black text-center py-1' />
                </div>
                <h3 className='total ml-3 pl-6'>Total: ${calculateTotal()}</h3>
                </div>
              <div className='botao-fundo mt-2'><button disabled={saldoCarregando || saldo === '0'} className='botao' type="submit">Buy pieces</button></div>
              <div className='flex mt-2 justify-center items-center'>
                  <p>The pieces purchased are random and sometimes it will be a piece you already have.</p>
                </div>
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
