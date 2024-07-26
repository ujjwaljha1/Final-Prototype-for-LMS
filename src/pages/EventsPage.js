// src/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaMapMarkerAlt, FaBuilding, FaCode, FaFilter, FaGraduationCap, FaBriefcase, FaGlobe } from 'react-icons/fa';
import EventDetails from '../components/EventDetails';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('hackathons');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    jobLocation: '',
    eventType: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/${activeTab}`);
      setEvents(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const filteredEvents = events.filter(event => {
    const searchableText = activeTab === 'hackathons' 
      ? `${event.instituteOrCompany || ''} ${event.description || ''}`
      : `${event.companyName || ''} ${event.jobTitle || ''} ${event.description || ''}`;
    
    const matchesSearch = searchableText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJobType = activeTab === 'placements' ? (filters.jobType === '' || event.jobType === filters.jobType) : true;
    const matchesJobLocation = activeTab === 'placements' ? (filters.jobLocation === '' || event.jobLocation === filters.jobLocation) : true;
    const matchesEventType = activeTab === 'hackathons' ? (filters.eventType === '' || event.eventType === filters.eventType) : true;
    const matchesGraduationYear = filters.graduationYear === '' || event.graduationYear === filters.graduationYear;

    return matchesSearch && matchesJobType && matchesJobLocation && matchesEventType && matchesGraduationYear;
  });

  const renderFilterOptions = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-2 gap-4 mt-4">
        {activeTab === 'placements' && (
          <>
            <select
              className="p-2 border rounded"
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
            <select
              className="p-2 border rounded"
              value={filters.jobLocation}
              onChange={(e) => handleFilterChange('jobLocation', e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </>
        )}
        {activeTab === 'hackathons' && (
          <select
            className="p-2 border rounded"
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
          >
            <option value="">All Event Types</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        )}
        <select
          className="p-2 border rounded"
          value={filters.graduationYear}
          onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
        >
          <option value="">All Graduation Years</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-1/3 bg-white shadow-lg overflow-hidden"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">Events</h2>
          <div className="flex mb-6 space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                activeTab === 'hackathons' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('hackathons')}
            >
              <FaCode className="inline mr-2" /> Hackathons
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                activeTab === 'placements' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('placements')}
            >
              <FaBuilding className="inline mr-2" /> Placements
            </motion.button>
          </div>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
            </button>
          </div>
          {renderFilterOptions()}
          <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-380px)]">
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.li
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedEvent && selectedEvent._id === event._id
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => handleEventClick(event)}
                  >
                    <h3 className="font-bold text-lg text-indigo-700 mb-2">
                      {activeTab === 'hackathons' ? (event.instituteOrCompany || 'Untitled Event') : (event.jobTitle || 'Untitled Job')}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <FaBuilding className="inline mr-2" />
                      {activeTab === 'hackathons' ? (event.instituteOrCompany || 'Unknown Organization') : (event.companyName || 'Unknown Company')}
                    </p>
                    {activeTab === 'placements' && (
                      <>
                        <p className="text-gray-600 text-sm mb-1">
                          <FaBriefcase className="inline mr-2" />
                          {event.jobType || 'Job Type Not Specified'}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          <FaMapMarkerAlt className="inline mr-2" />
                          {event.jobLocation || 'Location Not Specified'}
                        </p>
                      </>
                    )}
                    {activeTab === 'hackathons' && (
                      <p className="text-gray-600 text-sm mb-1">
                        <FaGlobe className="inline mr-2" />
                        {event.eventType || 'Event Type Not Specified'}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">
                      <FaGraduationCap className="inline mr-2" />
                      Graduation Year: {event.graduationYear || 'Not Specified'}
                    </p>
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedEvent ? (
            <motion.div
              key={selectedEvent._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EventDetails event={selectedEvent} eventType={activeTab} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <p className="text-2xl text-gray-500">Select an event to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventsPage;