import { test, expect } from "@playwright/test";

test.describe("Fluxo Admin: Navegação Completa", () => {
  test("deve executar o fluxo sem flakiness", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Entrar" }).click();

    // Usando a validação de heading do seu exemplo (muito mais estável)
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta" }),
    ).toBeVisible();

    await page
      .getByRole("textbox", { name: "seu@email.com" })
      .fill("josivaladm@gmail.com");
    await page
      .getByRole("textbox", { name: "Sua senha de acesso" })
      .fill("@Js92434212");
    await page.getByRole("button", { name: "Acessar conta" }).click();

    // ERRO 1 CORRIGIDO: Validamos a entrada esperando o primeiro link do menu
    const linkCatalogo = page.getByRole("link", {
      name: "Catálogo",
      exact: true,
    });
    await expect(linkCatalogo).toBeVisible();
    await linkCatalogo.click();

    const linkClientes = page.getByRole("link", {
      name: "Clientes",
      exact: true,
    });
    await expect(linkClientes).toBeVisible();
    await linkClientes.click();

    const linkAtendimento = page.getByRole("link", {
      name: "Atendimento",
      exact: true,
    });
    await expect(linkAtendimento).toBeVisible();
    await linkAtendimento.click();

    // Logout
    const btnAdmin = page.getByRole("button", { name: /Admin Sistema/i });
    await expect(btnAdmin).toBeVisible();
    await btnAdmin.click();

    const btnSair = page.getByRole("menuitem", { name: "Logout" });
    await expect(btnSair).toBeVisible();
    await btnSair.click();

    // Valida logout
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta" }),
    ).toBeVisible();
  });
});
