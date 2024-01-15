"use client"
import Image from 'next/image';
import React, { useState } from "react";

type QuadroProps = {
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;
};

const QuadroTrocas: React.FC<QuadroProps> = ({ listaEstoque }) => {
  const [destino, setDestino] = useState("");
  const [isDestinoVazio, setIsDestinoVazio] = useState(true);
  const [arraySelect, setArraySelect] = useState<Array<{ id: string; qtd: string; }>>([]);

  function handleSelect(selectId: string, selectQtd: string) {
    const updatedArray = [...arraySelect];
    const findSelectIndex = updatedArray.findIndex((item) => item.id === selectId);

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

  function sendSelected(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(arraySelect.length === 0 ){
      console.log("nenhuma peça selecionada");
    }
    console.log("destino:", destino, "array:", JSON.stringify(arraySelect));
  }

  const handleDestinoChange = (e: { target: { value: string } }) => {
    const novoDestino = e.target.value;
    setDestino(novoDestino);
    setIsDestinoVazio(novoDestino.trim() === "");
  };

  return (
    <>
      <ul className='quadrinhosTroca grid grid-cols-6 grid-rows-11'>
        {listaEstoque
          .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0)
          .map((imgsEstoque) => (
            <li key={imgsEstoque.id}>
              <Image
                priority={true}
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
                className="w-full h-10 text-gray-800"
                onChange={(e) => handleSelect(imgsEstoque.id, e.target.value)}
              />
              <p className='text-center' title="máximo disponível">
                ({imgsEstoque.qtd})
              </p>
            </li>
          ))}
      </ul>
      <div>
        <form onSubmit={sendSelected}>
          <input
            type="text"
            className='text-gray-800'
            name="destino"
            value={destino}
            onChange={handleDestinoChange}
          />
          <button className='botao' type="submit" disabled={isDestinoVazio}>
            enviar
          </button>
        </form>
      </div>
    </>
  );
};

export default QuadroTrocas;
