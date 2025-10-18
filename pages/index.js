import React from 'react'
import Head from 'next/head'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from "@heroui/react"
import {
  Truck,
  Phone,
  Clock,
  Shield,
  CheckCircle,
  Car,
  Bike,
  Bus,
  Wrench,
  Star,
  Award,
  Zap,
  MapPin,
  TrendingUp,
  Users,
  Target
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const Index = () => {
  const services = [
    {
      icon: Car,
      title: "Otomobil Çekme",
      description: "Binek araçlar için profesyonel çekici hizmeti",
      features: ["Sedan & Hatchback", "SUV Taşıma", "Hasarlı Araç"]
    },
    {
      icon: Bus,
      title: "Ticari Araç",
      description: "Minibüs ve kamyonet çekme hizmeti",
      features: ["Minibüs Çekme", "Kamyonet", "Panel Van"]
    },
    {
      icon: Bike,
      title: "Motosiklet",
      description: "İki tekerlekli araçlar için özel taşıma",
      features: ["Motosiklet", "Scooter", "ATV"]
    },
    {
      icon: Wrench,
      title: "Yol Yardım",
      description: "Acil yol yardım hizmetleri",
      features: ["Akü Takviye", "Lastik Değişimi", "Yakıt İkmali"]
    }
  ]

  const advantages = [
    { icon: Zap, title: "Hızlı Müdahale", desc: "İstanbul genelinde hızlı servis" },
    { icon: Shield, title: "Sigortalı Hizmet", desc: "Güvenli taşıma garantisi" },
    { icon: Clock, title: "7/24 Hizmet", desc: "Kesintisiz destek" },
    { icon: Truck, title: "Modern Ekipman", desc: "Son model çekiciler" },
    { icon: Star, title: "Uygun Fiyat", desc: "Şeffaf fiyatlandırma" },
    { icon: Award, title: "10+ Yıl Tecrübe", desc: "Uzman ekip" }
  ]

  const areas = [
    { 
      title: "Avrupa Yakası", 
      locations: [
        "Arnavutköy", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy",
        "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beylikdüzü", "Beyoğlu",
        "Büyükçekmece", "Çatalca", "Esenler", "Esenyurt", "Eyüpsultan",
        "Fatih", "Gaziosmanpaşa", "Güngören", "Kağıthane", "Küçükçekmece",
        "Sarıyer", "Silivri", "Sultangazi", "Şişli", "Zeytinburnu"
      ]
    },
    { 
      title: "Anadolu Yakası", 
      locations: [
        "Adalar", "Ataşehir", "Beykoz", "Çekmeköy", "Kadıköy",
        "Kartal", "Maltepe", "Pendik", "Sancaktepe", "Sultanbeyli",
        "Şile", "Tuzla", "Ümraniye", "Üsküdar"
      ]
    }
  ]

  const stats = [
    { icon: TrendingUp, value: "24 Saat", label: "Kesintisiz Hizmet" },
    { icon: Award, value: "10+ Yıl", label: "Tecrübe" },
    { icon: Users, value: "5000+", label: "Mutlu Müşteri" },
    { icon: Target, value: "39 İlçe", label: "İstanbul Geneli" }
  ]

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Arnavutköy Oto Çekici | 7/24 Profesyonel Araç Çekme Hizmeti | İstanbul</title>
        <meta name="title" content="Arnavutköy Oto Çekici | 7/24 Profesyonel Araç Çekme Hizmeti | İstanbul" />
        <meta name="description" content="Arnavutköy'de 7/24 profesyonel oto çekici hizmeti. Hızlı müdahale, güvenli taşıma, uygun fiyat. İstanbul'un 39 ilçesinde araç çekme ve yol yardım hizmeti. Sigortalı taşıma garantisi." />
        <meta name="keywords" content="arnavutköy oto çekici, istanbul oto çekici, araç çekici, oto kurtarma, 7/24 çekici, yol yardım, araç çekme, çekici hizmeti, oto çekici fiyatları, acil çekici, beylikdüzü oto çekici, esenyurt oto çekici, başakşehir oto çekici" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="Turkish" />
        <meta name="author" content="Arnavutköy Oto Çekici" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://arnavutkoy-oto-cekici.com/" />
        <meta property="og:title" content="Arnavutköy Oto Çekici | 7/24 Profesyonel Hizmet" />
        <meta property="og:description" content="İstanbul'un 39 ilçesinde 7/24 profesyonel oto çekici ve yol yardım hizmeti. Hızlı müdahale, güvenli taşıma, uygun fiyat." />
        <meta property="og:image" content="https://arnavutkoy-oto-cekici.com/og-image.jpg" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="Arnavutköy Oto Çekici" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://arnavutkoy-oto-cekici.com/" />
        <meta property="twitter:title" content="Arnavutköy Oto Çekici | 7/24 Profesyonel Hizmet" />
        <meta property="twitter:description" content="İstanbul'un 39 ilçesinde 7/24 profesyonel oto çekici ve yol yardım hizmeti." />
        <meta property="twitter:image" content="https://arnavutkoy-oto-cekici.com/og-image.jpg" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="TR-34" />
        <meta name="geo.placename" content="Arnavutköy, İstanbul" />
        <meta name="geo.position" content="41.1885;28.7511" />
        <meta name="ICBM" content="41.1885, 28.7511" />
        
        {/* Mobile */}
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Arnavutköy Oto Çekici" />
        
        {/* Links */}
        <link rel="canonical" href="https://arnavutkoy-oto-cekici.com/" />
        <link rel="alternate" hrefLang="tr" href="https://arnavutkoy-oto-cekici.com/" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Arnavutköy Oto Çekici",
            "image": "https://arnavutkoy-oto-cekici.com/og-image.jpg",
            "description": "İstanbul'un 39 ilçesinde 7/24 profesyonel oto çekici ve yol yardım hizmeti. Hızlı müdahale, güvenli taşıma, uygun fiyat.",
            "@id": "https://arnavutkoy-oto-cekici.com",
            "url": "https://arnavutkoy-oto-cekici.com",
            "telephone": "+905551234567",
            "priceRange": "₺₺",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Arnavutköy",
              "addressLocality": "Arnavutköy",
              "addressRegion": "İstanbul",
              "postalCode": "34275",
              "addressCountry": "TR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 41.1885,
              "longitude": 28.7511
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "İstanbul"
              },
              {
                "@type": "Place",
                "name": "Arnavutköy"
              },
              {
                "@type": "Place",
                "name": "Beylikdüzü"
              },
              {
                "@type": "Place",
                "name": "Esenyurt"
              },
              {
                "@type": "Place",
                "name": "Başakşehir"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Oto Çekici Hizmetleri",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Araç Çekme Hizmeti",
                    "description": "7/24 profesyonel araç çekme hizmeti"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Yol Yardım Hizmeti",
                    "description": "Acil yol yardım ve destek hizmeti"
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150"
            }
          }`}
        </script>
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Arnavutköy'de oto çekici hizmeti ne kadar sürede gelir?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Arnavutköy ve çevre ilçelerde ortalama 20-30 dakika içinde yerinize ulaşıyoruz. Trafik durumuna göre bu süre değişiklik gösterebilir."
                }
              },
              {
                "@type": "Question",
                "name": "İstanbul'un hangi ilçelerine hizmet veriyorsunuz?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "İstanbul'un 39 ilçesinin tamamına 7/24 profesyonel oto çekici hizmeti veriyoruz."
                }
              },
              {
                "@type": "Question",
                "name": "Oto çekici ücretleri nasıl hesaplanıyor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ücretlerimiz mesafe, araç tipi ve hizmet saatine göre belirlenir. Şeffaf fiyatlandırma politikamız gereği, hizmeti almadan önce toplam ücreti size bildiriyoruz."
                }
              },
              {
                "@type": "Question",
                "name": "7/24 hizmet veriyor musunuz?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Evet, haftanın 7 günü 24 saat kesintisiz hizmet veriyoruz."
                }
              },
              {
                "@type": "Question",
                "name": "Hangi araç tiplerini çekiyorsunuz?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Otomobil, SUV, hafif ticari araç, minibüs, kamyonet ve motosiklet çekme hizmeti veriyoruz."
                }
              }
            ]
          }`}
        </script>
      </Head>

      <main className="min-h-screen bg-white pb-20 md:pb-0">
        
        {/* Hero Section - Ultra Minimal */}
        <section className="relative bg-gradient-to-br from-brand-primary via-blue-900 to-blue-950 text-white overflow-hidden">
          
          <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-48">
            <div className="max-w-4xl mx-auto text-center">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5 mb-8 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold tracking-wide">7/24 KESİNTİSİZ HİZMET</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
                Arnavutköy'de<br/>
                <span className="text-blue-200">Profesyonel</span> Oto Çekici
              </h1>
              
              {/* Subheading */}
              <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto font-light">
                İstanbul'un 39 ilçesinde güvenilir araç çekme ve yol yardım hizmeti. 
                Hızlı müdahale, uygun fiyat, sigortalı taşıma.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-20">
                <Button
                  as="a"
                  href="tel:+905551234567"
                  size="lg"
                  className="w-full sm:w-64 bg-white hover:bg-gray-50 text-brand-primary font-bold text-lg px-8 py-8 shadow-2xl hover:shadow-xl hover:scale-105 transition-all"
                  startContent={<Phone className="w-5 h-5" strokeWidth={2.5} />}
                >
                  0555 123 4567
                </Button>
                
                <Button
                  as="a"
                  href="https://wa.me/905551234567"
                  size="lg"
                  variant="bordered"
                  className="w-full sm:w-64 border-2 border-white/80 text-white hover:bg-white hover:text-brand-primary font-bold text-lg px-8 py-8 backdrop-blur-sm hover:scale-105 transition-all"
                  startContent={<FaWhatsapp className="w-6 h-6" />}
                >
                  WhatsApp
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{stat.value}</p>
                    <p className="text-sm md:text-base text-blue-200 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="hizmetler" className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hizmetlerimiz
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Her türlü araç için profesyonel çekici ve yol yardım hizmeti
              </p>
            </div>
            
            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-6 h-6 text-brand-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Neden Bizi Tercih Etmelisiniz?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Güvenilir, hızlı ve profesyonel hizmet anlayışımızla yanınızdayız
              </p>
            </div>
            
            {/* Advantage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <advantage.icon className="w-6 h-6 text-brand-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{advantage.title}</h3>
                      <p className="text-sm text-gray-600">{advantage.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section id="bolgeler" className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hizmet Alanlarımız
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                İstanbul'un 39 ilçesinde profesyonel hizmet
              </p>
            </div>
            
            {/* Area Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {areas.map((area, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="bg-brand-primary text-white py-8 text-center">
                    <h3 className="text-xl font-semibold">{area.title}</h3>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {area.locations.map((location, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0" strokeWidth={2} />
                          <span>{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - SEO Optimized */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sık Sorulan Sorular
              </h2>
              <p className="text-lg text-gray-600">
                Oto çekici hizmeti hakkında merak edilenler
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-6">
              {[
                {
                  question: "Arnavutköy'de oto çekici hizmeti ne kadar sürede gelir?",
                  answer: "Arnavutköy ve çevre ilçelerde ortalama 20-30 dakika içinde yerinize ulaşıyoruz. Trafik durumuna göre bu süre değişiklik gösterebilir. Acil durumlarda en hızlı şekilde size ulaşmak için tüm önlemleri alıyoruz."
                },
                {
                  question: "İstanbul'un hangi ilçelerine hizmet veriyorsunuz?",
                  answer: "İstanbul'un 39 ilçesinin tamamına 7/24 profesyonel oto çekici hizmeti veriyoruz. Avrupa yakasında Arnavutköy, Beylikdüzü, Esenyurt gibi; Anadolu yakasında Kadıköy, Ataşehir, Pendik gibi tüm bölgelere hizmet sunuyoruz."
                },
                {
                  question: "Oto çekici ücretleri nasıl hesaplanıyor?",
                  answer: "Ücretlerimiz mesafe, araç tipi ve hizmet saatine göre belirlenir. Şeffaf fiyatlandırma politikamız gereği, hizmeti almadan önce toplam ücreti size bildiriyoruz. Gizli ek ücret yoktur. Detaylı fiyat teklifi için bizi arayabilirsiniz."
                },
                {
                  question: "Hangi araç tiplerini çekiyorsunuz?",
                  answer: "Otomobil, SUV, hafif ticari araç, minibüs, kamyonet ve motosiklet çekme hizmeti veriyoruz. Modern çekici filomuzla farklı araç tiplerine uygun ekipmanlara sahibiz. Hasarlı veya çalışmayan araçlar için de hizmet sunuyoruz."
                },
                {
                  question: "7/24 hizmet veriyor musunuz?",
                  answer: "Evet, haftanın 7 günü 24 saat kesintisiz hizmet veriyoruz. Gece yarısı, hafta sonu veya resmi tatil günlerinde bile arayabilir, acil oto çekici talebinizi iletebilirsiniz."
                },
                {
                  question: "Araç taşıma sırasında hasar oluşursa ne olur?",
                  answer: "Tüm çekici araçlarımız sigortalıdır. Taşıma sırasında meydana gelebilecek her türlü hasar sigortamız kapsamındadır. Profesyonel ekibimiz aracınızı güvenle taşımak için gerekli tüm önlemleri alır."
                },
                {
                  question: "Yol yardım hizmeti de veriyor musunuz?",
                  answer: "Evet, oto çekici hizmetinin yanı sıra akü takviyesi, lastik değişimi, yakıt ikmali ve basit mekanik müdahaleler gibi yol yardım hizmetleri de sunuyoruz."
                },
                {
                  question: "Ödeme nasıl yapılıyor?",
                  answer: "Nakit ve kredi kartı ile ödeme kabul ediyoruz. Hizmet sonrasında ödeme yapabilirsiniz. Kurumsal müşterilerimiz için fatura düzenlemekteyiz."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                    <span className="text-brand-primary flex-shrink-0">Q.</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* SEO Rich Text */}
            <div className="mt-16 prose prose-gray max-w-none">
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Arnavutköy Oto Çekici Hizmeti Hakkında
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong className="text-gray-900">Arnavutköy oto çekici</strong> hizmeti sunan firmamız, İstanbul genelinde profesyonel araç çekme ve yol yardım hizmetleri vermektedir. Modern çekici araçlarımız ve deneyimli ekibimizle 7/24 hizmetinizdeyiz.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong className="text-gray-900">İstanbul oto çekici</strong> sektöründe yıllardır güvenilir hizmet anlayışımızla tanınıyoruz. Avrupa yakası ve Anadolu yakasında bulunan 39 ilçenin tamamına hızlı ve güvenli araç çekme hizmeti sağlıyoruz. Arnavutköy, Başakşehir, Beylikdüzü, Esenyurt gibi bölgelerde özellikle tercih edilen oto çekici firmalarından biriyiz.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Araç arızası, kaza sonrası araç taşıma veya mekanik arıza durumlarında <strong className="text-gray-900">oto çekici hizmeti</strong> almak için bizi arayabilirsiniz. Şeffaf fiyatlandırma, sigortalı taşıma ve profesyonel hizmet garantisi sunuyoruz. Otomobil, SUV, hafif ticari, motosiklet gibi tüm araç tiplerini güvenle taşıyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="iletisim" className="py-24 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            
            <div className="bg-gradient-to-br from-brand-primary via-blue-900 to-blue-950 rounded-3xl p-12 md:p-16 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Acil Durumda Hemen Arayın
              </h2>
              <p className="text-lg text-blue-100 mb-12 max-w-xl mx-auto">
                İstanbul genelinde 7/24 profesyonel oto çekici hizmeti
              </p>
              
              <Button
                as="a"
                href="tel:+905551234567"
                size="lg"
                className="bg-white hover:bg-gray-50 text-brand-primary font-semibold text-xl px-12 py-7 shadow-xl mb-12"
                startContent={<Phone className="w-5 h-5" strokeWidth={2} />}
              >
                0555 123 4567
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-200" strokeWidth={2} />
                  <p className="text-sm text-blue-100">39 İlçe</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-200" strokeWidth={2} />
                  <p className="text-sm text-blue-100">7/24 Hizmet</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-blue-200" strokeWidth={2} />
                  <p className="text-sm text-blue-100">Güvenli Taşıma</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  {/* Premium Tow Truck SVG Logo - Footer */}
                  <svg width="48" height="48" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="truckGradientFooter" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#1e40af" />
                      </linearGradient>
                    </defs>
                    
                    {/* Main Truck Bed */}
                    <rect x="8" y="42" width="36" height="4" fill="#1e40af" />
                    <rect x="8" y="32" width="36" height="10" rx="1.5" fill="url(#truckGradientFooter)" />
                    
                    {/* Side Panel Details */}
                    <rect x="12" y="35" width="6" height="4" rx="0.5" fill="#3b82f6" opacity="0.4" />
                    <rect x="21" y="35" width="6" height="4" rx="0.5" fill="#3b82f6" opacity="0.4" />
                    <rect x="30" y="35" width="6" height="4" rx="0.5" fill="#3b82f6" opacity="0.4" />
                    
                    {/* Cabin */}
                    <path d="M44 32 L44 46 L64 46 L64 36 L54 32 Z" fill="#1e40af" />
                    <path d="M44 32 L54 32 L64 36 L64 34 L54 30 L44 30 Z" fill="#2563eb" />
                    
                    {/* Cabin Window */}
                    <path d="M47 34 L47 42 L61 42 L61 36 L54 34 Z" fill="#93c5fd" opacity="0.8" />
                    <line x1="54" y1="34" x2="54" y2="42" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
                    
                    {/* Tow Crane Boom */}
                    <rect x="42" y="16" width="3" height="16" rx="1" fill="#1e40af" transform="rotate(-25 44 24)" />
                    
                    {/* Crane Pulley */}
                    <circle cx="56" cy="16" r="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                    <circle cx="56" cy="16" r="1.5" fill="#fbbf24" />
                    
                    {/* Hook and Cable */}
                    <line x1="56" y1="19" x2="66" y2="32" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,1" />
                    <path d="M66 32 L68 35 L66 38 L64 35 Z" fill="#9ca3af" />
                    
                    {/* Warning Lights */}
                    <circle cx="50" cy="30" r="1" fill="#ef4444" opacity="0.8" />
                    <circle cx="54" cy="30" r="1" fill="#f59e0b" opacity="0.8" />
                    <circle cx="58" cy="30" r="1" fill="#ef4444" opacity="0.8" />
                    
                    {/* Headlight */}
                    <circle cx="63" cy="43" r="1.2" fill="#fde047" />
                    
                    {/* Wheels - 3 wheels */}
                    <g>
                      <circle cx="18" cy="46" r="8" fill="#374151" />
                      <circle cx="18" cy="46" r="5" fill="#4b5563" />
                      <circle cx="18" cy="46" r="2" fill="#6b7280" />
                      <line x1="18" y1="42" x2="18" y2="50" stroke="#6b7280" strokeWidth="0.5" />
                      <line x1="14" y1="46" x2="22" y2="46" stroke="#6b7280" strokeWidth="0.5" />
                    </g>
                    <g>
                      <circle cx="34" cy="46" r="8" fill="#374151" />
                      <circle cx="34" cy="46" r="5" fill="#4b5563" />
                      <circle cx="34" cy="46" r="2" fill="#6b7280" />
                      <line x1="34" y1="42" x2="34" y2="50" stroke="#6b7280" strokeWidth="0.5" />
                      <line x1="30" y1="46" x2="38" y2="46" stroke="#6b7280" strokeWidth="0.5" />
                    </g>
                    <g>
                      <circle cx="56" cy="46" r="8" fill="#374151" />
                      <circle cx="56" cy="46" r="5" fill="#4b5563" />
                      <circle cx="56" cy="46" r="2" fill="#6b7280" />
                      <line x1="56" y1="42" x2="56" y2="50" stroke="#6b7280" strokeWidth="0.5" />
                      <line x1="52" y1="46" x2="60" y2="46" stroke="#6b7280" strokeWidth="0.5" />
                    </g>
                    
                    {/* Front Bumper */}
                    <rect x="64" y="42" width="4" height="4" rx="1" fill="#2563eb" />
                  </svg>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Arnavutköy Oto Çekici</h3>
                    <p className="text-sm text-gray-400">7/24 Profesyonel Hizmet</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  İstanbul'un 39 ilçesinde güvenilir oto çekici ve yol yardım hizmeti. 
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Hızlı Erişim</h4>
                <div className="space-y-2">
                  {[
                    { name: "Hizmetlerimiz", href: "#hizmetler" },
                    { name: "Hizmet Bölgeleri", href: "#bolgeler" },
                    { name: "İletişim", href: "#iletisim" }
                  ].map((link, i) => (
                    <div key={i}>
                      <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors block">
                        {link.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">İletişim</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Telefon</p>
                    <a href="tel:+905551234567" className="text-gray-300 hover:text-white">0555 123 4567</a>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Hizmet</p>
                    <p className="text-gray-300">7/24 Açık</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-500">
                &copy; 2024 Arnavutköy Oto Çekici. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}

export default Index
