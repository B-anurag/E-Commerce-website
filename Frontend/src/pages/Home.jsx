import { useEffect, useState } from 'react';
import api from '../api/axios'
import{Link} from 'react-router'

export default function Home(){
  const [products, setProducts ] = useState([]);
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    const res = await api.get(`/products?search=${search}&category=${category}`);
    setProducts(res.data);
  }

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  return(
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
          key={product._id}
           to={`/products/${product._id}`}
            className="border p-3 rounded shaodow hover:shadow-lg transition"
            >
            <img 
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-contain bg-white rounded mb-4" 
            />
            <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
            <p className="text-gray-600"> ${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}