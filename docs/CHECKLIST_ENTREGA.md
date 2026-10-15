# Checklist de Entrega — Sprint 4

Roteiro para fechar o que falta: APK, testes no celular, vídeo e envio. O código e a configuração já estão preparados (`eas.json`, nome do pacote, chave do Gemini por variável de ambiente). Marque cada item conforme for fazendo.

## 1. Preparar a conta e a chave

- [ ] Ter uma **conta Expo** do grupo (https://expo.dev) e fazer login no terminal:
  ```bash
  npx eas-cli login
  ```
- [ ] Vincular o projeto à conta (cria o `projectId` no `app.json`; **commitar** a alteração):
  ```bash
  npx eas-cli init
  ```
- [ ] Gerar uma **chave da API do Gemini** (https://aistudio.google.com/apikey).
  - Teste local: copie `.env.example` para `.env` e preencha `EXPO_PUBLIC_GEMINI_API_KEY`.
  - Para o APK: cadastre a mesma variável no EAS, no ambiente `preview`:
    ```bash
    npx eas-cli env:create
    ```
    O assistente pergunta o nome (`EXPO_PUBLIC_GEMINI_API_KEY`), o valor, o ambiente (`preview`) e a visibilidade.
  - ⚠️ Variáveis `EXPO_PUBLIC_*` ficam **dentro do APK** e podem ser extraídas. Use uma chave só para o trabalho (com cota/restrição) e apague-a depois da avaliação. Nunca commite a chave.

## 2. Gerar o APK

- [ ] Rodar o build (leva alguns minutos, na nuvem do EAS):
  ```bash
  npx eas-cli build -p android --profile preview
  ```
- [ ] Baixar o `.apk` pelo link que o EAS mostra no final (ou pelo painel em expo.dev).
- [ ] **Não commitar o APK.** Publicar em um destes lugares e copiar o link:
  - **GitHub Releases:** `gh release create v1.0.0 caminho/do/app.apk --title "EcoTrack v1.0.0"` (ou pela página *Releases* do repositório).
  - **Google Drive:** subir o arquivo e deixar como "qualquer pessoa com o link pode ver".
- [ ] Colar o link do APK no `README.md` (seção "Links da Entrega" e "Download do APK e Instalação") e em `docs/ENTREGA_SPRINT4.txt`.

## 3. Testar o APK instalado no celular

Instalar o APK em um Android de verdade e passar por tudo. O professor avalia "ausência de erros críticos".

- [ ] Instala e abre sem travar; pede permissão de câmera/fotos.
- [ ] Cadastro e login (e-mail `@motiva.com` e um dos tokens de teste da tela de cadastro).
- [ ] **Mapa:** carrega os tiles, o zoom por pinça e pelos botões +/− funciona, tocar num ponto abre o detalhe, trocar de trecho reajusta a visão.
- [ ] **Criar OS** (manual e por "Usar esta sugestão") → **Iniciar** → **Concluir** com **foto tirada na câmera**.
- [ ] A conclusão abre o histórico já no detalhe, com a foto; o mapa mostra os pontos da faixa atualizados.
- [ ] **Fechar e reabrir o app:** OS, histórico, foto e mapa continuam corretos.
- [ ] **Limpar o cache** do app (Configurações do Android → Armazenamento → Limpar cache) e conferir que a foto continua no histórico.
- [ ] **Impedimento** e **Cancelamento** pelo assistente (respostas rápidas) e o aparecimento no histórico.
- [ ] **Assistente de dúvidas** responde de verdade (Gemini) e, com o Wi-Fi desligado, mostra o fallback sem travar.
- [ ] Avisos aparecem e ficam como lidos depois de tocados.
- [ ] Atualizar as linhas ⏳ da tabela de testes do README para ✅ (ou descrever o problema) e a seção "Status das Pendências".
- [ ] Corrigir o que quebrar e gerar um novo APK.

## 4. Documentos

- [ ] Rever o **documento de testes da Sprint 3** do professor e conferir se todos os pontos apontados foram corrigidos (aqui só constam os fluxos de OS e o RF04).
- [ ] Rever o plano de negócio (`docs/MODELO_DE_NEGOCIO.md`) com o grupo: números de custo e preço são estimativas; fechar a lista da seção 9 e remover o que não for verdade.
- [ ] Conferir se a Sprint 2 e a Sprint 3 do "Resumo das Entregas por Sprint" do README refletem o que o grupo entregou.

## 5. Vídeo de pitch (até 5 minutos)

Regras: **os integrantes aparecem e falam** (narração de IA não vale), mostrar o app **instalado e rodando no celular**, publicar no YouTube como **não listado**.

Sugestão de divisão do tempo:

| Tempo | Conteúdo | Quem fala |
| --- | --- | --- |
| 0:00–0:30 | Apresentação do grupo e do EcoTrack | todos |
| 0:30–1:15 | O problema da Motiva: roçada por cronograma, sem dado, custo e risco viário no Rodoanel | |
| 1:15–3:15 | Demonstração no celular: mapa do Rodoanel → sugestão de OS → iniciar → concluir com foto → histórico e mapa atualizado → impedimento → assistente | |
| 3:15–4:15 | Plano de negócio resumido: assinatura por km/mês, custos, diferenciais | |
| 4:15–5:00 | Impacto esperado para a Motiva e as rodovias, evolução das 4 Sprints e próximos passos | |

- [ ] Ensaiar uma vez com o cronômetro (não passar de 5:00).
- [ ] Gravar a tela do celular e a voz do grupo.
- [ ] Subir no YouTube como **não listado** e copiar o link.
- [ ] Colar o link no `README.md` ("Links da Entrega") e em `docs/ENTREGA_SPRINT4.txt`.

## 6. Envio

- [ ] Fazer o merge das últimas alterações na `master` e conferir o README final no GitHub.
- [ ] Completar `docs/ENTREGA_SPRINT4.txt` (links do APK e do vídeo) e enviar **somente esse arquivo `.txt`** pela plataforma indicada pelo professor (não pelo Teams, e dentro do prazo).
- [ ] Abrir o `.txt` depois de salvar para garantir que não está vazio nem corrompido.
