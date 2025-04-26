import Navbar from '@/components/frontend/Navbar'
import Hero from '@/components/frontend/Hero'
import Cards from '@/components/frontend/Cards'
import React from 'react'
import Footer from '@/components/frontend/Footer'
import CallYouBack from '@/components/frontend/CallYouBack'

const Index = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Cards/>
      <CallYouBack />
      <Footer/>
    </div>
  )
}

export default Index