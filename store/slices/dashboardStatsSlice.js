import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API'den tüm istatistik verilerini çeken thunk
export const fetchDashboardStats = createAsyncThunk(
  'dashboardStats/fetchStats',
  async (_, { getState }) => {
    try {
      // Kullanıcı bilgilerini Redux store'dan al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // Gerçek API'den verileri çek - paralel olarak çek
      const [
        aksiyonlarResponse, 
        veriHaritaResponse, 
        veriAktarimResponse,
        kamuAktarimResponse,
        digerAktarimResponse,
        varlikListesiResponse
      ] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/aksiyonlar/list`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/veriharita/list`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/veriaktarim/list`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kamu-aktarimlari/list`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diger-aktarimlar/list`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/varlik-listesi/list`)
      ]);
      
      // API'den gelen verileri döndür
      return {
        aksiyonlar: aksiyonlarResponse.data || [],
        veriHarita: veriHaritaResponse.data || [],
        veriAktarim: veriAktarimResponse.data || [],
        kamuAktarim: kamuAktarimResponse.data || [],
        digerAktarim: digerAktarimResponse.data || [],
        varlikListesi: varlikListesiResponse.data || [],
        userInfo // Kullanıcı bilgilerini de döndür
      };
    } catch (error) {
      console.error('Dashboard verileri çekilirken hata oluştu:', error);
      return { 
        aksiyonlar: [],
        veriHarita: [],
        veriAktarim: [],
        kamuAktarim: [],
        digerAktarim: [],
        varlikListesi: []
      };
    }
  }
);

// Kullanıcı rolüne göre şirket ve departman ID'lerini belirleyen yardımcı fonksiyon
const getCompanyAndDepartmentIds = (user) => {
  let companyIds = [];
  let departmentId = null;
  
  if (!user || !user.companies || user.companies.length === 0) {
    return { companyIds, departmentId };
  }
  
  // Danışman rolü: Sadece aktif şirket
  if (user.role === 'danışman') {
    const activeCompany = user.companies.find(company => company.company_active === true);
    if (activeCompany) {
      companyIds = [String(activeCompany.company_id)];
    }
  } 
  // Yönetici rolü: Kendi şirketi
  else if (user.role === 'yönetici') {
    companyIds = [String(user.companies[0].company_id)];
  }
  // Temsilci rolü: Sadece kendi şirketi ve departmanı
  else if (user.role === 'temsilci') {
    companyIds = [String(user.companies[0].company_id)];
    departmentId = user.companies[0].department_id ? String(user.companies[0].department_id) : null;
  }
  
  return { companyIds, departmentId };
};

// Genel filtreleme fonksiyonu
const filterDataByRole = (data, user, dataType, additionalFilter = null) => {
  // Veri yoksa boş dizi döndür
  if (!user || !data || !data[dataType] || !Array.isArray(data[dataType])) {
    return [];
  }
  
  // Temsilci rolü için varlık listesi gösterilmeyecek
  if (user.role === 'temsilci' && dataType === 'varlikListesi') {
    return [];
  }
  
  // Şirket ve departman ID'lerini al
  const { companyIds, departmentId } = getCompanyAndDepartmentIds(user);
  
  // Verileri filtrele
  return data[dataType].filter(item => {
    // Şirket ID'si kontrolü
    const companyMatch = companyIds.includes(String(item.company_id));
    
    // Departman kontrolü (sadece temsilci rolü için)
    let departmentMatch = true;
    if (user.role === 'temsilci' && departmentId) {
      departmentMatch = String(item.department_id) === departmentId;
    }
    
    // Ek filtre varsa uygula (örn. aksiyonlar için durum=false kontrolü)
    const additionalMatch = additionalFilter ? additionalFilter(item) : true;
    
    return companyMatch && departmentMatch && additionalMatch;
  });
};

