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
    <div className="p-6">

      {/* search */}
      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded py-2 px-4"
        />
      </div>

      {/* category filter */}
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded py-2 px-4"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Clothing">Clothing</option>
          <option value="Shoes">Shoes</option>
          <option value="Home">Home</option>
        </select>
      </div>

      {/* product list */}
      <div className="grid grid-cols-2  md:grid-cols-4  gap-5">
        {products.map((product) => (
          <div key={product._id} className="border p-3 rounded shadow hover:shadow-lg transition">
          <Link
            to={`/products/${product._id}`}
            className="block"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain bg-white rounded mb-4"
            />
            <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
            <p className="text-gray-600"> ${product.price}</p>
          </Link>

           <button
          onClick={() => addToCart(product._id)}
          className="mt-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
        >
          Add to Cart
        </button>
          </div>
        ))}
       

      </div>
    </div>
  )
}