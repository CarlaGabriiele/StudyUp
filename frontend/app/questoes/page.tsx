"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";
const QUESTOES_POR_PAGINA = 5;

type Alternativa = { letra: string; texto: string };

type Questao = {
  id: number;
  enunciado: string;
  alternativas: string;
  resposta_correta: string;
  nivel_dificuldade: string;
  disciplina: string;
};

type RespostaEstado = {
  selecionada: string | null;
  enviando: boolean;
  respondido: boolean;
  acertou: boolean | null;
  gabarito: string | null;
  mensagem: string | null;
  erro: string | null;
};

// Converte "A) H2O, B) CO2, C) O2" em [{ letra: "A", texto: "H2O" }, ...]
function parseAlternativas(bruto: string): Alternativa[] {
  const regex = /([A-Za-z])\)\s*([\s\S]*?)(?=(?:,\s*[A-Za-z]\))|$)/g;
  const alternativas: Alternativa[] = [];
  let match;
  while ((match = regex.exec(bruto)) !== null) {
    const texto = match[2].trim().replace(/,+$/, "").trim();
    if (texto) {
      alternativas.push({ letra: match[1].toUpperCase(), texto });
    }
  }
  return alternativas;
}

const CORES_DIFICULDADE: Record<string, { bg: string; cor: string; label: string }> = {
  facil: { bg: "#dcfce7", cor: "#16a34a", label: "Fácil" },
  medio: { bg: "#fef3c7", cor: "#d97706", label: "Médio" },
  dificil: { bg: "#fee2e2", cor: "#dc2626", label: "Difícil" },
};

