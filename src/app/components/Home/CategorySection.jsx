"use client";

const categories = [
  { name: "Men's Fashion", image: "/images/men.jpg" },
  { name: "Women's Fashion", image: "/images/women.jpg" },
  { name: "Electronics", image: "/images/electronics.jpg" },
  { name: "Home Appliances", image: "/images/home.jpg" },
];

function CategorySection() {
  return (
    <div className="px-8 py-6">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 bg-white"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-100 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-medium">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
