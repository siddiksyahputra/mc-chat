import React, { useEffect, useState } from 'react'
import { Search, X, UserPlus } from 'lucide-react'
import { Loading } from './Loading'
import { UserCard } from './UserCard'
import toast from 'react-hot-toast'
import axios from 'axios'

export const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [hasSearched, setHasSearched] = useState(false) // tambahkan state ini

    const handleSearchUser = async () => {
        if (!search.trim()) {
            setSearchUser([])
            setHasSearched(false) // reset hasSearched ketika search kosong
            return
        }

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const response = await axios.post(URL, { search })
            setSearchUser(response.data.data)
            setHasSearched(true) // set hasSearched menjadi true setelah melakukan pencarian
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (search.trim()) { // hanya jalankan search jika ada input
                handleSearchUser()
            }
        }, 500)
        return () => clearTimeout(debounce)
    }, [search])

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-300 mt-16">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-primary-50/50">
                    <div className="flex items-center gap-2">
                        <UserPlus size={20} className="text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Find Friends</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/80 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                
                {/* Search Input */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50
                                     placeholder:text-gray-400 text-sm transition-all duration-300"
                        />
                        <Search 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                            size={18} 
                        />
                    </div>
                </div>

                {/* Results Section */}
                <div className="px-4 pb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <Loading />
                        </div>
                    )}
                    
                    {/* Tampilkan pesan ini jika belum melakukan pencarian */}
                    {!hasSearched && !loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Enter a name or email to search</p>
                            <p className="text-sm text-gray-400 mt-1">Results will appear here</p>
                        </div>
                    )}
                    
                    {/* Tampilkan ini jika sudah search tapi tidak ada hasil */}
                    {hasSearched && !loading && searchUser.length === 0 && search && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
                            <p className="text-sm text-gray-400 mt-1">Try searching with a different term</p>
                        </div>
                    )}
                    
                    {/* Tampilkan hasil pencarian */}
                    {hasSearched && !loading && searchUser.length > 0 && (
                        <div className="space-y-3">
                            {searchUser.map((user) => (
                                <UserCard 
                                    key={user._id} 
                                    user={user}
                                    onClose={onClose}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}