"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Adicionamos isso

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter(); // Instanciamos o roteador

  async function handleRegister(e: any) {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await response.json();
    
    if (data.message) {
      alert(data.message);
      router.push("/login"); // Redireciona para o login na mesma hora!
    } else {
      alert(data.error);
    }
  }