import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { estoqueData } from "../functions";
import Image from 'next/image';

type ImgsEstoque = {
    id: number;
    url: string;
    qtd: string;
    // Outros campos, se houver
  };

const Trocas = async () => {

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

    const listaEstoque: ImgsEstoque[] = await estoqueData(idUserAtual);

    return (

        <div>
            
            <ul className='listapecas' /*className='flex flex-wrap justify-center mt-3'*/>
                      {listaEstoque
                        .filter((imgsEstoque) => parseInt(imgsEstoque.qtd, 10) > 0)
                        .map((imgsEstoque) => (
                          <li key={imgsEstoque.id}>
                            <Image
                              priority={true}
                              src={`/PuzzleCompleto/${imgsEstoque.url}`}
                              width={60}
                              height={60}
                              alt='#'
                              style={{ cursor: 'pointer' }}
                            />
                            <p className='text-center' title="número de peças repetidas">({imgsEstoque.qtd} un.)</p>
                          </li>
                        ))}
                    </ul>

        </div>
    );

};

export default Trocas;
