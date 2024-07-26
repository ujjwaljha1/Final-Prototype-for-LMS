import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AnnouncementForm = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/announcements', { title, subject, description });
      setTitle('');
      setSubject('');
      setDescription('');
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Error creating announcement');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Announcement</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-semibold">Title:</label>
          <ReactQuill
            value={title}
            onChange={setTitle}
            className="bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-2 font-semibold">Subject:</label>
          <ReactQuill
            value={subject}
            onChange={setSubject}
            className="bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-semibold">Description:</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Create Announcement
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AnnouncementForm;
