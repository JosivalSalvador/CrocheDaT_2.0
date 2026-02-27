import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

import { HomeHero } from "../_components/home-hero";
import { HomeCategories } from "../_components/home-categories";
import { HomeProducts } from "../_components/home-products";

export default async function HomePage() {
  const session = await getSession();

  if (!session || session.user.role !== "USER") {
    redirect("/login");
  }

  const name = session.user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 md:py-10">
      <HomeHero name={name} />

      <HomeCategories />

      <HomeProducts />
    </div>
  );
}
