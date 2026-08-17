Requisitos do Projeto — StudyUp

Este documento reúne os Requisitos Funcionais (RF) e Requisitos Não Funcionais (RNF) da plataforma StudyUp, detalhando para cada um a descrição, as regras de negócio associadas e os critérios de aceite, com base na modelagem de dados e nos endpoints definidos na Documentação Base do Projeto.

1. Requisitos Funcionais (RF)
Gestão de Acesso e Perfil
RF01 — Cadastro de Usuário

Descrição: O sistema deve permitir que novos alunos se registrem informando nome, email e senha, tendo acesso imediato às funcionalidades da plataforma.

Endpoint relacionado: POST /usuarios/cadastro

Regras de negócio:

RN01.1 — O campo email é único no sistema; não é permitido cadastro com um email já existente na base.
RN01.2 — A senha deve ser armazenada de forma criptografada (hash), nunca em texto puro, em conformidade com o RNF04.
RN01.3 — A senha deve atender a requisitos mínimos de segurança (ex.: mínimo de 8 caracteres, combinando letras e números).
RN01.4 — Os campos nome_completo, email e senha são obrigatórios; o cadastro não é concluído se algum estiver ausente ou vazio.
RN01.5 — O formato do email deve ser validado antes da persistência dos dados.
RN01.6 — No momento do cadastro, o sistema deve registrar automaticamente o atributo data_adesao com a data/hora atual.
RN01.7 — Após o cadastro bem-sucedido, o sistema deve retornar uma mensagem de confirmação e permitir o login imediato (não é exigida confirmação por email nesta versão).
RN01.8 — Tentativas de cadastro com dados inválidos devem retornar mensagens de erro específicas por campo (ex.: "email já cadastrado", "senha muito curta").

Critérios de aceite:

Não é possível cadastrar dois usuários com o mesmo email.
Senhas nunca aparecem em texto puro em logs, respostas de API ou no banco de dados.
Cadastro com campos incompletos é rejeitado com status HTTP apropriado (ex.: 400).
RF02 — Login de Usuário

Descrição: Autenticação de usuários cadastrados para acesso à plataforma, com controle de sessão baseado em token.

Regras de negócio:

RN02.1 — O login é realizado por email e senha; credenciais inválidas retornam erro genérico ("email ou senha incorretos"), sem indicar qual campo está errado, por segurança.
RN02.2 — Após autenticação bem-sucedida, o sistema deve gerar um token JWT contendo, no mínimo, o identificador do usuário e o tempo de expiração.
RN02.3 — O token JWT deve ter tempo de expiração definido (ex.: 1 hora), exigindo renovação via refresh token.
RN02.4 — Deve existir um mecanismo de refresh token para renovar o acesso sem exigir novo login, respeitando um tempo de expiração maior (ex.: 7 dias).
RN02.5 — Rotas privadas da API devem validar o token JWT em toda requisição, rejeitando acesso (HTTP 401) quando o token estiver ausente, inválido ou expirado.
RN02.6 — O logout deve invalidar o token/refresh token corrente, impedindo seu reuso (ex.: via blacklist ou invalidação no lado do cliente combinada a expiração curta).
RN02.7 — Deve haver limite de tentativas de login malsucedidas por conta em um intervalo de tempo, como proteção contra ataques de força bruta.

Critérios de aceite:

Requisições a rotas privadas sem token válido são bloqueadas.
Token expirado não concede acesso, mesmo que estruturalmente válido.
Logout efetivo impede o uso do token anterior.
RF03 — Gerenciamento de Perfil

Descrição: O aluno deve poder visualizar seus dados e editar informações pessoais.

Regras de negócio:

