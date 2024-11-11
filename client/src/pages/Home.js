import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import { Sidebar } from '../components/Sidebar';
import logo from '../assets/logo.png';
import io from 'socket.io-client'

export const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      
      const response = await axios.get(URL, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.logout) {
        dispatch(logout());
        navigate('/email');
      } else {
        dispatch(setUser(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching user details:", error.response || error);
      // Jika terjadi error, logout paksa
      dispatch(logout());
      navigate('/email');
    }
  };

  // Modifikasi useEffect untuk pengecekan user
  useEffect(() => {
    // Cek apakah user ada dan token tersimpan
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      dispatch(logout());
      navigate('/email');
      return;
    }

    // Fetch user details untuk validasi ulang
    fetchUserDetails();
  }, [user, navigate, dispatch]);

  useEffect(()=>{
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth : {
        token : localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser', (data)=>{
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])

  const basePath = location.pathname === '/';

  return (
    <div className="h-screen max-h-screen bg-primary-50">
      <div className="grid lg:grid-cols-[400px,1fr] h-full">
        <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
          <Sidebar />
        </section>

        <section className={basePath ? 'hidden' : ''}>
          <Outlet />
        </section>

        {basePath && (
          <div className="lg:flex flex-col items-center justify-center hidden">
            <img src={logo} width={250} alt='logo' />
            <p className="mt-4">Select user to send message</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;