// src/components/EventDetails.js
import React from 'react';
import { motion } from 'framer-motion';

const EventDetails = ({ event, eventType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <motion.img
        src={eventType === 'hackathons' ? event.bannerLogoLink : event.logo}
        alt={eventType === 'hackathons' ? event.instituteOrCompany : event.companyName}
        className="w-full h-48 object-cover rounded-lg mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h2
        className="text-3xl font-bold mb-4"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {eventType === 'hackathons' ? event.instituteOrCompany : event.companyName}
      </motion.h2>
      {eventType === 'hackathons' ? (
        <HackathonDetails event={event} />
      ) : (
        <PlacementDetails event={event} />
      )}
    </motion.div>
  );
};

const HackathonDetails = ({ event }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
    <p className="mb-2"><strong>Event Type:</strong> {event.eventType}</p>
    <div className="mb-2"><strong>Description:</strong> <div dangerouslySetInnerHTML={{ __html: event.description }} /></div>
    <p className="mb-2"><strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
    <p className="mb-2"><strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}</p>
    <p className="mb-2">
      <strong>Registration Link:</strong>{' '}
      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        Register Here
      </a>
    </p>
    {event.graduationYear && (
      <p className="mb-2"><strong>Graduation Year:</strong> {event.graduationYear}</p>
    )}
  </motion.div>
);

const PlacementDetails = ({ event }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
    <p className="mb-2"><strong>Job Title:</strong> {event.jobTitle}</p>
    <div className="mb-2"><strong>Description:</strong> <div dangerouslySetInnerHTML={{ __html: event.description }} /></div>
    <p className="mb-2"><strong>Responsibility:</strong> {event.responsibility}</p>
    <p className="mb-2"><strong>Job Type:</strong> {event.jobType}</p>
    <p className="mb-2"><strong>Location:</strong> {event.jobLocation}</p>
    <p className="mb-2"><strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
    <p className="mb-2"><strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}</p>
    <p className="mb-2">
      <strong>Company Website:</strong>{' '}
      <a href={event.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        Visit Website
      </a>
    </p>
    <p className="mb-2">
      <strong>Apply:</strong>{' '}
      <a href={event.jobApplyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        Apply Here
      </a>
    </p>
    {event.graduationYear && (
      <p className="mb-2"><strong>Graduation Year:</strong> {event.graduationYear}</p>
    )}
  </motion.div>
);

export default EventDetails;