RN03.1 — Um usuário só pode visualizar e editar o próprio perfil, nunca o de outro estudante (controle de autorização vinculado ao id do token).
RN03.2 — A edição de email deve respeitar a regra de unicidade (RN01.1); não é permitido alterar para um email já utilizado por outro usuário.
RN03.3 — A alteração de senha exige a confirmação da senha atual antes de permitir a definição de uma nova senha.
RN03.4 — Toda nova senha definida deve passar pelas mesmas validações de segurança do cadastro (RN01.3) e ser armazenada com criptografia (RN01.2).
RN03.5 — Campos sensíveis (como senha) nunca devem ser retornados nas respostas de consulta de perfil.
RN03.6 — Alterações de dados de perfil devem ser validadas quanto ao formato (ex.: email) antes de serem persistidas.

Critérios de aceite:

Um usuário autenticado não consegue alterar dados de outro usuário, mesmo manipulando o id na requisição.
Alteração de senha sem informar a senha atual é rejeitada.
Conteúdo e Prática
RF04 — Banco de Questões

Descrição: Disponibilizar exercícios categorizados por área do conhecimento (Matemática, Linguagens, etc.) e permitir filtros por tema ou nível de dificuldade.

Endpoint relacionado: GET /questoes/banco

Regras de negócio:

RN04.1 — Toda questão deve pertencer a uma disciplina/área do conhecimento válida (ex.: Matemática, Linguagens, Ciências Humanas, Ciências da Natureza, Redação).
RN04.2 — Toda questão deve ter um nivel_dificuldade associado (ex.: fácil, médio, difícil), utilizado tanto para filtros quanto para análise de desempenho (RF10).
RN04.3 — A listagem de questões deve suportar filtros combináveis por disciplina, tema/tag e nível de dificuldade.
RN04.4 — A listagem deve suportar paginação, para suportar o volume de "milhares de exercícios" citado na visão geral do projeto.
RN04.5 — O campo resposta_correta (gabarito) não deve ser retornado na listagem/consulta de questões antes de o aluno respondê-las, para não comprometer a resolução (RF05).
RN04.6 — Cada questão deve possuir de 2 a 5 alternativas (A a E), sendo exatamente uma marcada como correta.
RN04.7 — Questões podem estar vinculadas a um ou mais ConteudoTeorico (relacionamento N:N) via tema/tag comum, usado para a sugestão de vídeo-aula ao errar uma questão.

Critérios de aceite:

Uma consulta ao banco de questões sem gabarito não expõe a resposta correta.
Filtros por disciplina e dificuldade retornam apenas questões compatíveis com os critérios informados.
RF05 — Resolução de Questões

Descrição: Permitir que o usuário responda questões, visualize o gabarito e receba explicações/teoria associada.

Endpoint relacionado: POST /questoes/responder

Regras de negócio:

RN05.1 — Ao responder uma questão, o sistema deve comparar a alternativa escolhida com a resposta_correta e registrar o resultado (Acerto/Erro) em RegistroDesempenho.
RN05.2 — Todo registro de resposta deve armazenar o tempo_gasto (em segundos) pelo estudante, mesmo fora de simulados, para subsidiar análises futuras.
RN05.3 — Após o envio da resposta, o gabarito e a explicação/teoria associada (vinculada via ConteudoTeorico) devem ser exibidos ao aluno.
RN05.4 — Uma mesma questão pode ser respondida mais de uma vez pelo mesmo estudante; cada tentativa gera um novo RegistroDesempenho, preservando o histórico (RF09) em vez de sobrescrever tentativas anteriores.
RN05.5 — Se a questão respondida estiver vinculada a uma videoaula (via ConteudoTeorico), o sistema deve sugerir esse conteúdo em caso de erro, alimentando o mapeamento inteligente (RF10).
RN05.6 — Não é permitido registrar resposta para um id_questao inexistente ou para um id_estudante diferente do usuário autenticado no token.

Critérios de aceite:

Toda resposta enviada gera um registro de desempenho vinculado ao estudante e à questão.
O aluno recebe feedback (correto/incorreto) e explicação imediatamente após responder.
RF06 — Simulados

Descrição: Gerar provas com tempo limite controlado e cálculo de pontuação automática ao finalizar.

