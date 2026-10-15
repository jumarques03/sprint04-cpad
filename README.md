# EcoTrack - Challenge CCR Motiva (Sprint 4)

Bem-vindo ao repositório do **EcoTrack**, uma solução tecnológica desenvolvida para auxiliar a Motiva no monitoramento e gerenciamento inteligente da vegetação presente ao longo das rodovias sob sua concessão.

O projeto foi desenvolvido como parte do Challenge CCR Motiva do curso de Ciência da Computação da FIAP, com o objetivo de aplicar conceitos de desenvolvimento mobile, estruturação de dados, persistência local, visão computacional e apoio à tomada de decisão baseada em dados. 

Na **Sprint 3**, entregamos um protótipo funcional com fluxos navegáveis, persistência de dados locais e a camada de simulação (mock) cobrindo os cenários da solução.

Nesta **Sprint 4**, corrigimos o principal ponto do feedback da Sprint 3: o operador agora consegue **criar, iniciar e concluir uma ordem de serviço (OS)** de ponta a ponta, com **evidência fotográfica da roçada** (RF04) e **sugestão automática de OS pelos pontos críticos do mapa** (RF03). A OS está integrada ao mapa do Rodoanel: ao concluir a roçada, os pontos da faixa de km da ordem são atualizados no mapa.

---

# Integrantes

- Arthur Reis Batista da Silva - RM 562181
- Carolina Monteiro Bernardo - RM 564651
- Isabelle Dias Belini - RM 566464
- Júlia Souza Marques - RM 565010
- Leonardo de Magalhães Piassa - RM 563663
- Manoella dos Santos Ginez - RM 564469

---

# O Problema

A manutenção da vegetação nas rodovias administradas pela Motiva depende atualmente de inspeções presenciais e cronogramas periódicos de roçada.

Embora esse modelo funcione, ele apresenta limitações importantes:
- Dependência de inspeções humanas;
- Falta de dados atualizados em tempo real;
- Dificuldade na identificação dos trechos mais críticos;
- Custos operacionais elevados;
- Possibilidade de intervenções desnecessárias ou tardias;
- Riscos relacionados à segurança viária e à visibilidade da sinalização.

Dessa forma, existe a necessidade de uma solução capaz de monitorar os trechos de forma inteligente, permitindo que as equipes atuem de maneira eficiente, estratégica e baseada em dados.

---

# Persona

### Operador de Campo (João Silva)
Responsável por dirigir a frota e realizar a poda juntamente com sua equipe.
Necessita de uma ferramenta simples, intuitiva e eficiente, capaz de funcionar mesmo em ambientes com baixa conectividade, permitindo acesso rápido às informações necessárias para execução da operação.

---

# Requisitos Funcionais (RF)

- **RF01:** O sistema deve mapear automaticamente trechos de rodovia através de visão computacional.
- **RF02:** O aplicativo deve permitir o controle de ligar/desligar o sistema de escaneamento acoplado ao veículo.
- **RF03 ✅ (implementado na Sprint 4):** O sistema deve gerar e notificar Ordens de Serviço (OS) prioritárias baseadas na criticidade da vegetação. *O app agrupa os pontos críticos (vermelhos) do mapa em faixas de km, sugere as OS mais críticas na tela de criar OS e gera um aviso "Nova OS prioritária sugerida" (uma única vez para cada sugestão).*
- **RF04 ✅ (implementado na Sprint 4):** O operador deve conseguir registrar evidências da conclusão da poda. *Ao concluir a OS, o operador informa altura inicial e final da grama, observações e uma foto (câmera ou galeria), guardada no armazenamento do app e consultável no histórico de ordens.*
- **RF05:** O operador deve possuir acesso a um assistente virtual para esclarecimento de dúvidas operacionais.

---

# Requisitos Não Funcionais (RNF)

- **RNF01 – Modo Offline:** Permitir armazenamento local dos dados para utilização em locais sem cobertura de rede.
- **RNF02 – Usabilidade em Campo:** Interface com alto contraste e componentes adequados para utilização em ambientes externos.
- **RNF03 – Performance:** Garantir boa experiência de uso mesmo em dispositivos móveis intermediários.

---

