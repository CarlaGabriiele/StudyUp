"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

interface ResumoGeral {
  total_respondidas: number;
  total_acertos: number;
  total_erros: number;
  taxa_acerto_porcentagem: number;
  tempo_total_estudado_minutos: number;
  tempo_medio_por_questao_segundos: number;
  total_simulados_realizados: number;
}

interface DesempenhoDisciplina {
  disciplina: string;
  total_respondidas: number;
  acertos: number;
  erros: number;
  taxa_acerto_porcentagem: number;
}

interface DesempenhoDificuldade {
  nivel: string;
  total_respondidas: number;
  acertos: number;
  erros: number;
  taxa_acerto_porcentagem: number;
}

interface Aulas {
  total: number;
  concluidas: number;
  taxa_conclusao_porcentagem: number;
}

interface DesempenhoDetalhado {
  estudante: string;
  resumo_geral: ResumoGeral;
  desempenho_por_disciplina: DesempenhoDisciplina[];
  desempenho_por_dificuldade: DesempenhoDificuldade[];
  aulas: Aulas;
}

const DIFICULDADE_LABELS: Record<string, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

function formatarSegundos(segundos: number) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

function formatarMinutos(minutos: number) {
  if (minutos < 60) return `${minutos.toFixed(0)} min`;
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = Math.round(minutos % 60);
  return `${horas}h ${String(minutosRestantes).padStart(2, "0")}min`;
}

