import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API'den giriş kayıtları verilerini çeken thunk
export const fetchGirisKayitlariData = createAsyncThunk(
  'girisKayitlari/fetchData',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Kullanıcı bilgilerini Redux store'dan al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // API isteği yap
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/giris-kayitlari/list`);
      
      if (!response.data) {
        throw new Error('API yanıtında veri yok');
      }
      
      // API'den gelen verileri döndür
      return {
        girisKayitlari: response.data,
        userInfo // Kullanıcı bilgilerini de döndür
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Veri çekilirken bir hata oluştu');
    }
  }
);

// Kullanıcı rolüne göre şirket ID'lerini belirleyen yardımcı fonksiyon
const getCompanyIds = (user) => {
  let companyIds = [];
  
  if (!user || !user.companies || user.companies.length === 0) {
    return companyIds;
  }
  
  // Danışman rolü: Sadece aktif şirket
  if (user.role === 'danışman') {
    const activeCompany = user.companies.find(company => company.company_active === true);
    if (activeCompany) {
      companyIds = [String(activeCompany.company_id)];
    } else {
      // Aktif şirket bulunamazsa, ilk şirketi kullan
      if (user.companies.length > 0) {
        companyIds = [String(user.companies[0].company_id)];
      }
    }
  } 
  // Yönetici rolü: Kendi şirketi
  else if (user.role === 'yönetici') {
    companyIds = [String(user.companies[0].company_id)];
  }
  // Temsilci rolü için de şirket ID'si ekle
  else if (user.role === 'temsilci' && user.companies.length > 0) {
    companyIds = [String(user.companies[0].company_id)];
  }
  
  return companyIds;
};

// Verileri şirket ID'lerine göre filtreleyen fonksiyon
const filterDataByCompany = (data, companyIds) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  if (companyIds.length === 0) {
    return data; // Şirket ID'si yoksa tüm verileri göster
  }
  
  // Şirkete ait kayıtları filtrele
  const filteredData = data.filter(item => {
    if (!item.company_id) return false; // company_id yoksa filtreleme dışında tut
    return companyIds.includes(String(item.company_id));
  });
  
  return filteredData;
};

const girisKayitlariSlice = createSlice({
  name: 'girisKayitlari',
  initialState: {
    rawData: {
      girisKayitlari: []
    },
    filteredData: {
      girisKayitlari: []
    },
    loading: true,
    error: null,
    userRole: null
  },
  reducers: {
    // Şirket değiştiğinde verileri yeniden filtrele
    updateGirisKayitlariData: (state, action) => {
      const { user } = action.payload;
      
      if (state.rawData && user) {
        const companyIds = getCompanyIds(user);
        
        state.filteredData = {
          girisKayitlari: filterDataByCompany(state.rawData.girisKayitlari, companyIds)
        };
        
        state.userRole = user.role;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGirisKayitlariData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGirisKayitlariData.fulfilled, (state, action) => {
        // Ham verileri kaydet
        state.rawData = {
          girisKayitlari: action.payload.girisKayitlari || []
        };
        
        // Kullanıcı bilgilerini al
        const userInfo = action.payload.userInfo;
        
        if (userInfo) {
          const companyIds = getCompanyIds(userInfo);
          
          state.filteredData = {
            girisKayitlari: filterDataByCompany(state.rawData.girisKayitlari, companyIds)
          };
          
          state.userRole = userInfo.role;
        } else {
          // Kullanıcı bilgisi yoksa tüm verileri göster
          state.filteredData = {
            girisKayitlari: state.rawData.girisKayitlari
          };
        }
        
        state.loading = false;
      })
      .addCase(fetchGirisKayitlariData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Bilinmeyen bir hata oluştu';
        state.filteredData = {
          girisKayitlari: []
        };
      });
  }
});

export const { updateGirisKayitlariData } = girisKayitlariSlice.actions;
export default girisKayitlariSlice.reducer; 