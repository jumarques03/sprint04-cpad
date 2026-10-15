# EcoTrack — Modelo de Negócio e Viabilidade

**Challenge CCR Motiva · FIAP · Sprint 4**

> Este documento trata do EcoTrack como produto para a Motiva. Os dados do Rodoanel, dos trechos, da poda e das ordens de serviço (OS) vêm do protótipo deste repositório. Os valores de custo e de preço são **estimativas de ordem de grandeza**, listadas como premissas e que devem ser validadas com a Motiva (seção 9).

## 1. Proposta de valor

Hoje a manutenção da vegetação nas rodovias depende de **inspeções presenciais e cronogramas periódicos de roçada**. Isso gera cinco problemas: dados desatualizados, dificuldade de achar os trechos mais críticos, intervenções desnecessárias ou tardias, custo operacional alto e risco à segurança viária (visibilidade da sinalização).

O EcoTrack troca o cronograma fixo por **roçada baseada em dado**. O que ele entrega:

- **Monitoramento contínuo:** câmeras com visão computacional, embarcadas nos veículos da frota, leem a altura da vegetação ao longo da pista. O app só liga e desliga o escaneamento (RF01 e RF02).
- **Classificação por criticidade:** cada ponto vira um semáforo — 🟢 abaixo de 10 cm, 🟡 de 10 a 30 cm, 🔴 acima de 30 cm.
- **Ordem de serviço prioritária:** o app agrupa os pontos vermelhos próximos em faixas de km e **sugere as OS mais críticas** (RF03).
- **Execução rastreável:** o operador cria, inicia e conclui a OS no celular. Na conclusão registra altura inicial e final da grama, observações e a **foto de evidência** (RF04).
- **Mapa atualizado:** ao concluir a roçada, os pontos da faixa da OS são atualizados no mapa do Rodoanel, e o histórico de OS fica consultável com as evidências.

## 2. Personas e público-alvo

| Persona | Papel | O que precisa | Situação no protótipo |
| --- | --- | --- | --- |
| **Operador de campo (João Silva)** | Dirige a frota e poda com a equipe | App simples, que funcione com pouco sinal, para ver o mapa, receber e executar OS e registrar a evidência | **Implementado** (persona do README) |
| **Equipe de manutenção / supervisor** (ex.: EQUIPE ALPHA 6766) | Planeja e acompanha as equipes | Ver as OS abertas, o histórico e os impedimentos (chuva, acesso bloqueado) | Parcial: avisos e histórico no app do operador |
| **Gestor / engenheiro da concessionária** | Decide prioridades, presta contas e controla custo | Painel por trecho, indicadores, auditoria das evidências | **Fora do protótipo** (previsto como painel web) |
| **Central de operações** | Recebe os avisos do campo | Receber impedimentos e cancelamentos e disparar ações | Parcial: o app gera os avisos |

**Público-alvo:** concessionárias de rodovias. O caso de partida é o **Rodoanel Mário Covas (SP-021)**, com cerca de 180 km divididos em quatro trechos: Oeste (~32 km), Sul (~61 km), Leste (~43,5 km) e Norte (~44 km, ainda com cobertura parcial por causa das obras).

## 3. Modelo de receita

**Escolha: serviço gerenciado por assinatura, cobrado por km monitorado ao mês, com hardware embarcado em comodato.** Inclui implantação e treinamento (cobrança única) e um piloto de 3 meses com valor reduzido.

Por que essa escolha:

- **Recorrência:** a IA, a nuvem e o suporte são custos mensais. Uma licença perpétua deixaria o fornecedor sem receita para mantê-los.
- **Alinhamento com o contrato de concessão:** a Motiva tende a preferir despesa operacional, sem comprar hardware. O comodato tira essa barreira.
- **Preço por km é fácil de entender:** acompanha a extensão monitorada (hoje 180 km) e escala se outras rodovias entrarem.
- **Descartamos a cobrança por OS gerada**, porque ela faria o fornecedor ganhar mais quando há mais problema na pista, e esse incentivo é o oposto do que a Motiva quer.

**Proposta de partida:** cerca de **R$ 350 por km/mês**, ou seja, ~R$ 63 mil por mês (~R$ 756 mil por ano) para os 180 km, mais ~R$ 40 mil de implantação. É um ponto de partida de negociação, e não um preço fechado.

## 4. Estimativa de custos operacionais

**Premissas:** piloto com 4 veículos (um por trecho, 1 kit embarcado cada), uso do app por 4 equipes, ~180 km monitorados.

| Item | Estimativa | Observação |
| --- | --- | --- |
| Hardware embarcado (câmera, computador de borda, GPS, modem 4G, instalação) | R$ 15–25 mil por veículo (única vez) → R$ 60–100 mil | Hoje é **mockado** no protótipo; entra amortizado em ~36 meses (R$ 1,7–2,8 mil/mês) |
| Dados móveis (chip 4G) | ~R$ 400/mês | ~R$ 100 por veículo |
| Nuvem (backend, banco, armazenamento das fotos, monitoramento) | R$ 2–4 mil/mês | Hoje o app guarda tudo só no aparelho (`AsyncStorage`) |
| API de IA (Gemini: assistente de dúvidas no app) | R$ 200–800/mês | Baixo volume de texto. Hoje só o chat usa a API; os resumos do mapa são regras locais. Conferir a tabela vigente do provedor |
| Manutenção evolutiva e correções (~1,5 dev) | R$ 20–30 mil/mês | Maior custo do projeto |
| Suporte (N1/N2, ~0,5 pessoa) | R$ 5–8 mil/mês | Inclui treinamento das equipes |
| Implantação e treinamento | R$ 15–30 mil (única vez) | |

