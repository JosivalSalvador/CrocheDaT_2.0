import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />

      {/* O conteúdo dinâmico (a vitrine, o login, etc) entra aqui */}
      <main className="flex flex-1 flex-col">{children}</main>

      <Footer />
    </div>
  );
}
