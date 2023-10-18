import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../../route";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const parts = req.url.split("/users/")[1].split("/");
    const id = parts[0];
    const usersget = await prisma.users.findMany({where: {id}});
    return NextResponse.json({ message: "Success", usersget }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};