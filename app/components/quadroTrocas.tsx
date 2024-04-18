"use client"
import Image from 'next/image';
import React, { useState } from "react";
import { Troca, estoqueData } from '../dashboard/functions';

type QuadroProps = {
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
  idUserAtual: string;
  ID_RODADA: string;
};

const QuadroTrocas: React.FC<QuadroProps> = ({ listaEstoque, idUserAtual, ID_RODADA }) => {
  const [destino, setDestino] = useState("");
  const [isDestinoVazio, setIsDestinoVazio] = useState(true);
  const [arraySelect, setArraySelect] = useState<Array<{ id: string; qtd: string; }>>([]);
  const [estoque, setEstoque] = useState(listaEstoque);

  function handleSelect(selectId: string, selectQtd: string, maxQtd:string,) {
    const updatedArray = [...arraySelect];
    const findSelectIndex = updatedArray.findIndex((item) => item.id === selectId);

    if(selectQtd > maxQtd){
      selectQtd = maxQtd;
    }

    if (findSelectIndex !== -1) {
      if (selectQtd === "0") {
        updatedArray.splice(findSelectIndex, 1);
      } else {
        updatedArray[findSelectIndex].qtd = selectQtd;
      }
    } else {
      const reqSelect = { id: selectId, qtd: selectQtd };
      updatedArray.push(reqSelect);
    }

    setArraySelect(updatedArray);
    console.log("arraySelect:", updatedArray);
  }

  async function sendSelected(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(arraySelect.length === 0 ){
      console.log("nenhuma peça selecionada");
    }else{
      console.log("arrayselect heeey:", arraySelect);
      await Troca(destino, idUserAtual, arraySelect, ID_RODADA);
    console.log("destino:", destino, "array:", JSON.stringify(arraySelect));
      const updateEstoque = await estoqueData(idUserAtual, ID_RODADA);
      setEstoque(updateEstoque);
      setArraySelect([]);
    }
  }

  const handleDestinoChange = (e: { target: { value: string } }) => {
    const novoDestino = e.target.value;
    setDestino(novoDestino);
    setIsDestinoVazio(novoDestino.trim() === "");
  };

  return (
    <div className='jogos_wrap flex justify-center flex-col items-center pt-10'>
      <h2 className='text-xl text-center text-amber-950 font-extrabold'>Select the pieces you want to send:</h2>
      <ul className='mt-8 w-full max-w-4xl text-black sm:columns-1 md:columns-2'>
        {estoque
          .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0)
          .map((imgsEstoque) => (
            <li key={imgsEstoque.id} className=' h-24 items-center flex flex-row justify-stretch px-5'>
              <div className='text-center w-full flex justify-center items-center'>
              <Image
                className='border-4 border-orange-200'
                src={`/${ID_RODADA}/${imgsEstoque.url}`}
                width={60}
                height={60}
                alt='#'
                style={{ cursor: 'pointer' }}
              />
              </div>
              <div className='text-center w-full'>
              <p className='text-center text-xs my-2' title="máximo disponível">
                Máx.: {imgsEstoque.qtd}
              </p>
              </div>
              <div className='text-center w-full '>
              <input
                type="number"
                min={0}
                max={imgsEstoque.qtd}
                name="qtd"
                height={60}
                defaultValue={0}
                className="h-10 p-2 text-gray-800 qtdTrocas mt-2"
                onChange={(e) => handleSelect(imgsEstoque.id, e.target.value, imgsEstoque.qtd)}
              />
              </div>
            </li>
          ))}
      </ul>
      <div  className='formTroca mt-8 w-full max-w-4xl mb-14'>
        <form onSubmit={sendSelected}>
          
          <h2 className='text-xl text-center text-amber-950 font-extrabold mt-8 mb-4'>What is the recipient's username?</h2>
          <ul className='w-full sm:columns-1 md:columns-2 '>
            <li className='h-24 w-full border-0 items-center flex flex-row justify-stretch px-5'>
          <input
            type="text"
            className='text-gray-800 w-full mb-5 mt-2 h-14'
            name="destino"
            value={destino}
            onChange={handleDestinoChange}
          />
          </li>
          <li className='h-24 items-center flex flex-row justify-stretch px-5'>
          <button className='botao' type="submit" disabled={isDestinoVazio}>
            enviar
          </button>
          </li>
          </ul>
          
        </form>
      </div>
    </div>
  );
};

