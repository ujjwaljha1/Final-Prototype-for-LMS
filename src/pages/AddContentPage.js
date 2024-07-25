import React, { useState } from 'react';
import axios from 'axios';

const AddContentPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [videos, setVideos] = useState('');
  const [links, setLinks] = useState('');

  const handleAddContent = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      images: images.split(',').map((img) => img.trim()),
      videos: videos.split(',').map((video) => video.trim()),
      links: links.split(',').map((link) => link.trim()),
    };
    try {
      await axios.post('http://localhost:5000/api/content', data);
      alert('Content added successfully');
    } catch (error) {
      console.error('Error adding content', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Add Content</h1>
      <form onSubmit={handleAddContent}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Images (comma-separated URLs)</label>
          <input
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Videos (comma-separated URLs)</label>
          <input
            type="text"
            value={videos}
            onChange={(e) => setVideos(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Links (comma-separated URLs)</label>
          <input
            type="text"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Content</button>
      </form>
    </div>
  );
};

export default AddContentPage;
