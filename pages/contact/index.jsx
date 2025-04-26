import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Input, Select, SelectItem, CheckboxGroup, Checkbox, RadioGroup, Radio } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { submitForm } from '@/store/slices/formGonderSlice'
import Navbar from '@/components/menu/Navbar'
import Footer from '@/components/frontend/Footer'
import Image from 'next/image'
import darkLogo from '@/images/dark-logo.png'
import Link from 'next/link'
import { IoIosSend } from "react-icons/io"

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

const Contact = () => {
  const t = useTranslations('frontend.contact')
  const dispatch = useDispatch()
  
  // Redux state'lerini local state'e taşı
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [returnContact, setReturnContact] = useState([])
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

  // Form hata mesajlarını 4 saniye sonra kaldır
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => {
        setFormError('')
      }, 4000)
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
    
    if (!name.trim()) missingFields.push(t('nameSurname'))
    if (!email.trim()) missingFields.push(t('email'))
    if (!phone.trim()) missingFields.push(t('phone'))
    if (!country || country === '') missingFields.push(t('region'))
    if (!company.trim()) missingFields.push(t('company'))
    if (!position) missingFields.push(t('professional'))
    
    // İletişim tercihi kontrolü
    if (returnContact.length === 0) {
      missingFields.push(t('preferredContact'))
    }
    
    // Gizlilik tercihi kontrolü
    if (dataPrivacy.length === 0) {
      missingFields.push(t('marketingConsent'))
    }
    
    // Eksik alanlar varsa hata mesajı oluştur
    if (missingFields.length > 0) {
      const missingFieldsText = missingFields.join(', ')
      setFormError(`Lütfen aşağıdaki alanları doldurun: ${missingFieldsText}`)
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
      tel: phone,
      country: country,
      company: company,
      position: position,
      return_contact: returnContact,
      data_privacy: dataPrivacy,
      approval: dataPrivacy.length > 0
    }

    console.log('Form bileşeninden gönderilen veri:', formData)

    try {
      setLoading(true)
      await dispatch(submitForm(formData)).unwrap()
      setSuccess(true)
      
      // Form başarılı ise formu temizle
      setName('')
      setEmail('')
      setPhone('')
      setCountry('')
      setCompany('')
      setPosition('')
      setReturnContact([])
      setDataPrivacy([])
      
      // RadioGroup'un tamamen yenilenmesi için key'i değiştir
      setFormKey(prev => prev + 1)
      
      // Yeni bir CAPTCHA oluştur
      generateNewCaptcha();
    } catch (error) {
      console.error('Form gönderim hatası:', error)
      setError('Form gönderilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            <p className="text-gray-600">{t('description')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('nameSurname')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('nameSurnamePlaceholder')}
                    style={{ backgroundColor: '#F1F2FF !important' }}
                    className="w-full rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('region')} <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    selectedKeys={country ? [country] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      console.log('Seçilen ülke:', selectedKey);
                      setCountry(selectedKey);
                    }}
                    placeholder={t('regionPlaceholder')}
                    className="w-full rounded-lg"
                  >
                    <SelectItem key="europe">{t('europe')}</SelectItem>
                    <SelectItem key="uk">{t('uk')}</SelectItem>
                    <SelectItem key="turkiye">{t('turkiye')}</SelectItem>
                    <SelectItem key="other">{t('other')}</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('company')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t('companyPlaceholder')}
                    style={{ backgroundColor: '#F1F2FF !important' }}
                    className="w-full rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('professional')} <span className="text-red-500">*</span>
                  </label>
                  <RadioGroup 
                    key={formKey}
                    value={position} 
                    onValueChange={setPosition}
                    className="mt-2"
                  >
                    <Radio value="yes">{t('yes')}</Radio>
                    <Radio value="no">{t('no')}</Radio>
                  </RadioGroup>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    style={{ backgroundColor: '#F1F2FF !important' }}
                    className="w-full rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    style={{ backgroundColor: '#F1F2FF !important' }}
                    className="w-full rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('preferredContact')} <span className="text-red-500">*</span>
                  </label>
                  <CheckboxGroup 
                    value={returnContact}
                    onChange={(val) => {
                      console.log('Seçilen iletişim tercihleri:', val);
                      setReturnContact(Array.isArray(val) ? val : []);
                    }}
                    className="mt-2 space-y-2"
                  >
                    <Checkbox value="email">{t('byEmail')}</Checkbox>
                    <Checkbox value="phone">{t('byPhone')}</Checkbox>
                  </CheckboxGroup>
                </div>

                <div>
                  <h3 className="text-lg text-gray-700 mb-2">
                    {t('marketingConsent')} <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-gray-600 mb-4">{t('marketingDescription')}</p>
                  <p className="text-gray-600 mb-4">{t('consentText')}</p>
                  
                  <CheckboxGroup 
                    value={dataPrivacy}
                    onChange={(val) => {
                      console.log('Seçilen gizlilik tercihleri:', val);
                      setDataPrivacy(Array.isArray(val) ? val : []);
                    }}
                    className="mb-4 space-y-2"
                  >
                    <Checkbox value="email">{t('byEmail')}</Checkbox>
                    <Checkbox value="phone">{t('byPhone')}</Checkbox>
                  </CheckboxGroup>

                  <p className="text-gray-600 mb-6">{t('withdrawalText')}</p>
                </div>
                
                {/* Güvenlik doğrulama bölümü */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Güvenlik Doğrulaması <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-medium">{num1} + {num2} = ?</span>
                    <button 
                      type="button" 
                      onClick={generateNewCaptcha} 
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Yenile
                    </button>
                  </div>
                  <Input
                    type="number"
                    value={captchaAnswer}
                    onChange={handleCaptchaChange}
                    placeholder="Lütfen sonucu girin"
                    isInvalid={captchaError}
                    style={{ backgroundColor: '#F1F2FF !important' }}
                    className="w-full rounded-lg"
                  />
                  {captchaError && (
                    <p className="text-red-600 text-sm mt-1">Lütfen doğru cevabı girin.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#38216e] text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <IoIosSend className="w-5 h-5" />
                      <span>{t('submit')}</span>
                    </>
                  )}
                </button>

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
            </div>

            <div>
              <div className="bg-[#f9fafc] p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">{t('writeToUs')}</h2>
                <p className="text-gray-600 mb-8">{t('writeToUsDescription')}</p>
                
                <div className="flex items-center space-x-2 mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#817fec]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <Link href="mailto:contact@dpox.co.uk" className="hover:underline text-gray-900">
                    contact@dpox.co.uk
                  </Link>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold mb-2">DpoX Limited</h3>
                  <Image
                    src={darkLogo}
                    alt="DpoX Logo"
                    width={120}
                    height={40}
                    className="w-[80px] h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact

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