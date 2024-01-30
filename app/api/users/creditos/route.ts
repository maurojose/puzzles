import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../../main";

export const PUT = async (req: Request, res: NextResponse) => {
    try {
      const { id, saldo } = await req.json();
  
      await main();
      const updateUsers = await prisma.users.update({
        data: { saldo },
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