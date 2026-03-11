import { test, expect } from "@playwright/test";

test.describe("Fluxo Completo Customer: Busca, Carrinho e Chat", () => {
  test("deve executar o fluxo sem flakiness", async ({ page }) => {
    test.setTimeout(120000);
    // 1. Acesso e validação
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Entrar" }).click();
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta" }),
    ).toBeVisible();

    // 2. Login
    await page
      .getByRole("textbox", { name: "seu@email.com" })
      .fill("josivaluser2@gmail.com");
    await page
      .getByRole("textbox", { name: "Sua senha de acesso" })
      .fill("@Js92434212");
    await page.getByRole("button", { name: "Acessar conta" }).click();

    // 3. Busca em Categoria
    const linkAmigurumis = page.getByRole("link", {
      name: "Amigurumis",
      exact: true,
    });
    await expect(linkAmigurumis).toBeVisible();
    await linkAmigurumis.click();

    const searchInput = page.getByRole("textbox", {
      name: /Procurar em Amigurumis/i,
    });
    await expect(searchInput).toBeVisible();
    await searchInput.fill("teste"); // Usando 'teste' conforme seu exemplo de sucesso

    // 4. Retorno e Acesso ao Produto
    await page.getByRole("link", { name: "Todas", exact: true }).click();

    const linkProduto = page.getByRole("link", {
      name: /Foto de Tapete Oval Russo/i,
    });
    await expect(linkProduto).toBeVisible();
    await linkProduto.click();

    await expect(
      page.locator("div").filter({ hasText: "Tapete Oval Russo" }).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /Ver imagem 2/i }).click();

    // 5. Carrinho e Encomenda
    const btnAdicionar = page.getByRole("button", {
      name: "Adicionar ao Carrinho",
    });
    await expect(btnAdicionar).toBeVisible();
    await btnAdicionar.click();

    await page
      .getByRole("button", { name: "Abrir Carrinho" })
      .click({ force: true });

    // AJUSTE: Aguarda o carrinho abrir e o botão ficar visível antes de clicar
    const btnCombinar = page.getByRole("button", {
      name: "Combinar Encomenda",
    });
    await expect(btnCombinar).toBeVisible();
    await btnCombinar.click();

    // O PULO DO GATO: Se o carrinho ficou aberto na tela, ele esconde o resto do header.
    // O 'Escape' garante que qualquer modal/drawer seja fechado antes de seguirmos.
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500); // Dá um fôlego rápido pra animação do carrinho sumir

    // 6. Menu do Usuário (Usando exatamente o locator do seu caso de sucesso)
    const userMenu = page.getByRole("button", { name: "CE", exact: true });
    await expect(userMenu).toBeVisible();

    // Meu Perfil
    await userMenu.click();
    await page.getByRole("menuitem", { name: "Meu Perfil" }).click();

    // Meus Chats
    await expect(userMenu).toBeVisible();
    await userMenu.click();
    await page.getByRole("menuitem", { name: "Meus Chats" }).click();

    // 7. Novo Atendimento e Chat
    const btnNovoAtendimento = page.getByRole("button", {
      name: "Novo Atendimento",
    });
    await expect(btnNovoAtendimento).toBeVisible();
    await btnNovoAtendimento.click();

    await page
      .getByRole("textbox", { name: /Digite aqui o seu problema/i })
      .fill("teste");
    await page.getByRole("button", { name: "Iniciar Conversa" }).click();

    const msgInput = page.getByRole("textbox", { name: "Mensagem..." });
    await expect(msgInput).toBeVisible();
    await msgInput.fill("teste");
    await msgInput.press("Enter");

    // 8. Retorno à Home (clicando no primeiro link disponível, geralmente a logo)
    await page.getByRole("link").first().click();

    const toastNotificacao = page.locator("[data-sonner-toast]");
    await expect(toastNotificacao).toBeHidden({ timeout: 15000 });

    // 9. Logout
    await expect(userMenu).toBeVisible();
    await userMenu.click();

    const btnSair = page.getByRole("menuitem", { name: "Sair da conta" });
    await expect(btnSair).toBeVisible();
    await btnSair.click();

    // Valida logout
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta" }),
    ).toBeVisible();
  });
});
