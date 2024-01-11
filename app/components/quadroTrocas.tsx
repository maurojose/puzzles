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

const QuadroTrocas: React.FC<QuadroProps> = ({ listaEstoque}) => {
    
    const [destino, setDestino] = useState("");
  const [isDestinoVazio, setIsDestinoVazio] = useState(true);

    let arraySelect: Array<{
        id: string;
        qtd: string;
    }> = [];

    function handleSelect(selectId: string, selectQtd: string) {
        const findSelectIndex = arraySelect.findIndex(item => item.id === selectId);
    
        if (findSelectIndex !== -1) {
            if (selectQtd === "0") {
                arraySelect.splice(findSelectIndex, 1);
            } else {
                arraySelect[findSelectIndex].qtd = selectQtd;
            }
        } else {
            const reqSelect = { id: selectId, qtd: selectQtd };
            arraySelect.push(reqSelect);
        }
        console.log("arraySelect:", arraySelect);
    }

    function sendSelected(e: React.FormEvent<HTMLFormElement>, arraySelect:Array<{id: string; qtd: string;}>){
        e.preventDefault();
        const destino = e.currentTarget.querySelector('input[name="destino"]') as HTMLInputElement | null;
        if (destino) {
            console.log("destino:", destino.value, "array:", JSON.stringify(arraySelect));
        }else{
            console.log("nao tem destinatario");
        }
    }

    const handleDestinoChange = (e: { target: { value: string; }; }) => {
        const novoDestino = e.target.value;
        setDestino(novoDestino);
        setIsDestinoVazio(novoDestino.trim() === ""); // Atualiza o estado para indicar se o destino está vazio
      };

    return (
        <>
        <ul className='quadrinhosTroca grid grid-cols-6 grid-rows-11' /*className='flex flex-wrap justify-center mt-3'*/>
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
                        <input type="number" min={0} max={imgsEstoque.qtd} name="qtd" defaultValue={0} className="w-full h-10 text-gray-800" onChange={(e) => handleSelect(imgsEstoque.id, e.target.value)} />
                        <p className='text-center' title="máximo disponível">({imgsEstoque.qtd})</p>
                    </li>
                ))}
        </ul>
        <div>
            <form onSubmit={(e)=>sendSelected(e,arraySelect)}>
            <input type="text" className=' text-gray-800' name="destino" value={destino} onChange={handleDestinoChange}></input>
            <button className='botao' type="submit" disabled={isDestinoVazio}>enviar</button>
            </form>
        </div>
        </>

    );
};
export default QuadroTrocas;


