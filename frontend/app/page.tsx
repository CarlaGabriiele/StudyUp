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
      
      {/* Navbar Integrada na Home - Atualizada para o novo design condicional */}
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "20px 50px", 
        backgroundColor: "#0d1b2a", // Mantendo a cor da hero section para ficar contínuo
        color: "#ffffff" 
      }}>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", fontFamily: "serif", letterSpacing: "1px" }}>
          StudyUp
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {isLogged ? (
            <>
              <Link href="/dashboard" style={{ textDecoration: "none", color: "#ffffff", fontWeight: "bold" }}>
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
              <Link href="/login" style={{ textDecoration: "none", color: "#eaddca", fontWeight: "bold", padding: "10px 20px" }}>
                Entrar
              </Link>
              <Link href="/cadastro" style={{ textDecoration: "none", color: "#0f223d", backgroundColor: "#eaddca", fontWeight: "bold", padding: "10px 24px", borderRadius: "8px", transition: "0.3s" }}>
                Cadastrar
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

        <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#0d1b2a', borderRadius: '16px', padding: '40px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          
          {/* Card Recurso 1 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '250px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📝</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Banco de Questões</h4>
              <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>Milhares de questões comentadas e classificadas por assunto, ano e instituição.</p>
            </div>
            <button style={{ backgroundColor: '#90e0ef', color: '#03045e', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '80%' }}>Explorar questões →</button>
          </div>

          {/* Card Recurso 2 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '250px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>▶️</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Aulas Explicativas</h4>
              <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>Videoaulas objetivas e didáticas para reforçar o que realmente importa.</p>
            </div>
            <button style={{ backgroundColor: '#90e0ef', color: '#03045e', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '80%' }}>Ver aulas →</button>
          </div>

          {/* Card Recurso 3 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '250px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📈</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Desempenho</h4>
              <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>Acompanhe sua evolução por tema, disciplina e tipo de questão.</p>
            </div>
            <button style={{ backgroundColor: '#90e0ef', color: '#03045e', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '80%' }}>Ver desempenho →</button>
          </div>

        </div>
      </section>

    </div>
  );
}