Endpoint relacionado: POST /simulados/iniciar

Regras de negócio:

RN06.1 — Ao iniciar um simulado, o sistema deve selecionar um conjunto de questões conforme critérios definidos (ex.: distribuição por disciplina, seguindo a metodologia do ENEM).
RN06.2 — Todo simulado deve ter um tempo limite pré-definido; o cronômetro inicia no momento em que o simulado é gerado/iniciado.
RN06.3 — Ao atingir o tempo limite, o simulado deve ser finalizado automaticamente, considerando como não respondidas as questões pendentes.
RN06.4 — A pontuação deve ser calculada automaticamente ao final do simulado, com base nos acertos e, se aplicável, nos pesos por disciplina.
RN06.5 — Cada questão respondida dentro de um simulado deve gerar um RegistroDesempenho, assim como nas resoluções avulsas (RF05), permitindo distinguir desempenho em simulado do desempenho em prática livre.
RN06.6 — Não deve ser permitido que o estudante altere respostas após o encerramento (manual ou automático) do simulado.
RN06.7 — O resultado do simulado (pontuação, tempo total, acertos por disciplina) deve ficar disponível no histórico de atividades (RF09).

Critérios de aceite:

Um simulado expirado é encerrado automaticamente e não aceita novas respostas.
A pontuação final é calculada e exibida corretamente ao término do simulado.
RF07 — Aulas Explicativas

Descrição: Oferecer acesso a conteúdos teóricos via vídeos ou textos educativos focados no ENEM.

Endpoint relacionado: GET /conteudos/videoaulas

Regras de negócio:

RN07.1 — Todo conteúdo teórico deve possuir titulo, url_video (ou material de texto) e disciplina associada.
RN07.2 — A listagem de videoaulas deve permitir filtro por disciplina/tema, de forma consistente com os filtros do banco de questões (RN04.3).
RN07.3 — Conteúdos teóricos devem poder ser vinculados a uma ou mais questões (relacionamento N:N), possibilitando a sugestão automática mencionada em RN05.5 e RN10.
RN07.4 — O acesso a conteúdos teóricos requer usuário autenticado (rota privada), assim como as demais funcionalidades de prática.
RN07.5 — Links de vídeo inválidos ou indisponíveis não devem ser exibidos na listagem (validação de integridade do conteúdo).

Critérios de aceite:

Toda videoaula listada possui um link funcional e uma disciplina associada.
É possível localizar as videoaulas vinculadas a uma questão específica.
Monitoramento e Inteligência
RF08 — Acompanhamento de Desempenho

Descrição: Exibir estatísticas de acertos/erros e a evolução do aluno por área.

Regras de negócio:

RN08.1 — As estatísticas exibidas devem ser calculadas a partir dos registros em RegistroDesempenho vinculados ao id_estudante autenticado — nunca de outro usuário.
RN08.2 — O sistema deve apresentar o percentual de acertos e erros segmentado por disciplina/área do conhecimento.
RN08.3 — A evolução do aluno deve considerar a ordem cronológica dos registros (por data/timestamp implícito no registro), permitindo identificar tendência de melhora ou piora por período.
RN08.4 — Simulados e questões avulsas devem poder ser analisados tanto em conjunto quanto separadamente, dado que ambos geram RegistroDesempenho (RN05.4, RN06.5).
RN08.5 — Estatísticas devem ser recalculadas em tempo real (ou near real-time) a cada nova resposta registrada, refletindo o estado mais atual do desempenho do aluno.
RN08.6 — Áreas sem nenhum registro de desempenho devem ser sinalizadas como "sem dados" em vez de exibir uma taxa de acerto de 0%, evitando distorção da informação.

Critérios de aceite:

As estatísticas de um estudante nunca incluem dados de outro estudante.
A evolução por área reflete corretamente os registros de desempenho existentes.
RF09 — Histórico de Atividades

Descrição: Manter um registro de todas as questões respondidas e simulados realizados pelo estudante.

Regras de negócio:

