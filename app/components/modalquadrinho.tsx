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
    padding: '150px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    color: 'black',
  };
  
  type ModalquadrinhoProps = {
    isOpen: boolean;
    setModalAberto: (isOpen: boolean) => void; // Declarando o tipo da propriedade setModalAberto
    children: React.ReactNode;
  };

  export default function Modalquadrinho({ isOpen, setModalAberto, children }: ModalquadrinhoProps) {

    if(isOpen){

        return (
            <div className='fundomodal' style={BACKGROUND_STYLE}>
                <div className='conteudomodal' style={MODAL_STYLE}>
                    <div className='fecharmodal' style={{ cursor: 'pointer'}} onClick={() => setModalAberto(true)}>x</div>
                    <div>{children}</div>
                </div>
                <div className='fecharmodalbg' onClick={() => setModalAberto(true)}></div>
            </div>
          );
    }
    return null;
}
