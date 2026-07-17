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

    // 1. Criar um formato de formulário compatível com o OAuth2 do FastAPI
    const formData = new URLSearchParams();
    formData.append("username", email); // O FastAPI exige o nome 'username'
    formData.append("password", senha); // O FastAPI exige o nome 'password'

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      // 2. Alterar o Content-Type para formulário
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      alert(data.message || "Login realizado com sucesso!");
      localStorage.setItem("studyup_token", data.access_token);
      router.push("/"); 
    } else {
      // 3. Mesma lógica de tratamento de erros que aplicámos no registo
      if (Array.isArray(data.detail)) {
        const mensagensErro = data.detail.map((erro: any) => erro.msg).join("\n");
        alert("Erro de validação:\n" + mensagensErro);
      } else {
        alert(data.detail || "Email ou senha incorretos.");
      }
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      fontFamily: 'sans-serif' 
    }}>

      {/* LADO ESQUERDO: Imagem/Banner Promocional com o Texto Interno */}
      <div style={{ 
        flex: '1', 
        backgroundColor: '#0c1b33', // Azul escuro idêntico ao Figma
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center',
        padding: '0px',
        overflow: 'hidden',
        position: 'relative' // Referência para o posicionamento absoluto do texto
      }}>
        <img 
          src="/login-banner.png" 
          alt="StudyUp" 
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

      {/* LADO DIREITO: Formulário de Login */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px',
        color: '#333333'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <h2 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '10px',
            color: '#1a1a1a',
            fontFamily: 'Georgia, serif'
          }}>
            Bem-vindo de volta !
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666666', 
            marginBottom: '40px',
            fontSize: '0.95rem' 
          }}>
            Faça login para acessar sua conta.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '1rem' }}>E-mail:</label>
              <input
                type="email"
                placeholder="seu email@gmail.com"
                style={{ 
                  padding: '12px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid #cccccc', 
                  backgroundColor: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: '#333333',
                  transition: 'border-color 0.2s'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '1rem' }}>Senha:</label>
              <input
                type="password"
                placeholder="••••••••"
                style={{ 
                  padding: '12px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid #cccccc', // Borda suave como no Figma
                  backgroundColor: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: '#333333'
                }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <Link href="/esqueci-senha" style={{ 
                textAlign: 'right', 
                fontSize: '0.8rem', 
                color: '#666666', 
                marginTop: '4px',
                textDecoration: 'none' 
              }}>
                [Esqueci minha senha]
              </Link>
            </div>

            <button 
              type="submit" 
              style={{ 
                backgroundColor: '#9bc2e6', // Azul botão do Figma
                color: '#1a1a1a', 
                border: 'none', 
                padding: '14px', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#89b2db'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9bc2e6'}
            >
              Entrar
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666666', fontSize: '0.9rem' }}>
            Ainda não tem uma conta? <Link href="/cadastro" style={{ color: '#82a3e8', fontWeight: '500', textDecoration: 'none' }}>Cadastra-se</Link>
          </p>

        </div>
      </div>

    </div>
  );
}