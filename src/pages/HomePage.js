import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Book, ChevronRight } from 'lucide-react';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#4A90E2]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to LearnHub
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center text-gray-600 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore our wide range of categories and start your learning journey today!
        </motion.p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4A90E2]"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => (
              <motion.div key={category._id} variants={itemVariants}>
                <Link 
                  to={`/${category.slug}`} 
                  className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Book className="w-8 h-8 text-[#50E3C2]" />
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-[#333333]">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] h-2"></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HomePage;