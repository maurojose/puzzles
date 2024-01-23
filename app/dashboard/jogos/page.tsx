import Quadro from '../../components/quadro';
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {getData, checkData, estoqueData, fetchbootPecas, carregarSaldo, verificaGanhador} from "../functions"

const Jogos = async () => {

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
  const bootPecasNumber = await fetchbootPecas(idUserAtual);
  const bootPecas = bootPecasNumber.toString();
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

export default Jogos;