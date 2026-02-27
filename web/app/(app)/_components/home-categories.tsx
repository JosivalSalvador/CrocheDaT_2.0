export function HomeCategories() {
  const categories = [
    "Bolsas",
    "Tapetes",
    "Amigurumi",
    "Sousplat",
    "Decoração",
    "Kits",
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Categorias</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat) => (
          <div
            key={cat}
            className="bg-card cursor-pointer rounded-2xl border p-4 text-center transition hover:shadow-md"
          >
            <div className="bg-muted mb-3 h-16 rounded-xl" />

            <span className="text-sm font-medium">{cat}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
