import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../../main";

export const POST = async (req: Request, res: NextResponse) => {
    try {
      const { userEmail } = await req.json();
      await main();
      const findIdUser = await prisma.users.findFirst({
        where: {
          email: userEmail // Defina a condição de pesquisa para o campo "email"
        }
       });
       const idUser = findIdUser?.id;
      return NextResponse.json(idUser, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };