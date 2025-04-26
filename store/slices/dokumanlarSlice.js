import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API'den dokümanları çeken thunk
export const fetchDokumanlar = createAsyncThunk(
  'dokumanlar/fetchDokumanlar',
  async (_, { getState }) => {
    try {
      // Kullanıcı bilgilerini Redux store'dan al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // API'den dokümanları çek
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/list`);
      
      // API'den gelen verileri döndür
      return {
        dokumanlar: response.data || [],
        userInfo // Kullanıcı bilgilerini de döndür
      };
    } catch (error) {
      return { 
        dokumanlar: []
      };
    }
  }
);

// Tek bir dökümanı ID'ye göre çeken thunk
export const fetchSingleDokuman = createAsyncThunk(
  'dokumanlar/fetchSingleDokuman',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/single/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Doküman detayı çekilirken bir hata oluştu.');
    }
  }
);

// Doküman güncelleme thunk'ı
export const updateDokuman = createAsyncThunk(
  'dokumanlar/updateDokuman',
  async ({ id, formData }, { rejectWithValue, getState }) => {
    try {
      // FormData objesi oluştur
      const data = new FormData();
      
      // Döküman ismi
      data.append('dokuman_ismi', formData.dokuman_ismi);
      
      // Döküman türü - string olduğundan emin ol
      const dokuman_tur = typeof formData.dokuman_tur === 'string' 
        ? formData.dokuman_tur 
        : (formData.dokuman_tur?.toString() || '');
      data.append('dokuman_tur', dokuman_tur);
      
      // Son güncelleme tarihi
      data.append('lastupdated', formData.lastUpdated || new Date().toISOString().split('T')[0]);
      
      // Aktif şirket ID'sini al
      const userInfo = getState().userInfo.data;
      let company_id = null;
      
      if (userInfo.role === 'danışman') {
        // Danışman için aktif şirket ID'sini bul
        const activeCompany = userInfo.companies.find(company => company.company_active);
        if (activeCompany) {
          company_id = activeCompany.company_id;
        }
      }
      
      if (!company_id && userInfo.companies && userInfo.companies.length > 0) {
        // Eğer aktif şirket bulunamadıysa ilk şirketi kullan
        company_id = userInfo.companies[0].company_id;
      }
      
      if (company_id) {
        data.append('company_id', company_id);
      } else {
        return rejectWithValue('Şirket bilgisi bulunamadı. Lütfen bir şirket seçiniz veya yöneticinize başvurunuz.');
      }
      
      // Yeni dosya yüklendiyse ekle
      if (formData.file) {
        data.append('dokuman_linki', formData.file);
      }
      
      // API isteği gönder
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/update/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Doküman güncellenirken bir hata oluştu.');
    }
  }
);

// Doküman silme thunk'ı
export const deleteDokuman = createAsyncThunk(
  'dokumanlar/deleteDokuman',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/delete/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Doküman silinirken bir hata oluştu.');
    }
  }
);

// Döküman arşivleme thunk'ı
export const archiveDokuman = createAsyncThunk(
  'dokumanlar/archiveDokuman',
  async (id, { rejectWithValue }) => {
    try {
      // Arşivleme endpoint'ine istek gönder (guncel=false olarak ayarla)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/update-arsiv/${id}`, {
        guncel: false
      });
      
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Doküman arşivlenirken bir hata oluştu.');
    }
  }
);

// Döküman arşivden çıkarma thunk'ı
export const unarchiveDokuman = createAsyncThunk(
  'dokumanlar/unarchiveDokuman',
  async (id, { rejectWithValue }) => {
    try {
      // Arşivden çıkarma endpoint'ine istek gönder (guncel=true olarak ayarla)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/update-arsiv/${id}`, {
        guncel: true
      });
      
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Doküman arşivden çıkarılırken bir hata oluştu.');
    }
  }
);

