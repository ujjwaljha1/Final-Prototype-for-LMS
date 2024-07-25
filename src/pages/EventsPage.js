// src/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import EventDetails from '../components/EventDetails';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('hackathons');

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${activeTab}`);
      setEvents(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-1/4 bg-white shadow-lg"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Events</h2>
          <div className="flex mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === 'hackathons' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('hackathons')}
            >
              Hackathons
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === 'placements' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('placements')}
            >
              Placements
            </button>
          </div>
          <ul>
            <AnimatePresence>
              {events.map((event) => (
                <motion.li
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2"
                >
                  <button
                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleEventClick(event)}
                  >
                    {activeTab === 'hackathons' ? event.instituteOrCompany : event.companyName}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <AnimatePresence>
          {selectedEvent ? (
            <EventDetails key={selectedEvent._id} event={selectedEvent} eventType={activeTab} />
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