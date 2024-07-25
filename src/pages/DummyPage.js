import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const DummyPage = () => {
  const [placements, setPlacements] = useState([]);
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    fetchPlacements();
    fetchHackathons();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/placements');
      setPlacements(response.data);
    } catch (error) {
      console.error('Error fetching placements:', error);
    }
  };

  const fetchHackathons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hackathons');
      setHackathons(response.data);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Placements and Hackathons</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Placements Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Placements</h2>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
          >
            {placements.map((placement) => (
              <div key={placement._id} className="bg-white p-4 rounded-lg shadow-md">
                <img 
                  src={placement.logo} 
                  alt={`${placement.companyName} Logo`} 
                  className="w-full h-40 object-contain mb-4"
                />
                <h3 className="text-lg font-semibold">{placement.companyName}</h3>
                <p>{placement.jobTitle}</p>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Hackathons Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Hackathons</h2>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3}
          >
            {hackathons.map((hackathon) => (
              <div key={hackathon._id} className="bg-white p-4 rounded-lg shadow-md">
                <img 
                  src={hackathon.bannerLogoLink} 
                  alt={`${hackathon.instituteOrCompany} Banner`} 
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{hackathon.instituteOrCompany}</h3>
                <p>{hackathon.eventType} Event</p>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default DummyPage;