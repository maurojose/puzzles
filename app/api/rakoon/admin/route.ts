import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

export const GET = async (req: Request, res: NextResponse) => {
    try {
      await main();
      const getUsers = await prisma.rewardsRakoon.findMany();
      return NextResponse.json(getUsers, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };