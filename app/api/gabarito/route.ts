import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "../route";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const gabaritoget = await prisma.gabarito.findMany();
    return NextResponse.json(gabaritoget, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
  }
};

/*export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { id, rodada, url } = await req.json();
    await main();
    const gabaritopost = await prisma.gabarito.create({ data: { id, rodada, url } });
    return NextResponse.json({ message: "Success", gabaritopost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error post", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};*/

//vários objetos de uma vez só:

export const POST = async (req: Request, res: NextResponse) => {
    try {
      const requestData = await req.json(); // requestData é agora um array de objetos
  
      for (const item of requestData) {
        const { id, rodada, url } = item;
        const gabaritopost = await prisma.gabarito.create({ data: { id, rodada, url } });
        console.log(gabaritopost);
      }
  
      return NextResponse.json({ message: "Success", }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };

  export const DELETE = async (req: Request, res: NextResponse) => {
    try {
      await main();
      const deleteResult = await prisma.gabarito.deleteMany({});
      return NextResponse.json({ message: "Success", deleteResult }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
  
  