'use client'
import { carregarSaldo } from "../dashboard/functions";
import React, { useState, useEffect } from 'react';

async function handleCreditos
    (
    saldo: string,
    setSaldo: React.Dispatch<React.SetStateAction<string>>,
    idUserAtual: string,
    setisElegivel: React.Dispatch<React.SetStateAction<boolean>>
    )
{
    if(saldo === '0'){
        const addCredito: string = '500';
        const requestPut = { id: idUserAtual, saldo:addCredito };
        const putCreditos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/creditos`, {
        method: "PUT",
        body: JSON.stringify(requestPut),
        headers: {
            "Content-Type": "application/json"
        }
        });
        if (putCreditos.ok) {
            const recarregarSaldo: string = await carregarSaldo(idUserAtual);
            setSaldo(recarregarSaldo);
            setisElegivel(false);

          } else {
            setisElegivel(true);
          }
    }
    setisElegivel(false);

}

type CreditosProps =
{
    idUserAtual: string;
    carregaSaldo: string;
};

const Creditos: React.FC<CreditosProps> = ({idUserAtual, carregaSaldo}) =>
{
    const [saldo, setSaldo] = useState(carregaSaldo);

    let startElegivel: boolean = true;

    if(saldo !== '0'){
        startElegivel = false;
    }
    const [isElegivel, setisElegivel] = useState(startElegivel);
    return(
        <div className="flex flex-col justify-center items-center h-full w-full max-w-7xl">
            <h1 className=" text-lg font-extrabold mb-4">Earn coins to play</h1>
            <p>You have {saldo} coins</p>

            <div className='botao-fundo my-4'><button disabled={isElegivel === false} className='botao' type="button"  onClick={() => handleCreditos(saldo, setSaldo, idUserAtual, setisElegivel)}>Get 500 coins</button></div>
            {saldo !=='0'?(<p>You already have the max. Come back when you run out of coins</p>):(<p>Get 500 coins</p>)}
        </div>
    );
};

export default Creditos;