async function fetchProducts() {
  try {
    console.log("Memulai fetch product...");
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    const grid = document.getElementById("product-grid");
    if (!grid) {
      console.error("Elemen #product-grid tidak ditemukan!");
      return;
    }

    products.forEach((product) => {
      const rating = product.rating?.rate || 0;
      const rounded = Math.round(rating);

      const card = document.createElement("div");
      card.className =
        "bg-white border shadow-sm hover:shadow-lg transition p-4";

      card.innerHTML = `
        <a href="detail.html?id=${
          product.id
        }" style="display:block; height:100%; width:100%;">
          <img src="${product.image}" alt="${
        product.title
      }" class="w-full h-60 object-contain mb-4" />
          <h3 class="text-sm font-medium mb-2 truncate">${product.title}</h3>
          <p class="text-gray-600 text-sm mb-2">$${product.price.toFixed(2)}</p>
          <div class="text-yellow-400 text-sm flex items-center">
            ${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}
            <span class="ml-2 text-gray-500 text-xs">(${rating.toFixed(
              1
            )})</span>
          </div>
        </a>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
  }
}

window.onload = fetchProducts;
