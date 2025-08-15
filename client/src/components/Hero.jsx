import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardImage from "/image.png"; // Update with your actual image path
// import fallbackImage from "/fallback.png"; // Optional fallback

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
   <section className=" bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 ">
  {/* Background shapes - full screen */}
  {/* <div className="absolute inset-0 overflow-hidden"> */}
   <div className="absolute inset-0 w-full overflow-hidden">
  <div className="absolute top-0 -left-40 w-96 h-96 bg-sky-100 rounded-full opacity-70 blur-3xl animate-float-slow"></div>
  <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-100 rounded-full opacity-70 blur-3xl animate-float-medium"></div>
  <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-blue-100 rounded-full opacity-50 blur-2xl animate-float-fast"></div>
</div>

  {/* </div> */}
      {/* Content container */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
        {/* Text content with staggered animations */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6 text-center lg:text-left"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block bg-sky-500/10 px-4 py-1 rounded-full text-sm text-sky-600 backdrop-blur-sm border border-sky-200 shadow-sm"
          >
            🚀 Developer Portfolio Analytics
          </motion.span>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
          >
            Visualize Your <br />
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Developer Journey
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0"
          >
            Analyze your GitHub commits, LeetCode progress, and LinkedIn presence with one smart dashboard. Get insights that boost your learning and hiring potential.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start"
          >
            <Link
              to="/dashboard"
              aria-label="Launch the developer dashboard"
              className="relative overflow-hidden group bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="relative z-10">Launch Dashboard</span>
              <span className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            
            <Link
              to="/features"
              aria-label="View platform features"
              className="relative overflow-hidden group border border-gray-300 px-6 py-3 rounded-lg text-gray-700 hover:border-sky-400 hover:text-sky-600 transition-all duration-300"
            >
              <span className="relative z-10">See Features →</span>
              <span className="absolute inset-0 bg-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero image with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            type: "spring",
            stiffness: 100
          }}
          className="relative z-10 hidden lg:block"
        >
          <div className="relative">
            <img
              src={dashboardImage}
              alt="Analytics dashboard preview"
              className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200/50 hover:border-sky-200 transition-all duration-300"
              // onError={(e) => (e.target.src = fallbackImage)}
            />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(14,165,233,0.1)] pointer-events-none"></div>
          </div>
        </motion.div>
      </div>

      {/* Floating indicators for scroll hint (optional) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <div className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            className="w-1 h-1 bg-gray-500 rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;