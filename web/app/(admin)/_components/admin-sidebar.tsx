import Link from "next/link";
import { cn } from "@/lib/utils/utils";

export function AdminSidebar({ className }: { className?: string }) {
  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Encomendas", href: "/admin/orders" },
    { label: "Usuários", href: "/admin/users" },
  ];

  return (
    <nav className={cn("space-y-1", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:bg-primary/10 hover:text-primary block rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
