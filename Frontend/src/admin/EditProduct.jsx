import {useEffect, useState} from "react";
import api from '../api/axios'
import { useNavigate, useParams } from "react-router";
import { use } from "react";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image:'',
        stock:'',
    })

    const allowedFields = ["title", "description", "price", "category", "image", "stock"];

    const loadProduct = async () => {
        try {
            const res = await api.get(`/products`);
            const product= res.data.find((p) => p.id === parseInt(id));
            setForm(product);
        } catch (error) {
            console.error('Error loading product:', error);
        }
    }

    useEffect(() => {
        loadProduct();
    },[]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.put(`/products/update/${id}`, form)
        alert('Product updated successfully')
        navigate('/admin/products')
    }

    return(
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {
                    allowedFields.map((key) => (
                        allowedFields.includes(key) && 
                            <input
                            key={key}
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            placeholder={key}
                            className="w-full border border-gray-300 p-2 rounded"
                            />
                    ))
                }

                <button type="submit" 
                className="bg-blue-500 text-white p-2 rounded"
                >Update Product
                </button>
            </form>
        </div>
    )
}