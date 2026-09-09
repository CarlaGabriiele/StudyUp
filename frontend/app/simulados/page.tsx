"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

type Simulado = {
  id: number;
  titulo: string;
  descricao?: string | null;
  questoes?: { id: number }[];
};

export default function SimuladosPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [usuario, setUsuario] = useState<any>(null);
  const [simulados, setSimulados] = useState<Simulado[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarSimulados() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [resMe, resSimulados] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/simulados`, { headers }),
        ]);

        if (resMe.status === 401 || resSimulados.status === 401) {
          localStorage.removeItem("studyup_token");
          router.push("/login");
          return;
        }

        if (resMe.ok) setUsuario(await resMe.json());

        if (resSimulados.ok) {
          setSimulados(await resSimulados.json());
        } else {
          setErro("Não foi possível carregar os simulados.");
        }
      } catch (error) {
        setErro("Não foi possível conectar com o servidor. Verifique se o backend está rodando.");
      } finally {
        setCarregando(false);
      }
    }

    carregarSimulados();
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
            const ativo = item.label === "Simulados";
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

          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Simulados</h2>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.95rem" }}>
              Faça uma prova completa, cronometrada, e veja sua nota final ao terminar.
            </p>
          </div>

          {simulados.length === 0 ? (
            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "40px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>Nenhum simulado disponível no momento.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" }}>
              {simulados.map((simulado) => {
                const totalQuestoes = simulado.questoes?.length ?? 0;
                return (
                  <div
                    key={simulado.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      padding: "22px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div
                        style={{
                          backgroundColor: "#aed2ff",
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "1.1rem",
                        }}
                      >
                        🖥️
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{simulado.titulo}</p>
                        {simulado.descricao && (
                          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{simulado.descricao}</p>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", backgroundColor: "#f1f5f9", padding: "5px 10px", borderRadius: "12px", alignSelf: "flex-start" }}>
                      {totalQuestoes > 0 ? `${totalQuestoes} questões` : "Questões a definir"}
                    </span>

                    <Link
                      href={`/simulados/${simulado.id}`}
                      style={{
                        textAlign: "center",
                        backgroundColor: "#0b1326",
                        color: "#ffffff",
                        padding: "10px 0",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        marginTop: "auto",
                      }}
                    >
                      Iniciar simulado
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
