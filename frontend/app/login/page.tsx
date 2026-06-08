"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Adicionamos isso

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter(); // Instanciamos o roteador

  async function handleLogin(e: any) {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    
    if (data.access_token) {
      alert(data.message);
      // Aqui a mágica acontece: guardamos a chave no navegador!
      localStorage.setItem("studyup_token", data.access_token);
      router.push("/"); // Redireciona para a página principal
    } else {
      alert(data.error);
    }
  }