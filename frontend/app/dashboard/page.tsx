"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Proteção de rota simples: verifica se o utilizador tem o token
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
    } else {
      setCarregando(false);
    }
  }, [router]);

  if (carregando) {
    return <div style={{ padding: "40px", textAlign: "center" }}>A carregar...</div>;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', // <-- Alterado de #f4ede2 para #ffffff (branco)
      padding: '40px',
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: '#0f223d', fontSize: '2rem', marginBottom: '10px' }}>Meu Dashboard</h1>
        <p style={{ color: '#666666', fontSize: '1.1rem', marginBottom: '30px' }}>
          Bem-vindo à sua área de estudos do StudyUp!
        </p>

        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h2 style={{ color: '#222222', fontSize: '1.2rem', marginBottom: '10px' }}>🚧 Área em Desenvolvimento</h2>
          <p style={{ color: '#444444' }}>
            Nesta tela, você em breve terá acesso aos seus simulados, banco de questões do ENEM e ao seu relatório de inteligência de dados.
          </p>
        </div>
      </div>
    </div>
  );
}