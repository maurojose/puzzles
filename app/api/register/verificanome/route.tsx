import prisma from "@/prisma";
import { main } from "@/app/api/main";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { nome } = await request.json() as { nome: string;};

  try {
    await main();
    const existingName = await prisma.users.findFirst({
        where: {
          nome: nome 
        }
  
       });

       if(existingName){
        return new NextResponse("nome de usuário já existe", { status: 400 });
      }else{
        return new NextResponse("nome de usuário não existe", { status: 200 });
      }
  }catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }finally {
    await prisma.$disconnect();
  }

};