import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../route";

export const DELETE = async (req: Request, res: NextResponse) => {
    try {
      await main();
      const deleteResult = await prisma.jogostatus.deleteMany({});
      return NextResponse.json({ message: "Success", deleteResult }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };