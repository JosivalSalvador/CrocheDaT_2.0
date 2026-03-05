import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper">
      {/* Aqui depois vai entrar Sidebar, Header, etc */}
      {children}
    </div>
  );
}
