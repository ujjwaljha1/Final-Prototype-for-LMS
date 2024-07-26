import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Home,
  Briefcase,
  Info,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/verifyToken",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsAdmin(response.data.user.isAdmin);
        setIsAuthenticated(true);
        setProfile(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/announcements"
        );
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setProfile(null);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const navItems = [
    { path: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    {
      path: "/careers",
      icon: <Briefcase className="w-5 h-5" />,
      label: "Careers",
    },
    { path: "/about", icon: <Info className="w-5 h-5" />, label: "About" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] p-4 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/path-to-your-logo.png"
              alt="LearnHub Logo"
              className="w-10 h-10 mr-2"
            />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-300">
              knowfinity
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center hover:text-[#F5A623] transition duration-300 ${
                  location.pathname === item.path ? "text-[#F5A623]" : ""
                }`}
              >
                {item.icon}
                <span className="ml-1">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white bg-opacity-20 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            </form>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-[#F5A623] transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#F5A623] text-[#4A90E2] px-4 py-2 rounded-full hover:bg-yellow-400 transition duration-300 shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div
                  className="relative"
                  onMouseEnter={() => setShowNotifications(true)}
                  onMouseLeave={() => setShowNotifications(false)}
                  ref={notificationsRef}
                >
                  <motion.button
                    className="text-xl focus:outline-none relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-6 h-6" />
                    {notifications.some((n) => !n.read) && (
                      <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-md shadow-lg py-2 max-h-80 overflow-y-auto"
                      >
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <div
                              key={notification._id}
                              className={`px-4 py-2 ${
                                notification.read ? "opacity-50" : ""
                              } ${
                                index > 0 ? "border-t border-gray-300" : ""
                              } hover:bg-gray-100 transition duration-300`}
                            >
                              <h3
                                className="font-semibold"
                                dangerouslySetInnerHTML={{
                                  __html: notification.title,
                                }}
                              />
                              <p
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                  __html: notification.description,
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-center">
                            No notifications
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  ref={dropdownRef}
                >
                  <motion.button
                    className="flex items-center space-x-2 focus:outline-none"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={profile?.avatar || "https://via.placeholder.com/40"}
                      alt="Profile Avatar"
                      className="w-10 h-10 rounded-full border-2 border-[#F5A623] object-cover"
                    />
                    <span>{profile?.name}</span>
                  </motion.button>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 overflow-hidden"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100 transition duration-300 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" /> Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/adminpage"
                            className="block px-4 py-2 hover:bg-gray-100 transition duration-300 flex items-center"
                          >
                            <Settings className="w-4 h-4 mr-2" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100 transition duration-300 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-2xl focus:outline-none"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Items */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            className="fixed top-0 left-0 w-3/4 bg-[#4A90E2] text-white h-full z-40 overflow-y-auto"
          >
            <div className="flex flex-col items-start p-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="self-end mb-4"
              >
                <X className="w-6 h-6" />
              </button>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-2 w-full hover:bg-[#50E3C2] transition duration-300 ${
                    location.pathname === item.path ? "bg-[#50E3C2]" : ""
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
              <form onSubmit={handleSearch} className="relative w-full mt-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white bg-opacity-20 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
              </form>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="mt-4 hover:text-[#F5A623] transition duration-300 w-full text-center py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#F5A623] text-[#4A90E2] px-4 py-2 rounded-full mt-2 hover:bg-yellow-400 transition duration-300 w-full text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="flex flex-col items-start mt-4 space-y-2 w-full">
                  <Link
                    to="/profile"
                    className="hover:bg-[#50E3C2] transition duration-300 w-full p-2 flex items-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/adminpage"
                      className="hover:bg-[#50E3C2] transition duration-300 w-full p-2 flex items-center"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="hover:bg-[#50E3C2] transition duration-300 w-full p-2 text-left flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
