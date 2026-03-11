import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A forma profissional (Active Polling) para garantir que o servidor está pronto
async function waitForServer(url: string, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      // Faz um ping na URL. Usamos 127.0.0.1 para evitar problemas de IPv6 no CI.
      const res = await fetch(url);
      if (res.ok) {
        return; // O Next.js respondeu HTTP 200 OK! A porta está aberta e pronta.
      }
    } catch (err) {
      console.log(err);
      // ECONNREFUSED: O contêiner subiu, mas o Node.js ainda está bootando.
      // Ignoramos o erro e tentamos de novo no próximo ciclo.
    }
    await new Promise((r) => setTimeout(r, 1000)); // Espera 1s antes do próximo ping
  }
  throw new Error(
    `Timeout E2E: O servidor ${url} não respondeu em ${timeout / 1000}s`,
  );
}

async function globalSetup() {
  const rootDir = path.resolve(__dirname, "..");

  console.log("🚀 [SETUP] 1. A iniciar APENAS o Postgres...");
  execSync("docker compose -f docker-compose.yml up -d postgres --wait", {
    stdio: "inherit",
    cwd: rootDir,
  });

  console.log("🌱 [SETUP] 2. A executar as Migrations e o Seed...");
  // Com o banco rodando isolado, limpamos e populamos os dados de teste
  execSync(
    "npm --workspace=server exec -- dotenv -e .env -- prisma migrate reset --force",
    { stdio: "inherit", cwd: rootDir },
  );

  console.log("🚀 [SETUP] 3. A iniciar a API e o Web...");
  // Liga o resto. A API e o Web agora nascem com o banco já populado.
  execSync("docker compose -f docker-compose.yml up -d --wait", {
    stdio: "inherit",
    cwd: rootDir,
  });

  console.log(
    "⏳ [SETUP] 4. Fazendo polling para garantir que o Web (Next.js) subiu...",
  );
  // O Playwright vai ficar travado aqui batendo na porta até o Next.js acordar.
  await waitForServer("http://127.0.0.1:3000");

  console.log(
    "✅ [SETUP] Ambiente pronto e responsivo! A iniciar os testes E2E...",
  );
}

export default globalSetup;