# A Solução e Integração de Hardware (App & Visão Computacional)

O EcoTrack integra um aplicativo mobile com um sistema de visão computacional embarcado em veículos operacionais.

## Componentes da Solução
- **Hardware Embarcado:** Dispositivo com câmeras instalado nos veículos da frota, responsável pela captura das imagens da vegetação.
- **Aplicativo Mobile:** Centraliza todas as informações, permitindo a ativação do monitoramento, visualização do mapeamento interativo, recebimento de avisos e comunicação via IA.
- **Camada Inteligente:** Responsável por analisar os dados coletados e gerar recomendações em tempo real para as equipes de campo.

---

# Modelo de Negócio

O modelo de negócio do EcoTrack (proposta de valor, personas, modelo de receita, custos, riscos, diferenciais e impacto esperado para a Motiva) está documentado na pasta [`docs/`](docs/), no arquivo [`docs/MODELO_DE_NEGOCIO.md`](docs/MODELO_DE_NEGOCIO.md).

---

# Funcionalidades Implementadas (Status Atual)

## Autenticação ✅
- Cadastro de usuários, Login e Logout.
- Persistência de sessão (AsyncStorage).

## Tela Inicial ✅
- Informações dinâmicas da equipe, OS e trecho atual.
- Acesso rápido às funcionalidades principais.

## Ordem de Serviço ✅ (novo na Sprint 4)

**Ciclo de vida da OS:** `Pendente → Em andamento → Concluída` (ou `Impedida` / `Cancelada`).

- **Criar OS:** o operador escolhe o tipo de serviço, o trecho do Rodoanel, o km inicial/final (validados dentro do trecho) e o horário. A tela também mostra as **sugestões da IA** (faixas com pontos críticos e sem OS aberta), com o botão "Usar esta sugestão", que pré-preenche o formulário.
- **Iniciar OS:** botão "Iniciar execução" (grava `iniciadaEm`, muda o status para "Em andamento" e gera um aviso). Só uma OS fica em andamento por vez.
- **Concluir OS:** só é permitido para OS "Em andamento". A OS e a localização (rodovia, trecho e km) são preenchidas automaticamente; o operador informa **altura inicial** (sugerida a partir do mapa), **altura final**, **foto da evidência** (tirar na hora ou galeria) e observações.
- **Impedimento / Cancelamento:** a tela do assistente pede o tipo e o motivo e registra na própria OS (status `Impedida` ou `Cancelada`, motivo e data/hora), libera o operador para uma nova OS e avisa o sistema central.
- **Histórico de ordens:** lista as OS finalizadas (da mais recente para a mais antiga) com miniatura da foto, alturas, observações ou motivo; ao tocar, abre o detalhe com a foto grande. Se a imagem não puder ser carregada, é exibido um placeholder.
- **Integração com o mapa:** cada OS aponta para uma faixa real do mapa (trecho + km). Ao concluir, os pontos da faixa recebem a altura final, são reclassificados (verde/amarelo/vermelho) e o mapa e o resumo do trecho refletem a roçada. As roçadas ficam registradas e são reaplicadas ao abrir o app.
- **Múltiplas OS:** o app aceita uma lista de OS abertas (pendentes) com uma OS "ativa" selecionada; apenas uma pode estar em andamento por vez.
- **Número da OS:** contador sequencial persistido (`@eco_ordem_contador`, a partir de 1025), sem repetição.
- **Foto persistente:** a foto do seletor (cache) é copiada para `documentDirectory/evidencias/os-<numero>-<timestamp>.jpg` com `expo-file-system`. Se a cópia falhar, o operador é avisado e pode concluir com a foto temporária.

## Mapeamento Interativo (Rodoanel Mário Covas) ✅
- **Novo na Sprint 3:** O mapa estático foi substituído por uma interface interativa cobrindo os ~177 km do Rodoanel Mário Covas (SP-021).
- Pontos tocáveis divididos em 4 trechos (Oeste, Sul, Leste e Norte).
- Classificação automática da vegetação e exibição de cards dinâmicos:
  - 🟢 **Verde:** abaixo de 10 cm
  - 🟡 **Amarelo:** entre 10 cm e 30 cm
  - 🔴 **Vermelho:** acima de 30 cm
