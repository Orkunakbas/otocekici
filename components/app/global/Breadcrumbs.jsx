import React from 'react'

const Breadcrumbs = ({ title, description }) => {
  return (
    <div className="w-full bg-[#eff0ff] py-6 border-b border-[#E5D8FF]">
      <div className=" mx-auto px-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-semibold ">{title}</h1>
          {description && (
            <p className="text-sm text-gray-700  leading-relaxed ">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Breadcrumbs