import React, { useState } from 'react';
import { Upload, X } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helper/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: ""
    });

    const [uploadPhoto, setUploadPhoto] = useState("");
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        try {
            const uploadedPhoto = await uploadFile(file);
            setUploadPhoto(file);
            setData(prev => ({
                ...prev,
                profile_pic: uploadedPhoto?.url
            }));
        } catch (error) {
            console.error('Failed to upload photo:', error);
        }
    };

    const handleClearUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadPhoto(null);
        setData((prev) => ({
            ...prev,
            profile_pic: ""
        }));
    };

    const handleOnSubmit = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

        try {
            const response = await axios.post(URL, data);
            toast.success(response.data.message);

            if(response.data.success) {
                setData({ 
                    name: "",
                    email: "",
                    password: "",
                    profile_pic: ""
                });
                navigate('/email');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-primary-900">
                            Welcome to Mc Chat!
                        </h2>
                        <p className="text-primary-600">
                            Create an account to get started
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label 
                                    htmlFor="name" 
                                    className="block text-sm font-medium text-primary-800 mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={data.name}
                                    onChange={handleOnChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                                />
                            </div>

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

                            <div>
                                <label 
                                    htmlFor="profile_pic" 
                                    className="block text-sm font-medium text-primary-800 mb-2"
                                >
                                    Profile Photo
                                </label>
                                <div className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-primary-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all group">
                                    <label 
                                        htmlFor="profile_pic" 
                                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                                    >
                                        <Upload className="mx-auto h-10 w-10 text-primary-400 group-hover:text-primary-600 transition-colors" />
                                        <div className="mt-2 text-sm text-primary-500 group-hover:text-primary-700 transition-colors">
                                            {uploadPhoto?.name ? (
                                                <span className="font-medium">{uploadPhoto.name}</span>
                                            ) : (
                                                "Click to upload profile photo"
                                            )}
                                        </div>
                                    </label>
                                    {uploadPhoto && (
                                        <button 
                                            className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors"
                                            onClick={handleClearUploadPhoto}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="profile_pic"
                                    name="profile_pic"
                                    onChange={handleUploadPhoto}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-primary-900 text-white py-3 px-4 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                        >
                            Create Account
                        </button>

                        <p className="text-center text-sm text-primary-600">
                            Already have an account?{" "}
                            <Link to="/email" className="font-medium text-primary-800 hover:text-primary-900 hover:underline transition-colors">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;