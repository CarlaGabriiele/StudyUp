"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState(""); 
  const router = useRouter();

  async function handleRegister(e: any) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || "Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        // Tratamento do erro 422 do FastAPI
        if (Array.isArray(data.detail)) {
          // Pega todas as mensagens de validação e junta numa string
          const mensagensErro = data.detail.map((erro: any) => erro.msg).join("\n");
          alert("Erro de validação:\n" + mensagensErro);
        } else {
          alert(data.detail || "Erro ao realizar o cadastro.");
        }
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f4ede2', 
      fontFamily: 'sans-serif' 
    }}>
      
      <div style={{ 
        flex: '1', 
        backgroundColor: '#0f223d', 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center',
        padding: '0px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img 
          src="/cadastro-banner.png" 
          alt="StudyUp - Seu futuro começa com uma decisão" 
          style={{ 
            width: '100%', 
            height: '65%', 
            objectFit: 'cover', 
            objectPosition: 'bottom center' 
          }} 
        />
        
        <div style={{
          position: 'absolute',
          right: '5%',
          bottom: '33%',
          maxWidth: '280px',
          textAlign: 'right',
          color: '#ffffff',
          fontFamily: 'Georgia, serif',
          lineHeight: '1.1',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', fontWeight: 'bold', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>Seu</span>
            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>futuro</span>
            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>Começa</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Com uma</span>
            <span style={{
              fontSize: '3rem', fontWeight: 'bold', color: '#BBD3F0', display: 'inline-block'
            }}>decisão.</span>
          </div>
        </div>
      </div> {/* FECHAMENTO CORRETO DA DIV ESQUERDA */}

      <div style={{ 
        flex: '1', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px',
        color: '#333333'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '5px',
            color: '#222222',
            fontFamily: 'serif'
          }}>
            Bem-vindo!
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666666', 
            marginBottom: '35px',
            fontSize: '1rem' 
          }}>
            Faça cadastro para criar sua conta.
          </p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: '#444444' }}>Nome:</label>
              <input
                type="text"
                placeholder="seu nome"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #b5b0a7', 
                  backgroundColor: '#eaddca',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#333'
                }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: '#444444' }}>E-mail:</label>
              <input
                type="email"
                placeholder="seu email@gmail.com"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #b5b0a7', 
                  backgroundColor: '#eaddca',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#333'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: '#444444' }}>Senha:</label>
              <input
                type="password"
                placeholder="••••••••"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #b5b0a7', 
                  backgroundColor: '#eaddca',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#333'
                }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: '#444444' }}>Confirmar senha:</label>
              <input
                type="password"
                placeholder="••••••••"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #b5b0a7', 
                  backgroundColor: '#eaddca',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#333'
                }}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                backgroundColor: '#8da9c4', 
                color: '#ffffff', 
                border: 'none', 
                padding: '14px', 
                borderRadius: '8px', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              Cadastrar
            </button>
          </form>

          {/* Link para o Login */}
          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666666', fontSize: '0.95rem' }}>
            Já tem uma conta? <Link href="/login" style={{ color: '#547a9e', textDecoration: 'none', fontWeight: 'bold' }}>Entrar</Link>
          </p>

        </div>
      </div>

    </div>
  );
}