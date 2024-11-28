import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

export const GET = async (req: Request, res: NextResponse) => {
    try {
        const parts = req.url.split("/rakoon/users/")[1].split("/");
        const tghandle = parts[0];
      await main();
      const getUser = await prisma.rewardsRakoon.findMany({ where: { tghandle } });
      return NextResponse.json(getUser, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };