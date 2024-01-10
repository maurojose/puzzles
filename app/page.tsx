import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>bem vindo</h1>
      <div className="container mx-10">
        <p>Este jogo está nas primeiras fases de desenvolvimento. É um jogo simples, com um único objetivo: seja o primeiro a completar o quebra-cabeça. Esse jogo tem o seguinte funcionamento:<br/>
          - O primeiro a completar o quebra-cabeça será o vencedor e ganhará o prêmio;<br/>
          - As peças podem ser compradas a partir de uma unidade. Mas o jogo te dará peças aleatórias e as vezes poderá te dar uma peça que você já tem;<br/>
          - No futuro você poderá trocar peças com outros usuários, mas por enquanto isso nao ta funcionando.<br/>
        </p>
      </div>
    </main>
  );
}
