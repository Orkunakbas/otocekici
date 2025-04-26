import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import heroBg from '@/images/bg-hero-dpox.png'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react"

const Hero = () => {
  const t = useTranslations('frontend.home')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className="relative bg-[#716CF6] h-[650px]">
      {/* Content Container */}
      <div className="container relative z-10 mx-auto pt-24 pb-8">
        <div className="flex flex-col items-center justify-start">
          {/* Text Content */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-6 mb-6">
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-xl text-white">
              {t('description')}
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="relative w-full max-w-[1000px] mt-12 px-4">
            <div className="bg-white rounded-t-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center bg-white rounded-md px-3 py-1.5 w-full max-w-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-400">dpox.app</span>
                </div>
              </div>
              <div className="relative">
                <Image
                  src={heroBg}
                  alt="DpoX Dashboard Preview"
                  width={1000}
                  height={500}
                  className="w-full"
                  priority
                />
                <button 
                  onClick={onOpen}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all hover:bg-black/30"
                >
                  <BsFillPlayCircleFill className="w-16 h-16 text-white hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            {/* Demo Account Activation Section */}
            <div className="bg-primary py-6 px-8 flex items-center justify-center rounded-b-xl">
              <Link 
                href="/try" 
                className="text-white font-semibold text-lg hover:text-white/90 transition-colors"
              >
                {t('activateDemo')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="5xl"
        backdrop="blur"
        hideCloseButton={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-end p-2">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </ModalHeader>
              <ModalBody className="p-0">
                <video 
                  controls 
                  className="w-full"
                  autoPlay
                >
                  <source src="/dpox-tanitim.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Hero