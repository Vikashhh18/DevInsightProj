import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaCode, FaUniversity, FaChartLine } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const About = () => {
  const features = [
    { icon: <FaGithub className="text-xl" />, text: "GitHub analytics & contribution tracking" },
    { icon: <SiLeetcode className="text-xl" />, text: "LeetCode problem-solving progress" },
    { icon: <FaChartLine className="text-xl" />, text: "Resume analyzer & improvement tips" },
    { icon: <FaLinkedin className="text-xl" />, text: "LinkedIn profile optimization" },
    { icon: <FaUniversity className="text-xl" />, text: "Skill gap analysis & learning paths" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold">About DevInsight</h1>
          <p className="mt-2 text-blue-100">
            Your all-in-one developer productivity dashboard
          </p>
        </div>

        <div className="p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-600 leading-relaxed mb-6">
              <strong className="font-semibold text-gray-800">DevInsight</strong> is a comprehensive dashboard created by <span className="text-blue-600 font-medium">Vikash</span> (3rd year CS student) to help developers track their coding journey. It unifies your achievements and growth metrics in one place.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Our mission is to help developers understand their strengths, identify skill gaps, and take actionable steps toward improvement - whether you're preparing for interviews or building your portfolio.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCode className="mr-2 text-blue-500" />
              Key Features
            </h2>
            
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start text-gray-600"
                >
                  <span className="text-blue-500 mr-3 mt-0.5">{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100"
          >
            <p className="text-blue-700 font-medium flex items-start">
              <span className="bg-blue-100 p-1.5 rounded-full mr-3">
                <FaUniversity className="text-blue-600" />
              </span>
              <span>
                Built by a student developer for fellow coders. Whether you're in college like me or an experienced developer, DevInsight helps you track and showcase your growth effectively.
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Personal note section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3">About the Developer</h3>
        <p className="text-gray-600">
          Hi, I'm Vikash - a 3rd year Computer Science student passionate about building tools that solve real problems. DevInsight was created to address my own need for tracking coding progress across multiple platforms during my internship search.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="https://github.com/Vikashhh18" className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            View GitHub Profile
          </a>
          <a href="https://www.linkedin.com/in/vikash-sharma-080907288/" className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition">
            Connect on LinkedIn
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default About;