export default function QuestoesPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [usuario, setUsuario] = useState<any>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<number, RespostaEstado>>({});

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("Todas");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [busca, setBusca] = useState("");

  const temposInicio = useRef<Record<number, number>>({});

  useEffect(() => {
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarQuestoes() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [resMe, resQuestoes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/questoes`, { headers }),
        ]);

        if (resMe.status === 401 || resQuestoes.status === 401) {
          localStorage.removeItem("studyup_token");
          router.push("/login");
          return;
        }

        if (resMe.ok) setUsuario(await resMe.json());

        if (resQuestoes.ok) {
          const dados: Questao[] = await resQuestoes.json();
          setQuestoes(dados);
        } else {
          setErro("Não foi possível carregar as questões.");
        }
      } catch (error) {
        setErro("Não foi possível conectar com o servidor. Verifique se o backend está rodando.");
      } finally {
        setCarregando(false);
      }
    }

    carregarQuestoes();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("studyup_token");
    router.push("/login");
  }

  const disciplinas = useMemo(() => {
    const unicas = Array.from(new Set(questoes.map((q) => q.disciplina))).sort();
    return ["Todas", ...unicas];
  }, [questoes]);

  const questoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return questoes.filter((q) => {
      const atendeDisciplina = disciplinaSelecionada === "Todas" || q.disciplina === disciplinaSelecionada;
      const atendeBusca =
        termo.length === 0 ||
        q.enunciado.toLowerCase().includes(termo) ||
        q.disciplina.toLowerCase().includes(termo);
      return atendeDisciplina && atendeBusca;
    });
  }, [questoes, disciplinaSelecionada, busca]);

  const totalPaginas = Math.max(1, Math.ceil(questoesFiltradas.length / QUESTOES_POR_PAGINA));

  const questoesDaPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * QUESTOES_POR_PAGINA;
    return questoesFiltradas.slice(inicio, inicio + QUESTOES_POR_PAGINA);
  }, [questoesFiltradas, paginaAtual]);

  // Marca o instante em que cada questão da página apareceu, para calcular o tempo gasto
  useEffect(() => {
    questoesDaPagina.forEach((q) => {
      if (!temposInicio.current[q.id]) {
        temposInicio.current[q.id] = Date.now();
      }
    });
  }, [questoesDaPagina]);

  function handleMudarDisciplina(disciplina: string) {
    setDisciplinaSelecionada(disciplina);
    setPaginaAtual(1);
  }

  function handleBuscar(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  function handleSelecionarAlternativa(questaoId: number, letra: string) {
    setRespostas((prev) => {
      const atual = prev[questaoId];
      if (atual?.respondido) return prev;
      return {
        ...prev,
        [questaoId]: {
          selecionada: letra,
          enviando: false,
          respondido: false,
          acertou: null,
          gabarito: null,
          mensagem: null,
          erro: null,
        },
      };
    });
  }

  async function handleResponder(questao: Questao) {
    const estado = respostas[questao.id];
    if (!estado?.selecionada || estado.respondido) return;

    setRespostas((prev) => ({
      ...prev,
      [questao.id]: { ...prev[questao.id], enviando: true, erro: null },
    }));

    const alternativas = parseAlternativas(questao.alternativas);
    const escolhida = alternativas.find((a) => a.letra === estado.selecionada);
    const textoEscolhido = escolhida ? escolhida.texto : estado.selecionada;

    const inicio = temposInicio.current[questao.id] ?? Date.now();
    const tempoGasto = Math.max(1, Math.round((Date.now() - inicio) / 1000));

    try {
      const token = localStorage.getItem("studyup_token");
      const response = await fetch(`${API_URL}/questoes/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questao_id: questao.id,
          alternativa_escolhida: textoEscolhido,
          tempo_gasto: tempoGasto,
        }),
      });

      const dados = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("studyup_token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setRespostas((prev) => ({
          ...prev,
          [questao.id]: {
            ...prev[questao.id],
            enviando: false,
            erro: dados.detail || "Não foi possível enviar sua resposta.",
          },
        }));
        return;
      }

      setRespostas((prev) => ({
        ...prev,
        [questao.id]: {
          ...prev[questao.id],
          enviando: false,
          respondido: true,
          acertou: dados.acertou,
          gabarito: dados.gabarito,
          mensagem: dados.mensagem,
          erro: null,
        },
      }));
    } catch (error) {
      setRespostas((prev) => ({
        ...prev,
        [questao.id]: {
          ...prev[questao.id],
          enviando: false,
          erro: "Não foi possível conectar com o servidor.",
        },
      }));
    }
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
            const ativo = item.label === "Questões";
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
            }}
          >
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar questões, aulas, temas..."
              value={busca}
              onChange={(e) => handleBuscar(e.target.value)}
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

        <main style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {erro && (
            <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem" }}>
              {erro}
            </div>
          )}

          {/* CABEÇALHO */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Banco de Questões</h2>
              <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.95rem" }}>
                Pratique com questões do estilo ENEM e receba feedback na hora.
              </p>
            </div>

            {/* FILTRO POR DISCIPLINA */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Disciplina:</label>
              <select
                value={disciplinaSelecionada}
                onChange={(e) => handleMudarDisciplina(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {disciplinas.map((disciplina) => (
                  <option key={disciplina} value={disciplina}>
                    {disciplina}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LISTA DE QUESTÕES */}
          {questoesFiltradas.length === 0 ? (
            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "40px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                {busca.trim()
                  ? `Nenhuma questão encontrada para "${busca.trim()}".`
                  : "Nenhuma questão encontrada para esta disciplina."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {questoesDaPagina.map((questao, indice) => {
                const numero = (paginaAtual - 1) * QUESTOES_POR_PAGINA + indice + 1;
                const alternativas = parseAlternativas(questao.alternativas);
                const estado: RespostaEstado = respostas[questao.id] ?? {
                  selecionada: null,
                  enviando: false,
                  respondido: false,
                  acertou: null,
                  gabarito: null,
                  mensagem: null,
                  erro: null,
                };
                const dificuldade = CORES_DIFICULDADE[questao.nivel_dificuldade?.toLowerCase()] ?? {
                  bg: "#e2e8f0",
                  cor: "#475569",
                  label: questao.nivel_dificuldade,
                };

                return (
                  <div
                    key={questao.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      padding: "24px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      border: estado.respondido
                        ? `1px solid ${estado.acertou ? "#86efac" : "#fecaca"}`
                        : "1px solid transparent",
                    }}
                  >
                    {/* CABEÇALHO DA QUESTÃO */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "12px" }}>
                      <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8" }}>QUESTÃO {numero}</p>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", backgroundColor: "#dbeafe", color: "#2563eb" }}>
                          {questao.disciplina}
                        </span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", backgroundColor: dificuldade.bg, color: dificuldade.cor }}>
                          {dificuldade.label}
                        </span>
                      </div>
                    </div>

                    {/* ENUNCIADO */}
                    <p style={{ margin: "0 0 18px", fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.6, fontWeight: 600 }}>
                      {questao.enunciado}
                    </p>

                    {/* ALTERNATIVAS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {alternativas.map((alt) => {
                        const selecionadaPeloAluno = estado.selecionada === alt.letra;
                        const ehGabarito = estado.respondido && estado.gabarito?.trim().toUpperCase() === alt.texto.trim().toUpperCase();
                        const ehErroDoAluno = estado.respondido && selecionadaPeloAluno && !ehGabarito;

                        let backgroundColor = "#ffffff";
                        let borderColor = "#e2e8f0";
                        let corTexto = "#0f172a";

                        if (estado.respondido) {
                          if (ehGabarito) {
                            backgroundColor = "#dcfce7";
                            borderColor = "#86efac";
                            corTexto = "#166534";
                          } else if (ehErroDoAluno) {
                            backgroundColor = "#fee2e2";
                            borderColor = "#fecaca";
                            corTexto = "#991b1b";
                          }
                        } else if (selecionadaPeloAluno) {
                          backgroundColor = "#eff6ff";
                          borderColor = "#60a5fa";
                          corTexto = "#1d4ed8";
                        }

                        return (
                          <button
                            key={alt.letra}
                            onClick={() => handleSelecionarAlternativa(questao.id, alt.letra)}
                            disabled={estado.respondido}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              textAlign: "left",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: `1.5px solid ${borderColor}`,
                              backgroundColor,
                              color: corTexto,
                              fontSize: "0.88rem",
                              fontWeight: selecionadaPeloAluno || ehGabarito ? 700 : 500,
                              cursor: estado.respondido ? "default" : "pointer",
                              width: "100%",
                            }}
                          >
                            <span
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: `1.5px solid ${borderColor}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {alt.letra}
                            </span>
                            <span>{alt.texto}</span>
                            {ehGabarito && <span style={{ marginLeft: "auto" }}>✅</span>}
                            {ehErroDoAluno && <span style={{ marginLeft: "auto" }}>❌</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* AÇÃO / FEEDBACK */}
                    <div style={{ marginTop: "16px" }}>
                      {estado.erro && (
                        <p style={{ margin: "0 0 10px", fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>{estado.erro}</p>
                      )}

                      {!estado.respondido ? (
                        <button
                          onClick={() => handleResponder(questao)}
                          disabled={!estado.selecionada || estado.enviando}
                          style={{
                            backgroundColor: !estado.selecionada || estado.enviando ? "#cbd5e1" : "#0b1326",
                            color: "#ffffff",
                            border: "none",
                            padding: "10px 22px",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: !estado.selecionada || estado.enviando ? "not-allowed" : "pointer",
                          }}
                        >
                          {estado.enviando ? "Enviando..." : "Responder"}
                        </button>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: estado.acertou ? "#f0fdf4" : "#fef2f2",
                            border: `1px solid ${estado.acertou ? "#bbf7d0" : "#fecaca"}`,
                            borderRadius: "10px",
                            padding: "10px 14px",
                          }}
                        >
                          <span style={{ fontSize: "1.1rem" }}>{estado.acertou ? "✅" : "❌"}</span>
                          <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: estado.acertou ? "#166534" : "#991b1b" }}>
                            {estado.mensagem}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINAÇÃO */}
          {questoesFiltradas.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <button
                onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  color: paginaAtual === 1 ? "#cbd5e1" : "#0f172a",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => setPaginaAtual(pagina)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: pagina === paginaAtual ? "#0b1326" : "#ffffff",
                    color: pagina === paginaAtual ? "#ffffff" : "#0f172a",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {pagina}
                </button>
              ))}

              <button
                onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  color: paginaAtual === totalPaginas ? "#cbd5e1" : "#0f172a",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
                }}
              >
                Próxima →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