// Döküman Ekleme
export const addDokuman = createAsyncThunk(
  'dokumanlar/addDokuman',
  async (formData, { rejectWithValue, getState }) => {
    try {
      // Form verilerini oluştur
      const data = new FormData();
      
      // Döküman ismi string olarak ekle
      data.append('dokuman_ismi', formData.dokuman_ismi);
      
      // Döküman türünü string olarak ekle (object durumunu kontrol et)
      const dokuman_tur = typeof formData.dokuman_tur === 'string' 
        ? formData.dokuman_tur 
        : (formData.dokuman_tur?.toString() || '');
      
      data.append('dokuman_tur', dokuman_tur);
      
      // Son güncelleme tarihini ekle
      data.append('lastupdated', formData.lastUpdated);
      
      // Aktif şirket ID'sini al
      const userInfo = getState().userInfo.data;
      let company_id = null;
      
      if (userInfo.role === 'danışman') {
        // Danışman için aktif şirket ID'sini bul
        const activeCompany = userInfo.companies.find(company => company.company_active);
        if (activeCompany) {
          company_id = activeCompany.company_id;
        }
      }
      
      if (!company_id && userInfo.companies && userInfo.companies.length > 0) {
        // Eğer aktif şirket bulunamadıysa ilk şirketi kullan
        company_id = userInfo.companies[0].company_id;
      }
      
      if (company_id) {
        data.append('company_id', company_id);
      } else {
        return rejectWithValue('Şirket bilgisi bulunamadı. Lütfen bir şirket seçiniz veya yöneticinize başvurunuz.');
      }
      
      // Dosya varsa ekle
      if (formData.file) {
        data.append('dokuman_linki', formData.file);
      }
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/dokumanlar/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Doküman eklenirken bir hata oluştu.');
    }
  }
);

// Kullanıcı rolüne göre şirket ID'lerini belirleyen yardımcı fonksiyon
const getCompanyIds = (user) => {
  let companyIds = [];
  
  if (!user || !user.companies || user.companies.length === 0) {
    return companyIds;
  }
  
  // Aktif şirketleri kontrol et
  const activeCompanies = user.companies.filter(company => company.company_active === true);
  
  // Danışman rolü: Sadece aktif şirket
  if (user.role === 'danışman') {
    const activeCompany = activeCompanies.length > 0 ? activeCompanies[0] : null;
    if (activeCompany) {
      companyIds = [String(activeCompany.company_id)];
    }
  } 
  // Yönetici rolü: Kendi şirketi (aktif ise)
  else if (user.role === 'yönetici') {
    const activeCompany = activeCompanies.length > 0 ? activeCompanies[0] : null;
    if (activeCompany) {
      companyIds = [String(activeCompany.company_id)];
    } else if (user.companies.length > 0) {
      // Aktif şirket yoksa ilk şirketi kullan
      companyIds = [String(user.companies[0].company_id)];
    }
  }
  // Temsilci rolü: Kendi şirketi (aktif ise)
  else if (user.role === 'temsilci') {
    const activeCompany = activeCompanies.length > 0 ? activeCompanies[0] : null;
    if (activeCompany) {
      companyIds = [String(activeCompany.company_id)];
    } else if (user.companies.length > 0) {
      // Aktif şirket yoksa ilk şirketi kullan
      companyIds = [String(user.companies[0].company_id)];
    }
  }
  
  return companyIds;
};

// Dokümanları filtreleme fonksiyonu
const filterDokumanlarByRole = (dokumanlar, user) => {
  // Veri yoksa boş dizi döndür
  if (!user || !dokumanlar || !Array.isArray(dokumanlar)) {
    return [];
  }
  
  // Şirket ID'lerini al
  const companyIds = getCompanyIds(user);
  
  if (companyIds.length === 0) {
    return [];
  }
  
  // Dokümanları filtrele - sadece güncel ve kullanıcının şirketine ait olanlar
  const filteredDocs = dokumanlar.filter(dokuman => {
    const companyMatch = companyIds.includes(String(dokuman.company_id));
    const guncelMatch = dokuman.guncel === true;
    
    return guncelMatch && companyMatch;
  });
  
  return filteredDocs;
};

