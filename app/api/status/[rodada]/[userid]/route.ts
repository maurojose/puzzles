import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/route";

/*export const GET = async (req: Request, res: NextResponse) => {
    try {
        const parts = req.url.split("/status/")[1].split("/");
    const rodada = parts[0];
    const userid = parts[1];
    console.log(`rodada: ${rodada}`);
    console.log(`userid: ${userid}`);
      await main();
      const jogostat = await prisma.jogostatus.findMany({where: {rodada, userid}});
      return NextResponse.json({ message: "Success", jogostat }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };*/

  export const GET = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/status/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      console.log(`rodada: ${rodada}`);
      console.log(`userid: ${userid}`);
      await main();
      const jogostat = await prisma.jogostatus.findMany({ where: { rodada, userid } });
      return NextResponse.json(jogostat, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };

  export const POST = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/status/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id, url } = await req.json();
      await main();
      const statuspost = await prisma.jogostatus.create({ data: { id, url, rodada, userid } });
      return NextResponse.json({ message: "Success", statuspost }, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Error post", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };


  export const PUT = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/status/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id, url } = await req.json();

      const fetchIdunico = await fetch(`http://localhost:3000/api/status/${rodada}/${userid}`);
      const jsonIdunico = await fetchIdunico.json();
      const findIdunico = jsonIdunico.find(item => item.rodada === rodada && item.id === id && item.userid === userid);
      const idunico = findIdunico.idunico;


      await main();
      const updateStatus = await prisma.jogostatus.update({
        data: { url },
        where: { idunico: idunico },
      });
      return NextResponse.json({ message: "Success", updateStatus }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
  