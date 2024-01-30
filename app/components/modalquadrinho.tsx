import { url } from 'inspector';
import Image from 'next/image';
import React, { useState, useEffect, CSSProperties } from 'react'

type ModalquadrinhoProps = {

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
  ID_RODADA:string
  ) => Promise<void>;

  handleSwap: (
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
  ID_RODADA:string
  ) => Promise<void>;

  setDataLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    url: string;
}[]>>;
  dataLoad: {
    id: string;
    url: string;
}[];
  setLoadSwap: React.Dispatch<React.SetStateAction<boolean>>;
  setlistaEstoqueLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    qtd: string;
    url: string;
}[]>>;
  setEstoqueCarregando: React.Dispatch<React.SetStateAction<boolean>>;
  estoqueCarregando: boolean;
  pecas: string;
  idMudanca: string | null;
  setIdMudanca: React.Dispatch<React.SetStateAction<string | null>>;
  checkItem: string[] | null;
  setSaldo: React.Dispatch<React.SetStateAction<string>>;
  setGanhador: React.Dispatch<React.SetStateAction<boolean>>;
  setIdGanhador: React.Dispatch<React.SetStateAction<string | null>>;
  setCheckItem: React.Dispatch<React.SetStateAction<string[] | null>>;
  setSomaestoque: React.Dispatch<React.SetStateAction<number>>;
  idUserAtual: string;
  calcularSomaQtd: () => number;
  ID_RODADA:string;

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
  setSomaestoque,
  idUserAtual,
  calcularSomaQtd,
  ID_RODADA }: ModalquadrinhoProps) {
  
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
                              onClick={() => handleSwap(idClicado, setDataLoad, imgsEstoque.url, imgsEstoque.id, setlistaEstoqueLoad, setEstoqueCarregando, dataLoad, setIdMudanca, setCheckItem, checkItem, setidClicado, setSaldo, setGanhador, setIdGanhador, setSomaestoque, idUserAtual, calcularSomaQtd, ID_RODADA)}
                              priority={true}
                              src={`/${ID_RODADA}/${imgsEstoque.url}`}
                              width={60}
                              height={60}
                              alt='#'
                              style={{ cursor: 'pointer' }}
                            />
                            <p className='text-center' title="número de peças repetidas">({imgsEstoque.qtd} un.)</p>
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