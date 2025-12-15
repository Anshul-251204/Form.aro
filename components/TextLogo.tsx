import React from 'react';

const FormAroLogo = ({ size = "text-4xl" }) => {
  return (
    <div className={`font-sans font-bold tracking-tighter ${size} select-none`}>
      {/* 'Form' with a deep blue/indigo gradient */}
      <span className="text-blue-600">
        Form
      </span>

      {/* The 'Dot' in a contrasting vibrant orange/amber */}
      <span className="bg-orange-500 inline-block size-2 rounded-full mx-[3px]"></span>

      {/* 'aro' continuing the gradient flow or slightly lighter */}
      <span className=" bg-linear-to-r from-blue-500  via-blue-800 to-blue-900 bg-clip-text text-transparent  ">
        aro
      </span>
    </div>
  );
};

export default FormAroLogo;