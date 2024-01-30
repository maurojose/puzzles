import { carregarSaldo } from "../dashboard/functions";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Creditos from "../components/creditos";

const Carteira = async() =>
{
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
    const idUserAtual: string = await findIdByEmail.json();
    const carregaSaldo: string = await carregarSaldo(idUserAtual);

    return(
        <div className='jogos_wrap py-14 h-full text-black flex flex-col justify-center items-center'>
            <Creditos idUserAtual={idUserAtual} carregaSaldo = {carregaSaldo} />
        </div>
    );
}
export default Carteira;