**Total recorrente: ~R$ 30–46 mil/mês** (já com o hardware amortizado), o que dá um custo de equilíbrio de **~R$ 165–255 por km/mês**. Com o preço de partida de R$ 350 por km, a margem fica entre ~27% e ~52%.

## 5. Principais riscos e mitigação

| Risco | Impacto | Mitigação (e o que já existe no código) |
| --- | --- | --- |
| **Hardware e visão computacional ainda não existem**: altura da vegetação e GPS são mockados | Alto | Etapa de prova de conceito com 1 veículo antes do piloto. O app já recebe os pontos no formato esperado (km, lat/lng, altura, status) |
| **Falta de sinal na rodovia** | Alto | RNF01 (modo offline). O app já persiste OS, histórico e avisos localmente. **Falta** a fila de sincronização com o servidor |
| **IA indisponível ou com limite de uso** (já ocorreu no Gemini) | Médio | Fallback local no chat (mensagem fixa) e a chave fora do código, via variável de ambiente. Planejar um provedor alternativo e cache das respostas |
| **Evidência fraudada ou sem confiança** (a altura final é informada pelo operador) | Alto | Exigir foto na conclusão (já implementado) e, no backend, validar data/hora e posição da foto contra o km da OS |
| **Perda de fotos** (a foto do cache do celular pode ser apagada) | Médio | A foto é copiada para o armazenamento permanente do app, com aviso se a cópia falhar. Backup no servidor é o próximo passo |
| **Baixa adesão do operador** | Médio | Fluxo curto, textos em português, treinamento no piloto e acompanhamento de uso |
| **LGPD** (fotos de pista podem captar pessoas e placas) | Médio | Definir retenção e acesso às fotos, desfocar placas e rostos no backend, e termo com a Motiva |
| **Dependência de terceiros** (mapa, IA, tiles do OpenStreetMap) | Médio | No Android o mapa usa Leaflet/OpenStreetMap, que tem política de uso. Para produção, contratar uma chave do Google Maps ou um servidor de tiles próprio |

## 6. Diferenciais competitivos

- **Ciclo da OS completo no celular:** pendente → em andamento → concluída, impedida ou cancelada, com histórico e evidência. Muitas ferramentas de monitoramento param no alerta.
- **OS integrada ao mapa:** a OS aponta para uma faixa real (trecho + km), e concluir a roçada atualiza os pontos e o resumo do trecho. O dado de campo volta para a base.
- **Prioridade automática (RF03):** sugere as faixas mais críticas e avisa só uma vez por sugestão nova, sem ruído para o operador.
- **Regra de vegetação simples e auditável:** o semáforo 10 cm / 30 cm é claro para o operador e para o gestor.
- **Pensado para campo:** interface de alto contraste, fluxos curtos e dados guardados no aparelho.
- **Feito sobre o contexto real:** o Rodoanel Mário Covas, com 4 trechos, ~180 km, 243 pontos a cada ~750 m no mock e o Trecho Norte com cobertura parcial por causa das obras.

## 7. Impacto esperado

**Para a Motiva:**

- Roçar onde o dado mostra necessidade (🟡 e 🔴), e evitar a roçada em faixas dentro do padrão (🟢).
- Reduzir o tempo entre a detecção de um ponto crítico e a roçada.
- Ter registro auditável (foto, alturas, data/hora e equipe) de cada OS concluída ou impedida.

**Para as rodovias e usuários:** melhor visibilidade da sinalização e menos risco viário nos pontos críticos. Hoje o mock tem **31 pontos vermelhos** entre os 243, agrupados em 23 faixas candidatas a OS, o que mostra o tamanho do ganho de priorização.

**Indicadores para o piloto** (metas a combinar com a Motiva, sem baseline real ainda):

- tempo médio entre detecção e conclusão da OS;
- % de pontos vermelhos fora do prazo;
- % de OS concluídas com evidência;
- nº de roçadas evitadas em faixas 🟢.

## 8. Estado atual do protótipo (Sprint 4)

- **Implementado:** autenticação, mapa do Rodoanel (4 trechos), ciclo da OS, evidência fotográfica, histórico, impedimento e cancelamento, sugestão automática de OS e avisos.
- **Mockado:** altura da vegetação, GPS, vídeo da câmera embarcada e respostas de IA de fallback.
- **Não existe ainda:** backend e sincronização, painel web do gestor, integração com o hardware embarcado e testes automatizados.

## 9. Premissas e pontos a validar antes de publicar

- [ ] Frota real da Motiva no Rodoanel: quantos veículos e equipes por trecho?
- [ ] Custo atual de roçada por km e frequência do cronograma (para medir a economia)?
- [ ] Custos de hardware e de nuvem: cotar com fornecedores.
- [ ] Preço de partida (R$ 350/km/mês): conferir com o grupo.
- [ ] Quem opera cada trecho do Rodoanel, para não afirmar nada sobre a concessão além do escopo do desafio?
- [ ] Revisão do grupo antes de publicar.
