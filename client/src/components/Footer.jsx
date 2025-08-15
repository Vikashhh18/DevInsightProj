import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiCode, FiAward, FiMail, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 pt-20 pb-10 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-sky-900 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-900 rounded-full opacity-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <Link to="/" className="flex items-center text-2xl font-bold">
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                DevInsight
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your developer profiles into actionable insights with powerful analytics.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Vikashhh18" target="_blank" rel="noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a href="https://leetcode.com/" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                aria-label="LeetCode"
              >
                <FiCode className="h-5 w-5" />
              </a>
              <a href="https://vikash-dev-h39y.vercel.app" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                aria-label="Portfolio"
              >
                <FiAward className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Features", path: "/features" },
                { name: "Dashboard", path: "/dashboard" },
                { name: "Pricing", path: "/pricing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-sky-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Documentation", href: "#" },
                { name: "API Reference", href: "#" },
                { name: "GitHub Repo", href: "https://github.com/Vikashhh18" },
                { name: "Blog", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-400 hover:text-sky-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
                <FiMapPin className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                <p className="ml-3 text-sm text-gray-400">New Delhi, India</p>
              </div>
              <div className="flex items-start">
                <FiMail className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                <a href="mailto:Vikash.sharma1761@gmail.com" className="ml-3 text-sm text-gray-400 hover:text-sky-400 transition-colors">
                  Vikash.sharma1761@gmail.com
                </a>
              </div>
            </address>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500">
              © {currentYear} <span className="text-sky-400">DevInsight</span>. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-4 md:mt-0">
              Crafted with ❤️ by <span className="text-sky-400">Vikash Sharma</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;