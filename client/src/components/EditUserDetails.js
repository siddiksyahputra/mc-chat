import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helper/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

export const EditUserDetails = ({ onClose, user }) => {
    const [data, setData] = useState({
        name: user?.user,
        profile_pic: user?.profile_pic
    });

    const dispatch = useDispatch()
    useEffect(() => {
        setData(prev => ({
            ...prev,
            ...user
        }));
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const uploadedPhoto = await uploadFile(file);
            setData(prev => ({
                ...prev,
                profile_pic: uploadedPhoto?.url
            }));
        } catch (error) {
            console.error('Failed to upload photo:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios({
                method: 'post',
                url : URL,
                data : data,
                withCredentials : true
            })

            toast.success(response?.data?.message)

            if(response.data.success){
                dispatch(setUser(response.data.data))
            }
            onClose()
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Profile Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Edit your profile information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label 
                                htmlFor="name" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data?.name || ''}
                                onChange={handleOnChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                                         focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                         outline-none transition-colors duration-200
                                         placeholder:text-gray-400"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Photo
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="relative group">
                                        <Avatar
                                            width={64}
                                            height={64}
                                            imageUrl={data?.profile_pic}
                                            name={data?.name}
                                            className="rounded-full ring-2 ring-gray-100"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="cursor-pointer inline-block">
                                        <input
                                            type="file"
                                            id='profile_pic'
                                            className="hidden"
                                            onChange={handleUploadPhoto}
                                            accept="image/*"
                                        />
                                        <div className="px-4 py-2.5 border border-gray-200 rounded-lg 
                                                    hover:bg-gray-50 hover:border-primary/30
                                                    text-sm font-medium text-gray-700 
                                                    transition-colors duration-200 
                                                    active:bg-gray-100">
                                            Change Photo
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 
                                         hover:bg-gray-50 rounded-lg transition-colors duration-200
                                         border border-gray-200 hover:border-gray-300
                                         active:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2.5 bg-primary text-white text-sm font-medium 
                                         rounded-lg hover:bg-primary/90 transition-colors duration-200
                                         shadow-sm shadow-primary/10 hover:shadow-primary/20
                                         active:bg-primary/95"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(EditUserDetails);