"use client";
import React from 'react';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Superior / Navbar */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea', padding: '18px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Ícone do Capelo (Formatura) */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#0f172a">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#0f172a', lineHeight: '1.1', letterSpacing: '-0.3px' }}>StudyUp</h1>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, fontWeight: '500' }}>Foco no ENEM</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/login" style={{ color: '#334155', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Login</a>
          <a href="/cadastro" style={{ color: '#334155', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Cadastro</a>
        </div>
      </header>

      <div style={{ flex: '1' }}>
        
        {/* Hero Section */}
        <section style={{ backgroundColor: '#0b1326', color: '#ffffff', padding: '60px 60px 90px' }}>
          <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
            
            <div style={{ flex: '1', maxWidth: '520px' }}>
              <h1 style={{ fontSize: '2.7rem', fontWeight: '800', marginBottom: '6px', color: '#ffffff', letterSpacing: '-0.8px', lineHeight: '1.15' }}>
                Estude com propósito.
              </h1>
              <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: '#4a8cd8', marginBottom: '22px', letterSpacing: '-0.5px' }}>
                Acerte no ENEM.
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.55', color: '#94a3b8', margin: 0 }}>
                Questões, simulados, aulas e acompanhamento de desempenho em um só lugar para você alcançar sua melhor versão.
              </p>
            </div>

            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
              <img 
                src="https://img.freepik.com/vetores-gratis/grupo-de-jovens-estudando-juntos_23-2148520771.jpg" 
                alt="Estudantes estudando" 
                style={{ maxWidth: '500px', width: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </div>

          </div>
        </section>

        {/* Faixa Superior de Estatísticas (Cards Brancos Sobrepostos) */}
        <section style={{ marginTop: '-42px', padding: '0 40px', position: 'relative', zIndex: '10' }}>
          <div style={{ maxWidth: '1150px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0px 10px 30px rgba(0,0,0,0.08)', padding: '22px 30px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            
            {/* Card 1 - Questões */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#aed2ff', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📖</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#3b82f6', margin: 0, fontWeight: '700' }}>10.000+</h3>
                <p style={{ fontWeight: '700', margin: '2px 0 0', fontSize: '0.78rem', color: '#1e293b' }}>Questões</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>Organizadas por temas e disciplinas</p>
              </div>
            </div>

            {/* Card 2 - Aulas */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#cbbaff', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>☑️</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#7c3aed', margin: 0, fontWeight: '700' }}>800+</h3>
                <p style={{ fontWeight: '700', margin: '2px 0 0', fontSize: '0.78rem', color: '#1e293b' }}>Aulas</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>Videoaulas e conteúdos explicativos</p>
              </div>
            </div>

            {/* Card 3 - Simulados */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#86efac', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🎯</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#16a34a', margin: 0, fontWeight: '700' }}>65+</h3>
                <p style={{ fontWeight: '700', margin: '2px 0 0', fontSize: '0.78rem', color: '#1e293b' }}>Simulados</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>Simulados completos com padrões do ENEM.</p>
              </div>
            </div>

            {/* Card 4 - Desempenho */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#fde047', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📊</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#eab308', margin: 0, fontWeight: '700' }}>Desempenho</h3>
                <p style={{ fontWeight: '700', margin: '2px 0 0', fontSize: '0.78rem', color: '#1e293b' }}>Seu desempenho</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>Evolução detalhada em gráficos</p>
              </div>
            </div>

          </div>
        </section>

        {/* Seção Inferior de Recursos (Container Azul-Escuro) */}
        <section style={{ padding: '50px 40px 70px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '28px', color: '#1e293b', letterSpacing: '-0.3px' }}>
            Tudo o que você precisa para ir bem no ENEM
          </h2>

          <div style={{ maxWidth: '1150px', margin: '0 auto', backgroundColor: '#0b1326', borderRadius: '16px', padding: '45px 35px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            
            {/* Bloco 1 - Banco de Questões */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: '300px' }}>
              <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#aed2ff', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '16px' }}>📝</div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '14px', color: '#1e293b' }}>Banco de Questões</h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '220px' }}>
                  Milhares de questões comentadas e classificadas por assunto, ano e instituição.
                </p>
              </div>
              <button style={{ backgroundColor: '#a2caff', color: '#1e3a8a', border: 'none', borderRadius: '6px', padding: '9px 0', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem', width: '80%' }}>
                Ver questões →
              </button>
            </div>

            {/* Bloco 2 - Aulas Explicativas */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: '300px' }}>
              <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#cbbaff', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '16px' }}>▶️</div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '14px', color: '#1e293b' }}>Aulas Explicativas</h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '220px' }}>
                  Videoaulas objetivas e didáticas para reforçar o que realmente importa.
                </p>
              </div>
              <button style={{ backgroundColor: '#a2caff', color: '#1e3a8a', border: 'none', borderRadius: '6px', padding: '9px 0', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem', width: '80%' }}>
                Ver aulas →
              </button>
            </div>

            {/* Bloco 3 - Desempenho */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: '300px' }}>
              <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#99f6e4', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '16px' }}>📊</div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '14px', color: '#1e293b' }}>Desempenho</h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '220px' }}>
                  Acompanhe sua evolução por tema, disciplina e tipo de questão.
                </p>
              </div>
              <button style={{ backgroundColor: '#a2caff', color: '#1e3a8a', border: 'none', borderRadius: '6px', padding: '9px 0', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem', width: '80%' }}>
                Ver desempenho →
              </button>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}