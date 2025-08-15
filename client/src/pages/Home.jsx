import React from 'react'
import Hero from '../components/Hero.jsx'
import Work from '../components/Work.jsx'
import Features from '../components/Features.jsx'
import Testimonial from '../components/Testimonial.jsx'
import Contact from '../components/Contact.jsx'

const Home = () => {
  return (
    <div>
      <Hero/>
      <Features/>
      <Work/>
      <Testimonial/>
      <Contact/>
      </div>
  )
}

export default Home