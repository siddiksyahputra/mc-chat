import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { UserCircle } from 'lucide-react';
import axios from 'axios'
import toast from 'react-hot-toast';

export const CheckEmailPage = () => {
    const [data, setData] = useState({
        email: "",
    });

    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOnSubmit = async(e) => {
        e.preventDefault()
        e.stopPropagation()

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

        try {
            const response = await axios.post(URL, data);
            toast.success(response.data.message)
            
            if(response.data.success)
                setData({ 
                    email: "",
            })
            navigate('/password', {
              state : response?.data
            })
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center pb-32">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className='flex justify-center'>
                            <UserCircle className="h-16 w-16 text-primary-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary-900">
                            Welcome to Mc Chat!
                        </h2>
                        <p className="text-primary-600">
                            Verify your account
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-primary-800 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={handleOnChange}
                                required
                                className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                            />
                        </div>

                        <button
                            className="w-full bg-primary-900 text-white py-3 px-4 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                        >
                            Verify Email
                        </button>

                        <p className="text-center text-sm text-primary-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-primary-800 hover:text-primary-900 hover:underline transition-colors">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;