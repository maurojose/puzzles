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

  export const PUT = async (request: any) => {
    const { id, reffriend, points, pointsRef } = await request.json() as { id: string; reffriend: string; points:any; pointsRef:any; };
  
    try {
      await main();
      const updatePoints = await prisma.rewardsRakoon.update({
        where: { id: id },
        data: {
          points: points,
          verified: 1,
        },
      });
    
      console.log("user points added", updatePoints);

      const updatePointsRef = await prisma.rewardsRakoon.update({
        where: { id: reffriend },
        data: {
          points: {
            increment: pointsRef, // Soma pointsRef ao valor atual de points
          },
          referred:{
            increment: 1,
          }
        },
      });
      console.log("referal points added", updatePointsRef);

      return new NextResponse("points added", { status: 200 });
    } catch (err: any) {
      return new NextResponse(err, {
        status: 500,
      });
    }finally {
      await prisma.$disconnect();
    }
  };