const dokumanlarSlice = createSlice({
  name: 'dokumanlar',
  initialState: {
    rawData: [],
    filteredDokumanlar: [],
    loading: false,
    deleteLoading: false,
    error: null,
    deleteError: null,
    deleteSuccess: false,
    deleteMessage: '',
    addLoading: false,
    addSuccess: false,
    addError: null,
    archiveLoading: false,
    archiveSuccess: false,
    archiveError: null,
    unarchiveLoading: false,
    unarchiveSuccess: false,
    unarchiveError: null,
    // Tek bir doküman için state
    currentDokuman: null,
    currentDokumanLoading: false,
    currentDokumanError: null,
    // Güncelleme için state
    updateLoading: false,
    updateSuccess: false,
    updateError: null,
  },
  reducers: {
    // Şirket değiştiğinde verileri yeniden filtrele
    updateFilteredDokumanlar: (state, action) => {
      const { user } = action.payload;
      
      if (state.rawData && user) {
        // Dokümanları filtrele
        state.filteredDokumanlar = filterDokumanlarByRole(state.rawData, user);
      }
    },
    
    // Silme işlemi sonrası mesajı temizle
    clearDeleteStatus: (state) => {
      state.deleteSuccess = false;
      state.deleteError = null;
      state.deleteMessage = '';
    },
    
    // Arşivleme işlemi sonrası mesajı temizle
    clearArchiveStatus: (state) => {
      state.archiveSuccess = false;
      state.archiveError = null;
    },
    
    // Arşivden çıkarma işlemi sonrası mesajı temizle
    clearUnarchiveStatus: (state) => {
      state.unarchiveSuccess = false;
      state.unarchiveError = null;
    },
    
    // Güncelleme işlemi sonrası mesajı temizle
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
    
    // Aktif dökümanı temizle
    clearCurrentDokuman: (state) => {
      state.currentDokuman = null;
      state.currentDokumanError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDokumanlar
      .addCase(fetchDokumanlar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDokumanlar.fulfilled, (state, action) => {
        // Ham doküman verilerini kaydet
        state.rawData = action.payload.dokumanlar || [];
        
        // Kullanıcı bilgilerini al
        const userInfo = action.payload.userInfo;
        
        // Eğer kullanıcı bilgisi varsa, dokümanları filtrele
        if (userInfo) {
          state.filteredDokumanlar = filterDokumanlarByRole(state.rawData, userInfo);
        } else {
          state.filteredDokumanlar = [];
        }
        
        state.loading = false;
      })
      .addCase(fetchDokumanlar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Dokümanlar yüklenirken bir hata oluştu.';
        state.filteredDokumanlar = [];
      })
      
      // fetchSingleDokuman
      .addCase(fetchSingleDokuman.pending, (state) => {
        state.currentDokumanLoading = true;
        state.currentDokumanError = null;
      })
      .addCase(fetchSingleDokuman.fulfilled, (state, action) => {
        state.currentDokumanLoading = false;
        state.currentDokuman = action.payload;
      })
      .addCase(fetchSingleDokuman.rejected, (state, action) => {
        state.currentDokumanLoading = false;
        state.currentDokumanError = action.payload || 'Doküman bilgileri çekilirken bir hata oluştu.';
      })
      
      // updateDokuman
      .addCase(updateDokuman.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateDokuman.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        
        // Güncellenmiş dökümanı state'e yansıt
        if (action.payload && action.payload.id) {
          // Hem raw data hem de filtrelenmiş listede güncelle
          const rawIndex = state.rawData.findIndex(d => d.id === action.payload.id);
          if (rawIndex !== -1) {
            state.rawData[rawIndex] = { ...state.rawData[rawIndex], ...action.payload };
          }
          
          const filteredIndex = state.filteredDokumanlar.findIndex(d => d.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredDokumanlar[filteredIndex] = { ...state.filteredDokumanlar[filteredIndex], ...action.payload };
          }
          
          // Aktif dökümanı da güncelle
          if (state.currentDokuman && state.currentDokuman.id === action.payload.id) {
            state.currentDokuman = { ...state.currentDokuman, ...action.payload };
          }
        }
      })
      .addCase(updateDokuman.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Doküman güncellenirken bir hata oluştu.';
      })
      
      // deleteDokuman
      .addCase(deleteDokuman.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteDokuman.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        
        // Silinen dökümanı filtreli ve ham listeden çıkar
        state.rawData = state.rawData.filter(dokuman => dokuman.id !== action.payload.id);
        state.filteredDokumanlar = state.filteredDokumanlar.filter(dokuman => dokuman.id !== action.payload.id);
      })
      .addCase(deleteDokuman.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'Doküman silinirken bir hata oluştu.';
      })
      
      // addDokuman
      .addCase(addDokuman.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
        state.addSuccess = false;
      })
      .addCase(addDokuman.fulfilled, (state, action) => {
        state.addLoading = false;
        state.addSuccess = true;
        
        // Yeni eklenen dökümanı listelere ekle
        // Burada API'den dönen yeni doküman verisini kullanmalıyız
        if (action.payload && action.payload.id) {
          state.rawData.push(action.payload);
          
          // Filtreli listeden sadece güncel (guncel=true) olanlar gösteriliyor
          if (action.payload.guncel === true) {
            state.filteredDokumanlar.push(action.payload);
          }
        }
      })
      .addCase(addDokuman.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload || 'Doküman eklenirken bir hata oluştu.';
      })
      
      // archiveDokuman
      .addCase(archiveDokuman.pending, (state) => {
        state.archiveLoading = true;
        state.archiveError = null;
        state.archiveSuccess = false;
      })
      .addCase(archiveDokuman.fulfilled, (state, action) => {
        state.archiveLoading = false;
        state.archiveSuccess = true;
        
        // Arşivlenen dökümanın ham verideki güncelleme durumunu değiştir
        const dokuman = state.rawData.find(d => d.id === action.payload.id);
        if (dokuman) {
          dokuman.guncel = false;
        }
        
        // Arşivlenen dökümanı filtrelenmiş listeden çıkar (guncel=false olduğu için)
        state.filteredDokumanlar = state.filteredDokumanlar.filter(dokuman => dokuman.id !== action.payload.id);
      })
      .addCase(archiveDokuman.rejected, (state, action) => {
        state.archiveLoading = false;
        state.archiveError = action.payload || 'Doküman arşivlenirken bir hata oluştu.';
      })
      
      // unarchiveDokuman
      .addCase(unarchiveDokuman.pending, (state) => {
        state.unarchiveLoading = true;
        state.unarchiveError = null;
        state.unarchiveSuccess = false;
      })
      .addCase(unarchiveDokuman.fulfilled, (state, action) => {
        state.unarchiveLoading = false;
        state.unarchiveSuccess = true;
        
        // Ham veride dökümanın güncel durumunu güncelle
        const dokuman = state.rawData.find(d => d.id === action.payload.id);
        if (dokuman) {
          dokuman.guncel = true;
        }
        
        // Filtrelenmiş listeyi güncelle - arşivden çıkarıldığı için listeden kaldır
        state.filteredDokumanlar = state.filteredDokumanlar.filter(d => d.id !== action.payload.id);
      })
      .addCase(unarchiveDokuman.rejected, (state, action) => {
        state.unarchiveLoading = false;
        state.unarchiveError = action.payload || 'Doküman arşivden çıkarılırken bir hata oluştu.';
      });
  }
});

export const { 
  updateFilteredDokumanlar, 
  clearDeleteStatus, 
  clearArchiveStatus,
  clearUnarchiveStatus,
  clearUpdateStatus,
  clearCurrentDokuman 
} = dokumanlarSlice.actions;

export default dokumanlarSlice.reducer;