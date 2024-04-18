'use client'
import {LoadJogos} from "./functions";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {

    const [listaJogos, setListaJogos] = useState([]);

    useEffect(() => {
        const carregarListaJogos = async () => {
          const jogos = await LoadJogos();
          setListaJogos(jogos);
        };

        carregarListaJogos();
  }, []);


  const router = useRouter();
    
  
    return (
        <div className="jogos_wrap flex justify-center">
            <ul className="container mt-8 max-w-4xl flex flex-col text-black">
                {listaJogos.map((jogo: {id: string, premio: number, datacomeco:Date, preco: number}, index: number) => (

                    <li className="h-16 items-center flex flex-row justify-stretch px-5" key={jogo.id}>
                        <div className="text-center w-full border-e-2 border-amber-900">Game #{index + 1}</div>
                        <div className="text-center w-full border-e-2 border-amber-900">Prize: ${jogo.premio} </div>
                        <div className='botao-fundo botao-fundo_jogos h-10 ms-5'><button className='botao botao_jogos h-10 items-center justify-center' type="button" onClick={() => router.push(`/dashboard/jogos/?game=${jogo.id}`) }>play!</button></div>

                    </li>
                ))}
            </ul>
        </div>

    );

};
export default Dashboard;

