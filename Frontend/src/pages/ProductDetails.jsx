import {useEffect, useState} from 'react';
import api from '../api/axios';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetails(){

  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);

  const loadProduct = async () => {
    const res = await  api.get('/products/')
    const p = res.data.find((item) => item._id === id)
    setProduct(p);
  };
  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
     const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      setMsg('Please login first');
      return;
    }

    setLoading(true);
    try {
      await api.post('/cart/add', {
        userId,
        productId: product._id,
        quantity: qty
      });
      setMsg('Product added to cart!');
      setTimeout(() => setMsg(''), 2000);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add product to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="py-20 text-center text-gray-500">Loading product...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="inline-block mb-4 text-sm text-indigo-600 hover:underline">← Back to products</Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 flex items-center justify-center bg-gray-50">
          <img src={product.image} alt={product.title} className="max-h-80 object-contain" />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{product.category || 'Uncategorized'}</p>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-2xl font-extrabold text-indigo-600">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="mt-4 text-gray-700">{product.description}</p>

          {msg && (
            <div className={`mt-4 p-3 rounded text-sm ${msg.includes('added') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {msg}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >-</button>
              <div className="px-4 py-2 text-gray-800">{qty}</div>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md shadow hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : `Add ${qty} to Cart`}
            </button>

            <Link to="/cart" className="inline-flex items-center px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50">View Cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}