export default QuadroTrocas;




/*"use client"
import Image from 'next/image';
import React, { useState } from "react";
import { Troca, estoqueData } from '../dashboard/functions';

type QuadroProps = {
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
  idUserAtual: string;
  ID_RODADA: string;
};

const QuadroTrocas: React.FC<QuadroProps> = ({ listaEstoque, idUserAtual, ID_RODADA }) => {
  const [destino, setDestino] = useState("");
  const [isDestinoVazio, setIsDestinoVazio] = useState(true);
  const [arraySelect, setArraySelect] = useState<Array<{ id: string; qtd: string; }>>([]);
  const [estoque, setEstoque] = useState(listaEstoque);

  function handleSelect(selectId: string, selectQtd: string, maxQtd:string,) {
    const updatedArray = [...arraySelect];
    const findSelectIndex = updatedArray.findIndex((item) => item.id === selectId);

    if(selectQtd > maxQtd){
      selectQtd = maxQtd;
    }

    if (findSelectIndex !== -1) {
      if (selectQtd === "0") {
        updatedArray.splice(findSelectIndex, 1);
      } else {
        updatedArray[findSelectIndex].qtd = selectQtd;
      }
    } else {
      const reqSelect = { id: selectId, qtd: selectQtd };
      updatedArray.push(reqSelect);
    }

    setArraySelect(updatedArray);
    console.log("arraySelect:", updatedArray);
  }

  async function sendSelected(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(arraySelect.length === 0 ){
      console.log("nenhuma peça selecionada");
    }else{
      console.log("arrayselect heeey:", arraySelect);
      await Troca(destino, idUserAtual, arraySelect, ID_RODADA);
    console.log("destino:", destino, "array:", JSON.stringify(arraySelect));
      const updateEstoque = await estoqueData(idUserAtual, ID_RODADA);
      setEstoque(updateEstoque);
      setArraySelect([]);
    }
  }

  const handleDestinoChange = (e: { target: { value: string } }) => {
    const novoDestino = e.target.value;
    setDestino(novoDestino);
    setIsDestinoVazio(novoDestino.trim() === "");
  };

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-xl text-center'>Selecione as peças que deseja enviar:</h2>
      <ul className='quadrinhosTroca grid grid-cols-6 grid-rows-11'>
        {estoque
          .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0)
          .map((imgsEstoque) => (
            <li key={imgsEstoque.id} className=' trocasLi bg-emerald-800 text-white items-center justify-center flex flex-col'>
              <Image
                
                src={`/PuzzleCompleto/${imgsEstoque.url}`}
                width={60}
                height={60}
                alt='#'
                style={{ cursor: 'pointer' }}
              />
              <input
                type="number"
                min={0}
                max={imgsEstoque.qtd}
                name="qtd"
                defaultValue={0}
                className="h-10 p-2 text-gray-800 qtdTrocas mt-2"
                onChange={(e) => handleSelect(imgsEstoque.id, e.target.value, imgsEstoque.qtd)}
              />
              <p className='text-center text-xs my-2' title="máximo disponível">
                Máx.: {imgsEstoque.qtd}
              </p>
            </li>
          ))}
      </ul>
      <div>
        <form onSubmit={sendSelected}>
          <h2 className='text-xl text-center'>Qual o username do destinatário?</h2>
          <input
            type="text"
            className='text-gray-800 w-full mb-5 mt-2 h-14'
            name="destino"
            value={destino}
            onChange={handleDestinoChange}
          />
          <button className='botao' type="submit" disabled={isDestinoVazio}>
            enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuadroTrocas;
*/