RN09.1 — O histórico deve listar, para cada atividade, no mínimo: questão/simulado, resultado (acerto/erro ou pontuação), tempo gasto e data de realização.
RN09.2 — O histórico deve ser paginado, dado o volume potencial de registros por estudante ao longo do tempo.
RN09.3 — O histórico deve suportar filtros por período, disciplina e tipo de atividade (questão avulsa vs. simulado).
RN09.4 — Nenhum RegistroDesempenho deve ser excluído fisicamente do histórico por ação do usuário; o histórico é uma fonte de dados persistente para a inteligência de dados (RF10).
RN09.5 — Um estudante só pode consultar seu próprio histórico, reforçando a regra de autorização já aplicada em RF08.

Critérios de aceite:

É possível recuperar o histórico completo de um estudante de forma paginada, sem perda de registros.
Filtros aplicados ao histórico retornam resultados consistentes com os critérios informados.
RF10 — Mapeamento Inteligente

Descrição: A API deve identificar lacunas de conhecimento para sugerir revisões específicas (Inteligência de Dados).

Endpoints relacionados: GET /ia/relatorio-desempenho, GET /ia/trilha-estudo

Regras de negócio:

RN10.1 — O mapeamento de lacunas deve cruzar os dados de RegistroDesempenho (erros/acertos, tempo gasto) com as disciplinas/temas das questões, identificando as áreas com maior taxa de erro.
RN10.2 — Para cada lacuna identificada, o sistema deve sugerir automaticamente o(s) ConteudoTeorico vinculado(s) ao tema, via relacionamento N:N entre questões e videoaulas.
RN10.3 — A TrilhaInteligente gerada é individual (relação 1:1 com o estudante) e deve ser recalculada periodicamente ou a cada volume relevante de novas respostas, refletindo o progresso mais recente do aluno.
RN10.4 — Um estudante sem histórico suficiente de respostas (quantidade mínima de registros a definir) não deve receber uma trilha ou relatório com recomendações não fundamentadas; o sistema deve indicar que são necessários mais dados.
RN10.5 — As lacunas devem ser priorizadas por relevância (ex.: maior taxa de erro combinada ao peso da disciplina no ENEM), não apenas pela quantidade absoluta de erros.
RN10.6 — As recomendações da trilha de estudo devem ser reavaliadas sempre que novas respostas alterarem significativamente o desempenho do aluno em uma área.

Critérios de aceite:

O relatório de desempenho aponta corretamente as áreas com maior incidência de erro do estudante.
A trilha de estudo sugere conteúdos teóricos coerentes com as lacunas identificadas.
2. Requisitos Não Funcionais (RNF)
Desempenho e Escalabilidade
RNF01 — Tempo de Resposta

Descrição: O sistema deve responder às requisições da API em até 2 segundos.

Regras de negócio:

RN-NF01.1 — O limite de 2 segundos aplica-se à resposta das rotas de uso comum (cadastro, login, listagem de questões/conteúdos, resolução de questões).
RN-NF01.2 — Operações mais complexas, como geração de relatório de desempenho e trilha inteligente (RF10), devem ser monitoradas separadamente, podendo justificar processamento assíncrono caso o tempo de resposta síncrono não seja viável.
RN-NF01.3 — Deve haver monitoramento/log de tempo de resposta das rotas para identificar gargalos de performance.
RNF02 — Escalabilidade

Descrição: A arquitetura deve ser baseada em API REST e preparada para suportar o crescimento da base de usuários (meta de 4 milhões de estudantes).

Regras de negócio:

RN-NF02.1 — A API deve seguir princípios REST (recursos bem definidos, uso correto de verbos HTTP e códigos de status).
RN-NF02.2 — O design do banco de dados e da API deve permitir escalabilidade horizontal (múltiplas instâncias da aplicação) sem dependência de estado local.
RN-NF02.3 — Consultas de alto volume (ex.: banco de questões, histórico) devem considerar indexação adequada no banco de dados para suportar crescimento da base.
RNF03 — Concorrência

