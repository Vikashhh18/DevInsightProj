import { motion } from "framer-motion";
// import { Link } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  FcAbout, 
  FcInspection, 
  FcBarChart, 
  FcWorkflow 
} from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";

const workSteps = [
  {
    icon: <FcAbout className="text-3xl" />,
    title: "Connect Your Profiles",
    desc: "Securely link your GitHub, LeetCode, and LinkedIn accounts with OAuth authentication.",
    color: "bg-blue-50 border-blue-100",
    step: "01"
  },
  {
    icon: <FcInspection className="text-3xl" />,
    title: "Automated Analysis",
    desc: "Our system processes your public data to evaluate coding activity and skills.",
    color: "bg-indigo-50 border-indigo-100",
    step: "02"
  },
  {
    icon: <FcBarChart className="text-3xl" />,
    title: "Visual Insights",
    desc: "Interactive charts for commit history, problem-solving patterns, and progression.",
    color: "bg-sky-50 border-sky-100",
    step: "03"
  },
  {
    icon: <FcWorkflow className="text-3xl" />,
    title: "Growth Tracking",
    desc: "Weekly reports with actionable suggestions for improvement.",
    color: "bg-purple-50 border-purple-100",
    step: "04"
  },
];

const Work = () => {
  return (
    <section className="py-16">
         <div className="absolute top-0 -left-20 w-72 h-72 bg-sky-100 rounded-full opacity-70 blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-indigo-100 rounded-full opacity-70 blur-3xl animate-float-medium"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-50 blur-2xl animate-float-fast"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-3 border border-blue-100">
            PROCESS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            How <span className="text-blue-600">DevInsight</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Transform your developer profiles into actionable insights through our streamlined process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {workSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`h-full bg-white rounded-lg border ${step.color} p-5 transition-all duration-200 shadow-xs hover:shadow-sm relative overflow-hidden`}
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 text-xs font-medium text-gray-400">
                {step.step}
              </div>
              
              <div className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center mb-4 border`}>
                {step.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{step.desc}</p>
              <Link to={"/features"}>
              <div className="flex items-center text-sm font-medium text-blue-600">
                <span>Learn more</span>
                <FiArrowRight className="w-4 h-4 ml-1" />
              </div>
              </Link>
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default Work;