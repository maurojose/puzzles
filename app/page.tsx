import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-black">BEM-VINDO</h1>
      <div className="container mx-10 mt-5">
        <h2 className="text-xl font-bold mb-5">Este jogo está nas primeiras fases de desenvolvimento. É um jogo simples, com um único objetivo: seja o primeiro a completar o quebra-cabeça.</h2>
        <p className="font-bold mb-2">Esse jogo tem o seguinte funcionamento:<br/></p>
          <p>
          - O primeiro a completar o quebra-cabeça será o vencedor e ganhará o prêmio;<br/>
          - As peças podem ser compradas a partir de uma unidade. Mas o jogo te dará peças aleatórias e as vezes poderá te dar uma peça que você já tem;<br/>
          - Para aumentar suas chances, você pode trocar peças com outros usuários.<br/>
          - Para colocar créditos, vá para o menu carteira e clique no botão.<br/>
        </p>
      </div>
    </main>
  );
}
