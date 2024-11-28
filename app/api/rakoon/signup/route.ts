import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

export const POST = async (request: any) => {
    const { tghandle, wallet, reffriend, points } = await request.json() as { tghandle: string; wallet: string; reffriend: string; points:any; referred:any;verified:any; };
  
    try {
      await main();
  
      const existingTg = await prisma.rewardsRakoon.findFirst({
        where: {
          tghandle: tghandle
        }
  
       });
  
       const existingWallet = await prisma.rewardsRakoon.findFirst({
        where: {
          wallet: wallet
        }
  
       });
  
      if (existingTg) {
        return new NextResponse("TG is already in use", { status: 400 });
      }
      if(existingWallet){
        return new NextResponse("Wallet already registered", { status: 400 });
      }
      else{
      const zeroPoint = 0;
      const zeroRef = 0;
      const zeroVer = 0;
      const signuppost = await prisma.rewardsRakoon.create({ data: { tghandle, wallet, reffriend, points:zeroPoint, referred:zeroRef, verified:zeroVer } });
      console.log("inserting user", signuppost)
  
      return new NextResponse("user registered", { status: 200 });
      }
    } catch (err: any) {
      return new NextResponse(err, {
        status: 500,
      });
    }finally {
      await prisma.$disconnect();
    }
  };