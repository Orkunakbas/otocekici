import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getSession } from 'next-auth/react'

// Kullanıcı rolüne göre şirket ID'lerini belirleyen yardımcı fonksiyon
const getCompanyIds = (userRole, companies) => {
  if (!companies || !Array.isArray(companies)) return []
  
  if (userRole === 'danışman') {
    // Danışman rolü için sadece aktif şirketlerin ID'lerini döndür
    return companies
      .filter(company => company.company_active)
      .map(company => company.company_id)
  } else {
    // Diğer roller için tüm şirket ID'lerini döndür
    return companies.map(company => company.company_id)
  }
}

// Örnek giriş kayıtları verisi - kullanıcının belirttiği formata göre düzenlendi
const mockGirisKayitlari = [
  {
    "id": 1320,
    "rol": "danışman",
    "company_id": 21,
    "e_posta": "admin@dpox.demo",
    "giris_tarihi": "2025-03-17",
    "giris_saati": "05:21:27"
  },
  {
    "id": 1319,
    "rol": "temsilci",
    "company_id": 21,
    "e_posta": "mehmet@dpox.demo",
    "giris_tarihi": "2025-03-17",
    "giris_saati": "05:21:11"
  },
  {
    "id": 1318,
    "rol": "danışman",
    "company_id": 14,
    "e_posta": "olsan.sozen@sozenlegal.com",
    "giris_tarihi": "2025-03-17",
    "giris_saati": "04:21:44"
  },
  {
    "id": 1317,
    "rol": "danışman",
    "company_id": 14,
    "e_posta": "olsan.sozen@sozenlegal.com",
    "giris_tarihi": "2025-03-17",
    "giris_saati": "04:21:43"
  }
];

// Örnek departman verisi
const mockDepartments = [
  {
    "department_id": 66,
    "department_name": "İnsan Kaynakları",
    "company_id": 14,
    "company_name": "Ana Sigorta Anonim Şirketi"
  },
  {
    "department_id": 70,
    "department_name": "Pazarlama",
    "company_id": 14,
    "company_name": "Ana Sigorta Anonim Şirketi"
  },
  {
    "department_id": 72,
    "department_name": "Sağlık Sigortaları",
    "company_id": 14,
    "company_name": "Ana Sigorta Anonim Şirketi"
  },
  {
    "department_id": 75,
    "department_name": "Oto Teknik",
    "company_id": 14,
    "company_name": "Ana Sigorta Anonim Şirketi"
  }
];

// Örnek şirket verisi
const mockCompanies = [
  {
    "company_id": 14,
    "company_name": "Ana Sigorta Anonim Şirketi",
    "company_active": true
  },
  {
    "company_id": 21,
    "company_name": "Test Şirketi",
    "company_active": true
  }
];

// Performans verilerini getiren async thunk
export const fetchPerformanceData = createAsyncThunk(
  'performance/fetchData',
  async () => {
    try {
      console.log('Performans verileri getiriliyor...');
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        girisKayitlari: mockGirisKayitlari,
        departments: mockDepartments,
        companies: mockCompanies,
        userRole: 'yönetici'
      };
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      throw error;
    }
  }
);

const performanceSlice = createSlice({
  name: 'performance',
  initialState: {
    girisKayitlari: [],
    departments: [],
    companies: [],
    envanterGuncellemeleri: [],
    loading: false,
    error: null,
    userRole: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.girisKayitlari = action.payload.girisKayitlari;
        state.departments = action.payload.departments;
        state.companies = action.payload.companies;
        state.userRole = action.payload.userRole;
        console.log('Performans verileri başarıyla yüklendi:', action.payload);
      })
      .addCase(fetchPerformanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('Performans verileri yüklenirken hata oluştu:', action.error);
      });
  }
});

export default performanceSlice.reducer 