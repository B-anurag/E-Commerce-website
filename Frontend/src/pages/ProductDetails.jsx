import {useEffect, useState} from 'react';
import api from '../api/axios';
import { useParams } from 'react-router';

export default function ProductDetails(){

  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await api.post('/cart/add', {
        userId,
        productId: product._id,
        quantity: 1
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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img src={product.image} alt={product.title} className="w-full h-40 object-contain bg-white rounded" />
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-xl font-semibold mt-4">${product.price.toFixed(2)}</p>

      {msg && (
        <div className={`mt-4 p-2 rounded text-sm ${msg.includes('added') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg}
        </div>
      )}

      <button 
        onClick={handleAddToCart}
        disabled={loading}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}