export default function DesempenhoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [usuario, setUsuario] = useState<any>(null);
  const [desempenho, setDesempenho] = useState<DesempenhoDetalhado | null>(null);
  const [ia, setIa] = useState<any>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDesempenho() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [resMe, resDesempenho, resIa] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/estudos/desempenho-detalhado`, { headers }),
          fetch(`${API_URL}/ia/relatorio-desempenho`, { headers }),
        ]);

        if (resMe.status === 401 || resDesempenho.status === 401) {
          localStorage.removeItem("studyup_token");
          router.push("/login");
          return;
        }

        if (resMe.ok) setUsuario(await resMe.json());
        if (resDesempenho.ok) setDesempenho(await resDesempenho.json());
        if (resIa.ok) setIa(await resIa.json());
      } catch (error) {
        setErro("Não foi possível conectar com o servidor. Verifique se o backend está rodando.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDesempenho();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("studyup_token");
    router.push("/login");
  }

  if (carregando) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#64748b" }}>
        A carregar...
      </div>
    );
  }

  const primeiroNome = usuario?.nome ? usuario.nome.split(" ")[0] : "Estudante";
  const iniciais = usuario?.nome
    ? usuario.nome
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte: string) => parte[0])
        .join("")
        .toUpperCase()
    : "??";

  const menuItens = [
    { label: "Início", icon: "🏠", href: "/dashboard" },
    { label: "Questões", icon: "📖", href: "/questoes" },
    { label: "Simulados", icon: "🖥️", href: "/simulados" },
    { label: "Aulas", icon: "🎓", href: "/aulas" },
    { label: "Desempenho", icon: "📊", href: "/desempenho" },
    { label: "Anotações", icon: "📝", href: "/anotacoes" },
    { label: "Ranking", icon: "🏆", href: "/ranking" },
    { label: "Configurações", icon: "⚙️", href: "/configuracoes" },
  ];

  const resumo = desempenho?.resumo_geral;
  const temRegistros = (resumo?.total_respondidas ?? 0) > 0;
  const disciplinas = desempenho?.desempenho_por_disciplina ?? [];
  const dificuldades = desempenho?.desempenho_por_dificuldade ?? [];
  const aulas = desempenho?.aulas;
  const recomendacoes = ia?.recomendacoes_videoaulas ?? [];

  const termoBusca = busca.trim().toLowerCase();
  const disciplinasFiltradas = termoBusca
    ? disciplinas.filter((d) => d.disciplina.toLowerCase().includes(termoBusca))
    : disciplinas;
  const dificuldadesFiltradas = termoBusca
    ? dificuldades.filter((d) => (DIFICULDADE_LABELS[d.nivel] ?? d.nivel).toLowerCase().includes(termoBusca))
    : dificuldades;
  const recomendacoesFiltradas = termoBusca
    ? recomendacoes.filter(
        (a: any) =>
          a.titulo?.toLowerCase().includes(termoBusca) || a.disciplina?.toLowerCase().includes(termoBusca)
      )
    : recomendacoes;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "sans-serif" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: "230px",
          backgroundColor: "#0b1326",
          color: "#ffffff",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 8px", marginBottom: "36px" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
          </svg>
          <div>
            <h1 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>StudyUp</h1>
            <p style={{ fontSize: "0.65rem", color: "#94a3b8", margin: 0, fontWeight: 500 }}>Foco no ENEM</p>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {menuItens.map((item) => {
            const ativo = item.label === "Desempenho";
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: ativo ? "#0b1326" : "#cbd5e1",
                  backgroundColor: ativo ? "#ffffff" : "transparent",
                  fontWeight: ativo ? 700 : 500,
                  fontSize: "0.85rem",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* TOPBAR */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "16px 32px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f1f5f9",
              borderRadius: "8px",
              padding: "8px 14px",
              width: "320px",
            }}
          >
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar questões, aulas, temas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "0.85rem",
                color: "#1e293b",
              }}
            />
          </div>

          <button
            onClick={handleLogout}
            title="Sair da conta"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#0b1326",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {iniciais}
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>{usuario?.nome ?? "Estudante"}</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8" }}>Estudante</p>
            </div>
          </button>
        </header>

        {/* ÁREA PRINCIPAL */}
        <main style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {erro && (
            <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem" }}>
              {erro}
            </div>
          )}

          {/* CABEÇALHO */}
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Desempenho de {primeiroNome}</h2>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.95rem" }}>
              Uma visão aprofundada da sua evolução nos estudos.
            </p>
          </div>

          {!temRegistros ? (
            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748b" }}>
                Você ainda não respondeu nenhuma questão. Comece a praticar para acompanhar seu desempenho aqui!
              </p>
              <Link
                href="/questoes"
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  backgroundColor: "#0b1326",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Responder questões
              </Link>
            </div>
          ) : (
            <>
              {/* CARDS DE RESUMO GERAL */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                <StatCard icone="📖" cor="#aed2ff" valor={String(resumo!.total_respondidas)} label="Questões respondidas" />
                <StatCard icone="✅" cor="#dcfce7" valor={String(resumo!.total_acertos)} label="Acertos" corValor="#16a34a" />
                <StatCard icone="❌" cor="#fee2e2" valor={String(resumo!.total_erros)} label="Erros" corValor="#dc2626" />
                <StatCard icone="🎯" cor="#fde68a" valor={`${resumo!.taxa_acerto_porcentagem}%`} label="Taxa de acerto" corValor="#d97706" />
              </div>

              {/* TAXA DE ACERTO GERAL */}
              <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Visão geral</h3>
                    <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748b" }}>Seu aproveitamento em todas as questões respondidas</p>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "20px" }}>
                    📊 Geral
                  </span>
                </div>

                <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
                    <MiniStat icone="⏱️" cor="#ede9fe" corTexto="#7c3aed" valor={formatarSegundos(resumo!.tempo_medio_por_questao_segundos)} label="Tempo médio" sublabel="Por questão" />
                    <MiniStat icone="🕒" cor="#e0f2fe" corTexto="#0284c7" valor={formatarMinutos(resumo!.tempo_total_estudado_minutos)} label="Tempo total estudado" sublabel="Em questões e simulados" />
                    <MiniStat icone="🖥️" cor="#fae8ff" corTexto="#a21caf" valor={String(resumo!.total_simulados_realizados)} label="Simulados realizados" sublabel="Com respostas registadas" />
                  </div>

                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px" }}>
                      <span>Taxa de acerto geral</span>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{resumo!.taxa_acerto_porcentagem}%</span>
                    </div>
                    <div style={{ width: "100%", height: "14px", borderRadius: "8px", backgroundColor: "#fee2e2", overflow: "hidden" }}>
                      <div style={{ width: `${resumo!.taxa_acerto_porcentagem}%`, height: "100%", backgroundColor: "#22c55e" }} />
                    </div>

                    {aulas && (
                      <div style={{ marginTop: "18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px" }}>
                          <span>Aulas concluídas</span>
                          <span style={{ fontWeight: 700, color: "#0f172a" }}>
                            {aulas.concluidas}/{aulas.total} ({aulas.taxa_conclusao_porcentagem}%)
                          </span>
                        </div>
                        <div style={{ width: "100%", height: "14px", borderRadius: "8px", backgroundColor: "#e2e8f0", overflow: "hidden" }}>
                          <div style={{ width: `${aulas.taxa_conclusao_porcentagem}%`, height: "100%", backgroundColor: "#60a5fa" }} />
                        </div>
                      </div>
                    )}

                    {ia?.dica_ia && (
                      <div style={{ marginTop: "18px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "12px 14px" }}>
                        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#1d4ed8" }}>💡 Dica da IA</p>
                        <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#1e3a5f", lineHeight: 1.5 }}>{ia.dica_ia}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DESEMPENHO POR DISCIPLINA + DIFICULDADE */}
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px" }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Desempenho por disciplina</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "#64748b" }}>Sua taxa de acerto em cada área do conhecimento</p>

                  {disciplinasFiltradas.length === 0 ? (
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      {termoBusca ? `Nenhuma disciplina encontrada para "${busca.trim()}".` : "Nenhum dado por disciplina disponível."}
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {disciplinasFiltradas.map((d) => (
                        <div key={d.disciplina}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a" }}>{d.disciplina}</span>
                            <span style={{ color: "#64748b" }}>
                              {d.acertos}/{d.total_respondidas} acertos • {d.taxa_acerto_porcentagem}%
                            </span>
                          </div>
                          <div style={{ width: "100%", height: "10px", borderRadius: "8px", backgroundColor: "#fee2e2", overflow: "hidden" }}>
                            <div style={{ width: `${d.taxa_acerto_porcentagem}%`, height: "100%", backgroundColor: "#22c55e" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Por nível de dificuldade</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "#64748b" }}>Como você se sai em cada nível</p>

                  {dificuldadesFiltradas.length === 0 ? (
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      {termoBusca ? `Nenhum nível encontrado para "${busca.trim()}".` : "Nenhum dado por dificuldade disponível."}
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {dificuldadesFiltradas.map((d) => (
                        <div key={d.nivel}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a" }}>{DIFICULDADE_LABELS[d.nivel] ?? d.nivel}</span>
                            <span style={{ color: "#64748b" }}>{d.taxa_acerto_porcentagem}%</span>
                          </div>
                          <div style={{ width: "100%", height: "10px", borderRadius: "8px", backgroundColor: "#e2e8f0", overflow: "hidden" }}>
                            <div style={{ width: `${d.taxa_acerto_porcentagem}%`, height: "100%", backgroundColor: "#7c3aed" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RECOMENDAÇÕES DE VIDEOAULAS */}
              {recomendacoes.length > 0 && (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Aulas recomendadas para reforço</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "#64748b" }}>
                    Sugestões com base nas disciplinas onde você mais erra
                  </p>

                  {recomendacoesFiltradas.length === 0 ? (
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Nenhuma aula recomendada encontrada para "{busca.trim()}".</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {recomendacoesFiltradas.map((aula: any) => (
                      <div
                        key={aula.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid #f1f5f9",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#0b1326",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          ▶️
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{aula.titulo}</p>
                          <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>{aula.disciplina}</p>
                        </div>
                        <Link
                          href="/aulas"
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#2563eb",
                            backgroundColor: "#dbeafe",
                            padding: "6px 12px",
                            borderRadius: "12px",
                            textDecoration: "none",
                            flexShrink: 0,
                          }}
                        >
                          Assistir
                        </Link>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icone, cor, valor, label, corValor }: { icone: string; cor: string; valor: string; label: string; corValor?: string }) {
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%" }}>
      <div style={{ backgroundColor: cor, width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
        {icone}
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: corValor ?? "#0f172a" }}>{valor}</p>
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>{label}</p>
      </div>
    </div>
  );
}

function MiniStat({ icone, cor, corTexto, valor, label, sublabel }: { icone: string; cor: string; corTexto: string; valor: string; label: string; sublabel: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ backgroundColor: cor, width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icone}
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: corTexto }}>{valor}</p>
        <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "0.65rem", color: "#94a3b8" }}>{sublabel}</p>
      </div>
    </div>
  );
}
