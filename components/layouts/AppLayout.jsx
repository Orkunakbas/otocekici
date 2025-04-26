import React from 'react'
import Navbar from '../app/navbar/Navbar'

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen ">
      <Navbar />
        {children}
    </div>
  )
}

export default AppLayout 