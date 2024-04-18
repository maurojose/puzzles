import Quadro from '../../components/quadro';
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {getData, checkData, estoqueData, fetchbootPecas, carregarSaldo, verificaGanhador} from "../functions"

const Jogos = async ({params, searchParams}: any) => {

  const ID_RODADA: string = searchParams.game;

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
  const idUserAtual: string = await findIdByEmail.json();

  const data: {
    id: string;
    url: string;
}[] = await getData(idUserAtual, ID_RODADA);
  const listaEstoque = await estoqueData(idUserAtual, ID_RODADA);
  const bootPecasNumber = await fetchbootPecas(idUserAtual, ID_RODADA);
  const bootPecas = bootPecasNumber.toString();
  const startSaldo: string = await carregarSaldo(idUserAtual);
  const dataCheck = await checkData(idUserAtual, ID_RODADA);
  const ganhadorCheck = await verificaGanhador(ID_RODADA);
  return (
    <div className='conteudo mb-8'>
  {ganhadorCheck.ganhador === "1" ? (
    <>
      <h1>We have a winner, game over.</h1>
      {ganhadorCheck.ganhadorAtual === idUserAtual ? (
        <h2>And that's you, congrats!</h2>
      ) : (
        <h2>wish you luck.</h2>
      )}
    </>
  ) : (
    <Quadro data={data} bootPecas={bootPecas} startSaldo={startSaldo} listaEstoque={listaEstoque} dtchck={dataCheck} idUserAtual={idUserAtual} ID_RODADA = {ID_RODADA} />
  )}
</div>
  );
};

export default Jogos;