export const kasaHareketleri = [
  {
    id: 1,
    tarih: "2024-02-08T09:30:00",
    islem_tipi: "gelir",
    odeme_yontemi: "Kreditkarte",
    miktar: 1500.00,
    para_birimi: "CHF",
    aciklama: "Online Verkauf #12345",
    kategori: "E-Commerce"
  },
  {
    id: 2,
    tarih: "2024-02-08T11:45:00",
    islem_tipi: "gider",
    odeme_yontemi: "Überweisung",
    miktar: 250.50,
    para_birimi: "CHF",
    aciklama: "Software Lizenz",
    kategori: "Hollisbau"
  },
  {
    id: 3,
    tarih: "2024-02-08T14:20:00",
    islem_tipi: "gelir",
    odeme_yontemi: "Kreditkarte",
    miktar: 2750.00,
    para_birimi: "CHF",
    aciklama: "Webshop Bestellung #54321",
    kategori: "E-Commerce"
  },
  {
    id: 4,
    tarih: "2024-02-08T16:00:00",
    islem_tipi: "gider",
    odeme_yontemi: "Überweisung",
    miktar: 180.00,
    para_birimi: "CHF",
    aciklama: "Büromaterial",
    kategori: "Hollisbau"
  },
  {
    id: 5,
    tarih: "2024-02-09T10:15:00",
    islem_tipi: "gelir",
    odeme_yontemi: "Kreditkarte",
    miktar: 3200.00,
    para_birimi: "CHF",
    aciklama: "CRM Jahreslizenz",
    kategori: "CRM"
  }
];

export const kasaOzeti = {
  gunluk: {
    toplam_giris: 7450.00,
    toplam_cikis: 430.50,
    net: 7019.50,
    islem_sayisi: 5
  },
  haftalik: {
    toplam_giris: 32450.00,
    toplam_cikis: 2830.50,
    net: 29619.50,
    islem_sayisi: 28
  },
  aylik: {
    toplam_giris: 125450.00,
    toplam_cikis: 12830.50,
    net: 112619.50,
    islem_sayisi: 120
  }
};

export const odemeYontemleriDagilimi = [
  { yontem: "Kreditkarte", oran: 65, miktar: 7450.00 },
  { yontem: "Überweisung", oran: 35, miktar: 430.50 }
];

export const kategoriDagilimi = [
  { kategori: "E-Commerce", oran: 65, miktar: 4250.00 },
  { kategori: "CRM", oran: 20, miktar: 3200.00 },
  { kategori: "Hollisbau", oran: 15, miktar: 430.50 }
];

