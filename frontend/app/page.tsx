"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studyup_token");
    if (token) {
      setIsLogged(true);
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333' }}>
      
      {/* Navbar - fundo branco, separada da hero section, igual ao protótipo */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 50px",
        backgroundColor: "#ffffff",
        color: "#0d1b2a",
        borderBottom: "1px solid #eef0f3",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "9px",
            backgroundColor: "#0d1b2a",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            flexShrink: 0,
          }}>
            🎓
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0d1b2a" }}>StudyUp</div>
            <div style={{ fontSize: "0.7rem", color: "#8a93a3", fontWeight: 500 }}>Foco no ENEM</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {isLogged ? (
            <>
              <Link href="/dashboard" style={{ textDecoration: "none", color: "#0d1b2a", fontWeight: 600, fontSize: "0.95rem" }}>
                Meu Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('studyup_token');
                  setIsLogged(false);
                }}
                style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold' }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: "none", color: "#0d1b2a", fontWeight: 500, fontSize: "0.95rem" }}>
                Login
              </Link>
              <Link href="/cadastro" style={{ textDecoration: "none", color: "#0d1b2a", fontWeight: 500, fontSize: "0.95rem" }}>
                Cadastro
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Seção Principal (Hero Section) */}
      <section style={{ backgroundColor: '#0d1b2a', color: '#ffffff', padding: '60px 20px', textAlign: 'left' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#ffffff' }}>
              Estude com propósito.
            </h1>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#4ea8de', marginBottom: '20px' }}>
              Acerte no ENEM.
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#e0e1dd', maxWidth: '500px' }}>
              Questões, simulados, aulas e acompanhamento de desempenho em um só lugar para você alcançar sua melhor versão.
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/alunos.png" 
              alt="Estudantes estudando" 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </div>

        </div>
      </section>

      {/* Faixa de Estatísticas (Cards sobrepostos) */}
      <section style={{ marginTop: '-40px', padding: '0 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0,0,0,0.1)', padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          {/* Card 1 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#bbd0ff', padding: '10px', borderRadius: '8px', fontSize: '1.5rem' }}>📘</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#4ea8de', margin: 0, fontWeight: 'bold' }}>10.000+</h3>
              <p style={{ fontWeight: 'bold', margin: '5px 0 2px 0', fontSize: '0.9rem' }}>Questões</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Organizadas por temas e disciplinas.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#c8b6ff', padding: '10px', borderRadius: '8px', fontSize: '1.5rem' }}>☑️</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#743efb', margin: 0, fontWeight: 'bold' }}>800+</h3>
              <p style={{ fontWeight: 'bold', margin: '5px 0 2px 0', fontSize: '0.9rem' }}>Aulas</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Videoaulas e conteúdos explicativos.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#b7e4c7', padding: '10px', borderRadius: '8px', fontSize: '1.5rem' }}>🎯</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#2d6a4f', margin: 0, fontWeight: 'bold' }}>65+</h3>
              <p style={{ fontWeight: 'bold', margin: '5px 0 2px 0', fontSize: '0.9rem' }}>Simulados</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Simulados completos com padrões do ENEM.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#ffd166', padding: '10px', borderRadius: '8px', fontSize: '1.5rem' }}>📊</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#f77f00', margin: 0, fontWeight: 'bold' }}>Desempenho</h3>
              <p style={{ fontWeight: 'bold', margin: '5px 0 2px 0', fontSize: '0.9rem' }}>Seu desempenho</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Evolução detalhada em gráficos.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Seção Inferior - Recursos */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '40px', color: '#111' }}>
          Tudo o que você precisa para ir bem no ENEM
        </h2>

        <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#0d1b2a', borderRadius: '16px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>

          {/* Card Recurso 1 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '26px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '9px', backgroundColor: '#bbd0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '14px' }}>📝</div>
            <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1rem', color: '#111' }}>Banco de Questões</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5', marginBottom: '18px' }}>Milhares de questões comentadas e classificadas por assunto, ano e instituição.</p>
            <button style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Ver questões →</button>
          </div>

          {/* Card Recurso 2 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '26px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '9px', backgroundColor: '#bbd0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '14px' }}>▶️</div>
            <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1rem', color: '#111' }}>Aulas Explicativas</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5', marginBottom: '18px' }}>Videoaulas objetivas e didáticas para reforçar o que realmente importa.</p>
            <button style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Ver aulas →</button>
          </div>

          {/* Card Recurso 3 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '26px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '9px', backgroundColor: '#0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '14px' }}>📈</div>
            <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1rem', color: '#111' }}>Desempenho</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5', marginBottom: '18px' }}>Acompanhe sua evolução por tema, disciplina e tipo de questão.</p>
            <button style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Ver desempenho →</button>
          </div>

        </div>
      </section>

    </div>
  );
}