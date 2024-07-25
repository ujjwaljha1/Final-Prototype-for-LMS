

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import axios from 'axios';

const HackathonPage = () => {
  const [formData, setFormData] = useState({
    instituteOrCompany: '',
    eventType: 'online',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    bannerLogoLink: '',
    registrationLink: '',
    graduationYear: ''
  });

  const [hackathons, setHackathons] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hackathons');
      setHackathons(response.data);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/hackathons/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/hackathons', formData);
      }
      fetchHackathons();
      resetForm();
    } catch (error) {
      console.error('Error submitting hackathon:', error);
    }
  };

  const handleEdit = (hackathon) => {
    setFormData({
      ...hackathon,
      startTime: format(new Date(hackathon.startDate), 'HH:mm'),
      endTime: format(new Date(hackathon.endDate), 'HH:mm'),
      startDate: format(new Date(hackathon.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(hackathon.endDate), 'yyyy-MM-dd'),
    });
    setIsEditing(true);
    setEditingId(hackathon._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hackathons/${id}`);
      fetchHackathons();
    } catch (error) {
      console.error('Error deleting hackathon:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      instituteOrCompany: '',
      eventType: 'online',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      bannerLogoLink: '',
      registrationLink: '',
      graduationYear: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-blue-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hackathon Management
      </motion.h1>

      <motion.form 
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instituteOrCompany">
            Institute or Company
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="instituteOrCompany"
            type="text"
            name="instituteOrCompany"
            value={formData.instituteOrCompany}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Event Type
          </label>
          <div>
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="eventType"
                value="online"
                checked={formData.eventType === 'online'}
                onChange={handleInputChange}
                className="form-radio"
              />
              <span className="ml-2">Online</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="eventType"
                value="offline"
                checked={formData.eventType === 'offline'}
                onChange={handleInputChange}
                className="form-radio"
              />
              <span className="ml-2">Offline</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
              Start Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
              End Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
              End Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bannerLogoLink">
            Banner Logo Link
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bannerLogoLink"
            type="url"
            name="bannerLogoLink"
            value={formData.bannerLogoLink}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationLink">
            Registration Link
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="registrationLink"
            type="url"
            name="registrationLink"
            value={formData.registrationLink}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="graduationYear">
            Graduation Year
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="graduationYear"
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEditing ? 'Update Hackathon' : 'Add Hackathon'}
          </button>
          {isEditing && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => resetForm()}
            >
              Cancel
            </button>
          )}
        </div>
      </motion.form>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl font-bold mb-4">Hackathons List</h2>
        {hackathons.length > 0 ? (
          hackathons.map((hackathon) => (
            <div key={hackathon._id} className="mb-4">
              <h3 className="text-xl font-semibold">{hackathon.instituteOrCompany}</h3>
              <p className="text-gray-700">{hackathon.eventType}</p>
              <p className="text-gray-700">
                <strong>Description:</strong>
                <div dangerouslySetInnerHTML={{ __html: hackathon.description }} />
              </p>
              <p className="text-gray-700">
                <strong>Start:</strong> {format(new Date(hackathon.startDate), 'yyyy-MM-dd')} at {hackathon.startTime}
              </p>
              <p className="text-gray-700">
                <strong>End:</strong> {format(new Date(hackathon.endDate), 'yyyy-MM-dd')} at {hackathon.endTime}
              </p>
              <p className="text-gray-700">
                <strong>Banner Logo:</strong> <a href={hackathon.bannerLogoLink} target="_blank" rel="noopener noreferrer">View</a>
              </p>
              <p className="text-gray-700">
                <strong>Registration Link:</strong> <a href={hackathon.registrationLink} target="_blank" rel="noopener noreferrer">Register</a>
              </p>
              {hackathon.graduationYear && (
                <p className="text-gray-700">
                  <strong>Graduation Year:</strong> {hackathon.graduationYear}
                </p>
              )}
              <button
                onClick={() => handleEdit(hackathon)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(hackathon._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No hackathons found.</p>
        )}
      </div>
    </div>
  );
};

export default HackathonPage;
