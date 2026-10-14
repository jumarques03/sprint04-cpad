import { Directory, File, Paths } from "expo-file-system";

const EXTENSOES_ACEITAS = ["jpg", "jpeg", "png", "webp"];

function extrairExtensao(uri) {
  const semParametros = uri.split("?")[0];
  const extensao = semParametros.split(".").pop().toLowerCase();

  return EXTENSOES_ACEITAS.includes(extensao) ? extensao : "jpg";
}

// A URI devolvida pelo image picker fica no cache e pode ser apagada pelo
// sistema. Copiamos a foto para a pasta de documentos do app (permanente) e
// devolvemos o novo caminho, que é o que deve ser salvo no registro da OS.
export async function salvarEvidencia(uriOrigem, numeroOrdem) {
  const pasta = new Directory(Paths.document, "evidencias");
  pasta.create({ intermediates: true, idempotent: true });

  const nome = `os-${numeroOrdem}-${Date.now()}.${extrairExtensao(uriOrigem)}`;
  const destino = new File(pasta, nome);

  await new File(uriOrigem).copy(destino);

  return destino.uri;
}
