'use client'
import React, { useState } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';

export default function Quadro() {


  const quadrinhos = [];
  for (let i = 0; i < 66; i++) {
    quadrinhos.push(
      <Quadrinho key={i} id={i.toString()} onClick={() => setAbreModal(true)} />
    );
  }

  const [abreModal, setAbreModal] = useState(false);

  return (
    <>
    <div className='contadorpecas mb-5 flex justify-center'>
        <h1>0/66</h1>
      </div>
    <div className='quadro flex justify-center'>
      <ul className='quadrinhos grid grid-cols-6 grid-rows-11'>
        {quadrinhos}
      </ul>
      <Modalquadrinho isOpen={abreModal} setModalAberto={() => setAbreModal(!abreModal)}>
        hahahahahahahahahahaha
      </Modalquadrinho>
    </div>
    </>
  );
}
