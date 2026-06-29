"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  async function handleLogin(e: any) {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    
    // Se a resposta HTTP for de sucesso (200 OK)
    if (response.ok) {
      alert(data.message);
      // Salva o token de acesso no navegador
      localStorage.setItem("studyup_token", data.access_token);
      router.push("/"); 
    } else {
      // Se der erro (401 Unauthorized), exibe o erro do FastAPI (.detail)
      alert(data.detail || "Email ou senha incorretos.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">StudyUp</h1>
      </div>

      <section className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-2">Bem-vindo de volta</h2>
        <p className="text-gray-500 mb-6">Entre com suas credenciais para acessar a plataforma.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700">E-mail</label>
          <div className="flex items-center border rounded-md p-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full outline-none p-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="text-sm font-medium text-gray-700">Senha</label>
          <div className="flex items-center border rounded-md p-2">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full outline-none p-1"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="mt-4 bg-blue-600 text-white p-3 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition font-bold">
            Entrar na conta
          </button>
        </form>
      </section>

      <p className="mt-6 text-gray-600">
        Não tem uma conta? <Link href="/cadastro" className="text-blue-600 font-medium hover:underline">Criar conta grátis</Link>
      </p>
    </main>
  );
}