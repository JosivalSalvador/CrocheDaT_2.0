import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalSetup() {
  // Aponta para a raiz do monorepo
  const rootDir = path.resolve(__dirname, "..");

  console.log("🚀 [SETUP] 1. A iniciar APENAS o Postgres...");
  // Sobe apenas o banco de dados e espera ele ficar "healthy"
  execSync("docker compose -f docker-compose.yml up -d postgres --wait", {
    stdio: "inherit",
    cwd: rootDir,
  });

  console.log("🌱 [SETUP] 2. A executar as Migrations e o Seed...");
  // Com o banco isolado e rodando, resetamos e populamos com os dados de teste
  execSync(
    "npm --workspace=server exec -- dotenv -e .env -- prisma migrate reset --force",
    { stdio: "inherit", cwd: rootDir },
  );

  console.log("🚀 [SETUP] 3. A iniciar a API e o Web...");
  // Agora sim subimos o resto. A API e o Next.js já vão nascer lendo o banco populado!
  execSync("docker compose -f docker-compose.yml up -d --wait", {
    stdio: "inherit",
    cwd: rootDir,
  });

  console.log("✅ [SETUP] Ambiente pronto! A iniciar os testes E2E...");
}

export default globalSetup;
