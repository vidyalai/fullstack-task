"use client"
import React from 'react';
import Router from 'next/router';
import Image from 'next/image';

export default function GoogleAuthButton() {
  const handleClick = () => {
    // Here you can handle any other logic you need to run on click
    // ...
    
    // Redirecting to the specified URL
    window.location.href="https://www.google.com/"
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center mt-2 mb-2 p-2 w-full border border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 focus:outline-none focus:border-blue-500 transition"
    >
      <Image
        src="/images/google.png" // The path is relative to the public folder
        alt="Google"
        style={{marginRight:"10px"}}
        width={30}  // Set the width as needed
        height={30} // Set the height as needed
      />
      continue with Google
    </button>
  );
}
