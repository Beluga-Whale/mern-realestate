import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, userSelector } from '../store/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
    const [formData, setFormData] = useState<object>({});
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { error, loading } = useAppSelector(userSelector);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const action = await dispatch(loginUser(formData));
            const type = action.type.split('/');
            if (type[2] === 'fulfilled') {
                navigate('/');
            }
        } catch (err: any) {
            return;
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7 ">
                Sign In
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="email"
                    className="border p-3  rounded-lg"
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="border p-3  rounded-lg"
                    id="password"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
                <p>Don't have an account?</p>
                <Link to="/sign-up">
                    <span className="text-blue-700">Sign up</span>
                </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
};

export default SignIn;
