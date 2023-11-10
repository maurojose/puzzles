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

  setModalAberto: (isOpen: boolean) => void;
  idClicado: string | null;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;

  handleDelete: (
    idClicado: string | null,
    setDataLoad: any,
    setLoadSwap: any,
    setlistaEstoqueLoad: any,
    setEstoqueCarregando: boolean
  ) => Promise<void>;

  handleSwap: (
    idClicado: string | null,
    setDataLoad: any,
    setLoadSwap: any,
    imgsEstoque: any,
    imgsEstoqueId: any,
    setlistaEstoqueLoad: any,
    setModalAberto: any,
    setEstoqueCarregando: boolean
  ) => Promise<void>;

  setDataLoad: any;
  setLoadSwap: any;
  setlistaEstoqueLoad: any;
  setEstoqueCarregando: any;
  estoqueCarregando: any;
  pecas: string;

};

export default function Modalquadrinho({ children, isOpen, pecas, setModalAberto, idClicado, listaEstoque, handleDelete, handleSwap, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando, estoqueCarregando }: ModalquadrinhoProps) {
  if (isOpen) {
    return (
      <div className='fundomodal content-start' style={BACKGROUND_STYLE}>
        <div className='quadromodal p-10' style={MODAL_STYLE}>
          <div className='fecharmodal mb-10 container content-end text-right font-black text-3xl' style={{ cursor: 'pointer' }} onClick={() => setModalAberto(true)}>
              x
          </div>
          <div className='conteudoModal container'>
            <div className='estoqueModal justify-items-center text-center'>
                <div>
                  <h4>QUADRINHO CLICADO: {idClicado}</h4>
                  <button className='botao mt-5' onClick={() => handleDelete(idClicado, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando,)}>
                    Retirar item do quadrinho atual
                  </button>
                  <div className='ListaEstoque mt-10 p-5 bg-slate-200'>
                  <h4 className='container mb-3'>PEÇAS:</h4>
                  {estoqueCarregando ? (
                <p>aguarde, atualizando o estoque...</p>
              ) : (<p>({pecas}/66)</p> )}
                  <ul className='flex flex-wrap justify-center mt-3'>
                    {listaEstoque
                      .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0)
                      .map((imgsEstoque) => (
                        <li className='m-1' key={imgsEstoque.id}>
                          <Image
                            onClick={() => handleSwap(idClicado, setDataLoad, setLoadSwap, imgsEstoque.url, imgsEstoque.id, setlistaEstoqueLoad, setEstoqueCarregando, setModalAberto)}
                            priority={true}
                            src={`/PuzzleCompleto/${imgsEstoque.url}`}
                            width={60}
                            height={60}
                            alt='#'
                            style={{ cursor: 'pointer' }}
                          />
                          <p>({imgsEstoque.qtd})</p>
                        </li>
                      ))}
                  </ul>
                  </div>
                </div>
            </div>
            <div className='compraModal text-center mt-10'>{children}</div>
          </div>
        </div>
        <div className='fecharmodalbg' onClick={() => setModalAberto(true)}></div>
      </div>
    );
  }
  return null;
}