# EcoTrack — Modelo de Negócio

**Challenge CCR Motiva · FIAP · Sprint 4**

> Os dados do Rodoanel, dos trechos, da poda e das ordens de serviço (OS) vêm do protótipo deste repositório. Os valores de custo e de preço são estimativas de ordem de grandeza.

## 1. Proposta de valor

Hoje a roçada nas rodovias segue **inspeções presenciais e cronogramas fixos**: o dado é desatualizado, os trechos mais críticos são difíceis de achar, há intervenções desnecessárias ou tardias, o custo é alto e a visibilidade da sinalização fica em risco.

O EcoTrack troca o cronograma por **roçada baseada em dado**:

- **Medir:** câmeras com visão computacional nos veículos da frota leem a altura da vegetação ao longo da pista. O operador liga e desliga o escaneamento pelo app.
- **Classificar:** cada ponto vira um semáforo — 🟢 abaixo de 10 cm, 🟡 de 10 a 30 cm, 🔴 acima de 30 cm.
- **Priorizar:** o app agrupa os pontos vermelhos em faixas de km e sugere as OS mais críticas.
- **Executar e comprovar:** o operador cria, inicia e conclui a OS no celular, com altura inicial e final da grama e **foto de evidência**.
- **Fechar o ciclo:** ao concluir, o mapa do Rodoanel é atualizado e o histórico guarda a evidência.

## 2. Personas e público-alvo

| Persona | O que precisa |
| --- | --- |
| **Operador de campo (João Silva)** | App simples, que funcione com pouco sinal, para ver o mapa, executar OS e registrar a evidência |
| **Equipe de manutenção / supervisor** (ex.: EQUIPE ALPHA 6766) | Acompanhar OS abertas, histórico e impedimentos (chuva, acesso bloqueado) |
| **Gestor / engenheiro da concessionária** | Painel por trecho, indicadores e auditoria das evidências |
| **Central de operações** | Receber os avisos de impedimento e cancelamento do campo |

**Público-alvo:** concessionárias de rodovias. O caso de partida é o **Rodoanel Mário Covas (SP-021)**, com cerca de 180 km em quatro trechos: Oeste (~32 km), Sul (~61 km), Leste (~43,5 km) e Norte (~44 km, com cobertura parcial por causa das obras).

## 3. Modelo de receita

**Serviço gerenciado por assinatura, cobrado por km monitorado ao mês, com hardware embarcado em comodato**, mais implantação e treinamento (cobrança única) e um piloto de 3 meses com valor reduzido.

- **Recorrência:** IA, nuvem e suporte são custos mensais; uma licença perpétua não os sustentaria.
- **Despesa operacional:** a Motiva não precisa comprar hardware (comodato).
- **Preço por km:** fácil de entender e escala se outras rodovias entrarem.
- **Sem cobrança por OS gerada:** o fornecedor ganharia mais com mais problema na pista, o oposto do interesse da Motiva.

**Proposta de partida:** ~**R$ 350 por km/mês**, ou seja, ~R$ 63 mil/mês (~R$ 756 mil/ano) para 180 km, mais ~R$ 40 mil de implantação.

## 4. Custos operacionais estimados

Premissas: piloto com 4 veículos (um por trecho), 4 equipes usando o app, ~180 km monitorados.

| Item | Estimativa |
| --- | --- |
| Hardware embarcado (câmera, computador de borda, GPS, modem 4G, instalação) | R$ 15–25 mil por veículo (única vez) → R$ 60–100 mil, amortizado em ~36 meses (R$ 1,7–2,8 mil/mês) |
| Dados móveis (4G) | ~R$ 400/mês |
| Nuvem (backend, banco, armazenamento das fotos) | R$ 2–4 mil/mês |
| API de IA (Gemini, assistente de dúvidas) | R$ 200–800/mês |
| Manutenção evolutiva e correções (~1,5 dev) | R$ 20–30 mil/mês |
| Suporte (N1/N2, ~0,5 pessoa) | R$ 5–8 mil/mês |
| Implantação e treinamento | R$ 15–30 mil (única vez) |

**Total recorrente: ~R$ 30–46 mil/mês**, o que dá um custo de equilíbrio de **~R$ 165–255 por km/mês**. Com R$ 350 por km, a margem fica entre ~27% e ~52%.

## 5. Principais riscos e mitigação

| Risco | Mitigação |
| --- | --- |
| Hardware e visão computacional embarcados (no protótipo, altura e GPS são simulados) | Prova de conceito com 1 veículo antes do piloto; o app já recebe os pontos no formato esperado (km, lat/lng, altura, status) |
| Falta de sinal na rodovia | Modo offline: OS, histórico e avisos ficam salvos no aparelho; fila de sincronização com o servidor |
| IA indisponível ou com limite de uso | Fallback local no chat, chave fora do código e provedor alternativo |
| Evidência sem confiança (a altura final é informada pelo operador) | Foto obrigatória na conclusão e, no backend, validação de data/hora e posição da foto contra o km da OS |
| Perda de fotos | Cópia para o armazenamento permanente do app e backup no servidor |
| LGPD (fotos de pista podem captar pessoas e placas) | Política de retenção e acesso, e desfoque de placas e rostos no backend |
| Baixa adesão do operador | Fluxo curto, textos em português, treinamento no piloto |
| Dependência de terceiros (mapa e IA) | Chave do Google Maps ou servidor de tiles próprio e provedor alternativo de IA |

## 6. Diferenciais competitivos

- **Ciclo da OS completo no celular** (pendente → em andamento → concluída, impedida ou cancelada), com histórico e evidência. Muitas ferramentas de monitoramento param no alerta.
- **OS integrada ao mapa:** a OS aponta para uma faixa real (trecho + km) e concluir a roçada atualiza os pontos do Rodoanel.
- **Prioridade automática:** sugere as faixas mais críticas e avisa só uma vez por sugestão nova.
- **Regra simples e auditável:** o semáforo 10 cm / 30 cm é claro para o operador e para o gestor.
- **Pensado para campo:** alto contraste, fluxos curtos e dados guardados no aparelho.

## 7. Impacto esperado

**Para a Motiva:** roçar onde o dado mostra necessidade (🟡 e 🔴) e evitar a roçada em faixas dentro do padrão (🟢); reduzir o tempo entre detectar um ponto crítico e roçá-lo; ter registro auditável (foto, alturas, data/hora e equipe) de cada OS.

**Para as rodovias e usuários:** melhor visibilidade da sinalização e menos risco viário nos pontos críticos. No mock há **31 pontos vermelhos** entre 243, agrupados em 23 faixas candidatas a OS.

**Indicadores do piloto** (metas a combinar com a Motiva): tempo médio entre detecção e conclusão da OS; % de pontos vermelhos fora do prazo; % de OS concluídas com evidência; nº de roçadas evitadas em faixas 🟢.

## 8. Estado do protótipo

Implementados: autenticação, mapa do Rodoanel (4 trechos), ciclo da OS, evidência fotográfica, histórico, impedimento e cancelamento, sugestão automática de OS, avisos e assistente de dúvidas. Simulados: altura da vegetação, GPS e vídeo da câmera embarcada, que em produção vêm do hardware nos veículos.
