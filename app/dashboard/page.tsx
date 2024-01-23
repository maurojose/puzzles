import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {LoadJogos} from "./functions"

const Dashboard = async () => {
    const session = await getServerSession();
    if (!session) {
      redirect("/");
    }
    const userEmail = session.user?.email;
    const findIdByEmail = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getid`, {
          method: "POST",
          body: JSON.stringify({userEmail}),
          headers: {
            "Content-Type": "application/json"
          }
        });
    const idUserAtual = await findIdByEmail.json();

    const listaJogos = await LoadJogos();
    console.log("lista de jogos:", listaJogos);
  
    return (
        <div>
            <ul>
                {listaJogos.map((jogo: {id: string, premio: number, datacomeco:Date, preco: number}) => (

                    <li key={jogo.id}> {jogo.id}. Prêmio: {jogo.premio}, data de começo: {jogo.datacomeco.toString()}, preço da unidade: {jogo.preco}</li>

                ))}
            </ul>
        </div>

    );

};
export default Dashboard;