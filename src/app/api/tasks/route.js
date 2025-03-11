import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar tarefas" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "O título é obrigatório" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || "",
        status: false, 
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar tarefa" }, { status: 500 });
  }
}