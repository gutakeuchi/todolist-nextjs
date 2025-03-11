"use client"; 
import { useState, useEffect } from "react";
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
      .then((data) => setTasks(data));
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) return;

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]); 
      setNewTask({ title: "", description: "" }); 
    }
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

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={`${styles.listItem} ${task.status ? styles.done : ""}`}>
            <span>{task.title}</span>
            {task.description && <p>{task.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
