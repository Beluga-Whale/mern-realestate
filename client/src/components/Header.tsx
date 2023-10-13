import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { userSelector } from '../store/user/userSlice';
import { useEffect, useState } from 'react';

type User = {
    currentUserGoogle?: {
        avatar?: string;
    };
    currentUserDatabase?: any;
};

const Header = () => {
    const user: User = useAppSelector(userSelector) as User;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className="shadow-md bg-[#EBE4D1] ">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-[#E25E3E]">Beluga</span>
                        <span className="text-[#C63D2F]">Estate</span>
                    </h1>
                </Link>
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-100 p-3 rounded-lg flex items-center"
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button>
                        <FaSearch className="text-slate-600" />
                    </button>
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
                                    user?.currentUserGoogle?.avatar ||
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
