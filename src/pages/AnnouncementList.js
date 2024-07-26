import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/announcements');
        setAnnouncements(res.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Announcements</h2>
      {announcements.map((announcement, index) => (
        <motion.div
          key={announcement._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition duration-300"
        >
          <h3 className="text-xl font-semibold mb-2" dangerouslySetInnerHTML={{ __html: announcement.title }} />
          <p className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: announcement.subject }} />
          <Link
            to={`/announcement/${announcement._id}`}
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Read More
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnnouncementList;