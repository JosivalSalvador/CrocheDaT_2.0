import { ReactNode } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "../(auth)/_components/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const name = session.user.name.split(" ")[0];

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    },
    {
      label: "Pedidos",
      href: "/admin/orders",
      icon: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    },
    {
      label: "Peças",
      href: "/admin/parts",
      icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    },
    {
      label: "Usuários",
      href: "/admin/users",
      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    },
  ];

  return (
    <div className="bg-background flex min-h-screen">
      {/* SIDEBAR */}

      <aside className="bg-card hidden w-64 border-r lg:flex lg:flex-col">
        {/* LOGO */}

        <div className="border-b px-6 py-5">
          <div className="text-lg font-semibold">Crochê da T</div>

          <div className="text-muted-foreground text-xs">
            Painel Administrativo
          </div>
        </div>

        {/* MENU */}

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d={item.icon} />
              </svg>

              {item.label}
            </Link>
          ))}
        </nav>

        {/* USER */}

        <div className="border-t p-4">
          <div className="mb-3 text-sm">
            <div className="font-medium">{name}</div>

            <div className="text-muted-foreground text-xs">Administrador</div>
          </div>

          <LogoutButton />
        </div>
      </aside>

      {/* MAIN AREA */}

      <div className="flex flex-1 flex-col">
        {/* HEADER */}

        <header className="bg-background border-b">
          <div className="flex h-14 items-center justify-between px-4 lg:px-8">
            <div className="text-sm font-medium">Painel Admin</div>

            <div className="flex items-center gap-4">
              <span className="text-muted-foreground hidden text-sm md:block">
                {name}
              </span>

              <LogoutButton />
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
