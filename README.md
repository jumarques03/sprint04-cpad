# EcoTrack - Challenge CCR Motiva (Sprint 3)

Bem-vindo ao repositório do **EcoTrack**, uma solução tecnológica desenvolvida para auxiliar a Motiva no monitoramento e gerenciamento inteligente da vegetação presente ao longo das rodovias sob sua concessão.

O projeto foi desenvolvido como parte do Challenge CCR Motiva do curso de Ciência da Computação da FIAP, com o objetivo de aplicar conceitos de desenvolvimento mobile, estruturação de dados, persistência local, visão computacional e apoio à tomada de decisão baseada em dados. 

Nesta **Sprint 3**, entregamos um **Protótipo Funcional Completo**, com todos os fluxos navegáveis, persistência de dados locais e evolução da camada de simulação (mock) cobrindo os cenários completos da solução.

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
- **RF03:** O sistema deve gerar e notificar Ordens de Serviço (OS) prioritárias baseadas na criticidade da vegetação.
- **RF04:** O operador deve conseguir registrar evidências da conclusão da poda.
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

# Funcionalidades Implementadas (Status Atual)

## Autenticação ✅
- Cadastro de usuários, Login e Logout.
- Persistência de sessão (AsyncStorage).

## Tela Inicial ✅
- Informações dinâmicas da equipe, OS e trecho atual.
- Acesso rápido às funcionalidades principais.

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

## Assistente de Dúvidas & Cancelamento ✅
- Chat operacional inteligente.
- Registro de impedimentos com geração automática de avisos para o sistema central.

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

### Integração IA e Fallbacks
O assistente de chat e os resumos de mapa foram arquitetados para consumir a API oficial do Google Gemini. Devido a limites e alta demanda (*high demand*) temporária nas contas de camada gratuita do provedor, implementamos fallbacks (rotas alternativas) de mock com DummyJSON. Isso garante que o fluxo do aplicativo nunca trave durante a operação em campo, mantendo a responsabilidade do software.

---

# Testes Manuais (Sprint 3)

Foram executados testes manuais para garantir que os fluxos principais e alternativos da aplicação não apresentem falhas de navegação ou interface.

| Cenário Testado | Resultado Esperado | Resultado Obtido | Status |
| :--- | :--- | :--- | :--- |
| **Persistência de Notificações** (Tocar num aviso não lido e reiniciar o app) | A opacidade do aviso deve reduzir (marcado como lido) e o estado deve ser mantido após reiniciar o aplicativo. | O `AsyncStorage` gravou a alteração perfeitamente; o aviso permaneceu como lido. | ✅ Passou |
| **Navegação do Mapa - Troca de Trecho** (Alternar do Trecho Sul para o Oeste) | O mapa deve recarregar a lista de pontos instantaneamente mostrando as novas coordenadas e quilometragens. | Os pontos foram atualizados corretamente sem travamentos na UI. | ✅ Passou |
| **Mapa - Dados Pendentes** (Acessar o Trecho Norte) | Pontos sem leitura de altura da grama devem exibir o status "Aguardando escaneamento" sem quebrar a aplicação (undefined). | O card interativo exibiu o alerta de dados pendentes corretamente. | ✅ Passou |
| **Fallback do Assistente** (Enviar mensagem no chat com a API oficial em alta demanda) | O app deve interceptar o erro e exibir a resposta de fallback instantânea do mock genérico, sem apresentar tela de crash. | O bot respondeu através do fallback local com a notificação de instabilidade externa. | ✅ Passou |
| **Monitoramento e Integração** (Iniciar gravação e checar a tela de avisos) | O estado global deve ativar a visão computacional e gerar automaticamente um aviso não lido no painel de notificações. | A câmera simulada ativou e a notificação foi injetada no `MockDataContext`. | ✅ Passou |

---

# Pendências e Plano de Ajustes (Sprint 4)

Para a entrega final na Sprint 4, as seguintes melhorias estão planejadas:
1. **Estabilização de APIs:** Substituir permanentemente os mocks de fallback pela conexão final da IA, caso o provisionamento da conta Google Cloud normalize.
2. **Refinamento de UI/UX:** Aplicar micro-interações e ajustes finos de responsividade para garantir que a interface fique perfeita em diferentes proporções de tela.
3. **Revisão de Código:** Otimização dos hooks do React para evitar renderizações desnecessárias ao transitar entre as abas principais.

---

# Tecnologias Utilizadas

## Mobile

- React Native
- Expo
- Expo Router

## Gerenciamento de Estado

- Context API

## Persistência Local

- AsyncStorage

## Interface

- Expo Vector Icons
- React Native StyleSheet
- React Native Maps

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
│   ├── cancelamento.js
│   ├── perfil.js
│   ├── sobre-mim.js
│   ├── trocar-senha.js
│   └── suporte.js
│
components/
│
context/
│   ├── AuthContext.js
│   └── MockDataContext.js
│
data/
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

Nesta Sprint, os recursos de câmera e geolocalização foram simulados através de dados mockados (imagem e vídeo).

Essa decisão foi tomada porque, no contexto da solução proposta, tanto a captura de imagens quanto a localização são provenientes dos dispositivos embarcados nos veículos operacionais e não diretamente do dispositivo móvel.

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
