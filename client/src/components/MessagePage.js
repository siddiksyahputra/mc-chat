import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Image,
  Video,
  X,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import uploadFile from "../helper/uploadFile";
import Avatar from "./Avatar";

const MessagePage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
    lastSeen: new Date(),
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    if (!socketConnection) {
      setError("Connection lost. Trying to reconnect...");
      return;
    }

    socketConnection.emit("message-page", userId);

    const handleMessageUser = (data) => {
      setDataUser(data);
      setError("");
    };

    const handleMessage = (data) => {
      setAllMessages(data);
      setError("");
    };

    const handleError = (error) => {
      setError(error.message || "An error occurred");
    };

    socketConnection.on("message-user", handleMessageUser);
    socketConnection.on("message", handleMessage);
    socketConnection.on("error", handleError);

    return () => {
      socketConnection.off("message-user", handleMessageUser);
      socketConnection.off("message", handleMessage);
      socketConnection.off("error", handleError);
    };
  }, [socketConnection, userId, user?._id]);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => ({ ...prev, text: prev.text + emojiObject.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async () => {
    if (!socketConnection) {
      setError("Cannot send message: No connection");
      return;
    }

    if (!message.text && !message.imageUrl && !message.videoUrl) {
      return;
    }

    setIsLoading(true);
    try {
      socketConnection.emit("new-message", {
        sender: user._id,
        receiver: userId,
        text: message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        msgByUserId: user._id,
      });
      setMessage({ text: "", imageUrl: "", videoUrl: "" });
      setFile(null);
      setPreviewImage(null);
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFile = async (e, type) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (uploadedFile.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setIsLoading(true);
    setFile(uploadedFile);

    try {
      if (type === "image") {
        setPreviewImage(URL.createObjectURL(uploadedFile));
        const upload = await uploadFile(uploadedFile);
        setMessage((prev) => ({ ...prev, imageUrl: upload.url }));
      } else {
        const upload = await uploadFile(uploadedFile);
        setMessage((prev) => ({ ...prev, videoUrl: upload.url }));
      }
    } catch (err) {
      setError("Failed to upload file");
    } finally {
      setIsLoading(false);
      setShowUploadOptions(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setPreviewImage(null);
    setMessage((prev) => ({
      ...prev,
      imageUrl: "",
      videoUrl: "",
    }));
  };

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="flex-none bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 lg:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar
                    width={40}
                    height={40}
                    imageUrl={dataUser.profile_pic}
                    name={dataUser.name}
                    userId={dataUser._id}
                    className="rounded-full ring-2 ring-primary-100"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {dataUser.name === user.name ? dataUser.name + ` (You)` : dataUser.name || "Loading..." }
                  </h3>
                  <p className="text-sm text-gray-500">
                    {dataUser.online ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Messages Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          {allMessages.map((msg, index) => {
            const isSender = msg.msgByUserId === user._id;
            const showAvatar =
              !isSender &&
              (!index || allMessages[index - 1]?.msgByUserId !== msg.msgByUserId);
            const isLastMessage = index === allMessages.length - 1;

            return (
              <div
                key={index}
                className={`flex ${isSender ? "justify-end" : "justify-start"} group`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] transform transition-all duration-200 ease-out ${
                  isLastMessage ? "animate-fade-in-up" : ""
                }`}>
                  {!isSender && (
                    <div className={`flex-shrink-0 w-8 ${!showAvatar && "invisible"}`}>
                      <Avatar
                        width={32}
                        height={32}
                        imageUrl={dataUser.profile_pic}
                        name={dataUser.name}
                        userId={dataUser._id}
                        className="rounded-full ring-2 ring-gray-100 transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div
                    className={`relative flex flex-col ${
                      isSender
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200 
                        ${
                          isSender
                            ? "bg-primary-600 text-white rounded-br-none hover:bg-primary-700"
                            : "bg-white text-gray-900 rounded-bl-none hover:bg-gray-50"
                        }
                        group-hover:shadow-md transform group-hover:-translate-y-0.5
                      `}
                    >
                      {msg.text && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}
                      {msg.imageUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden">
                          <img
                            src={msg.imageUrl}
                            alt="Sent"
                            className="max-h-60 object-cover w-full transition-transform duration-200 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {msg.videoUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden">
                          <video
                            src={msg.videoUrl}
                            controls
                            className="max-h-60 w-full"
                          />
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 mt-1 ${
                        isSender ? "justify-end" : "justify-start"
                      }`}>
                        <span className={`text-xs ${
                          isSender ? "text-primary-100" : "text-gray-400"
                        }`}>
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Section */}
      <div className="flex-none bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          {previewImage && (
            <div className="mb-3">
              <div className="relative inline-block">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-primary-100"
                />
                <button
                  onClick={handleClearFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Smile className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Paperclip className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={message.text}
                onChange={(e) =>
                  setMessage((prev) => ({ ...prev, text: e.target.value }))
                }
                className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />

              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              {showUploadOptions && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 w-48">
                  <div className="p-2 space-y-1">
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                      <input
                        type="file"
                        onChange={(e) => handleUploadFile(e, "image")}
                        accept="image/*"
                        className="hidden"
                      />
                      <Image className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Upload Image</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                      <input
                        type="file"
                        onChange={(e) => handleUploadFile(e, "video")}
                        accept="video/*"
                        className="hidden"
                      />
                      <Video className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Upload Video</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!message.text && !message.imageUrl && !message.videoUrl)}
              className={`p-3 rounded-full transition-all duration-200 ${
                isLoading || (!message.text && !message.imageUrl && !message.videoUrl)
                  ? "bg-primary-200 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 active:scale-95"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Send className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
