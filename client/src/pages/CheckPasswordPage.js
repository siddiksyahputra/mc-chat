import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../redux/userSlice';

export const CheckPasswordPage = () => {
    const [data, setData] = useState({
        password: "",
    });

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    // Extract user details from location state
    const userData = location?.state?.data

    useEffect(() => {
        // If no user data, redirect to email page
        if (!userData) {
            navigate('/email');
            return;
        }

        // Dispatch user data to Redux store
        dispatch(setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            profile_pic: userData.profile_pic
        }));
    }, [userData, navigate, dispatch]);

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

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

        try {
            const response = await axios.post(URL, {
              userId: userData._id,
              password: data.password
            },{
                withCredentials: true
            });
            
            if(response.data.success){
                // Dispatch token to Redux store
                dispatch(setToken(response?.data?.token))
                
                // Store token in localStorage
                localStorage.setItem(`token`, response?.data?.token)
                
                // Reset password and navigate
                setData({ 
                    password: ""
                })
                navigate('/')
                
                toast.success(response.data.message)
            }   
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    };
    
    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center pb-32">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className='flex justify-center'>
                            <Avatar
                                name={userData?.name}
                                imageUrl={userData?.profile_pic}
                                width={75}
                                height={75}
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-primary-900">
                            Hi, {userData?.name}!
                        </h2>
                        <p className="text-primary-600">
                            Verify your account
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-primary-800 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={handleOnChange}
                                required
                                className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                            />
                        </div>

                        <button
                            className="w-full bg-primary-900 text-white py-3 px-4 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                        >
                            Login
                        </button>

                        <p className="text-center text-sm text-primary-600">
                            Forgot password?{" "}
                            <Link to="/forgot-password" className="font-medium text-primary-800 hover:text-primary-900 hover:underline transition-colors">
                                Click here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckPasswordPage;