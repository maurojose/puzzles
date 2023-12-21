import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../../main";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const parts = req.url.split("/users/")[1].split("/");
    const id = parts[0];
    const usersget = await prisma.users.findFirst({where: {id}});
    const userId = usersget?.id;
    const userSaldo = usersget?.saldo;
    const responseUsers = [];
    responseUsers.push({ id: userId, saldo: userSaldo });
    return NextResponse.json(responseUsers, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const parts = req.url.split("/users/")[1].split("/");
    const id = parts[0];
    const { nome, saldo } = await req.json();

    await main();
    const updateUsers = await prisma.users.update({
      data: { nome, saldo },
      where: { id },
    });
    return NextResponse.json({ message: "Success", updateUsers }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};