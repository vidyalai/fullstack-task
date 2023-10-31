import React from 'react';

const Button = ({ label, onClick, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
