import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import { userSelector } from '../store/user/userSlice';

type User = {
    currentUserGoogle?: {
        photoURL?: string;
    };
    currentUserDatabase?: any;
};

const Header = () => {
    const user: User = useAppSelector(userSelector) as User;

    return (
        <header className="shadow-md bg-[#EBE4D1] ">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-[#E25E3E]">Beluga</span>
                        <span className="text-[#C63D2F]">Estate</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                    />
                    <FaSearch className="text-slate-600" />
                </form>
                <ul className="flex gap-4">
                    <Link to="/">
                        <li className="hidden sm:inline text-sltate-700 hover:underline ">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-sltate-700 hover:underline ">
                            About
                        </li>
                    </Link>
                    <Link to="/profile">
                        {user?.currentUserGoogle !== null ||
                        user?.currentUserDatabase !== null ? (
                            <img
                                className="w-7 h-7 rounded-full object-cover "
                                src={
                                    user?.currentUserGoogle?.photoURL ||
                                    user?.currentUserDatabase?.avatar
                                }
                                alt=""
                            />
                        ) : (
                            <li className="text-sltate-700 hover:underline ">
                                Sign In
                            </li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
};

export default Header;
