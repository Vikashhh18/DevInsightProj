import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import img1 from '../assets/student1.jpeg'
import img2 from '../assets/student2.jpeg'
import img3 from '../assets/student3.jpeg'

const testimonials = [
  {
    name: "Aarav Singh",
    role: "Final Year CS Student",
    feedback: "This platform helped me stay consistent and track my coding progress better than any other. The insights are super valuable!",
    image: img1,
    rating: 5
  },
  {
    name: "Meera Nair",
    role: "Aspiring Web Developer",
    feedback: "The UI is clean, the features are smart, and I love how my weekly progress is visualized. It's like having a mentor!",
    image:img2,
    rating: 5
  },
  {
    name: "Dev Joshi",
    role: "Intern @ TCS",
    feedback: "After using this platform for 2 months, I landed an internship. The mock tests and readiness score really helped!",
    image: img3,
    rating: 4
  },
];

const Testimonial = () => {
  return (
    <section className=" py-16 bg-gray-50/50">
      <div className="absolute top-0 left-0 w-32 h-32 bg-sky-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-sky-500/10 px-4 py-1 rounded-full text-sm text-sky-600 backdrop-blur-sm border border-sky-200 mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Developers Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from learners who've accelerated their growth with DevInsight
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-sky-400/80"
                    />
                    <Quote className="absolute -bottom-2 -right-2 w-6 h-6 text-sky-500 bg-white p-1 rounded-full border border-sky-100" />
                  </div>
                </div>
                
                <div className="flex justify-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400' : 'fill-gray-200'}`} 
                    />
                  ))}
                </div>
                
                <blockquote className="text-gray-600 text-sm md:text-base mb-6 flex-grow italic">
                  "{t.feedback}"
                </blockquote>
                
                <div className="mt-auto">
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;