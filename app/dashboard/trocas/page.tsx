import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { estoqueData } from "../functions"

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

    return (

        <div><h1>hello world</h1></div>
    );

};

export default Trocas;
