import { motion } from "framer-motion";
import { Github, Code2, Linkedin, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Feature = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const features = [
    {
      icon: <Github className="w-5 h-5" />,
      title: "GitHub Analytics",
      desc: "Track repositories, contributions, and coding activity with detailed visual reports",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100",
      hoverColor: "hover:border-blue-200",
      path: "/github",
      stat: "284 Repos"
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "LeetCode Stats",
      desc: "Analyze problem-solving patterns with difficulty breakdowns and progress tracking",
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-100",
      hoverColor: "hover:border-amber-200",
      path: "/leetcode",
      stat: "568 Solved"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      title: "LinkedIn Insights",
      desc: "Optimize your professional profile with keyword analysis and growth metrics",
      color: "bg-sky-50 text-sky-600",
      borderColor: "border-sky-100",
      hoverColor: "hover:border-sky-200",
      path: "/linkedin",
      stat: "500+ Connections"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Resume Analyzer",
      desc: "Get AI-powered feedback with ATS score and improvement suggestions",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-100",
      hoverColor: "hover:border-green-200",
      path: "/resume-analyzer",
      stat: "92% ATS Score"
    }
  ];

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-3 border border-blue-100">
            Features
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Professional <span className="text-blue-600">Analytics</span> Suite
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Comprehensive tools to measure and enhance your developer profile across platforms
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <Link to={feature.path} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isMounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true, margin: "50px", amount: 0.1 }}
                whileHover={{ y: -5 }}
                className={`h-full bg-white rounded-xl border ${feature.borderColor} ${feature.hoverColor} p-6 transition-all duration-200 shadow-xs hover:shadow-sm group relative overflow-hidden opacity-100`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${feature.color.replace('bg-', 'bg-gradient-to-b from-')} to-transparent`}></div>
                
                <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-4 border ${feature.borderColor} ml-1`}>
                  {feature.icon}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {feature.stat}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{feature.desc}</p>
                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>Try it out</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white  cursor-pointer px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center mx-auto gap-1"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Feature;