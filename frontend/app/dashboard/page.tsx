"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

export default function DashboardPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [usuario, setUsuario] = useState<any>(null);
  const [resumo, setResumo] = useState<any>(null);
  const [ia, setIa] = useState<any>(null);
  const [conteudos, setConteudos] = useState<any[]>([]);
  const [simulados, setSimulados] = useState<any[]>([]);

  useEffect(() => {
    // Proteção de rota simples: verifica se o utilizador tem o token
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDashboard() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [resMe, resResumo, resIa, resConteudos, resSimulados] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/estudos/dashboard`, { headers }),
          fetch(`${API_URL}/ia/relatorio-desempenho`, { headers }),
          fetch(`${API_URL}/estudos/conteudos`, { headers }),
          fetch(`${API_URL}/simulados`, { headers }),
        ]);

        if (resMe.status === 401 || resResumo.status === 401) {
          // Token inválido ou expirado
          localStorage.removeItem("studyup_token");
          router.push("/login");
          return;
        }

        if (resMe.ok) setUsuario(await resMe.json());
        if (resResumo.ok) setResumo(await resResumo.json());
        if (resIa.ok) setIa(await resIa.json());
        if (resConteudos.ok) setConteudos(await resConteudos.json());
        if (resSimulados.ok) setSimulados(await resSimulados.json());
      } catch (error) {
        setErro("Não foi possível conectar com o servidor. Verifique se o backend está rodando.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
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

  const resumoQuestoes = resumo?.resumo_questoes;
  const totalRespondidas = resumoQuestoes?.total_respondidas ?? 0;
  const totalAcertos = resumoQuestoes?.total_acertos ?? 0;
  const totalErros = totalRespondidas - totalAcertos;
  const taxaAcerto = resumoQuestoes?.taxa_acerto_porcentagem ?? 0;

  const tempoMedioSegundos =
    totalRespondidas > 0
      ? Math.round(((resumoQuestoes?.tempo_total_em_questoes_minutos ?? 0) * 60) / totalRespondidas)
      : 0;
  const tempoMedioFormatado = `${String(Math.floor(tempoMedioSegundos / 60)).padStart(2, "0")}:${String(
    tempoMedioSegundos % 60
  ).padStart(2, "0")}`;

  const conteudosPendentes = conteudos.filter((c) => !c.concluido);
  const conteudosConcluidos = conteudos.filter((c) => c.concluido);
  const proximoSimulado = simulados[0];

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
            const ativo = item.label === "Início";
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
            padding: "16px 32px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
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
              color: "#94a3b8",
              fontSize: "0.85rem",
            }}
          >
            🔍 <span>Buscar questões, aulas, temas...</span>
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

        <main style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {erro && (
            <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem" }}>
              {erro}
            </div>
          )}

          {/* SAUDAÇÃO */}
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Olá, {primeiroNome}!</h2>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.95rem" }}>
              Continue firme nos seus estudos! Você está no caminho certo.
            </p>
          </div>

          {/* CARDS DE ESTATÍSTICAS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <StatCard icone="📖" cor="#aed2ff" valor="10.000+" label="Questões" />
            <StatCard icone="☑️" cor="#cbbaff" valor="800+" label="Aulas" />
            <StatCard icone="🎯" cor="#86efac" valor="65+" label="Simulados" />
            <Link href="/desempenho" style={{ textDecoration: "none" }}>
              <StatCard icone="📈" cor="#fde68a" valor="Desempenho" label="Seu desempenho" corValor="#d97706" />
            </Link>
          </div>

          {/* SEU DESEMPENHO */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Seu desempenho</h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748b" }}>Acompanhe sua evolução nos estudos</p>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "20px" }}>
                📊 Geral
              </span>
            </div>

            {totalRespondidas === 0 ? (
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Você ainda não respondeu nenhuma questão. Comece a praticar para ver seu desempenho aqui!
              </p>
            ) : (
              <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "180px" }}>
                  <MiniStat icone="⏱️" cor="#ede9fe" corTexto="#7c3aed" valor={tempoMedioFormatado} label="Tempo médio" sublabel="Por questão" />
                  <MiniStat icone="✅" cor="#dcfce7" corTexto="#16a34a" valor={String(totalAcertos)} label="Questões corretas" sublabel={`${totalRespondidas} questões`} />
                  <MiniStat icone="❌" cor="#fee2e2" corTexto="#dc2626" valor={String(totalErros)} label="Questões incorretas" sublabel={`${totalRespondidas} questões`} />
                </div>

                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px" }}>
                    <span>Taxa de acerto</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{taxaAcerto}%</span>
                  </div>
                  <div style={{ width: "100%", height: "14px", borderRadius: "8px", backgroundColor: "#fee2e2", overflow: "hidden" }}>
                    <div style={{ width: `${taxaAcerto}%`, height: "100%", backgroundColor: "#22c55e" }} />
                  </div>

                  {ia?.dica_ia && (
                    <div style={{ marginTop: "18px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "12px 14px" }}>
                      <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#1d4ed8" }}>💡 Dica da IA</p>
                      <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#1e3a5f", lineHeight: 1.5 }}>{ia.dica_ia}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CONTINUE DE ONDE PAROU + PRÓXIMO SIMULADO */}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Continue de onde parou</h3>

              {conteudos.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Nenhuma aula disponível no momento.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {conteudosPendentes.slice(0, 1).map((c) => (
                    <ConteudoItem key={c.id} conteudo={c} destaque />
                  ))}
                  {conteudosConcluidos.slice(0, 1).map((c) => (
                    <ConteudoItem key={c.id} conteudo={c} />
                  ))}
                  {conteudosPendentes.length === 0 && conteudosConcluidos.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Nenhuma aula disponível no momento.</p>
                  )}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Próximo simulado</h3>

              {proximoSimulado ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ backgroundColor: "#aed2ff", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      🖥️
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>{proximoSimulado.titulo}</p>
                      {proximoSimulado.descricao && (
                        <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#64748b" }}>{proximoSimulado.descricao}</p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/simulados/${proximoSimulado.id}`}
                    style={{
                      textAlign: "center",
                      backgroundColor: "#60a5fa",
                      color: "#ffffff",
                      padding: "10px 0",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                    }}
                  >
                    Iniciar simulado
                  </Link>
                </div>
              ) : (
                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Nenhum simulado disponível no momento.</p>
              )}
            </div>
          </div>
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

function ConteudoItem({ conteudo, destaque }: { conteudo: any; destaque?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: destaque ? "#0b1326" : "#e2e8f0",
          color: destaque ? "#ffffff" : "#64748b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ▶️
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{conteudo.titulo}</p>
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>{conteudo.disciplina}</p>
      </div>
      <span
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: "12px",
          backgroundColor: conteudo.concluido ? "#dcfce7" : "#dbeafe",
          color: conteudo.concluido ? "#16a34a" : "#2563eb",
        }}
      >
        {conteudo.concluido ? "Concluído" : "Em andamento"}
      </span>
    </div>
  );
}
