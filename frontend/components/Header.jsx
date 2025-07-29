import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaImage,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaUserCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock authentication state
  useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.email === "admin@example.com");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
    navigate("/sign-in");
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          aria-label="Go to homepage"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <FaImage className="text-white text-xl" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-indigo-700">
              MediaWave
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main menu">
          <NavLink to="/" icon={<FaHome />} text="Home" />
          <NavLink to="/gallery" icon={<FaImage />} text="Gallery" />
          <NavLink to="/contact" icon={<FaEnvelope />} text="Contact" />
          {isAdmin && (
            <NavLink to="/admin/users" icon={<FaUserCog />} text="Admin" />
          )}
        </nav>

        {/* User Profile / Auth Buttons */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
                aria-label="User menu"
                aria-expanded={isMenuOpen}
              >
                <img
                  src={
                    currentUser?.profilePic ||
                    "https://i.ibb.co/0jqHpnp/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                  width="40"
                  height="40"
                />
                <span className="hidden md:inline text-gray-700">
                  {currentUser.username || currentUser.email.split("@")[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  role="menu"
                >
                  <DropdownLink 
                    to="/profile" 
                    icon={<FaUser />}
                    text="My Profile"
                    onClick={closeMenu}
                  />
                  <DropdownLink 
                    to="/upload" 
                    icon={<FaImage />}
                    text="Upload Media"
                    onClick={closeMenu}
                  />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center"
                    role="menuitem"
                  >
                    <FaSignOutAlt className="mr-2" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <AuthLink to="/sign-in" text="Sign In" />
              <AuthLink 
                to="/sign-up" 
                text="Sign Up" 
                isPrimary 
              />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded p-1"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" aria-hidden="true" />
          ) : (
            <FaBars className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden bg-white shadow-lg absolute w-full left-0 px-4 py-2 space-y-2"
          role="menu"
        >
          <MobileNavLink to="/" icon={<FaHome />} text="Home" onClick={closeMenu} />
          <MobileNavLink to="/gallery" icon={<FaImage />} text="Gallery" onClick={closeMenu} />
          <MobileNavLink to="/contact" icon={<FaEnvelope />} text="Contact" onClick={closeMenu} />
          {isAdmin && (
            <MobileNavLink 
              to="/admin/users" 
              icon={<FaUserCog />} 
              text="Admin Panel" 
              onClick={closeMenu} 
            />
          )}
          {currentUser ? (
            <>
              <MobileNavLink 
                to="/profile" 
                icon={<FaUser />} 
                text="My Profile" 
                onClick={closeMenu} 
              />
              <MobileNavLink 
                to="/upload" 
                icon={<FaImage />} 
                text="Upload Media" 
                onClick={closeMenu} 
              />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded flex items-center"
                role="menuitem"
              >
                <FaSignOutAlt className="mr-2" aria-hidden="true" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-2 pt-2 border-t">
              <AuthLink 
                to="/sign-in" 
                text="Sign In" 
                isMobile 
                onClick={closeMenu}
              />
              <AuthLink 
                to="/sign-up" 
                text="Sign Up" 
                isPrimary 
                isMobile 
                onClick={closeMenu}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// Reusable component for desktop navigation links
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center group"
    aria-label={text}
  >
    <span className="mr-2 group-hover:scale-110 transition-transform" aria-hidden="true">
      {icon}
    </span>
    {text}
  </Link>
);

// Reusable component for dropdown links
const DropdownLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center"
    role="menuitem"
    onClick={onClick}
  >
    <span className="mr-2" aria-hidden="true">
      {icon}
    </span>
    {text}
  </Link>
);

// Reusable component for mobile navigation links
const MobileNavLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded flex items-center"
    role="menuitem"
    onClick={onClick}
  >
    <span className="mr-2" aria-hidden="true">
      {icon}
    </span>
    {text}
  </Link>
);

// Reusable component for auth links
const AuthLink = ({ to, text, isPrimary = false, isMobile = false, onClick }) => {
  const baseClasses = isMobile 
    ? "flex-1 text-center px-4 py-2"
    : "px-4 py-2";
  
  const primaryClasses = isPrimary 
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "text-indigo-600 hover:text-indigo-800";
  
  return (
    <Link
      to={to}
      className={`${baseClasses} ${primaryClasses} rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      onClick={onClick}
    >
      {text}
    </Link>
  );
};