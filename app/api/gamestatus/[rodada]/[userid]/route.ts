import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { main } from "@/app/api/main";

  export const GET = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/gamestatus/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      //console.log(`rodada: ${rodada}`);
      //console.log(`userid: ${userid}`);
      await main();
      const jogostat = await prisma.jogostatus.findMany({ where: { rodada, userid } });
      return NextResponse.json(jogostat, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Erro get status", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };

  export const POST = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/gamestatus/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id, url } = await req.json();
      await main();
      const statuspost = await prisma.jogostatus.create({ data: { id, url, rodada, userid } });
      return NextResponse.json({ message: "Success post status", statuspost }, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Error post status", err }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };


  export const PUT = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/gamestatus/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id, url } = await req.json();

      const fetchIdunico = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
      const jsonIdunico = await fetchIdunico.json();
      const findIdunico = jsonIdunico.find((item: { rodada: string; id: string; userid: string; }) => item.rodada === rodada && item.id === id && item.userid === userid);
      const idunico = findIdunico.idunico;

      await main();
      const updateStatus = await prisma.jogostatus.update({
        data: { url },
        where: { idunico: idunico },
      });
      return NextResponse.json({ message: "Success put status", updateStatus }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error put status", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
  
  export const DELETE = async (req: Request, res: NextResponse) => {
    try {
      const parts = req.url.split("/gamestatus/")[1].split("/");
      const rodada = parts[0];
      const userid = parts[1];
      const { id } = await req.json();

      const fetchIdunico = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamestatus/${rodada}/${userid}`);
      const jsonIdunico = await fetchIdunico.json();
      const findIdunico = jsonIdunico.find((item: { rodada: string; id: string; userid: string; }) => item.rodada === rodada && item.id === id && item.userid === userid);
      const idunico = findIdunico.idunico;

      await main();
      const post = await prisma.jogostatus.delete({ where: { idunico: idunico  } });
      return NextResponse.json({ message: "Success status delete", post }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error status delete", error }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };