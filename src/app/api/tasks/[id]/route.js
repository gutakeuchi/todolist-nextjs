import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function DELETE(req) {
  try { 
    const id = req.nextUrl.pathname.split("/").pop(); 

    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const deletedTask = await prisma.task.delete({
      where: { id: parseInt(id) }, 
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir tarefa" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const { status } = await req.json();

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return NextResponse.json({ error: "Erro ao atualizar tarefa" }, { status: 500 });
  }
}