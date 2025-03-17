import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Navbar = () => {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token11'); 
        router.push('/'); 
    };

    return (
        <nav className="bg-blue-500 p-4 text-white flex justify-between">
            <h1 className="text-lg font-bold">My Website</h1>
            <button 
                onClick={handleLogout} 
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
