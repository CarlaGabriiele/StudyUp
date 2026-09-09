"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";
const SEGUNDOS_POR_QUESTAO = 180; // 3 minutos por questão, já que o simulado não define uma duração própria

type Alternativa = { letra: string; texto: string };

type Questao = {
  id: number;
  enunciado: string;
  alternativas: string;
  resposta_correta: string;
  nivel_dificuldade: string;
  disciplina: string;
};

type Simulado = {
  id: number;
  titulo: string;
  descricao?: string | null;
  questoes: Questao[];
};

type DetalheResposta = {
  questao_id: number;
  resposta_aluno: string;
  gabarito: string;
  correto: boolean;
};

type ResultadoSimulado = {
  simulado_id: number;
  total_questoes: number;
  acertos: number;
  erros: number;
  nota_porcentagem: number;
  tempo_total_segundos: number;
  detalhes: DetalheResposta[];
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

function formatarTempo(totalSegundos: number): string {
  const seguro = Math.max(0, totalSegundos);
  const minutos = Math.floor(seguro / 60);
  const segundos = seguro % 60;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

export default function SimuladoPage() {
  const router = useRouter();
  const params = useParams();
  const simuladoId = Number(params?.id);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [simulado, setSimulado] = useState<Simulado | null>(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);
  const [finalizando, setFinalizando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [resultado, setResultado] = useState<ResultadoSimulado | null>(null);

  // Refs para valores que NÃO devem provocar reinício do cronômetro
  // quando o utilizador simplesmente navega entre as questões.
  const dataInicioRef = useRef<number | null>(null);
  const duracaoTotalRef = useRef<number>(0);
  const jaFinalizadoRef = useRef(false);

  const chaveArmazenamento = `studyup_simulado_${simuladoId}`;

  useEffect(() => {
    const token = localStorage.getItem("studyup_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarSimulado() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const resSimulado = await fetch(`${API_URL}/simulados/${simuladoId}`, { headers });

        if (resSimulado.status === 401) {
          localStorage.removeItem("studyup_token");
          router.push("/login");
          return;
        }

        if (resSimulado.status === 404) {
          setErro("Este simulado não foi encontrado.");
          return;
        }

        if (!resSimulado.ok) {
          setErro("Não foi possível carregar o simulado.");
          return;
        }

        const dados: Simulado = await resSimulado.json();
        setSimulado(dados);

        const duracaoTotal = Math.max(60, dados.questoes.length * SEGUNDOS_POR_QUESTAO);
        duracaoTotalRef.current = duracaoTotal;

        // Recupera progresso salvo (respostas + início do cronômetro), para que
        // um recarregamento acidental da página não reinicie o tempo nem apague respostas.
        const salvo = sessionStorage.getItem(chaveArmazenamento);
        if (salvo) {
          try {
            const estadoSalvo = JSON.parse(salvo);
            dataInicioRef.current = estadoSalvo.dataInicio;
            setRespostas(estadoSalvo.respostas ?? {});
          } catch {
            dataInicioRef.current = Date.now();
          }
        } else {
          dataInicioRef.current = Date.now();
          sessionStorage.setItem(chaveArmazenamento, JSON.stringify({ dataInicio: dataInicioRef.current, respostas: {} }));
        }

        const decorrido = Math.floor((Date.now() - (dataInicioRef.current ?? Date.now())) / 1000);
        setTempoRestante(Math.max(0, duracaoTotal - decorrido));
      } catch (error) {
        setErro("Não foi possível conectar com o servidor. Verifique se o backend está rodando.");
      } finally {
        setCarregando(false);
      }
    }

    carregarSimulado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simuladoId, router]);

  // Salva o progresso das respostas sempre que ele muda (sem afetar o cronômetro)
  useEffect(() => {
    if (!simulado || dataInicioRef.current === null) return;
    sessionStorage.setItem(chaveArmazenamento, JSON.stringify({ dataInicio: dataInicioRef.current, respostas }));
  }, [respostas, simulado, chaveArmazenamento]);

  // Cronômetro: depende só da duração total, então trocar de questão NUNCA o reinicia.
  useEffect(() => {
    if (!simulado || resultado) return;

    const intervalo = setInterval(() => {
      const decorrido = Math.floor((Date.now() - (dataInicioRef.current ?? Date.now())) / 1000);
      const restante = Math.max(0, duracaoTotalRef.current - decorrido);
      setTempoRestante(restante);

      if (restante <= 0) {
        clearInterval(intervalo);
        finalizarSimulado(true);
      }
    }, 1000);

    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulado, resultado]);

  const questoes = simulado?.questoes ?? [];
  const questaoAtual = questoes[indiceAtual];
  const alternativasAtuais = useMemo(() => (questaoAtual ? parseAlternativas(questaoAtual.alternativas) : []), [questaoAtual]);
  const totalRespondidas = Object.keys(respostas).length;

  function handleSelecionarAlternativa(letra: string) {
    if (!questaoAtual || resultado) return;
    setRespostas((prev) => ({ ...prev, [questaoAtual.id]: letra }));
  }

  function handleIrPara(indice: number) {
    if (indice < 0 || indice >= questoes.length) return;
    setIndiceAtual(indice);
  }

  async function finalizarSimulado(automatico: boolean) {
    if (!simulado || jaFinalizadoRef.current) return;

    if (!automatico) {
      const faltando = questoes.length - totalRespondidas;
      const confirmacao = window.confirm(
        faltando > 0
          ? `Você ainda não respondeu ${faltando} questão(ões). Deseja finalizar o simulado mesmo assim?`
          : "Deseja finalizar o simulado e enviar suas respostas?"
      );
      if (!confirmacao) return;
    }

    jaFinalizadoRef.current = true;
    setFinalizando(true);
    setErroEnvio("");

    // Converte a letra escolhida em cada questão para o texto da alternativa,
    // que é o formato usado pelo backend para conferir o gabarito.
    const respostasTexto: Record<number, string> = {};
    for (const questao of questoes) {
      const letraEscolhida = respostas[questao.id];
      if (!letraEscolhida) continue;
      const alternativas = parseAlternativas(questao.alternativas);
      const escolhida = alternativas.find((a) => a.letra === letraEscolhida);
      respostasTexto[questao.id] = escolhida ? escolhida.texto : letraEscolhida;
    }

    const decorrido = Math.min(
      duracaoTotalRef.current,
      Math.floor((Date.now() - (dataInicioRef.current ?? Date.now())) / 1000)
    );

    try {
      const token = localStorage.getItem("studyup_token");
      const response = await fetch(`${API_URL}/simulados/${simulado.id}/submeter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          respostas: respostasTexto,
          tempo_total_segundos: decorrido,
        }),
      });

      const dados = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("studyup_token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setErroEnvio(dados.detail || "Não foi possível enviar as respostas do simulado.");
        jaFinalizadoRef.current = false;
        return;
      }

      // Só limpamos o progresso salvo depois de uma submissão bem-sucedida.
      sessionStorage.removeItem(chaveArmazenamento);
      setResultado(dados);
    } catch (error) {
      setErroEnvio("Não foi possível conectar com o servidor para enviar suas respostas.");
      jaFinalizadoRef.current = false;
    } finally {
      setFinalizando(false);
    }
  }

  if (carregando) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#64748b" }}>
        A carregar...
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p style={{ color: "#b91c1c", fontSize: "0.95rem" }}>{erro}</p>
        <Link href="/simulados" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
          ← Voltar para simulados
        </Link>
      </div>
    );
  }

  if (!simulado) return null;

  // TELA DE RESULTADO
  if (resultado) {
    const bomDesempenho = resultado.nota_porcentagem >= 60;
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "sans-serif", display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "32px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8" }}>SIMULADO FINALIZADO</p>
            <h2 style={{ margin: "6px 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>{simulado.titulo}</h2>

            <div
              style={{
                margin: "24px auto",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                border: `10px solid ${bomDesempenho ? "#22c55e" : "#ef4444"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "1.8rem", fontWeight: 800, color: bomDesempenho ? "#16a34a" : "#dc2626" }}>
                {resultado.nota_porcentagem}%
              </span>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700 }}>NOTA FINAL</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginTop: "8px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#16a34a" }}>{resultado.acertos}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>Acertos</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#dc2626" }}>{resultado.erros}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>Erros</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>{formatarTempo(resultado.tempo_total_segundos)}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>Tempo total</p>
              </div>
            </div>
          </div>

          {/* DETALHES POR QUESTÃO */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Revisão das questões</h3>
            {resultado.detalhes.map((detalhe, indice) => {
              const questao = questoes.find((q) => q.id === detalhe.questao_id);
              return (
                <div
                  key={detalhe.questao_id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "10px",
                    backgroundColor: detalhe.correto ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${detalhe.correto ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                      {indice + 1}. {questao?.enunciado ?? "Questão"}
                    </p>
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{detalhe.correto ? "✅" : "❌"}</span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#475569" }}>
                    Sua resposta: <strong>{detalhe.resposta_aluno || "Não respondida"}</strong>
                  </p>
                  {!detalhe.correto && (
                    <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#475569" }}>
                      Gabarito: <strong>{detalhe.gabarito}</strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link
              href="/simulados"
              style={{ padding: "12px 22px", borderRadius: "8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
            >
              Voltar aos simulados
            </Link>
            <Link
              href="/dashboard"
              style={{ padding: "12px 22px", borderRadius: "8px", backgroundColor: "#0b1326", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
            >
              Ver dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SIMULADO SEM QUESTÕES CADASTRADAS
  if (questoes.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Este simulado ainda não possui questões cadastradas.</p>
        <Link href="/simulados" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
          ← Voltar para simulados
        </Link>
      </div>
    );
  }

  const tempoUrgente = (tempoRestante ?? 0) <= 60;

  // TELA DO SIMULADO EM ANDAMENTO
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "sans-serif", display: "flex", justifyContent: "center", padding: "28px 20px" }}>
      <div style={{ width: "100%", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* CABEÇALHO COM CRONÔMETRO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", borderRadius: "14px", padding: "16px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8" }}>SIMULADO</p>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>{simulado.titulo}</h2>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: tempoUrgente ? "#fee2e2" : "#eff6ff",
              color: tempoUrgente ? "#dc2626" : "#1d4ed8",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "1.1rem",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ⏱️ {formatarTempo(tempoRestante ?? 0)}
          </div>
        </div>

        {erroEnvio && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem" }}>
            {erroEnvio}
          </div>
        )}

        {/* CARD DA QUESTÃO */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "12px" }}>
            <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8" }}>
              QUESTÃO {indiceAtual + 1} DE {questoes.length}
            </p>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", backgroundColor: "#dbeafe", color: "#2563eb" }}>
              {questaoAtual?.disciplina}
            </span>
          </div>

          <p style={{ margin: "0 0 18px", fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.6, fontWeight: 600 }}>
            {questaoAtual?.enunciado}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {alternativasAtuais.map((alt) => {
              const selecionada = questaoAtual ? respostas[questaoAtual.id] === alt.letra : false;
              return (
                <button
                  key={alt.letra}
                  onClick={() => handleSelecionarAlternativa(alt.letra)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: `1.5px solid ${selecionada ? "#60a5fa" : "#e2e8f0"}`,
                    backgroundColor: selecionada ? "#eff6ff" : "#ffffff",
                    color: selecionada ? "#1d4ed8" : "#0f172a",
                    fontSize: "0.88rem",
                    fontWeight: selecionada ? 700 : 500,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: `1.5px solid ${selecionada ? "#60a5fa" : "#e2e8f0"}`,
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
                </button>
              );
            })}
          </div>
        </div>

        {/* NAVEGAÇÃO FLUIDA ENTRE QUESTÕES */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {questoes.map((questao, indice) => {
              const respondida = respostas[questao.id] !== undefined;
              const atual = indice === indiceAtual;
              return (
                <button
                  key={questao.id}
                  onClick={() => handleIrPara(indice)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: atual ? "2px solid #0b1326" : "1px solid #e2e8f0",
                    backgroundColor: respondida ? "#0b1326" : "#ffffff",
                    color: respondida ? "#ffffff" : "#64748b",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title={respondida ? "Questão respondida" : "Questão não respondida"}
                >
                  {indice + 1}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => handleIrPara(indiceAtual - 1)}
              disabled={indiceAtual === 0}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: indiceAtual === 0 ? "#cbd5e1" : "#0f172a",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: indiceAtual === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Anterior
            </button>

            <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
              {totalRespondidas} de {questoes.length} respondidas
            </p>

            {indiceAtual < questoes.length - 1 ? (
              <button
                onClick={() => handleIrPara(indiceAtual + 1)}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "none", backgroundColor: "#0b1326", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Próxima →
              </button>
            ) : (
              <button
                onClick={() => finalizarSimulado(false)}
                disabled={finalizando}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: finalizando ? "#86efac" : "#16a34a",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: finalizando ? "not-allowed" : "pointer",
                }}
              >
                {finalizando ? "Enviando..." : "Finalizar simulado"}
              </button>
            )}
          </div>

          {indiceAtual < questoes.length - 1 && (
            <button
              onClick={() => finalizarSimulado(false)}
              disabled={finalizando}
              style={{
                alignSelf: "center",
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.78rem",
                fontWeight: 600,
                textDecoration: "underline",
                cursor: finalizando ? "not-allowed" : "pointer",
              }}
            >
              Finalizar simulado agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
