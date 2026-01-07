import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Safe retrieval of user profile
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserProfile(parsedUser?.photoURL || null);
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
  }, []);

  // Check authentication status
  const isLoggedIn = !!user;
  const isAdminLoggedIn = !!admin;
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  // ✅ Define before useEffect
  const checkAuthStatus = async () => {
    try {
      const adminEmail = localStorage.getItem("adminEmail");
      const adminName = localStorage.getItem("adminName");
      const adminRole = localStorage.getItem("adminRole");

      if (adminEmail && adminName && adminRole) {
        setAdmin({ email: adminEmail, name: adminName, role: adminRole });
        setUser(null);
        return;
      }

      const userData = localStorage.getItem("user");
      const userToken = localStorage.getItem("userToken");

      if (userData && userToken) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setAdmin(null);
      } else {
        setUser(null);
        setAdmin(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAdmin(null);
    }
  };

  // Run auth check on mount and path change
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const handleLogout = () => {
    if (isAdminLoggedIn) {
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminRole");
      setAdmin(null);
    } else if (isLoggedIn) {
      localStorage.removeItem("userToken");
      setUser(null);
    }

    setIsUserDropdownOpen(false);
    navigate("/");
  };

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  if (isAdminLoggedIn) {
    navLinks.push({ to: "/admin", label: "Admin Panel" });
  } else if (isLoggedIn) {
    navLinks.push({ to: "/dashboard", label: "Dashboard" });
  }

  const isActiveLink = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  const getUserInitials = () => {
    if (isAdminLoggedIn && admin?.name) return admin.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    if (isLoggedIn && user?.name) return user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    return "U";
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">BP</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 leading-tight text-sm">Burgeonpath</span>
                  <span className="font-bold text-gray-900 leading-tight text-sm">Tech</span>
                </div>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>

            {/* Mobile Menu Links */}
            <div className="p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActiveLink(link.to)
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActiveLink(link.to) && (
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-purple-500"
                        layoutId="mobileActiveIndicator"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Footer - Auth Buttons */}
            {!isLoggedIn && !isAdminLoggedIn && !isAuthPage && (
              <div className="p-4 border-t border-gray-200 space-y-3 mt-auto">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2.5 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200">
                    Sign in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Footer - Logged In User */}
            {(isLoggedIn || isAdminLoggedIn) && (
              <div className="p-4 border-t border-gray-200 space-y-3 mt-auto">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={userProfile || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {isAdminLoggedIn ? admin?.name : user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isAdminLoggedIn ? admin?.email : user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Dropdown Backdrop */}
      <AnimatePresence>
        {isUserDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30"
            onClick={() => setIsUserDropdownOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
            : "bg-white/95 backdrop-blur-sm"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-sm">BP</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-tight text-sm">Burgeonpath</span>
                <span className="font-bold text-gray-900 leading-tight text-sm">Tech</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActiveLink(link.to)
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                  >
                    {link.label}
                    {isActiveLink(link.to) && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-purple-500 rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {(isLoggedIn || isAdminLoggedIn) ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={userProfile || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {isAdminLoggedIn ? admin?.name : user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdminLoggedIn ? "Admin" : "User"}
                      </p>
                    </div>
                  </motion.button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {isAdminLoggedIn ? admin?.name : user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isAdminLoggedIn ? admin?.email : user?.email}
                          </p>
                        </div>

                        {isAdminLoggedIn ? (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        ) : (
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                !isAuthPage && (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/login">
                        <button className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
                          Sign in
                        </button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/signup">
                        <button className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                          Get Started
                        </button>
                      </Link>
                    </motion.div>
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              {(isLoggedIn || isAdminLoggedIn) ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                </motion.button>
              ) : (
                !isAuthPage && (
                  <motion.div className="flex items-center gap-2">
                    <Link to="/login">
                      <button className="px-3 py-1.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm">
                        Sign in
                      </button>
                    </Link>
                    <Link to="/signup">
                      <button className="px-3 py-1.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 text-sm">
                        Join
                      </button>
                    </Link>
                  </motion.div>
                )
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
