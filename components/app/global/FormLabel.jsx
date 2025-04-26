import React from 'react'

const FormLabel = ({ number, title, description }) => {
  return (
    <div className="mb-3">
      <div className=" flex items-center">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-100 text-black mr-3">
          <span className="text-base font-medium">{number}</span>
        </div>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {description && (
        <p className="text-sm text-gray-500  ml-12">
          {description}
        </p>
      )}
    </div>
  )
}

export default FormLabel