// import DOMPurify from 'dompurify';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';

// const PlacementPage = () => {
//   const [formData, setFormData] = useState({
//     companyName: '',
//     jobTitle: '',
//     description: '',
//     responsibility: '',
//     graduationYear: '',
//     logo: '',
//     jobType: 'Offline',
//     jobLocation: '',
//     companyWebsite: '',
//     jobApplyUrl: '',
//     startDate: '',
//     endDate: ''
//   });

//   const [placements, setPlacements] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchPlacements();
//   }, []);

//   const fetchPlacements = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get('http://localhost:5000/api/placements');
//       setPlacements(response.data);
//     } catch (error) {
//       console.error('Error fetching placements:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const sanitizeHTML = (html) => {
//     return {
//       __html: DOMPurify.sanitize(html)
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`http://localhost:5000/api/placements/${editingId}`, formData);
//       } else {
//         await axios.post('http://localhost:5000/api/placements', formData);
//       }
//       fetchPlacements();
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting placement:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/placements/${id}`);
//       fetchPlacements();
//     } catch (error) {
//       console.error('Error deleting placement:', error);
//     }
//   };

//   const handleEdit = (placement) => {
//     setEditingId(placement._id);
//     setFormData({
//       companyName: placement.companyName,
//       jobTitle: placement.jobTitle,
//       description: placement.description,
//       responsibility: placement.responsibility,
//       graduationYear: placement.graduationYear,
//       logo: placement.logo,
//       jobType: placement.jobType,
//       jobLocation: placement.jobLocation,
//       companyWebsite: placement.companyWebsite,
//       jobApplyUrl: placement.jobApplyUrl,
//       startDate: placement.startDate.slice(0, 16),
//       endDate: placement.endDate.slice(0, 16)
//     });
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       companyName: '',
//       jobTitle: '',
//       description: '',
//       responsibility: '',
//       graduationYear: '',
//       logo: '',
//       jobType: 'Offline',
//       jobLocation: '',
//       companyWebsite: '',
//       jobApplyUrl: '',
//       startDate: '',
//       endDate: ''
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.h1 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-4xl font-bold mb-8 text-center text-blue-600"
//       >
//         {editingId ? 'Edit' : 'Create New'} Placement
//       </motion.h1>
//       <motion.form 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         onSubmit={handleSubmit} 
//         className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Company Name</label>
//             <input
//               type="text"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Job Title</label>
//             <input
//               type="text"
//               name="jobTitle"
//               value={formData.jobTitle}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div className="col-span-2">
//             <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="4"
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div className="col-span-2">
//             <label className="block mb-2 text-sm font-medium text-gray-700">Responsibility</label>
//             <textarea
//               name="responsibility"
//               value={formData.responsibility}
//               onChange={handleChange}
//               rows="4"
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Graduation Year(s)</label>
//             <input
//               type="text"
//               name="graduationYear"
//               value={formData.graduationYear}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Company Logo URL</label>
//             <input
//               type="url"
//               name="logo"
//               value={formData.logo}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="https://example.com/logo.png"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Job Type</label>
//             <select
//               name="jobType"
//               value={formData.jobType}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               <option value="Offline">Offline</option>
//               <option value="Online">Online</option>
//               <option value="Hybrid">Hybrid</option>
//             </select>
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Job Location</label>
//             <input
//               type="text"
//               name="jobLocation"
//               value={formData.jobLocation}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Company Website</label>
//             <input
//               type="url"
//               name="companyWebsite"
//               value={formData.companyWebsite}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Job Apply URL</label>
//             <input
//               type="url"
//               name="jobApplyUrl"
//               value={formData.jobApplyUrl}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
//             <input
//               type="datetime-local"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
//             <input
//               type="datetime-local"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//         </div>
//         <div className="mt-8 flex justify-center">
//           <motion.button 
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit" 
//             className="bg-blue-600 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
//           >
//             {editingId ? 'Update' : 'Submit'}
//           </motion.button>
//           {editingId && (
//             <motion.button 
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="button" 
//               onClick={resetForm} 
//               className="ml-4 bg-gray-500 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-gray-600 transition duration-300"
//             >
//               Cancel
//             </motion.button>
//           )}
//         </div>
//       </motion.form>
//       <motion.h2 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="text-3xl font-semibold mb-6 text-center text-blue-600"
//       >
//         Saved Placements
//       </motion.h2>
//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {placements.map((placement) => (
//             <motion.div 
//               key={placement._id} 
//               className="bg-white shadow-lg rounded-lg overflow-hidden"
//               whileHover={{ scale: 1.03 }}
//               transition={{ duration: 0.2 }}
//             >
//               <img 
//                 src={placement.logo || 'https://via.placeholder.com/300x150?text=No+Logo'} 
//                 alt={`${placement.companyName} Logo`} 
//                 className="w-full h-48 object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/300x150?text=Error+Loading+Image';
//                 }}
//               />
//               <div className="p-6">
//                 <h3 className="text-2xl font-bold mb-2 text-blue-600">{placement.jobTitle}</h3>
//                 <p className="text-xl text-gray-700 mb-4">{placement.companyName}</p>
//                 <div
//                   className="text-gray-600 mb-4"
//                   dangerouslySetInnerHTML={sanitizeHTML(placement.description)}
//                 />
//                 <div
//                   className="text-gray-600 mb-4"
//                   dangerouslySetInnerHTML={sanitizeHTML(`<strong>Responsibilities:</strong> ${placement.responsibility}`)}
//                 />
//                 <p className="text-gray-600 mb-2"><strong>Job Type:</strong> {placement.jobType}</p>
//                 <p className="text-gray-600 mb-2"><strong>Location:</strong> {placement.jobLocation || 'N/A'}</p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Website:</strong> <a href={placement.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{placement.companyWebsite}</a>
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Apply URL:</strong> <a href={placement.jobApplyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{placement.jobApplyUrl}</a>
//                 </p>
//                 <p className="text-gray-600 mb-2"><strong>Start Date:</strong> {new Date(placement.startDate).toLocaleString()}</p>
//                 <p className="text-gray-600 mb-2"><strong>End Date:</strong> {new Date(placement.endDate).toLocaleString()}</p>
//                 <div className="flex space-x-4 mt-6">
//                   <motion.button 
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleEdit(placement)} 
//                     className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
//                   >
//                     Edit
//                   </motion.button>
//                   <motion.button 
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleDelete(placement._id)} 
//                     className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
//                   >
//                     Delete
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//           </motion.div>
//       )}
//     </div>
//   );
// };

// export default PlacementPage;


import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const PlacementPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    description: '',
    responsibility: '',
    graduationYear: '',
    logo: '',
    jobType: 'Offline',
    jobLocation: '',
    companyWebsite: '',
    jobApplyUrl: '',
    startDate: '',
    endDate: ''
  });

  const [placements, setPlacements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/placements');
      setPlacements(response.data);
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/placements/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/placements', formData);
      }
      fetchPlacements();
      resetForm();
    } catch (error) {
      console.error('Error submitting placement:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/placements/${id}`);
      fetchPlacements();
    } catch (error) {
      console.error('Error deleting placement:', error);
    }
  };

  const handleEdit = (placement) => {
    setEditingId(placement._id);
    setFormData({
      companyName: placement.companyName,
      jobTitle: placement.jobTitle,
      description: placement.description,
      responsibility: placement.responsibility,
      graduationYear: placement.graduationYear,
      logo: placement.logo,
      jobType: placement.jobType,
      jobLocation: placement.jobLocation,
      companyWebsite: placement.companyWebsite,
      jobApplyUrl: placement.jobApplyUrl,
      startDate: placement.startDate.slice(0, 16),
      endDate: placement.endDate.slice(0, 16)
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      companyName: '',
      jobTitle: '',
      description: '',
      responsibility: '',
      graduationYear: '',
      logo: '',
      jobType: 'Offline',
      jobLocation: '',
      companyWebsite: '',
      jobApplyUrl: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center text-blue-600"
      >
        {editingId ? 'Edit' : 'Create New'} Placement
      </motion.h1>
      <motion.form 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">Responsibility</label>
            <textarea
              name="responsibility"
              value={formData.responsibility}
              onChange={handleChange}
              rows="4"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Graduation Year(s)</label>
            <input
              type="text"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Company Logo URL</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Job Location</label>
            <input
              type="text"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Company Website</label>
            <input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Job Apply URL</label>
            <input
              type="url"
              name="jobApplyUrl"
              value={formData.jobApplyUrl}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="bg-blue-600 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            {editingId ? 'Update' : 'Submit'}
          </motion.button>
          {editingId && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={resetForm} 
              className="ml-4 bg-gray-500 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </motion.form>
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-semibold mb-6 text-center text-blue-600"
      >
        Saved Placements
      </motion.h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {placements.map((placement) => (
            <motion.div 
              key={placement._id} 
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={placement.logo || 'https://via.placeholder.com/300x150?text=No+Logo'} 
                alt={`${placement.companyName} Logo`} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x150?text=Error+Loading+Image';
                }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-blue-600">{placement.jobTitle}</h3>
                <p className="text-xl text-gray-700 mb-4">{placement.companyName}</p>
                <div
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={sanitizeHTML(placement.description)}
                />
                <div
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={sanitizeHTML(`<strong>Responsibilities:</strong> ${placement.responsibility}`)}
                />
                <p className="text-gray-600 mb-2"><strong>Job Type:</strong> {placement.jobType}</p>
                <p className="text-gray-600 mb-2"><strong>Location:</strong> {placement.jobLocation || 'N/A'}</p>
                <p className="text-gray-600 mb-2">
                  <strong>Website:</strong> <a href={placement.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{placement.companyWebsite}</a>
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Apply URL:</strong> <a href={placement.jobApplyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{placement.jobApplyUrl}</a>
                </p>
                <p className="text-gray-600 mb-2"><strong>Start Date:</strong> {new Date(placement.startDate).toLocaleString()}</p>
                <p className="text-gray-600 mb-2"><strong>End Date:</strong> {new Date(placement.endDate).toLocaleString()}</p>
                <div className="flex space-x-4 mt-6">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(placement)} 
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(placement._id)} 
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
          </motion.div>
      )}
    </div>
  );
};

export default PlacementPage;