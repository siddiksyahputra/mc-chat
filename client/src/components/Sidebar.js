import React, { useEffect, useState } from "react";
import { MessageCircleMore, UserPlus, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { EditUserDetails } from "./EditUserDetails";
import { SearchUser } from "./SearchUser";
import axios from "axios";
import { logout } from "../redux/userSlice";
import toast from "react-hot-toast";

export const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (socketConnection && user?._id) {
      setLoading(true);
      socketConnection.emit("sidebar", user._id.toString());
      socketConnection.on("conversation", (data) => {
        const processedConversations = data.map((conversation) => {
          const otherUser =
            conversation.sender._id === user._id
              ? conversation.receiver
              : conversation.sender;

          return {
            ...conversation,
            otherUser: otherUser,
          };
        });
        setAllUser(processedConversations);
        setLoading(false);
      });
    }
  }, [socketConnection, user?._id]);

  const handleLogout = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`

    try {
        const response = await axios.get(URL, {
            withCredentials: true
        });
        if(response.data.message){
          dispatch(logout());
          navigate('/email')
          localStorage.clear()            
          toast.success(response.data.message)
        }   
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'Logout failed')
    }
};

  const navButtonClasses = `
    w-12 h-12 flex justify-center items-center rounded-full
    hover:bg-primary-50 active:bg-primary-100
    transition-all duration-200 ease-in-out 
    group relative cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-primary-200
    shadow-md hover:shadow-lg
  `;

  const navLinkClasses = ({ isActive }) => `
    ${navButtonClasses}
    ${isActive ? "bg-primary-100 before:bg-primary" : ""} 
    before:content-[''] before:absolute before:left-0 
    before:w-1 before:h-full before:rounded-r-full
    before:transition-all before:duration-200
    hover:before:bg-primary-300
  `;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getOtherUser = (conversation) => {
    return conversation.sender._id === user._id
      ? conversation.receiver
      : conversation.sender;
  };

  return (
    <div className="w-full h-full bg-gray-50 grid grid-cols-[56px,1fr]">
      {/* Sidebar Navigation */}
      <nav
        className="bg-white w-14 h-full rounded-tr-2xl rounded-br-2xl py-8 
                    shadow-lg border-r border-primary-100 flex flex-col justify-between"
      >
        {/* Navigation Links */}
        <div className="space-y-6 px-1">
          <NavLink className={navLinkClasses} title="Chat">
            <MessageCircleMore
              size={24}
              className="text-primary-600 group-hover:text-primary 
                         group-hover:scale-110 transition-transform duration-200"
            />
          </NavLink>
          <div
            onClick={() => setOpenSearchUser(true)}
            className={navButtonClasses}
            title="Add Friends"
          >
            <UserPlus
              size={24}
              className="text-primary-600 group-hover:text-primary 
                         group-hover:scale-110 transition-transform duration-200"
            />
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="flex flex-col items-center gap-8">
          <button
            className="relative group mx-auto p-0.5 rounded-full 
                       transition-all duration-300 
                       hover:ring-2 hover:ring-primary-300 hover:ring-offset-2
                       focus:outline-none focus:ring-2 focus:ring-primary-400"
            title={user.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user.name}
              imageUrl={user.profile_pic}
              userId={user?._id}
              className="rounded-full"
            />
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex justify-center items-center rounded-full 
                     hover:bg-red-50 active:bg-red-100 group 
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-200"
            title="Logout"
          >
            <LogOut
              size={22}
              className="text-primary-400 group-hover:text-red-600 
                         group-hover:scale-110 transition-all duration-200"
            />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full">
        <div className="h-16 flex items-center justify-between border-b border-primary-50 px-8">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>

        {/* User List Container */}
        <div
          className="h-[calc(100vh-64px)] overflow-y-auto 
                       scrollbar-thin scrollbar-thumb-primary-200 
                       scrollbar-track-transparent"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div
                className="w-20 h-20 bg-primary-50 rounded-full 
                             flex items-center justify-center mb-6
                             animate-pulse duration-2000"
              >
                <MessageCircleMore size={32} className="text-primary-400" />
              </div>
              <p className="text-gray-500 text-base max-w-[260px] leading-relaxed">
                Loading conversations...
              </p>
            </div>
          ) : allUser.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div
                className="w-20 h-20 bg-primary-50 rounded-full 
                             flex items-center justify-center mb-6
                             animate-pulse duration-2000"
              >
                <MessageCircleMore size={32} className="text-primary-400" />
              </div>
              <p className="text-gray-500 text-base max-w-[260px] leading-relaxed">
                No conversations yet. Start chatting by adding new friends!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {allUser.map((conv) => {
                const otherUser = getOtherUser(conv);
                const lastMessage = conv.lastMsg;
                const isUnread = conv.unseenMsg > 0;
                const receiver = conv.otherUser._id;

                return (
                  <NavLink
                    to={`/${receiver}`}
                    key={conv._id}
                    className={`p-4 rounded-xl transition-all duration-200
                cursor-pointer group relative flex items-center gap-4
                hover:bg-primary-50 
                ${isUnread ? "border-l-4 border-primary" : ""}`}
                  >
                    {/* User Avatar */}
                    <div className="relative">
                      <Avatar
                        width={48}
                        height={48}
                        name={otherUser.name}
                        imageUrl={otherUser.profile_pic}
                        userId={otherUser._id}
                        className="rounded-full"
                      />
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-medium ${
                            isUnread ? "text-primary" : "text-gray-900"
                          } truncate`}
                        >
                          {otherUser.name === user.name ? otherUser.name + ` (You)` : otherUser.name }
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(lastMessage?.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {lastMessage?.msgByUserId === user._id ? "You: " : ""}
                        {lastMessage?.text}
                        {lastMessage?.imageUrl ? " 📷 image" : ""}
                        {lastMessage?.videoUrl ? " 🎥 video" : ""}
                      </p>
                    </div>

                    {/* Unread Messages Badge */}
                    {conv.unseenMsg > 0 && (
                      <div
                        className="absolute right-4 bottom-6 min-w-[20px] h-5 
                      bg-primary rounded-full flex items-center justify-center
                      px-1.5 py-0.5"
                      >
                        <span className="text-xs font-medium text-white">
                          {conv.unseenMsg}
                        </span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
