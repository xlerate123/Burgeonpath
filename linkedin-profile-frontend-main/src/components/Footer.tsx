import { motion } from "framer-motion";

const Footer = () => {
  const date = new Date();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      color: "hsl(var(--primary))",
      transition: {
        duration: 0.2
      }
    }
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 20px hsl(270 60% 70% / 0.3)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };
   const stars = Array.from({ length: 40 }); 

  return (
   <footer className="relative w-full py-16 px-8 flex justify-center items-center overflow-hidden ">
      {/* Background stars */}
     <div className="absolute inset-0 rounded-3xl pointer-events-none">
        {stars.map((_, i) => {
          // explicit px units and larger test size for visibility
          const size = Math.floor(Math.random() * 6) + 3; // 3px - 8px
          const left = `${Math.random() * 100}%`;
          const top = `${Math.random() * 100}%`;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left,
                top,
                transformOrigin: "center",
                // debug border for visibility while testing; remove later
                // border: '1px solid rgba(255,255,255,0.12)'
              }}
              initial={{ opacity: 0.2, x: 0, y: 0 }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Main Footer Card */}
      <div className="relative bg-gray-800 rounded-3xl w-full max-w-6xl p-6 sm:p-10 md:p-16 text-white grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 z-10">
  {/* Left side - Newsletter */}
        <div className="text-center md:text-left">
          <div className="w-12 h-12 mb-6 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
            <span className="text-xl">🪐</span>
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Stay in the Loop with Readable
          </h2>
          <p className="text-gray-300 mb-6 max-w-md">
            Subscribe to our newsletter for smart article picks, updates, and
            tips—delivered fresh to your inbox.
          </p>

          <div className="flex items-center bg-[#2A2A2E] rounded-full overflow-hidden max-w-md">
            <input
              type="email"
              placeholder="Enter email"
              className="flex-grow px-4 py-3 bg-transparent text-gray-200 outline-none"
            />
            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
              Subscribe →
            </button>
          </div>
        </div>

        {/* Right side - Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="font-semibold mb-3">Sections</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#how" className="hover:text-white">How It Works</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#why" className="hover:text-white">Why Choose Us</a></li>
              <li><a href="#testimonials" className="hover:text-white">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Social</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a></li>
              <li><a href="https://threads.net" target="_blank" rel="noreferrer" className="hover:text-white">Threads</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">Twitter</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Pages</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/blog" className="hover:text-white">Blogs</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>

  )
};

export default Footer;
