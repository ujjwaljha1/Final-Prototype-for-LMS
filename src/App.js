import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminPanel from './pages/AdminPanel';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import Adminpage from './pages/Adminpage';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import ViewUsers from './pages/Users';
import PlacementPage from './pages/PlacementPage';
import HackathonPage from './pages/Hackathon';
import EventsPage from './pages/EventsPage'; // Import the new EventsPage
import DummyPage from './pages/DummyPage';
import UserProfile from './pages/UserProfile';
import AnnouncementList from './pages/AnnouncementList';
import AnnouncementForm from './pages/AnnouncementForm';
import AnnouncementDetail from './pages/AnnouncementDetail';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // After 2 seconds, set loading to false
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path='/adminpage' element={<ProtectedRoute element={<Adminpage />} admin />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} admin />} />
          <Route path="/hackathons" element={<ProtectedRoute element={<HackathonPage />} admin />} />
          <Route path="/:slug" element={<CategoryPage/>} />
          <Route path='/placement' element={<PlacementPage/>}/>
          <Route path="/user" element={<ViewUsers/>}/>
          <Route path="/events" element={<EventsPage />} /> // Add this new route for the EventsPage
          <Route path="/dummy" element={<DummyPage/>}/>
          <Route path='/announcementlist' element={<ProtectedRoute element={<AnnouncementList/>}admin/>}/>
          <Route path='/createAnnouncement' element={<ProtectedRoute element={<AnnouncementForm/>} admin/>}/>
          <Route path='/announcement/:id' element={<AnnouncementDetail/>}/>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/profile" element={<UserProfile/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;