"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./page.module.css";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: boolean;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Erro ao carregar tarefas:", err));
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Erro ao adicionar tarefa");

      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar tarefa");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Erro ao excluir tarefa");

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a tarefa");
    }
  };

  const toggleTaskStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");

      setTasks(tasks.map((task) => (task.id === id ? { ...task, status: updatedStatus } : task)));
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status da tarefa");
    }
  };

  // essa função serve para reeordenar as tarefas, da posição anterior para a nova posiçãoS
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  };

  return (
    <div className={styles.container}>
      <h1>📋 Lista de Tarefas</h1>

      <form onSubmit={addTask} className={styles.form}>
        <input
          type="text"
          placeholder="Título da tarefa"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button type="submit">Adicionar</button>
      </form>

      {}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className={styles.taskList}>
              {tasks.map((task, index) => (
                <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} className={styles.listItem}>
                    <input
                      type="checkbox"
                      checked={task.status}
                      onChange={() => toggleTaskStatus(task.id, task.status)}
                    />
                  
                    <div className={styles.taskContent}>
                      {}
                      <span className={task.status ? styles.completedText : ""} {...provided.dragHandleProps}>
                        <strong>{task.title}</strong>
                      </span>
                      {task.description && <p>{task.description}</p>}
                    </div>
                  
                    <button onClick={() => deleteTask(task.id)} className={styles.deleteButton}>
                      Excluir
                    </button>
                  </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
