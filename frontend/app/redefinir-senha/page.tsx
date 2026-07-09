"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RedefinirSenhaPage() {
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const router = useRouter();

  async function handleRedefinir(e: any) {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/redefinir-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nova_senha: novaSenha }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Senha redefinida com sucesso!");
      router.push("/login");
    } else {
      if (Array.isArray(data.detail)) {
        const mensagensErro = data.detail.map((erro: any) => erro.msg).join("\n");
        alert("Erro de validação:\n" + mensagensErro);
      } else {
        alert(data.detail || "Erro ao redefinir a senha.");
      }
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f4ede2', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '40px', 
        borderRadius: '12px', 
        width: '100%', 
        maxWidth: '450px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)' 
      }}>
        
        <h2 style={{ 
          fontSize: '2.2rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '10px', 
          color: '#222222', 
          fontFamily: 'serif' 
        }}>
          Nova Senha
        </h2>
        <p style={{ textAlign: 'center', color: '#666666', marginBottom: '35px', lineHeight: '1.5' }}>
          Cole o código de recuperação que recebeu e introduza a sua nova senha (mínimo 8 caracteres).
        </p>

        <form onSubmit={handleRedefinir} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', color: '#111111', fontSize: '1.1rem' }}>Código de Recuperação (Token):</label>
            <input
              type="text"
              placeholder="Cole o código aqui..."
              style={{ 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #777777', 
                backgroundColor: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                color: '#333333',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', color: '#111111', fontSize: '1.1rem' }}>Nova Senha:</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{ 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #777777', 
                backgroundColor: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                color: '#333333',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', color: '#111111', fontSize: '1.1rem' }}>Confirmar Nova Senha:</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{ 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #777777', 
                backgroundColor: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                color: '#333333',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#98bae3', 
              color: '#111111', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'background-color 0.3s'
            }}
          >
            Redefinir Senha
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#333333', fontSize: '0.95rem' }}>
          <Link href="/login" style={{ color: '#7b92ce', textDecoration: 'none', fontWeight: 'bold' }}>Voltar ao Login</Link>
        </p>

      </div>
    </div>
  );
}