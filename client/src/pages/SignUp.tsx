import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
    const [formData, setFormData] = useState<object | null>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/signup', formData);
            setError(null);
            navigate('/sign-in');
        } catch (err: any) {
            setError(err.response.data.message);
            setLoading(false);
            return;
        }
        setLoading(false);
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7 ">
                Sign Up
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="username"
                    className="border p-3  rounded-lg"
                    id="username"
                    onChange={handleChange}
                />
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
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
                <p>Have an account?</p>
                <Link to="/sign-in">
                    <span className="text-blue-700">Sign in</span>
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
