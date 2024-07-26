import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase, Code, Users, Bell, Calendar, List, User } from 'lucide-react';
import 'tailwindcss/tailwind.css';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  const adminItems = [
    { title: 'Add', path: '/admin', icon: UserPlus },
    { title: 'Placement', path: '/placement', icon: Briefcase },
    { title: 'Hackathons', path: '/hackathons', icon: Code },
    { title: 'User Management', path: '/user', icon: Users },
    { title: "Announcement", path: '/createannouncement', icon: Bell },
    { title: "Event Page", path: "/events", icon: Calendar },
    { title: "Announcement list", path: "/announcementlist", icon: List },
    { title: "Profile view", path: "/profile", icon: User }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminItems.map((item) => (
            <motion.div
              key={item.title}
              className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-2xl"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRedirect(item.path)}
            >
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <motion.div
                  className="text-indigo-600 mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {React.createElement(item.icon, { size: 48 })}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">Manage {item.title.toLowerCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;