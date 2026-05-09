import { useEffect, useState } from 'react';
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    const res = await api.get(`/products?search=${search}&category=${category}`);
    setProducts(res.data);
  }

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, { userId, productId });

      const total = res.data.cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity, 0
      );
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Product added to cart. Total: $" + total);
    } catch (error) {
      console.error('Add to cart failed', error);
      alert('Failed to add product to cart. See console for details.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Products</h1>
          <div className="text-sm text-gray-600">{products.length} items</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-4 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"></path></svg>
          </div>

          <div className="w-full sm:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Home">Home</option>
            </select>
          </div>
        </div>
      </header>

      <main>
        {products.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition overflow-hidden">
                <Link to={`/products/${product._id}`} className="block">
                  <div className="h-56 bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800 truncate">{product.title}</h2>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-indigo-600 font-bold text-lg">${product.price}</span>
                    <span className="text-sm text-gray-500">{product.category || '—'}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => addToCart(product._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-3 rounded-md text-sm hover:opacity-95 transition"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}