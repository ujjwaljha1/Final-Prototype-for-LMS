import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const Adminpage = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Add', path: '/admin' },
          { title: 'Placement', path: '/placement' },
          { title: 'Hackathons', path: '/hackathons' },
          {title: 'User Management',path:'/user'}
        ].map((item) => (
          <motion.div
            key={item.title}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRedirect(item.path)}
          >
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">{item.title}</h3>
              <p className="text-gray-600">Click to navigate to the {item.title.toLowerCase()} section.</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Adminpage;
