import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button, Card, CardBody, Progress } from "@heroui/react"
import { FaFilePdf, FaFileWord, FaDownload, FaUpload, FaCheckCircle } from 'react-icons/fa'

const Pdfcevirici = () => {
  const [file, setFile] = useState(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [converted, setConverted] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
      setConverted(false)
    } else {
      setError('Lütfen geçerli bir PDF dosyası seçin!')
      setFile(null)
    }
  }

  const convertPdfToWord = async () => {
    if (!file) {
      setError('Lütfen bir PDF dosyası seçin!')
      return
    }

    setConverting(true)
    setProgress(0)
    setError('')

    try {
      // Dinamik import - sadece client-side'da yükle
      const pdfjsLib = await import('pdfjs-dist')
      const { Document, Packer, Paragraph, TextRun } = await import('docx')
      const { saveAs } = await import('file-saver')

      // Worker'ı ayarla - public klasöründen
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
      }

      // PDF dosyasını oku
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      setProgress(20)

      const totalPages = pdf.numPages
      const paragraphs = []
      
      // Her sayfadan metin ve stil çıkar
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Satırları Y pozisyonuna göre grupla
        const lines = {}
        
        textContent.items.forEach(item => {
          if (!item.str.trim()) return
          
          // Y pozisyonuna göre satırları grupla (yakın değerler aynı satır)
          const y = Math.round(item.transform[5])
          
          if (!lines[y]) {
            lines[y] = []
          }
          
          // Font bilgilerini detaylı çıkar
          const fontName = item.fontName || ''
          const transform = item.transform
          
          // Font boyutu - Transform matrisinden al (en doğru yöntem)
          // transform[0] = scaleX, transform[3] = scaleY
          const scaleX = Math.abs(transform[0])
          const scaleY = Math.abs(transform[3])
          const fontSize = Math.max(scaleX, scaleY) * 2 // Word için punto çarpanı
          
          // Font stillerini algıla (çok daha kapsamlı)
          const fontLower = fontName.toLowerCase()
          
          // Bold kontrolü
          const isBold = fontLower.includes('bold') || 
                        fontLower.includes('heavy') || 
                        fontLower.includes('black') ||
                        fontLower.includes('semibold') ||
                        fontLower.includes('extrabold') ||
                        fontLower.includes('demibold') ||
                        fontLower.match(/[-_]b(?![a-z])/) || // -B veya _B ile biten
                        (item.width / item.str.length > scaleX * 0.7) // Geniş karakterler
          
          // Italic kontrolü
          const isItalic = fontLower.includes('italic') || 
                          fontLower.includes('oblique') ||
                          fontLower.includes('slant') ||
                          fontLower.match(/[-_]i(?![a-z])/) || // -I veya _I ile biten
                          Math.abs(transform[2]) > 0.1 // Eğik transform matrisi
          
          lines[y].push({
            text: item.str,
            x: item.transform[4],
            fontSize: Math.round(fontSize),
            isBold,
            isItalic,
            fontName: fontName,
          })
        })

        // Satırları Y pozisyonuna göre sırala (yukarıdan aşağıya)
        const sortedLines = Object.keys(lines)
          .sort((a, b) => parseFloat(b) - parseFloat(a))
          .map(y => lines[y])

        // Her satırı Word paragrafına çevir
        sortedLines.forEach(lineItems => {
          if (lineItems.length === 0) return
          
          // Satırdaki öğeleri X pozisyonuna göre sırala (soldan sağa)
          lineItems.sort((a, b) => a.x - b.x)
          
          // Paragraf oluştur
          const textRuns = []
          let lastX = 0
          
          lineItems.forEach((item, index) => {
            // Öğeler arasında boşluk varsa ekle
            if (index > 0 && item.x - lastX > 10) {
              textRuns.push(
                new TextRun({
                  text: ' ',
                  size: item.fontSize,
                })
              )
            }
            
            textRuns.push(
              new TextRun({
                text: item.text,
                size: item.fontSize,
                bold: item.isBold,
                italics: item.isItalic,
                font: 'Calibri',
              })
            )
            
            lastX = item.x + (item.text.length * 5)
          })
          
          if (textRuns.length > 0) {
            paragraphs.push(
              new Paragraph({
                children: textRuns,
                spacing: { 
                  before: 60,
                  after: 60,
                },
              })
            )
          }
        })

        // Sayfalar arası boşluk (son sayfa hariç)
        if (pageNum < totalPages) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: '' })],
              spacing: { after: 600 },
              pageBreakBefore: true, // Sayfa sonu ekle
            })
          )
        }

        setProgress(20 + (pageNum / totalPages) * 60)
      }

      setProgress(80)

      // Word belgesi oluştur
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      })

      setProgress(90)

      // Word dosyasını indir
      const blob = await Packer.toBlob(doc)
      const fileName = file.name.replace('.pdf', '.docx')
      saveAs(blob, fileName)

      setProgress(100)
      setConverted(true)
      setConverting(false)

    } catch (err) {
      console.error('Dönüştürme hatası:', err)
      setError('PDF dönüştürülürken bir hata oluştu. Lütfen tekrar deneyin.')
      setConverting(false)
      setProgress(0)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>PDF'den Word'e Çevirici | Ücretsiz Online Dönüştürücü</title>
        <meta name="description" content="PDF dosyalarınızı ücretsiz olarak Word belgesine çevirin. Hızlı, güvenli ve kolay kullanım." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <FaFilePdf className="w-16 h-16 text-red-500" />
              <div className="text-4xl font-bold text-gray-400">→</div>
              <FaFileWord className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PDF'den Word'e Çevirici
            </h1>
            <p className="text-lg text-gray-600">
              PDF dosyalarınızı kolayca Word belgesine dönüştürün
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border border-gray-200">
            <CardBody className="p-8 md:p-12">
              
              {/* Upload Area */}
              <div className="mb-8">
                <label 
                  htmlFor="pdf-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-16 h-16 mb-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    {file ? (
                      <>
                        <FaFilePdf className="w-12 h-12 text-red-500 mb-2" />
                        <p className="text-lg font-semibold text-gray-700">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                    ) : (
                      <>
                        <p className="mb-2 text-lg font-semibold text-gray-700">
                          PDF dosyanızı seçin veya sürükleyin
                        </p>
                        <p className="text-sm text-gray-500">PDF dosyaları desteklenir</p>
                      </>
                    )}
                  </div>
                  <input 
                    id="pdf-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-center font-medium">{error}</p>
                </div>
              )}

              {/* Progress Bar */}
              {converting && (
                <div className="mb-6">
                  <Progress 
                    value={progress} 
                    className="mb-2"
                    color="primary"
                    size="lg"
                  />
                  <p className="text-center text-gray-600 font-medium">
                    Dönüştürülüyor... %{Math.round(progress)}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {converted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-3">
                  <FaCheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-600 text-center font-medium">
                    Word belgesi başarıyla indirildi!
                  </p>
                </div>
              )}

              {/* Convert Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-8 shadow-lg hover:shadow-xl transition-all"
                startContent={converted ? <FaCheckCircle className="w-6 h-6" /> : <FaFileWord className="w-6 h-6" />}
                onClick={convertPdfToWord}
                isDisabled={!file || converting}
                isLoading={converting}
              >
                {converting ? 'Dönüştürülüyor...' : converted ? 'Tekrar Dönüştür' : 'Word\'e Dönüştür'}
              </Button>

            </CardBody>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUpload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kolay Kullanım</h3>
              <p className="text-sm text-gray-600">Sürükle bırak ile hızlı yükleme</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hızlı Dönüşüm</h3>
              <p className="text-sm text-gray-600">Saniyeler içinde hazır</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDownload className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ücretsiz</h3>
              <p className="text-sm text-gray-600">Limitsiz dönüştürme</p>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Pdfcevirici