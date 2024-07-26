import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaFileUpload } from 'react-icons/fa';
import collegeData from './college.json';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    alternativeEmail: '',
    institute: '',
    graduationYear: '',
    course: '',
    linkedinUrl: '',
    githubUrl: '',
    resume: null,
    workExperiences: []
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Remove token handling
      const response = await axios.get('http://localhost:5000/api/users/profile');
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Remove navigation to login
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'workExperiences') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'resume' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      await axios.put('http://localhost:5000/api/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updatedExperiences = formData.workExperiences.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setFormData(prevState => ({
      ...prevState,
      workExperiences: updatedExperiences
    }));
  };

  const addWorkExperience = () => {
    setFormData(prevState => ({
      ...prevState,
      workExperiences: [
        ...prevState.workExperiences,
        { companyName: '', joinedOn: '', leftOn: '', currentlyWorking: false }
      ]
    }));
  };

  const removeWorkExperience = (index) => {
    setFormData(prevState => ({
      ...prevState,
      workExperiences: prevState.workExperiences.filter((_, i) => i !== index)
    }));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      {!editing ? (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Name:</strong> {user.name || 'Not set'}</p>
          <p><strong>Joined on:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <p><strong>Institute:</strong> {user.institute || 'Not set'}</p>
          <p><strong>Graduation Year:</strong> {user.graduationYear || 'Not set'}</p>
          <p><strong>Course:</strong> {user.course || 'Not set'}</p>
          <p>
            <strong>LinkedIn:</strong> 
            {user.linkedinUrl ? (
              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                <FaLinkedin className="inline mr-1" /> Profile
              </a>
            ) : 'Not set'}
          </p>
          <p>
            <strong>GitHub:</strong> 
            {user.githubUrl ? (
              <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <FaGithub className="inline mr-1" /> Profile
              </a>
            ) : 'Not set'}
          </p>
          <h2 className="text-2xl font-bold mt-4 mb-2">Work Experience</h2>
          {user.workExperiences && user.workExperiences.length > 0 ? (
            user.workExperiences.map((exp, index) => (
              <motion.div 
                key={index} 
                className="mb-2 p-2 bg-gray-100 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <p><strong>Company:</strong> {exp.companyName}</p>
                <p><strong>Joined:</strong> {exp.joinedOn}</p>
                <p><strong>Left:</strong> {exp.currentlyWorking ? 'Currently Working' : exp.leftOn}</p>
              </motion.div>
            ))
          ) : (
            <p>No work experience added</p>
          )}
          <motion.button
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit Profile
          </motion.button>
        </motion.div>
      ) : (
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label className="block">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Alternative Email:</label>
            <input
              type="email"
              name="alternativeEmail"
              value={formData.alternativeEmail}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Institute:</label>
            <select
              name="institute"
              value={formData.institute}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Institute</option>
              {collegeData.map((college, index) => (
                <option key={index} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Graduation Year:</label>
            <select
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Year</option>
              {Array.from({ length: 2027 - 1975 + 1 }, (_, i) => 1975 + i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Course:</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">LinkedIn URL:</label>
            <div className="flex items-center">
              <FaLinkedin className="mr-2 text-blue-500" />
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block">GitHub URL:</label>
            <div className="flex items-center">
              <FaGithub className="mr-2 text-gray-700" />
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block">Profile Picture:</label>
            <div className="flex items-center">
              <FaFileUpload className="mr-2 text-gray-500" />
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileUpload}
                accept="image/*"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block">Resume:</label>
            <div className="flex items-center">
              <FaFileUpload className="mr-2 text-gray-500" />
              <input
                type="file"
                name="resume"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Work Experience</h2>
          {formData.workExperiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-4 border rounded bg-gray-50"
            >
              <div>
                <label className="block">Company Name:</label>
                <input
                  type="text"
                  value={exp.companyName}
                  onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Joined On:</label>
                <input
                  type="date"
                  value={exp.joinedOn}
                  onChange={(e) => handleWorkExperienceChange(index, 'joinedOn', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {!exp.currentlyWorking && (
                <div>
                  <label className="block">Left On:</label>
                  <input
                    type="date"
                    value={exp.leftOn}
                    onChange={(e) => handleWorkExperienceChange(index, 'leftOn', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) => handleWorkExperienceChange(index, 'currentlyWorking', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Currently Working</span>
                </label>
              </div>
              <motion.button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove
              </motion.button>
            </motion.div>
          ))}
          <motion.button
            type="button"
            onClick={addWorkExperience}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Work Experience
          </motion.button>
          <div>
            <motion.button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default UserProfile;