- Geração de Resumo Inteligente do trecho via integração com IA/Mock.

## Avisos & Notificações ✅
- **Novo na Sprint 3:** Persistência de leitura. Avisos clicados são marcados como lidos e salvos no `AsyncStorage`, sobrevivendo a reinicializações do app.
- Geração automática de notificações vinculadas ao status de monitoramento.

## Assistente de Dúvidas ✅
- Chat operacional inteligente.

## Assistente de Impedimento / Cancelamento ✅
- **Novo na Sprint 4:** o registro agora é gravado na OS ativa (tipo, motivo e data/hora), com geração automática de avisos para o sistema central. Sem OS ativa, a tela orienta a criar uma ordem.

---

# Mock de Dados e Justificativas Técnicas

Nesta etapa, focamos em cobrir todos os cenários da solução (sucesso, listas vazias, dados pendentes e erros) através de uma arquitetura baseada em Context API e AsyncStorage.

### Mock de Mapeamento (Rodoanel Mário Covas)
O mock do mapa agora reflete o **Rodoanel Mário Covas completo**, dividido em seus quatro trechos reais. 
- **Justificativa de Mock:** Os dados de quilometragem, coordenadas (latitude/longitude) e altura da vegetação são simulados no aplicativo porque, no cenário arquitetural real, essas informações **viriam do hardware embarcado nos veículos** (sensores e GPS do equipamento de visão computacional), e não do dispositivo móvel do operador.
- **Trecho Norte (Cobertura Parcial):** Para cumprir o requisito de fluxos alternativos, o Trecho Norte foi mockado intencionalmente com pontos de status "aguardando escaneamento" ou sem dado de altura. Isso reflete fielmente a realidade da rodovia (que ainda possui obras) e simula o estado do sistema quando um trecho possui dados pendentes de leitura.

### Estados cobertos pelo mock

| Estado | Onde é simulado |
| --- | --- |
| Sucesso | Trechos Oeste, Sul e Leste, com pontos e status variados |
| Cobertura parcial / dado pendente | Trecho Norte, com pontos em "aguardando escaneamento" |
| Vazio | Ao acionar "Atualizar pontos do trecho", o mock pode simular um trecho sem nenhum ponto escaneado |
| Erro | Ao acionar "Atualizar pontos do trecho", o mock pode simular falha ao carregar os dados, com botão de tentar novamente |

### Mock de Ordem de Serviço
- As OS são criadas pelo operador (ou sugeridas pela IA a partir do mapa) e guardadas no `AsyncStorage` (`@eco_ordens_v3`, histórico em `@eco_ordens_historico_v3`). Dados da versão anterior (`@eco_ordem_servico_v2`) são migrados na primeira abertura.
- Por padrão o app **começa sem OS ativa**. Para demonstrações, `data/mockOrdemServico.js` traz uma OS pronta (Trecho Leste, Km 120–123) que só é carregada se `USAR_ORDEM_INICIAL` for `true`.
- **Justificativa de Mock:** a altura da vegetação "antes" vem do mapa mockado (que no cenário real viria do hardware embarcado); a altura "depois" é informada pelo operador ao concluir.

### Integração IA e Fallbacks
O assistente de chat e os resumos de mapa foram arquitetados para consumir a API oficial do Google Gemini. Devido a limites e alta demanda (*high demand*) temporária nas contas de camada gratuita do provedor, implementamos fallbacks (rotas alternativas) de mock com DummyJSON. Isso garante que o fluxo do aplicativo nunca trave durante a operação em campo, mantendo a responsabilidade do software.

---

# Testes Manuais (Sprint 3 e Sprint 4)

Foram executados testes manuais para garantir que os fluxos principais e alternativos da aplicação não apresentem falhas de navegação ou interface. Os cenários da **Sprint 4** (ordem de serviço) foram executados na **versão web** do app (`npx expo start --web`, navegador em tela de celular); itens que dependem do dispositivo (câmera real e cópia do arquivo da foto) estão indicados na tabela.

