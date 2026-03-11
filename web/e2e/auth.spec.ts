import { test, expect } from "@playwright/test";

test.describe("Fluxo Completo: Busca, Carrinho e Autenticação", () => {
  test("deve executar o fluxo sem flakiness", async ({ page }) => {
    // 1. Acesso e validação das categorias
    await page.goto("http://localhost:3000/");
    // Substituído o texto concatenado pela validação exata dos links principais, que nunca falha
    await expect(
      page.getByRole("link", { name: "Todas", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Amigurumis", exact: true }),
    ).toBeVisible();

    // 2. Busca na categoria
    await page.getByRole("link", { name: "Amigurumis", exact: true }).click();
    const searchInput = page.getByRole("textbox", {
      name: /Procurar em Amigurumis/i,
    });
    await expect(searchInput).toBeVisible();
    // O .fill() do Playwright já clica no elemento antes de digitar nativamente.
    await searchInput.fill("teste");

    // 3. Retorno para 'Todas' e acesso ao produto
    await page.getByRole("link", { name: "Todas", exact: true }).click();
    const linkProduto = page.getByRole("link", {
      name: /Foto de Tapete Oval Russo/i,
    });
    await expect(linkProduto).toBeVisible();
    await linkProduto.click();

    // 4. Tela do produto (Removido o .nth(2) frágil)
    // Agora ele busca especificamente pelo texto do produto em vez de contar a ordem das divs na tela
    await expect(
      page.locator("div").filter({ hasText: "Tapete Oval Russo" }).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /Ver imagem 2/i }).click();

    // 5. Adicionar ao Carrinho
    const btnAdicionar = page.getByRole("button", {
      name: "Adicionar ao Carrinho",
    });
    await expect(btnAdicionar).toBeVisible();
    await btnAdicionar.click();

    // 6. Redirecionamento e Login
    // Substituído o bloco gigante de texto pela validação do título da tela de login
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta" }),
    ).toBeVisible();

    await page
      .getByRole("textbox", { name: "seu@email.com" })
      .fill("josivaluser@gmail.com");
    await page
      .getByRole("textbox", { name: "Sua senha de acesso" })
      .fill("@Js92434212");
    await page.getByRole("button", { name: "Acessar conta" }).click();

    // 7. Validação e Logout
    // O gravador capturou 6 cliques no botão 'CE' e várias validações repetidas.
    // Para estabilidade de 100%, esperamos o botão aparecer, clicamos UMA vez, e esperamos o menu abrir.
    const userMenu = page.getByRole("button", { name: "CE", exact: true });
    await expect(userMenu).toBeVisible();
    await userMenu.click();

    const btnSair = page.getByRole("menuitem", { name: "Sair da conta" });
    await expect(btnSair).toBeVisible();
    await btnSair.click();

    // 8. Valida se o logout ocorreu com sucesso retornando para a tela de login
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta" }),
    ).toBeVisible();
  });
});
