"use client";

import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tokenDev, setTokenDev] = useState(""); // Apenas para facilitar os nossos testes locais

  async function handleRecuperar(e: any) {
    e.preventDefault();
    setMensagem("");
    setTokenDev("");

    const response = await fetch("http://127.0.0.1:8000/esqueci-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMensagem(data.message);
      // Como estamos a testar localmente e não temos envio de emails,
      // exibimos o token no ecrã para poder copiá-lo facilmente.
      if (data.token_teste) {
        setTokenDev(data.token_teste);
      }
    } else {
      alert(data.detail || "Erro ao solicitar a recuperação de senha.");
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
          Recuperar Senha
        </h2>
        <p style={{ textAlign: 'center', color: '#666666', marginBottom: '35px', lineHeight: '1.5' }}>
          Introduza o endereço de e-mail associado à sua conta para receber as instruções de recuperação.
        </p>

        <form onSubmit={handleRecuperar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', color: '#111111', fontSize: '1.1rem' }}>E-mail:</label>
            <input
              type="email"
              placeholder="seu email@gmail.com"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Enviar instruções
          </button>
        </form>

        {/* Bloco que exibe o token de teste para o programador */}
        {mensagem && (
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#eaddca', borderRadius: '8px', borderLeft: '4px solid #98bae3' }}>
            <p style={{ color: '#222222', marginBottom: '10px', fontSize: '0.95rem' }}><strong>Aviso:</strong> {mensagem}</p>
            
            {tokenDev && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#444444', marginBottom: '5px' }}>
                  <em>Ambiente de desenvolvimento: Copie o token abaixo para simular o link do e-mail.</em>
                </p>
                <code style={{ 
                  display: 'block', 
                  backgroundColor: '#0f223d', 
                  color: '#ffffff', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  wordBreak: 'break-all', 
                  fontSize: '0.75rem',
                  lineHeight: '1.4'
                }}>
                  {tokenDev}
                </code>
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#333333', fontSize: '0.95rem' }}>
          Lembrou-se da senha? <Link href="/login" style={{ color: '#7b92ce', textDecoration: 'none', fontWeight: 'bold' }}>Voltar ao Login</Link>
        </p>

      </div>
    </div>
  );
}