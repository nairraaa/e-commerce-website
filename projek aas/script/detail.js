/* detail.js – versi sinkron dengan cart.html */
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://fakestoreapi.com/products";

  /* ===== DOM refs ===== */
  const imgEl          = document.getElementById("product-image");
  const titleEl        = document.getElementById("product-title");
  const priceEl        = document.getElementById("product-price");
  const descEl         = document.getElementById("product-desc");
  const ratingStarsEl  = document.getElementById("rating-stars");
  const ratingCountEl  = document.getElementById("rating-count");

  const decBtn         = document.getElementById("btn-dec");
  const incBtn         = document.getElementById("btn-inc");
  const qtyInp         = document.getElementById("qty-input");

  const addCartBtn     = document.getElementById("add-cart");
  const buyNowBtn      = document.getElementById("buy-now");

  let currentProduct = null;

  /* ===== Ambil 1 produk (by ?id atau default produk pertama) ===== */
  async function loadProduct() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam   = urlParams.get("id");
      const endpoint  = idParam ? `${API_URL}/${idParam}` : API_URL;

      const res  = await fetch(endpoint);
      const data = await res.json();
      currentProduct = Array.isArray(data) ? data[0] : data;

      renderProduct(currentProduct);
    } catch (err) {
      console.error("Failed fetching product:", err);
    }
  }

  /* ===== Render ke halaman ===== */
  function renderProduct(p) {
    imgEl.src = p.image;
    imgEl.alt = p.title;

    titleEl.textContent = p.title.toUpperCase();
    priceEl.textContent = `$${p.price.toFixed(2)}`;
    descEl.textContent  = p.description;

    ratingCountEl.textContent = `(${p.rating.count} ratings)`;
    ratingStarsEl.innerHTML   = "";

    const full = Math.round(p.rating.rate);
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      star.setAttribute("data-feather", "star");
      star.classList.add("h-4", "w-4", i < full ? "fill-current" : "stroke-current");
      ratingStarsEl.appendChild(star);
    }
    feather.replace();   // render ikon yang baru ditambahkan
  }

  /* ===== Kontrol kuantitas ===== */
  incBtn.addEventListener("click", () => {
    qtyInp.value = parseInt(qtyInp.value, 10) + 1;
  });

  decBtn.addEventListener("click", () => {
    const val = parseInt(qtyInp.value, 10);
    if (val > 1) qtyInp.value = val - 1;
  });

  /* ===== Helper LocalStorage Cart ===== */
  const getCart  = () => JSON.parse(localStorage.getItem("cart") || "[]");
  const saveCart = (cartArr) => localStorage.setItem("cart", JSON.stringify(cartArr));

  /* ===== Add to Cart ===== */
  addCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    const cart = getCart();
    const existIdx = cart.findIndex((c) => c.id === currentProduct.id);

    if (existIdx !== -1) {
      cart[existIdx].quantity += parseInt(qtyInp.value, 10);
    } else {
      cart.push({
        id:       currentProduct.id,
        title:    currentProduct.title,
        price:    currentProduct.price,
        image:    currentProduct.image,
        quantity: parseInt(qtyInp.value, 10)
      });
    }

    saveCart(cart);

    addCartBtn.textContent = "Added!";
    setTimeout(() => (addCartBtn.textContent = "Add to Cart"), 1500);
  });

  /* ===== Buy Now → simpan & redirect ===== */
  buyNowBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    localStorage.setItem(
      "checkoutProduct",
      JSON.stringify({
        ...currentProduct,
        quantity: parseInt(qtyInp.value, 10)
      })
    );
    window.location.href = "checkout.html";
  });

  /* ===== Init ===== */
  loadProduct();
});