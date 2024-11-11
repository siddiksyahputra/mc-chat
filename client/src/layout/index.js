import React from 'react';
import logo from '../assets/logo.png';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col">
      <header className='bg-white shadow-sm'>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-20">
            <img
              src={logo}
              alt='Mc Chat Logo'
              width={250}
              height={60}
              className="object-contain"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;