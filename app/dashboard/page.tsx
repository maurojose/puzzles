import Quadro from '../components/quadro';
import { USER_ID, ID_RODADA } from '../constants';
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {getData, getGabarito, checkData, estoqueData, fetchbootPecas, carregarSaldo, verificaGanhador} from "../dashboard/functions"

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

  const data: {
    id: string;
    url: string;
}[] = await getData(idUserAtual);
  const listaEstoque = await estoqueData(idUserAtual);
  const bootPecas = await fetchbootPecas(idUserAtual);
  const startSaldo: string = await carregarSaldo(idUserAtual);
  const dataCheck = await checkData(idUserAtual);
  const ganhadorCheck = await verificaGanhador();
  console.log(dataCheck);
  console.log("retorno de ganhador:", ganhadorCheck);
  return (
    <div className='conteudo mb-8'>
  {ganhadorCheck.ganhador === "1" ? (
    <>
      <h1>temos um ganhador, jogo encerrado</h1>
      {ganhadorCheck.ganhadorAtual === idUserAtual ? (
        <h2>e o ganhador é você!</h2>
      ) : (
        <h2>mais sorte no próximo</h2>
      )}
    </>
  ) : (
    <Quadro data={data} bootPecas={bootPecas} startSaldo={startSaldo} listaEstoque={listaEstoque} dtchck={dataCheck} idUserAtual={idUserAtual} />
  )}
</div>
  );
};

export default Dashboard;