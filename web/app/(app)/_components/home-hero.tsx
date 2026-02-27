export function HomeHero({ name }: { name: string }) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold md:text-3xl">Olá, {name}</h1>

      <p className="text-muted-foreground text-sm">
        Descubra novas peças artesanais feitas à mão
      </p>
    </section>
  );
}
