import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnnouncementDetail = () => {
  const [announcement, setAnnouncement] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/announcements/${id}`);
        setAnnouncement(res.data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (!announcement) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: announcement.title }} />
      <p className="text-xl text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: announcement.subject }} />
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: announcement.description }} />
    </motion.div>
  );
};

export default AnnouncementDetail;