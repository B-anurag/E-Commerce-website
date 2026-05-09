import { useParams } from "react-router-dom";

export default function OrderSuccess(){
    const {id} = useParams();

    const goHome= () => {
        window.location.href="/"
    }

    return(
        <div className="max-w-xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>

            <p className="mt-4 text-lg">Your Order ID: <strong>{id}</strong>
            <span className="font-semibold">{id}</span>
            </p>

            <button onClick={goHome} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Continue Shopping
            </button>
        </div>
    )
}
