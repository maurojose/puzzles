import { url } from 'inspector';
import Image from 'next/image';
import React, { useState, useEffect, CSSProperties } from 'react'


const BACKGROUND_STYLE: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000,
};

const MODAL_STYLE: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  borderRadius: '10px',
  color: 'black',
  maxHeight: '80vh', // Defina a altura máxima como 80% da altura da janela
  overflowY: 'auto',
};

type ModalquadrinhoProps = {

  children: React.ReactNode;
  isOpen: boolean;
  setidClicado: React.Dispatch<React.SetStateAction<string>>;

  setModalAberto: (isOpen: boolean) => void;
  idClicado: string;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;

  handleDelete: (
    idClicado: string,
    setDataLoad: React.Dispatch<React.SetStateAction<{
      id: string;
      url: string;
  }[]>>,
    setLoadSwap: any,
    setlistaEstoqueLoad: any,
    setEstoqueCarregando: boolean,
    setModalAberto: boolean,
    dataLoad: {
      id: string;
      url: string;
  }[],
    setIdMudanca: string | null
  ) => Promise<void>;

  handleSwap: (
    idClicado: string,
    setidClicado: React.Dispatch<React.SetStateAction<string>>,
    setDataLoad: React.Dispatch<React.SetStateAction<{
      id: string;
      url: string;
  }[]>>,
    setLoadSwap: any,
    imgsEstoque: string,
    imgsEstoqueId: string,
    setlistaEstoqueLoad: any,
    setModalAberto: any,
    setEstoqueCarregando: boolean,
    dataLoad: {
      id: string;
      url: string;
  }[],
    setIdMudanca: React.Dispatch<React.SetStateAction<string | null>>,
    setSaldo: React.Dispatch<React.SetStateAction<string>>,
    setGanhador: boolean,
    setIdGanhador: string | null,
    idUserAtual: string
  ) => Promise<void>;

  setDataLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    url: string;
}[]>>;
  dataLoad: {
    id: string;
    url: string;
}[];
  setLoadSwap: any;
  setlistaEstoqueLoad: any;
  setEstoqueCarregando: any;
  estoqueCarregando: any;
  pecas: string;
  idMudanca: string | null;
  setIdMudanca: string | null;
  checkItem: string[] | null;
  setSaldo: React.Dispatch<React.SetStateAction<string>>;
  setGanhador: boolean;
  setIdGanhador: string | null;
  setCheckItem: ((value: string[] | null) => void) | null;
  idUserAtual: string;

};

export default function Modalquadrinho({
  isOpen,
  setModalAberto,
  idClicado,
  listaEstoque,
  handleSwap,
  setDataLoad,
  setLoadSwap,
  setlistaEstoqueLoad,
  setEstoqueCarregando,
  estoqueCarregando,
  dataLoad,
  setIdMudanca,
  setidClicado,
  checkItem,
  setCheckItem,
  setSaldo,
  setGanhador,
  setIdGanhador,
  idUserAtual }: ModalquadrinhoProps) {
  
  const buscaUrlAtual = dataLoad.find((item: { id: string; }) => item.id === idClicado);
  let urlAtual = "0";
  
  if(buscaUrlAtual){
    urlAtual = buscaUrlAtual.url || "0";
  }

  if (isOpen) {
    return (
              <div  className='dashpecas'>
                <div className='fecharmodal font-black' onClick={() => { setModalAberto(true); setidClicado(''); }}>x</div>
                
              
                  {estoqueCarregando? (<p>salvando...</p>) : (

                    <div className='wrappecas'>

                    <ul className='listapecas' /*className='flex flex-wrap justify-center mt-3'*/>
                      {listaEstoque
                        .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0)
                        .map((imgsEstoque) => (
                          <li key={imgsEstoque.id} className={imgsEstoque.url === urlAtual || (checkItem && checkItem.includes(imgsEstoque.id)) ? 'selectEstoque' : 'null'}>
                            <Image
                              onClick={() => handleSwap(idClicado, setDataLoad, imgsEstoque.url, imgsEstoque.id, setlistaEstoqueLoad, setEstoqueCarregando, dataLoad, setIdMudanca, setCheckItem, checkItem, setidClicado, setSaldo, setGanhador, setIdGanhador, idUserAtual)}
                              priority={true}
                              src={`/PuzzleCompleto/${imgsEstoque.url}`}
                              width={60}
                              height={60}
                              alt='#'
                              style={{ cursor: 'pointer' }}
                            />
                            <p className='text-center'>({imgsEstoque.qtd})</p>
                          </li>
                        ))}
                    </ul>
                    </div>

                  )}
              </div>
    );
  }
  return null;
}