Descrição: O sistema deve suportar múltiplos usuários simultâneos sem perda de performance.

Regras de negócio:

RN-NF03.1 — Operações de escrita concorrente (ex.: múltiplos registros de desempenho simultâneos) não devem gerar inconsistência de dados.
RN-NF03.2 — Simulados com tempo controlado (RF06) devem funcionar corretamente mesmo com múltiplos estudantes realizando simulados ao mesmo tempo, sem interferência entre sessões.
Segurança e Arquitetura
RNF04 — Proteção de Dados

Descrição: Dados sensíveis e senhas devem ser obrigatoriamente criptografados no banco de dados.

Regras de negócio:

RN-NF04.1 — Senhas devem ser armazenadas usando algoritmo de hash forte com salt (ex.: bcrypt), nunca em texto puro ou com criptografia reversível simples.
RN-NF04.2 — Dados pessoais sensíveis (ex.: email) devem ser protegidos contra exposição indevida em logs e respostas de erro.
RN-NF04.3 — Toda comunicação entre cliente e servidor deve ocorrer via HTTPS.
RNF05 — Autenticação

Descrição: O controle de acesso deve ser realizado via JWT (JSON Web Token).

Regras de negócio:

RN-NF05.1 — Todas as rotas que envolvem dados do estudante (perfil, respostas, histórico, desempenho, trilha) devem exigir um JWT válido no cabeçalho da requisição.
RN-NF05.2 — O payload do JWT não deve conter dados sensíveis (ex.: senha), apenas identificadores necessários (ex.: id_estudante) e metadados de expiração.
RN-NF05.3 — Tokens JWT devem ser assinados com uma chave secreta protegida, não exposta no código-fonte versionado.
RNF06 — Stateless

Descrição: O servidor não deve armazenar sessões; cada requisição deve conter todas as informações necessárias para ser processada.

Regras de negócio:

RN-NF06.1 — Nenhuma informação de autenticação deve depender de estado mantido em memória do servidor entre requisições (ex.: sessão em variável local).
RN-NF06.2 — Toda informação de identidade do usuário necessária ao processamento da requisição deve vir do próprio token JWT enviado pelo cliente.
Usabilidade e Manutenção
RNF07 — Interface

Descrição: O sistema deve ser intuitivo e totalmente responsivo, garantindo boa experiência em dispositivos móveis (Mobile) e Web.

Regras de negócio:

RN-NF07.1 — Todas as telas principais (cadastro, login, banco de questões, simulados, desempenho) devem ser testadas em pelo menos uma resolução mobile e uma desktop.
RN-NF07.2 — Fluxos críticos (resolução de questões, simulados cronometrados) devem manter usabilidade equivalente entre mobile e web, sem perda de funcionalidade.
RNF08 — Portabilidade

Descrição: Compatibilidade com os principais navegadores do mercado (Chrome, Firefox, Safari, Edge).

Regras de negócio:

RN-NF08.1 — Funcionalidades essenciais devem ser validadas manualmente ou via testes automatizados nos navegadores Chrome, Firefox, Safari e Edge antes da entrega de cada etapa.
RN-NF08.2 — Não devem ser utilizados recursos exclusivos de um único navegador que quebrem a experiência nos demais.
RNF09 — Manutenibilidade

Descrição: O código fonte deve seguir boas práticas (Clean Code), sendo organizado de forma modular para facilitar futuras atualizações.

Regras de negócio:

RN-NF09.1 — O projeto deve seguir a estrutura modular definida (app/models.py, app/schemas.py, app/routes/, app/services/, tests/), conforme a Estrutura do Projeto documentada.
RN-NF09.2 — A lógica de inteligência de dados (RF10) deve permanecer isolada na camada services, sem se misturar à camada de rotas.
RN-NF09.3 — Toda nova funcionalidade relevante deve ser acompanhada de testes na pasta tests/, conforme previsto no cronograma do projeto.
