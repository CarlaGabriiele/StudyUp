"use client";
import React from 'react';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: '1' }}>
        
        {/* Seção Principal (Hero Section) com a cor exata do protótipo */}
        <section style={{ backgroundColor: '#111c2e', color: '#ffffff', padding: '70px 20px', textAlign: 'left' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
            
            <div style={{ flex: '1', minWidth: '350px' }}>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff', letterSpacing: '-0.5px' }}>
                Estude com propósito.
              </h1>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#3b8ccd', marginBottom: '24px' }}>
                Acerte no ENEM.
              </h2>
              <p style={{ fontSize: '1.15rem', lineHeight: '1.6', color: '#b0bccc', maxWidth: '520px' }}>
                Questões, simulados, aulas e acompanhamento de desempenho em um só lugar para você alcançar sua melhor versão.
              </p>
            </div>

            <div style={{ flex: '1', minWidth: '350px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://img.freepik.com/vetores-gratis/grupo-de-jovens-estudando-juntos_23-2148520771.jpg" 
                alt="Estudantes estudando" 
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </div>

          </div>
        </section>

        {/* Faixa de Estatísticas (Cards sobrepostos perfeitamente alinhados) */}
        <section style={{ marginTop: '-45px', padding: '0 20px', position: 'relative', zIndex: '10' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0px 10px 35px rgba(0,0,0,0.08)', padding: '25px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
            
            {/* Card 1 - Questões */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#adcfff', width: '45px', height: '45px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#1d4ed8' }}>📘</div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#3b8ccd', margin: 0, fontWeight: 'bold' }}>10.000+</h3>
                <p style={{ fontWeight: 'bold', margin: '2px 0', fontSize: '0.85rem', color: '#1f2937' }}>Questões</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.3' }}>Organizadas por temas e disciplinas.</p>
              </div>
            </div>

            {/* Card 2 - Aulas */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#cbbaff', width: '45px', height: '45px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#6d28d9' }}>☑️</div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#6d28d9', margin: 0, fontWeight: 'bold' }}>800+</h3>
                <p style={{ fontWeight: 'bold', margin: '2px 0', fontSize: '0.85rem', color: '#1f2937' }}>Aulas</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.3' }}>Videoaulas e conteúdos explicativos.</p>
              </div>
            </div>

            {/* Card 3 - Simulados */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#a7f3d0', width: '45px', height: '45px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#047857' }}>🎯</div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#059669', margin: 0, fontWeight: 'bold' }}>65+</h3>
                <p style={{ fontWeight: 'bold', margin: '2px 0', fontSize: '0.85rem', color: '#1f2937' }}>Simulados</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.3' }}>Simulados completos com padrões do ENEM.</p>
              </div>
            </div>

            {/* Card 4 - Desempenho */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#fde68a', width: '45px', height: '45px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#b45309' }}>📊</div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#ea580c', margin: 0, fontWeight: 'bold' }}>Desempenho</h3>
                <p style={{ fontWeight: 'bold', margin: '2px 0', fontSize: '0.85rem', color: '#1f2937' }}>Seu desempenho</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.3' }}>Evolução detalhada em gráficos.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Seção Inferior - Recursos */}
        <section style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '35px', color: '#1f2937', letterSpacing: '-0.3px' }}>
            Tudo o que você precisa para ir bem no ENEM
          </h2>

          <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#111c2e', borderRadius: '16px', padding: '50px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            
            {/* Card Recurso 1 - Banco de Questões */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '280px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>📝</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px', color: '#111c2e' }}>Banco de Questões</h4>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.6', padding: '0 10px' }}>
                  Milhares de questões comentadas e classificadas por assunto, ano e instituição.
                </p>
              </div>
              <button style={{ backgroundColor: '#9bcff2', color: '#0b3c5d', border: 'none', borderRadius: '6px', padding: '12px 0', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '90%', transition: 'background 0.2s' }}>
                Explorar questões →
              </button>
            </div>

            {/* Card Recurso 2 - Aulas Explicativas */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '280px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>▶️</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px', color: '#111c2e' }}>Aulas Explicativas</h4>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.6', padding: '0 10px' }}>
                  Videoaulas objetivas e didáticas para reforçar o que realmente importa.
                </p>
              </div>
              <button style={{ backgroundColor: '#9bcff2', color: '#0b3c5d', border: 'none', borderRadius: '6px', padding: '12px 0', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '90%', transition: 'background 0.2s' }}>
                Ver aulas →
              </button>
            </div>

            {/* Card Recurso 3 - Desempenho */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '280px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>📈</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px', color: '#111c2e' }}>Desempenho</h4>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.6', padding: '0 10px' }}>
                  Acompanhe sua evolução por tema, disciplina e tipo de questão.
                </p>
              </div>
              <button style={{ backgroundColor: '#9bcff2', color: '#0b3c5d', border: 'none', borderRadius: '6px', padding: '12px 0', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '90%', transition: 'background 0.2s' }}>
                Ver desempenho →
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* Rodapé Alinhado */}
      <footer style={{ backgroundColor: '#111c2e', color: '#b0bccc', padding: '30px 20px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <strong style={{ color: '#ffffff' }}>StudyUp</strong> - Todos os direitos reservados. © 2026
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/termos" style={{ color: '#3b8ccd', textDecoration: 'none' }}>Termos de Uso</a>
            <a href="/privacidade" style={{ color: '#3b8ccd', textDecoration: 'none' }}>Privacidade</a>
            <a href="/suporte" style={{ color: '#3b8ccd', textDecoration: 'none' }}>Suporte</a>
          </div>
        </div>
      </footer>

    </div>
  );
}