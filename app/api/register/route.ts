import prisma from "@/prisma";
import { main } from "../main";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { email, password } = await request.json() as { email: string; password: string; };
  const nome = "mauro" //só pra testar
  const saldo = "0" //só pra testar

  try {
    await main();

    const existingUser = await prisma.users.findFirst({
      where: {
        email: email // Defina a condição de pesquisa para o campo "email"
      }

     });

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }else{

    const hashedPassword = await bcrypt.hash(password, 5);
    const userspost = await prisma.users.create({ data: { nome, saldo, password: hashedPassword, email } });
    console.log("inserindo o usuário:", userspost)

    return new NextResponse("user is registered", { status: 200 });
    }
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }finally {
    await prisma.$disconnect();
  }
};
