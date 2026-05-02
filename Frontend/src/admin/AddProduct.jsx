import {useState} from 'react'
import api from '../api/axios'   
import { useNavigate } from 'react-router'

export default function AddProduct() {
    const [form ,setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        image:'',
        stock:'',
    })
    const [error, setError] = useState('')

    const navigate = useNavigate()
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.title.trim() || !form.price.trim()) {
            setError('Title and price are required.')
            return
        }

        const payload = {
            ...form,
            price: Number(form.price),
            stock: form.stock === '' ? 0 : Number(form.stock),
        }

        try {
            await api.post('/products/add', payload)
            alert('Product added successfully')
            navigate('/admin/products')
        } catch (error) {
            setError('Unable to add product. Check the console for details.')
            console.error('Error adding product:', error)
        }
    }

    return(
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            {
                Object.keys(form).map((key) => (
                   <input 
                   key={key}
                   name={key}
                   type={key === 'price' || key === 'stock' ? 'number' : 'text'}
                   required={key === 'title' || key === 'price'}
                   value={form[key]}
                   onChange={handleChange}
                   placeholder={key}
                   className="w-full border border-gray-300 p-2 rounded"
                   /> 
                ))
          }

          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Product
          </button>
        </form>
        </div>
    )
}