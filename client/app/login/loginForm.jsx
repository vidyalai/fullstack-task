"use client"
import React, { useState } from 'react';
import InputField from '../components/TextInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import baseUrl from '../utils/baseUrl';
import Link from 'next/link';
import showAlert from '../utils/showAlert';


export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // showAlert()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit =async (e) => {
    
    
    e.preventDefault();
    let res = await fetch(`${baseUrl}/user/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
    let data = await res.json();
    if(res.status=="201"){
        sessionStorage.setItem("token",data.token)
        alert(data.message)
        window.location.href="/my-files"
        
    }
    else if(res.status=="500"){alert("sorry, currently we are not able to process your request, please try after some time.")}
    else if(res.status=="404"){alert(data.message);
      window.location.href="/register"
    }
    else {alert(data.message)}
    
};

  return (
  <form onSubmit={handleSubmit} className="max-w-mdw-full bg-white dark:bg-zinc-800 rounded-xl p-8  shadow-md">
  <h1   className="text-2xl font-bold text-center mb-4">Sign In</h1>
      
      <GoogleAuthButton/>
      <p  className='text-center '>or</p>
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        id="email"
        name="email"
      />
      <InputField
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        id="password"
        name="password"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        submit
      </button>
      <Link href="/register">
      <p className="text-blue-500 underline text-left text-xs mt-6 cursor-pointer">
         Don't have an account? Please sign up.
      </p>
      </Link>
    </form>
  );
}
