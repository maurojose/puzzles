'use client'
import React, { useState } from 'react';
import Quadrinho from './quadrinho';
import Modalquadrinho from './modalquadrinho';
import Image from 'next/image';
import { USER_ID, ID_RODADA } from '../constants';

async function handleCompra() {

  // ID da peça
  const idCompra = Math.floor(Math.random() * 66); // Define uma ID aleatória entre 0 e 65
  const id = idCompra.toString(); // Converte a ID para string

  // URL
  const fetchUrl = await fetch("http://localhost:3000/api/gabarito"); // Faz requisição do gabarito para buscar URL do ID
  const urlStatus = await fetchUrl.json(); // Transforma a resposta em um JSON
  const urlAtual = urlStatus.find(item => item.id === id); // Pega o objeto que tem o ID igual à ID gerada aleatoriamente
  const url = urlAtual.url; // Pega a chave "url" desse objeto

  // Verifica aqui se o jogo atual existe e se tem um ganhador
  const fetchJogos = await fetch(`http://localhost:3000/api/jogos`, { cache: 'no-store' });
  const jogoData = await fetchJogos.json();
  const jogoAtual = jogoData.find(objeto => objeto.id === ID_RODADA);

  // Se existe, tem um ganhador?
  if (jogoAtual) {
    const ganhadorAtual = jogoAtual.ganhador;
    if (ganhadorAtual !== null) {
      // Se tem um ganhador, vamos nem continuar.
      console.log("Para tudo! Temos um ganhador");
    } else {
      // Se não tem um ganhador, podemos prosseguir.
      console.log("Não temos um ganhador");
      // Ao comprar, temos que atualizar a tabela de estoque. Verificamos se tem um objeto que já tem o ID aleatório gerado aqui.
      const fetchEstoque = await fetch(`http://localhost:3000/api/estoque/${ID_RODADA}/${USER_ID}`, { cache: 'no-store' });
      const estoqueStatus = await fetchEstoque.json();
      const estoqueAtual = estoqueStatus.find(objeto => objeto.id === id);

      // Se tem, pegue a quantidade
      if (estoqueAtual !== undefined) {
        const fetchqtd = parseInt(estoqueAtual.qtd, 10);
        const sumqtd = fetchqtd + 1; // Soma 1
        const qtd = sumqtd.toString();
        console.log("Já tem uma peça igual ao", idCompra, "no estoque:", estoqueStatus);

        // Atualiza o estoque usando uma requisição PUT
        const requestput = { id, qtd };
        const putPeca = await fetch(`http://localhost:3000/api/estoque/${ID_RODADA}/${USER_ID}`, {
          method: "PUT",
          body: JSON.stringify(requestput),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (putPeca.ok) {
          console.log("Peça atualizada com sucesso, agora tem", qtd);
        } else {
          console.log("Erro ao atualizar a peça");
        }
      } else {
        // se não tem um igual, vou adicionar
        console.log("Não há uma peça igual a", idCompra, "no estoque.");
        const qtd = "1";
        const requestBody = { id, qtd, url };

        // Adiciona a peça ao estoque usando uma requisição POST
        const addPeca = await fetch(`http://localhost:3000/api/estoque/${ID_RODADA}/${USER_ID}`, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (addPeca.ok) {
          console.log("Peça adicionada com sucesso");
        } else {
          console.log("Erro ao adicionar a peça");
        }
      }

      // Agora teremos que atualizar o saldo do usuário


    }
  } else {
    console.log("Erro 404 - esse jogo não existe");
  }
  // Atualiza a lista do estoque
}

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
      <button className='botao mt-5' onClick={handleCompra}>
          Comprar
        </button>
    </>
  );
}

export default Quadro;
