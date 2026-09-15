"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

interface Aula {
  id: number;
  titulo: string;
  disciplina?: string;
  url_video: string;
  descricao?: string;
  professor?: string;
}

export default function AulasPage() {
  const router = useRouter();

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [usuario, setUsuario] = useState<any>(null);
  const [disciplinaAtiva, setDisciplinaAtiva] = useState("Todas");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDados() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [resMe, resAulas] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/conteudos/videoaulas`, { headers }),
        ]);

        if (resMe.status === 401 || resAulas.status === 401) {
          localStorage.removeItem("studyup_token");
          router.push("/login");
          return;
        }

        if (resMe.ok) setUsuario(await resMe.json());
        if (resAulas.ok) setAulas(await resAulas.json());
      } catch (err: any) {
        setErro("Não foi possível conectar com o servidor. Verifique se o backend está rodando.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("studyup_token");
    router.push("/login");
  }

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

  const disciplinas = [
    "Todas",
    "Linguagens",
    "Ciências Humanas",
    "Ciências da Natureza",
    "Matemática",
    "Redação",
  ];

  const mapaCategorias: Record<string, string[]> = {
    "Linguagens": ["linguagens", "português", "literatura", "inglês", "espanhol", "artes"],
    "Ciências Humanas": ["ciências humanas", "história", "geografia", "filosofia", "sociologia"],
    "Ciências da Natureza": ["ciências da natureza", "física", "química", "biologia"],
    "Matemática": ["matemática"],
    "Redação": ["redação"],
  };

  const aulasFiltradas = aulas.filter((aula) => {
    const disciplinaAula = aula.disciplina?.toLowerCase() || "";

    let atendeDisciplina = false;
    if (disciplinaAtiva === "Todas") {
      atendeDisciplina = true;
    } else {
      const materiasAceitas = mapaCategorias[disciplinaAtiva] || [disciplinaAtiva.toLowerCase()];
      atendeDisciplina = materiasAceitas.includes(disciplinaAula);
    }

    const atendeBusca =
      aula.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      disciplinaAula.includes(busca.toLowerCase());

    return atendeDisciplina && atendeBusca;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#64748b" }}>
        A carregar...
      </div>
    );
  }

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
            const ativo = item.label === "Aulas";
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
          {/* BUSCA NA ESQUERDA */}
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

          {/* PERFIL EMPURRADO TOTALMENTE À DIREITA */}
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
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Aulas</h2>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.95rem" }}>
              Assista a videoaulas e aprimore seus conhecimentos.
            </p>
          </div>

          {/* FILTROS DE DISCIPLINAS */}
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Disciplinas</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {disciplinas.map((disc) => (
                <button
                  key={disc}
                  onClick={() => setDisciplinaAtiva(disc)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: disciplinaAtiva === disc ? "#0b1326" : "#ffffff",
                    color: disciplinaAtiva === disc ? "#ffffff" : "#475569",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  {disc}
                </button>
              ))}
            </div>
          </div>

          {/* LISTAGEM DE AULAS */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
              {disciplinaAtiva === "Todas" ? "Todas as aulas" : `Aulas de ${disciplinaAtiva}`}
            </h3>

            {erro && (
              <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>
                {erro}
              </div>
            )}

            {!erro && aulasFiltradas.length === 0 && (
              <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                Nenhuma aula encontrada para este filtro.
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {aulasFiltradas.map((aula) => (
                <div
                  key={aula.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #f1f5f9",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div style={{ width: "160px", height: "90px", backgroundColor: "#000000", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                    <iframe
                      src={aula.url_video}
                      title={aula.titulo}
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allowFullScreen
                    />
                  </div>

                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                      {aula.titulo}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                      {aula.disciplina || "Geral"} {aula.professor ? `• Prof. ${aula.professor}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}