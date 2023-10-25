'use client'

import React, { useState, useEffect } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import Image from 'next/image';
import { USER_ID, ID_RODADA } from '../constants';

async function handleCompra(setSaldo) {
  const fetchCompra = await fetch(`http://localhost:3000/api/compras/${ID_RODADA}/${USER_ID}`);
  const respostaCompra = await fetchCompra.json();
  const vencedor = respostaCompra.vencedor;
  const saldo = respostaCompra.saldo;
  console.log(vencedor, saldo);

  // Atualize o saldo na interface após a compra
  setSaldo(saldo);
}

type QuadroProps = {
  data: Array<{ id: string; url: string }>;
  nCartas: String;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
};

const Quadro: React.FC<QuadroProps> = ({ data, nCartas, listaEstoque }) => {
  const [itemClicadoId, setItemClicadoId] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(0); // Inicialize com 0 e atualize logo em seguida
  const [saldoCarregado, setSaldoCarregado] = useState(false); // Para controlar o carregamento do saldo

  useEffect(() => {
    async function carregarSaldo() {
      const fetchUsers = await fetch(`http://localhost:3000/api/users/${USER_ID}`);
      const usersJson = await fetchUsers.json();
      const findUser = usersJson.find(objeto => objeto.id === USER_ID);
      const saldoUser = findUser.saldo;

      // Defina o saldo inicial com base no valor da API
      setSaldo(saldoUser);
      setSaldoCarregado(true);
    }

    carregarSaldo();
  }, []); // Isso carregará o saldo apenas uma vez ao montar o componente

  const handleItemClicado = (id: string) => {
    setItemClicadoId(id);
    setAbreModal(true);
  };

  const quadrinhos = [];
  for (let i = 0; i < 66; i++) {
    quadrinhos.push(
      <Quadrinho key={i} data={data} id={`${i}`} onClick={() => handleItemClicado(`${i}`)} />
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
      {saldoCarregado && <h2 className='saldo mt-4'>Seu saldo é: {saldo}</h2>}
      <button className='botao mt-5' onClick={() => handleCompra(setSaldo)}>
        Comprar
      </button>
    </>
  );
};

export default Quadro;