const dashboardStatsSlice = createSlice({
  name: 'dashboardStats',
  initialState: {
    rawData: null,
    filteredAksiyonlar: [],
    filteredVeriHarita: [],
    filteredVeriAktarim: [],
    filteredKamuAktarim: [],
    filteredDigerAktarim: [],
    filteredVarlikListesi: [],
    filteredStats: {
      veriHaritaSayisi: null,
      veriAktarimSayisi: null,
      kamuAktarimSayisi: null,
      digerAktarimSayisi: null,
      varlikListesiSayisi: null,
      aksiyonlarSayisi: null,
      tedarikcilerSayisi: null
    },
    loading: true, // Başlangıçta loading true olarak ayarla
    error: null
  },
  reducers: {
    // Şirket değiştiğinde verileri yeniden filtrele
    updateFilteredStats: (state, action) => {
      const { user } = action.payload;
      
      if (state.rawData && user) {
        // Tüm verileri filtrele
        state.filteredAksiyonlar = filterDataByRole(state.rawData, user, 'aksiyonlar', item => item.durum === false);
        state.filteredVeriHarita = filterDataByRole(state.rawData, user, 'veriHarita');
        state.filteredVeriAktarim = filterDataByRole(state.rawData, user, 'veriAktarim');
        state.filteredKamuAktarim = filterDataByRole(state.rawData, user, 'kamuAktarim');
        state.filteredDigerAktarim = filterDataByRole(state.rawData, user, 'digerAktarim');
        state.filteredVarlikListesi = filterDataByRole(state.rawData, user, 'varlikListesi');
        
        // İstatistikleri güncelle
        state.filteredStats = {
          ...state.filteredStats,
          aksiyonlarSayisi: state.filteredAksiyonlar.length,
          veriHaritaSayisi: state.filteredVeriHarita.length,
          tedarikcilerSayisi: state.filteredVeriAktarim.length,
          kamuAktarimSayisi: state.filteredKamuAktarim.length,
          digerAktarimSayisi: state.filteredDigerAktarim.length,
          varlikListesiSayisi: state.filteredVarlikListesi.length
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Loading durumunda değerleri null olarak ayarla
        state.filteredStats = {
          ...state.filteredStats,
          aksiyonlarSayisi: null,
          veriHaritaSayisi: null,
          tedarikcilerSayisi: null,
          kamuAktarimSayisi: null,
          digerAktarimSayisi: null,
          varlikListesiSayisi: null
        };
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.rawData = {
          aksiyonlar: action.payload.aksiyonlar || [],
          veriHarita: action.payload.veriHarita || [],
          veriAktarim: action.payload.veriAktarim || [],
          kamuAktarim: action.payload.kamuAktarim || [],
          digerAktarim: action.payload.digerAktarim || [],
          varlikListesi: action.payload.varlikListesi || []
        };
        
        // Filtreleme işlemini gerçekleştir
        if (state.rawData) {
          // Kullanıcı bilgilerini al
          const userInfo = action.payload.userInfo;
          
          if (userInfo) {
            // Tüm verileri filtrele
            state.filteredAksiyonlar = filterDataByRole(state.rawData, userInfo, 'aksiyonlar', item => item.durum === false);
            state.filteredVeriHarita = filterDataByRole(state.rawData, userInfo, 'veriHarita');
            state.filteredVeriAktarim = filterDataByRole(state.rawData, userInfo, 'veriAktarim');
            state.filteredKamuAktarim = filterDataByRole(state.rawData, userInfo, 'kamuAktarim');
            state.filteredDigerAktarim = filterDataByRole(state.rawData, userInfo, 'digerAktarim');
            state.filteredVarlikListesi = filterDataByRole(state.rawData, userInfo, 'varlikListesi');
            
            // İstatistikleri güncelle
            state.filteredStats = {
              ...state.filteredStats,
              aksiyonlarSayisi: state.filteredAksiyonlar.length,
              veriHaritaSayisi: state.filteredVeriHarita.length,
              tedarikcilerSayisi: state.filteredVeriAktarim.length,
              kamuAktarimSayisi: state.filteredKamuAktarim.length,
              digerAktarimSayisi: state.filteredDigerAktarim.length,
              varlikListesiSayisi: state.filteredVarlikListesi.length
            };
          } else {
            // Kullanıcı bilgisi yoksa tüm verileri göster
            state.filteredStats = {
              ...state.filteredStats,
              aksiyonlarSayisi: state.rawData.aksiyonlar.filter(item => item.durum === false).length,
              veriHaritaSayisi: state.rawData.veriHarita.length,
              tedarikcilerSayisi: state.rawData.veriAktarim.length,
              kamuAktarimSayisi: state.rawData.kamuAktarim.length,
              digerAktarimSayisi: state.rawData.digerAktarim.length,
              varlikListesiSayisi: state.rawData.varlikListesi.length
            };
          }
        }
        
        // En son loading'i false yap
        state.loading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Hata durumunda değerleri 0 olarak ayarla
        state.filteredStats = {
          ...state.filteredStats,
          aksiyonlarSayisi: 0,
          veriHaritaSayisi: 0,
          tedarikcilerSayisi: 0,
          kamuAktarimSayisi: 0,
          digerAktarimSayisi: 0,
          varlikListesiSayisi: 0
        };
      });
  }
});

export const { updateFilteredStats } = dashboardStatsSlice.actions;
export default dashboardStatsSlice.reducer;
