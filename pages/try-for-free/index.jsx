import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Input, Select, SelectItem, CheckboxGroup, Checkbox, RadioGroup, Radio, Button } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { submitFreeAccount } from '@/store/slices/freeAccountSlice'
import Navbar from '@/components/frontend/Navbar'
import Footer from '@/components/frontend/Footer'
import Image from 'next/image'
import darkLogo from '@/images/dark-logo.png'
import Link from 'next/link'
import { IoIosSend } from "react-icons/io"

// Pricing ikonlarını import ediyoruz
import pricing2 from '@/images/pricing/pricing-2.png'
import pricing3 from '@/images/pricing/pricing-3.png'
import pricing4 from '@/images/pricing/pricing-4.png'
import pricing5 from '@/images/pricing/pricing-5.png'
import pricing7 from '@/images/pricing/pricing-7.png'

// Global hata yakalayıcı
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global hata yakalandı:', event)
    event.preventDefault() // Hata ekranını gösterme
    return true
  })
}

// Rastgele tek sayı üreten yardımcı fonksiyon
const generateRandomOddNumber = (min = 1, max = 9) => {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber % 2 === 0 ? randomNumber + 1 : randomNumber;
};

const TryForFree = () => {
  const t = useTranslations('frontend.try-for-free')
  const dispatch = useDispatch()
  
  // Redux state'lerini local state'e taşı
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [dataPrivacy, setDataPrivacy] = useState([])
  const [formError, setFormError] = useState('')
  
  // Güvenlik doğrulama sistemi için state'ler
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  // RadioGroup için key oluştur
  const [formKey, setFormKey] = useState(1)

  // Sayfa yüklendiğinde rastgele sayılar oluştur
  useEffect(() => {
    generateNewCaptcha();
  }, [])

  // Yeni CAPTCHA oluştur
  const generateNewCaptcha = () => {
    const newNum1 = generateRandomOddNumber(1, 9);
    const newNum2 = generateRandomOddNumber(1, 9);
    setNum1(newNum1);
    setNum2(newNum2);
    setCaptchaAnswer('');
    setCaptchaError(false);
  };

  // Input değiştiğinde captcha hatasını sıfırla
  const handleCaptchaChange = (e) => {
    setCaptchaAnswer(e.target.value);
    setCaptchaError(false);
  };

  // Form hata mesajlarını 5 saniye sonra kaldır
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => {
        setFormError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [formError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form gönderilirken ülke değeri:', country);
    
    // CAPTCHA doğrulaması
    const correctAnswer = num1 + num2;
    const userAnswer = captchaAnswer === '' ? NaN : Number(captchaAnswer);
    console.log('Doğru cevap:', correctAnswer, 'Kullanıcı cevabı:', userAnswer, 'Tip:', typeof userAnswer);
    
    if (isNaN(userAnswer) || userAnswer !== correctAnswer) {
      setCaptchaError(true);
      setFormError('Lütfen matematik işlemini doğru bir şekilde çözün.');
      // Yanlış cevap verildiğinde yeni bir captcha oluştur
      generateNewCaptcha();
      return;
    }
    
    // Form doğrulama - her bir alanı ayrı ayrı kontrol et
    const missingFields = []
    
    if (!name.trim()) missingFields.push(t('form.fullName'))
    if (!email.trim()) missingFields.push(t('form.email'))
    if (!country || country === '') missingFields.push(t('form.region'))
    if (!company.trim()) missingFields.push(t('form.companyName'))
    if (!position) missingFields.push(t('form.employeeCount'))
    
    // Gizlilik tercihi kontrolü
    if (dataPrivacy.length === 0) {
      missingFields.push(t('form.terms'))
    }
    
    // Eksik alanlar varsa hata mesajı oluştur
    if (missingFields.length > 0) {
      const missingFieldsText = missingFields.join(', ')
      setFormError(`${t('form.pleaseComplete')}: ${missingFieldsText}`)
      // Yeni bir captcha oluştur
      generateNewCaptcha();
      return;
    }
    
    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setFormError('Lütfen geçerli bir e-posta adresi girin.')
      // Yeni bir captcha oluştur
      generateNewCaptcha();
      return;
    }
    
    // Hata mesajını temizle
    setFormError('')
    setCaptchaError(false);
    
    // Basit form verisi oluştur
    const formData = {
      fullname: name,
      email: email,
      numberoff: position,
      country: country,
      company_name: company
    }

    console.log('Form bileşeninden gönderilen veri:', formData)

    try {
      setLoading(true)
      await dispatch(submitFreeAccount(formData)).unwrap()
      setSuccess(true)
      
      // Form başarılı ise formu temizle
      setName('')
      setEmail('')
      setCountry('')
      setCompany('')
      setPosition('')
      setDataPrivacy([])
      
      // RadioGroup'un tamamen yenilenmesi için key'i değiştir
      setFormKey(prev => prev + 1)
      
      // Yeni bir CAPTCHA oluştur
      generateNewCaptcha()

      // 5 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
      
    } catch (error) {
      console.error('Form gönderim hatası:', error)
      setError('Form gönderilirken bir hata oluştu')
      // 5 saniye sonra error mesajını kaldır
      setTimeout(() => {
        setError('')
      }, 5000)
      generateNewCaptcha()
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: pricing3,
      title: 'Records of Processing'
    },
    {
      icon: pricing5,
      title: 'Assessment Tools'
    },
    {
      icon: pricing7,
      title: 'Vendor Screening'
    },
    {
      icon: pricing2,
      title: 'Document Drafting'
    },
    {
      icon: pricing4,
      title: 'Real Time Monitoring'
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-600">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-row items-center gap-3">
                <div className="w-8 flex-shrink-0">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{t(`features.${feature.title}`)}</span>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.fullName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('form.fullNamePlaceholder')}
                  style={{ backgroundColor: '#F1F2FF !important' }}
                  className="w-full rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.companyName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t('form.companyNamePlaceholder')}
                  style={{ backgroundColor: '#F1F2FF !important' }}
                  className="w-full rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.employeeCount')} <span className="text-red-500">*</span>
                </label>
                <RadioGroup
                  value={position}
                  onValueChange={setPosition}
                  className="flex flex-col gap-2"
                  required
                >
                  <Radio value="just-me">{t('form.justMe')}</Radio>
                  <Radio value="2-9">2-9</Radio>
                  <Radio value="10-99">10-99</Radio>
                  <Radio value="100-299">100-299</Radio>
                  <Radio value="300+">{t('form.moreThan300')}</Radio>
                </RadioGroup>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.region')} <span className="text-red-500">*</span>
                </label>
                <Select
                  selectedKeys={country ? [country] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    console.log('Seçilen ülke:', selectedKey);
                    setCountry(selectedKey);
                  }}
                  placeholder={t('form.regionPlaceholder')}
                  className="w-full rounded-lg"
                >
                  <SelectItem key="Europe" value="Europe">Europe</SelectItem>
                  <SelectItem key="United Kingdom" value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem key="Türkiye" value="Türkiye">Türkiye</SelectItem>
                  <SelectItem key="Other" value="Other">Other</SelectItem>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.email')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('form.emailPlaceholder')}
                  style={{ backgroundColor: '#F1F2FF !important' }}
                  className="w-full rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {num1} + {num2} = ? <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={captchaAnswer}
                  onChange={handleCaptchaChange}
                  placeholder="Sonucu giriniz"
                  style={{ backgroundColor: '#F1F2FF !important' }}
                  className={`w-full rounded-lg ${captchaError ? "border-red-500" : ""}`}
                  required
                />
                {captchaError && (
                  <p className="text-red-500 text-sm mt-1">
                    Lütfen işlemi doğru bir şekilde çözün
                  </p>
                )}
              </div>

              <div>
                <CheckboxGroup
                  value={dataPrivacy}
                  onChange={(val) => {
                    console.log('Gizlilik politikası onayı:', val);
                    setDataPrivacy(Array.isArray(val) ? val : []);
                  }}
                  className="mt-2"
                >
                  <Checkbox value="accepted" required>
                    <span className="text-sm text-gray-600">
                      {t.rich('form.terms', {
                        link: (chunks) => (
                          <Link href="/legal" className="text-[#6366F1] hover:text-[#4F46E5]">
                            {chunks}
                          </Link>
                        ),
                      })}
                    </span>
                  </Checkbox>
                </CheckboxGroup>
              </div>

              <Button
                type="submit"
                variant="shadow"
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-3 rounded-lg"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  t('form.submit')
                )}
              </Button>

              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                  <p className="text-red-600 text-sm text-center">
                    {formError}
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                  <p className="text-red-600 text-sm text-center">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                  <p className="text-green-600 text-sm text-center">
                    {t('successMessage')}
                  </p>
                </div>
              )}
            </form>

            <div className="mt-8">
              <p className="text-sm text-gray-600">
                {t.rich('privacyNotice', {
                  link: (chunks) => (
                    <Link href="/legal" className="text-[#6366F1] hover:text-[#4F46E5]">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TryForFree

// Pages Router için doğru yöntem: Sayfanın en üstüne bu kodu ekle
export async function getStaticProps({ locale }) {
  // _app.js'teki App.getInitialProps zaten mesajları yüklüyor, burada sadece locale'ı geçiyoruz
  return {
    props: {
      // Bu prop sayesinde middleware bu sayfayı doğru locale ile yükleyecek
      locale
    }
  };
}