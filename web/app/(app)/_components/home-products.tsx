export function HomeProducts() {
  const products = [
    "Bolsa artesanal",
    "Tapete redondo",
    "Amigurumi urso",
    "Sousplat floral",
    "Cesto organizador",
    "Boneca crochê",
    "Cachecol",
    "Kit bebê",
    "Porta copos",
    "Almofada",
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Produtos em destaque</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((item) => (
          <div
            key={item}
            className="group bg-card cursor-pointer rounded-2xl border p-3 transition hover:shadow-md"
          >
            <div className="bg-muted aspect-square rounded-xl" />

            <p className="mt-3 text-sm font-medium">{item}</p>

            <p className="text-muted-foreground text-xs">R$ 49,90</p>
          </div>
        ))}
      </div>
    </section>
  );
}
