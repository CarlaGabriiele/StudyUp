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
        backgroundColor: '#0f223d', 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center',
        padding: '0px',
        overflow: 'hidden',
        position: 'relative' // Mantido para que o texto se oriente por este container
      }}>
        <img 
          src="/login-banner.png" 
          alt="StudyUp" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'bottom center'
          }} 
        />

        {/* TEXTO INSERIDO NO LUGAR CORRETO (Dentro do container relativo) */}
        <div style={{
          position: 'absolute',
          right: '40px',
          bottom: '180px', // Movido um pouco mais para cima para não cobrir a mesa da ilustração
          maxWidth: '260px',
          textAlign: 'right',
          color: '#ffffff',
          fontFamily: 'serif',
          lineHeight: '1.2',
          zIndex: 10
        }}>
          <span style={{ fontSize: '1.8rem', display: 'block' }}>Seu</span>
          <span style={{ fontSize: '2.4rem', fontWeight: 'bold', display: 'block' }}>futuro</span>
          <span style={{ fontSize: '2.4rem', fontWeight: 'bold', display: 'block', color: '#eaddca' }}>Começa</span>
          <span style={{ fontSize: '1.6rem', display: 'block' }}>Com uma</span>
          <span style={{ fontSize: '2.6rem', fontWeight: 'bold', display: 'block', color: '#98bae3' }}>decisão.</span>
        </div>
      </div>

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
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '5px',
            color: '#222222',
            fontFamily: 'serif'
          }}>
            Bem-vindo de volta !
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666666', 
            marginBottom: '45px',
            fontSize: '1rem' 
          }}>
            Faça login para acessar sua conta.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontWeight: 'bold', color: '#111111', fontSize: '1.1rem' }}>Senha:</label>
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
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <Link href="/esqueci-senha" style={{ 
                textAlign: 'right', 
                fontSize: '0.85rem', 
                color: '#555555', 
                marginTop: '5px',
                textDecoration: 'none' 
              }}>
                [Esqueci minha senha]
              </Link>
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
                marginTop: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              Entrar
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '30px', color: '#333333', fontSize: '0.95rem' }}>
            Ainda não tem uma conta? <Link href="/cadastro" style={{ color: '#7b92ce', textDecoration: 'none' }}>Cadastra-se</Link>
          </p>

        </div>
      </div>

    </div>
  );
}