| Cenário Testado | Resultado Esperado | Resultado Obtido | Status |
| :--- | :--- | :--- | :--- |
| **Persistência de Notificações** (Tocar num aviso não lido e reiniciar o app) | A opacidade do aviso deve reduzir (marcado como lido) e o estado deve ser mantido após reiniciar o aplicativo. | O `AsyncStorage` gravou a alteração perfeitamente; o aviso permaneceu como lido. | ✅ Passou |
| **Navegação do Mapa - Troca de Trecho** (Alternar do Trecho Sul para o Oeste) | O mapa deve recarregar a lista de pontos instantaneamente mostrando as novas coordenadas e quilometragens. | Os pontos foram atualizados corretamente sem travamentos na UI. | ✅ Passou |
| **Mapa - Dados Pendentes** (Acessar o Trecho Norte) | Pontos sem leitura de altura da grama devem exibir o status "Aguardando escaneamento" sem quebrar a aplicação (undefined). | O card interativo exibiu o alerta de dados pendentes corretamente. | ✅ Passou |
| **Fallback do Assistente** (Enviar mensagem no chat com a API oficial em alta demanda) | O app deve interceptar o erro e exibir a resposta de fallback instantânea do mock genérico, sem apresentar tela de crash. | O bot respondeu através do fallback local com a notificação de instabilidade externa. | ✅ Passou |
| **Monitoramento e Integração** (Iniciar gravação e checar a tela de avisos) | O estado global deve ativar a visão computacional e gerar automaticamente um aviso não lido no painel de notificações. | A câmera simulada ativou e a notificação foi injetada no `MockDataContext`. | ✅ Passou |
| **Cadastro** (preencher nome, CPF, telefone, e-mail `@motiva.com`, senha e token válido e tocar em "Finalizar") | Exibir "Cadastro realizado com sucesso" e seguir para o login. | A mensagem de sucesso foi exibida e o app abriu a tela de login. | ✅ Passou (web) |
| **Login** (e-mail e senha cadastrados) | Autenticar e abrir a tela inicial com as informações do operador. | A tela inicial abriu com equipe, status da ordem e os cards. | ✅ Passou (web) |
| **Criar OS por sugestão da IA** (Criar OS → "Usar esta sugestão" → preencher horário → criar) | O formulário deve ser pré-preenchido (tipo, trecho e km) e a OS criada com número sequencial e status "Pendente". | O formulário veio preenchido (Trecho Oeste, Km 1,5–5,3) e a OS #1025 foi criada como "Pendente". | ✅ Passou (web) |
| **Iniciar OS** (OS pendente → "Iniciar execução") | Status muda para "Em andamento" e aparecem "Concluir" e "Registrar impedimento"; a lista de outras ordens avisa que é preciso concluir a atual antes de iniciar outra. | Status "Em andamento" exibido, botões corretos e aviso "Conclua a ordem em andamento antes de iniciar outra". | ✅ Passou (web) |
| **Concluir OS com campos inválidos** (enviar vazio e depois altura final maior que a inicial) | Mostrar erros de campo obrigatório, de foto ausente e "Deve ser menor que a altura inicial". | Os três erros foram exibidos e a ordem não foi concluída. | ✅ Passou (web) |
| **Concluir OS com evidência (RF04)** (altura final, foto da galeria e observação) | Registrar a conclusão, abrir o histórico já no detalhe da OS com a evidência e atualizar o mapa. | Na web a cópia do arquivo não é suportada, então o app avisou e concluiu com a foto temporária no segundo toque. O detalhe abriu com a foto e, no mapa, os pontos Km 120–123 do Trecho Leste ficaram verdes (críticos do trecho: 9 → 8). | ✅ Passou (web). A cópia permanente da foto no celular **não foi testada** |
| **Persistência após reabrir o app** (recarregar a página) | Manter OS pendente, histórico, contador e a roçada aplicada no mapa. | Tudo foi mantido; a OS migrada da versão anterior (#1024) também foi carregada corretamente. | ✅ Passou (web) |
| **Foto da evidência indisponível** (apontar a foto para um arquivo inexistente) | Exibir "Foto indisponível" em vez de quebrar a tela. | O detalhe exibiu o placeholder. | ✅ Passou (web) |
| **Registrar impedimento** (OS em andamento → Impedimento → motivo) | Gravar o motivo na OS, mover para o histórico com status "Impedida" e liberar para nova OS. | A OS #1025 apareceu como "Impedida" com o motivo, no topo do histórico (mais recente primeiro). | ✅ Passou (web) |
| **Sem OS ativa** (abrir Concluir e Impedimento/Cancelamento sem ordem) | Orientar a criar uma ordem em vez de registrar no vazio. | As duas telas exibiram o estado vazio com o botão "Criar ordem de serviço"; a home exibiu "a definir" e "Sem ordem ativa". | ✅ Passou (web) |
| **Sugestão automática de OS (RF03)** (abrir o app e a tela de criar OS, depois reabrir o app) | Listar as faixas críticas mais graves e gerar o aviso apenas uma vez por sugestão nova. | 5 sugestões exibidas; avisos "Nova OS prioritária sugerida" não se repetiram ao recarregar o app. | ✅ Passou (web) |
| **Câmera real e foto permanente no celular** (tirar a foto, concluir e depois limpar o cache do app) | A foto continuar disponível no histórico. | — | ⏳ Não testado (depende de dispositivo) |

---

# Pendências e Plano de Ajustes

Pendências reais após a Sprint 4:
1. **Testes em dispositivo:** validar no celular (Expo Go/dev build) a câmera, a cópia da foto para `documentDirectory/evidencias` e a permanência da foto após limpar o cache. Na web a cópia de arquivos não é suportada, por isso esse caminho só foi testado pelo aviso de falha.
2. **Backend real:** OS, histórico e evidências ficam apenas no `AsyncStorage` e no armazenamento do aparelho. Falta sincronizar com um servidor (envio das fotos e do status das OS para a central), inclusive em modo offline com fila de envio.
3. **Dados de vegetação e GPS:** continuam mockados (`data/mockMap.js`); a integração com o hardware embarcado da visão computacional ainda não existe. A altura "final" é informada manualmente pelo operador.
4. **Uma OS em andamento por vez:** mantivemos essa regra; permitir várias OS simultâneas ou equipes diferentes exigiria um modelo de equipe/usuário no backend.
5. **Mapa no Android sem chave do Google:** o Android usa Leaflet/OpenStreetMap em WebView (precisa de internet). Para produção, o ideal é configurar uma chave do Google Maps e voltar ao mapa nativo.
6. **Assistente de IA:** substituir os mocks de fallback pela conexão final com a API quando a conta estiver estável.
7. **Limpeza de evidências:** as fotos antigas não são apagadas do aparelho; falta uma política de retenção.
8. **Testes automatizados:** hoje os testes são manuais (tabela acima); falta cobrir as regras de OS (`utils/ordemServico.js`) com testes unitários.

---

# Tecnologias Utilizadas

## Mobile

- React Native
- Expo
- Expo Router (Expo SDK 57)
- Expo Image Picker (câmera e galeria)
- Expo File System (armazenamento das evidências)

## Gerenciamento de Estado

- Context API

## Persistência Local

- AsyncStorage

## Interface

- Expo Vector Icons
- React Native StyleSheet
- React Native Maps (iOS) / Leaflet + OpenStreetMap em WebView (Android)

---

# Estrutura do Projeto

```text
app/
├── (auth)
│   ├── start.js
│   ├── login.js
│   └── register.js
│
├── (main)
│   ├── index.js
│   ├── monitoramento.js
│   ├── mapa.js
│   ├── avisos.js
│   ├── duvidas.js
│   ├── cancelamento.js        (impedimento / cancelamento da OS)
│   ├── ordem-servico.js       (criar, iniciar e acompanhar a OS)
│   ├── concluir-ordem.js      (concluir a OS com evidência)
│   ├── historico-ordens.js    (histórico e evidências)
│   ├── perfil.js
│   ├── sobre-mim.js
│   ├── trocar-senha.js
│   └── suporte.js
│
components/                    (OrderCard, OrdemServicoForm, OrdemServicoInfo,
│                               OrdemSugeridaCard, FotoComprovacao, EvidenciaFoto,
│                               EvidenciaDetalhe, OrdemHistoricoCard, StatusBadge...)
│
context/
│   ├── AuthContext.js
│   └── MockDataContext.js
│
data/                          (mocks por domínio, incluindo mockOrdemServico.js)
│
docs/
│   └── MODELO_DE_NEGOCIO.md   (modelo de negócio e viabilidade)
│
utils/
│   ├── ordemServico.js        (status, sugestões RF03, integração OS x mapa)
│   ├── evidencias.js          (cópia da foto para o armazenamento permanente)
│   └── vegetationStatus.js
│
assets/
```

---

# Como Rodar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/jumarques03/sprint02-cpad
```

## Acessar a Pasta do Projeto

```bash
cd sprint02-cpad
```

## Instalar Dependências

```bash
npm install
```

## Executar o Projeto

```bash
npx expo start
```

## Abrir o Aplicativo

- Escaneie o QR Code utilizando o Expo Go no celular.
- Ou execute em um emulador Android/iOS.

---

# Observação sobre Recursos Nativos

**Câmera e galeria (reais):** a evidência da conclusão da roçada (RF04) usa `expo-image-picker`: o operador tira uma foto ou escolhe uma imagem da galeria, e o arquivo é copiado para o armazenamento do app com `expo-file-system`.

**Vegetação e localização (mockadas):** a captura de imagens da visão computacional (vídeo de monitoramento), as alturas de vegetação e as coordenadas/GPS continuam simuladas através de dados mockados. No contexto da solução proposta, essas informações são provenientes dos dispositivos embarcados nos veículos operacionais e não diretamente do dispositivo móvel; por isso a localização da OS vem do trecho e do km do mapa, e não do GPS do celular.

Dessa forma, os mocks representam o comportamento esperado da futura integração com os equipamentos reais.

O mapa interativo (`react-native-maps`) apenas renderiza a base cartográfica (Apple Maps/Google Maps); nenhum ponto, coordenada de trecho, km ou dado de vegetação exibido nele é buscado de API externa — todos vêm do mock em `data/mockMap.js`.

---

# Testes Manuais — Mapa do Rodoanel

| Cenário testado | Resultado esperado | Resultado obtido | Status |
| --- | --- | --- | --- |
| Trocar o trecho selecionado (ex: "Todos" → "Trecho Norte") | A lista/mapa filtra para exibir apenas os pontos do trecho escolhido e o resumo da IA é recalculado | Filtro aplicado corretamente, apenas os 7 pontos do Trecho Norte exibidos e resumo atualizado | ✅ Passou |
| Abrir um ponto do Trecho Norte sem leitura (ex: Km 144) | Deve exibir estado "Aguardando leitura", sem `undefined` ou quebra de tela | Modal exibiu "Aguardando leitura" com mensagem explicativa, sem erros | ✅ Passou |
| Abrir um ponto com leitura completa (ex: Km 172, vermelho) | Deve exibir km, altura, status colorido, horário da leitura e recomendação da IA | Modal exibiu todos os dados corretamente (35 cm, vermelho, horário formatado e recomendação) | ✅ Passou |
| Simular falha ao atualizar um trecho ("Atualizar pontos do trecho") | Deve exibir estado de erro com botão "Tentar novamente", sem travar a tela | Estado de erro exibido corretamente; "Tentar novamente" restaurou os dados do trecho | ✅ Passou |
| Simular trecho sem nenhum ponto escaneado | Deve exibir estado vazio claro ("Nenhum trecho escaneado ainda"), não uma tela em branco | Estado vazio exibido corretamente com mensagem e botão para tentar atualizar novamente | ✅ Passou (bug corrigido: antes da correção, o trecho ficava vazio permanentemente após esse estado, pois o "sucesso" só atualizava os pontos já existentes; corrigido para regenerar a partir dos dados originais do mock) |
| Selecionar "Todos" após navegar pelos trechos | Deve agregar os pontos dos 4 trechos, cobrindo o anel completo, e mostrar o resumo geral da IA | Todos os 243 pontos exibidos (espaçamento de ~750 m), agrupados por trecho, resumo geral correto | ✅ Passou |

---

*Projeto desenvolvido para o Challenge CCR Motiva – Ciência da Computação FIAP.*
