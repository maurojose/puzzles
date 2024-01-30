import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { estoqueData } from "../../functions";
import QuadroTrocas from "@/app/components/quadroTrocas";

type ImgsEstoque = {
    id: string;
    url: string;
    qtd: string;
  };

const Trocas = async ({params, searchParams}: any) => {

    const ID_RODADA: string = searchParams.game;

    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }
    const userEmail = session.user?.email;
    const findIdByEmail = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getid`, {
        method: "POST",
        body: JSON.stringify({ userEmail }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const idUserAtual = await findIdByEmail.json();

    const listaEstoque: ImgsEstoque[] = await estoqueData(idUserAtual, ID_RODADA);

    return (

        <div className='jogos_wrap'>
          <QuadroTrocas listaEstoque = {listaEstoque} idUserAtual = {idUserAtual} ID_RODADA={ID_RODADA} />

        </div>
    );

};

export default Trocas;
