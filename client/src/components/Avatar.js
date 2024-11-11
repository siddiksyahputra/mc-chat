import React, { useMemo, useState } from 'react';
import { CircleUser  } from 'lucide-react';
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width = 65, height = 65, className = '' }) => {
    const [imgError, setImgError] = useState(false);
    const onlineUser  = useSelector(state => state?.user?.onlineUser );

    // Generate avatar initials from the user's name
    const avatarName = useMemo(() => {
        if (!name) return "";
        const splitName = name.split(" ");
        return splitName.length > 1 
            ? (splitName[0][0] + splitName[1][0]).toUpperCase() 
            : splitName[0][0].toUpperCase();
    }, [name]);

    // Generate a random color or consistent color based on userId
    const randomColor = useMemo(() => {
        const colors = [
            'bg-gradient-to-br from-primary/80 to-primary',
            'bg-gradient-to-br from-purple-400 to-primary',
            'bg-gradient-to-br from-indigo-400 to-indigo-600',
            'bg-gradient-to-br from-violet-400 to-violet-600',
            'bg-gradient-to-br from-fuchsia-400 to-fuchsia-600',
            'bg-gradient-to-br from-blue-400 to-primary',
            'bg-gradient-to-br from-cyan-400 to-primary',
            'bg-gradient-to-br from-purple-400 to-violet-600',
        ];
        return userId ? colors[parseInt(userId) % colors.length] : colors[Math.floor(Math.random() * colors.length)];
    }, [userId]);

    const isOnline = onlineUser .includes(userId);

    return (
        <div className={`relative inline-block ${className}`}>
            <div 
                className="
                    overflow-hidden rounded-full 
                    ring-2 ring-black/5 dark:ring-white/10 
                    shadow-lg hover:shadow-xl 
                    transition-all duration-300 ease-in-out
                " 
                style={{ width: `${width}px`, height: `${height}px` }}
            >
                {imageUrl && !imgError ? (
                    <div className="w-full h-full group relative">
                        <img
                            src={imageUrl}
                            width={width}
                            height={height}
                            alt={name || 'User  avatar'}
                            onError={() => setImgError(true)}
                            className="
                                object-cover w-full h-full
                                transition-transform duration-300 ease-in-out
                                group-hover:scale-110 group-hover:rotate-2
                            "
                            loading="lazy"
                        />
                        <div className="
                            absolute inset-0 
                            bg-gradient-to-b from-black/0 to-black/20 
                            opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 ease-in-out
                        "/>
                    </div>
                ) : name ? (
                    <div 
                        className={`
                            flex items-center justify-center 
                            w-full h-full
                            text-white font-semibold
                            transition-transform duration-300 ease-in-out
                            hover:scale-105
                            ${randomColor}
                        `}
                        style={{
                            fontSize: `${Math.max(width * 0.35, 14)}px`,
                            textShadow: '0 1px 2px rgba(0,0,0,0.15)'
                        }}
                    >
                        {avatarName}
                    </div>
                ) : (
                    <div className="
                        flex items-center justify-center 
                        w-full h-full 
                        bg-gray-50 hover:bg-gray-100 
                        dark:bg-gray-800 dark:hover:bg-gray-700
                        transition-colors duration-300 ease-in-out
                    ">
                        <CircleUser    
                            size={width * 0.7}
                            className="text-gray-400 dark:text-gray-500"
                        />
                    </div>
                )}
            </div>

            <div className="
                absolute inset-0 
                rounded-full 
                bg-gradient-to-br from-white/30 via-white/10 to-transparent 
                opacity-0 hover:opacity-100 
                transition-opacity duration-300 ease-in-out
                pointer-events-none
            "/>

            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
        </div>
    );
}

export default Avatar;