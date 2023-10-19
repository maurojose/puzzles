'use client'
import React, { useState } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import Image from 'next/image';

type QuadroProps = {
  data: Array<{ id: string; url: string }>;
  nCartas: String;
  listaEstoque: Array<{
     id: string; qtd: string; url: string;
}>;
}

const Quadro: React.FC<QuadroProps> = ({ data, nCartas, listaEstoque }) => {

  const [itemClicadoId, setItemClicadoId] = useState<string | null>(null);

  const handleItemClicado = (id: string) => {
    setItemClicadoId(id);
    setAbreModal(true);
  };

  const quadrinhos = [];
  for (let i = 0; i < 66; i++) {
    quadrinhos.push(
      <Quadrinho key={i} data={data} id={`${i}`} onClick={() => handleItemClicado(`${i}`)}/>
    );
  }

  const [abreModal, setAbreModal] = useState(false);

  return (
    <>
    <div className='contadorpecas mb-5 flex justify-center'>
        <h1>{nCartas}/66</h1>
      </div>
    <div className='quadro flex justify-center'>
      <ul className='quadrinhos grid grid-cols-6 grid-rows-11'>
        {quadrinhos}
      </ul>
      <Modalquadrinho itemClicadoId={itemClicadoId} isOpen={abreModal} setModalAberto={() => setAbreModal(!abreModal)}>
      <ul className=' grid grid-cols-6 grid-rows-11'>
          {listaEstoque.map((imgsEstoque) => (
            <li className='m2' key={imgsEstoque.id}>
             <Image src={`/PuzzleCompleto/${imgsEstoque.url}`} width={60} height={60} alt='#' style={{ cursor: 'pointer' }} />
             <p>qtd:{imgsEstoque.qtd}</p>
            </li>

          ))}
          </ul>
      </Modalquadrinho>
    </div>
    </>
  );
}

export default Quadro;