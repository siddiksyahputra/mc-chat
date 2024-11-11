import React from 'react';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';

export const UserCard = ({ user, onViewProfile, onClose }) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate(`/${user._id}`);
    onClose?.();
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300 border border-primary-100/50">
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        <Avatar
          width={56}
          height={56}
          name={user?.name}
          imageUrl={user.profile_pic}
          userId={user?._id}
          className="rounded-full ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-300"
        />
      </div>

      {/* User Info Section */}
      <div className="flex-grow min-w-0">
        <h2 className="text-lg font-semibold text-gray-800 truncate hover:text-primary-600 transition-colors duration-300">
          {user?.name}
        </h2>
        <p className="text-sm text-gray-500 truncate">{user?.email}</p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleMessageClick}
            className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-300 hover:shadow-md"
          >
            Message
          </button>
          <button 
            onClick={onViewProfile}
            className="px-3 py-1.5 text-xs font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-300"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};
