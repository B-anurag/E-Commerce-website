import { useEffect, useState } from "react";
import api from "../api/axios"
import { Link } from "react-router"

export default function ProductList(){
    const [products, setProducts] = useState([])
                
    const loadProducts = async () => {
        const response = await api.get("/products")
        setProducts(response.data)
    }

    const deleteProduct = async (id) =>{
        try{
            await api.delete(`/products/delete/${id}`)
            alert('Product deleted successfully')
            loadProducts()
        }catch(error){
            console.error('Error deleting product:', error)
        }
    }
    useEffect(() => {
        void api.get("/products").then((response) => {
            setProducts(response.data)
        })
    }, []);

    return(
        <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6 ">
                <h2 className="text-2xl font-bold">Product List </h2>
                <Link to="/admin/products/add" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                     Add New Product 
                </Link>
            </div>

            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr classname="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Stock</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-100 text-center">
                                <td className="border border-gray-300 px-4 py-2">{product.title}</td>
                                <td className="border border-gray-300 px-4 py-2">${product.price}</td>
                                <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <Link to={`/admin/products/edit/${product._id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                                        Update
                                    </Link>
                                    <button onClick={() => deleteProduct(product._id)}
                                     className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
            </table>
        </div>
    )
}