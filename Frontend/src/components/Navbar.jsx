import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Navbar() {
    const navigate = useNavigate();
    const [cartCount, setCartcount] = useState(0);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const loadCart = async () => {
            if (!userId) return setCartcount(0);

            try {
                const res = await api.get(`/cart/${userId}`);
                if(!res.data || !res.data.items) {
                    return setCartcount(0);
                }
                const total = res.data.items.reduce(
                    (sum, item) => sum + item.quantity, 0
                );
                setCartcount(total);
            } catch(error) {
                console.error('Error loading cart:', error);
                setCartcount(0);
            }
        }
        loadCart()
        window.addEventListener('cartUpdated', loadCart);
        return () => {
            window.removeEventListener('cartUpdated', loadCart);
        }
    }, [userId]);

    const logout = () => {
        sessionStorage.clear();
        setCartcount(0);
        navigate("/login");
    }

    return (
        <nav className="flex justify-between  p-4 shadow">
            <Link to="/" className="font-bold text-xl">Anurag Store</Link>

            <div className="flex gap-4 items-center">
                <Link to="/cart" className="relative text-xl">
                    Cart
                    {
                        cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )
                    }

                </Link>

                {
                    !userId ? (
                        <>
                            <Link to="/login" className="text-lg">Login</Link>
                            <Link to="/signup" className="text-lg">Signup</Link>
                        </>
                    ) : (
                        <button onClick={logout} className="text-lg">Logout</button>
                    )
                }
            </div>
        </nav>
    )

}