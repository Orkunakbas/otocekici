import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchUserInfo } from './userInfoSlice';

// API URL'leri
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    }
  } 
  // Yönetici ve Temsilci rolü: İlk şirket ID'si
  else if (user.role === 'yönetici' || user.role === 'temsilci') {
    if (user.companies.length > 0) {
      companyIds = [String(user.companies[0].company_id)];
    }
  }
  
  return companyIds;
};

// Aksiyonları filtreleme fonksiyonu - Güncel aksiyonlar için
const filterGuncelAksiyonlarByRole = (aksiyonlar, user) => {
  // Veri yoksa boş dizi döndür
  if (!user || !aksiyonlar || !Array.isArray(aksiyonlar)) {
    return [];
  }
  
  // Şirket ID'lerini al
  const companyIds = getCompanyIds(user);
  
  if (companyIds.length === 0) {
    return [];
  }
  
  // Aksiyonları filtrele - sadece güncel ve kullanıcının şirketine ait olanlar
  const filteredAksiyonlar = aksiyonlar.filter(aksiyon => {
    const companyMatch = companyIds.includes(String(aksiyon.company_id));
    const guncelMatch = aksiyon.guncel === true;
    return guncelMatch && companyMatch;
  });
  
  return filteredAksiyonlar;
};

// Aksiyonları filtreleme fonksiyonu - Arşivlenmiş aksiyonlar için
const filterArsivAksiyonlarByRole = (aksiyonlar, user) => {
  // Veri yoksa boş dizi döndür
  if (!user || !aksiyonlar || !Array.isArray(aksiyonlar)) {
    return [];
  }
  
  // Şirket ID'lerini al
  const companyIds = getCompanyIds(user);
  
  if (companyIds.length === 0) {
    return [];
  }
  
  // Aksiyonları filtrele - sadece arşivlenmiş ve kullanıcının şirketine ait olanlar
  const filteredAksiyonlar = aksiyonlar.filter(aksiyon => {
    const companyMatch = companyIds.includes(String(aksiyon.company_id));
    const guncelMatch = aksiyon.guncel === false;
    return guncelMatch && companyMatch;
  });
  
  return filteredAksiyonlar;
};

// Aksiyonları getir
export const fetchAksiyonlar = createAsyncThunk(
  'aksiyonlar/fetchAksiyonlar',
  async (_, { getState }) => {
    try {
      // Kullanıcı bilgilerini Redux store'dan al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // API'den aksiyonları çek
      const response = await axios.get(`${API_URL}/api/aksiyonlar/list`);
      
      // API'den gelen verileri ve userInfo'yu döndür
      return {
        aksiyonlar: response.data || [],
        userInfo
      };
    } catch (error) {
      return { 
        aksiyonlar: [],
        userInfo: null
      };
    }
  }
);

// Departmanları getir
export const fetchDepartments = createAsyncThunk(
  'aksiyonlar/fetchDepartments',
  async () => {
    const response = await axios.get(`${API_URL}/api/departments/list`);
    return response.data;
  }
);

// Aksiyon sil
export const deleteAksiyon = createAsyncThunk(
  'aksiyonlar/deleteAksiyon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/aksiyonlar/delete/${id}`);
      return { id, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Aksiyon silinirken bir hata oluştu');
    }
  }
);

// Aksiyon arşivle
export const archiveAksiyon = createAsyncThunk(
  'aksiyonlar/archiveAksiyon',
  async (id, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/api/aksiyonlar/update-arsiv/${id}`, {
        guncel: false
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Aksiyon arşivlenirken bir hata oluştu');
    }
  }
);

// Aksiyon durumunu güncelle
export const updateAksiyonDurum = createAsyncThunk(
  'aksiyonlar/updateAksiyonDurum',
  async ({ id, durum }) => {
    try {
      await axios.post(`${API_URL}/api/aksiyonlar/update/${id}`, { 
        durum: durum ? 1 : 0 
      });
      return { id, durum };
    } catch (error) {
      throw error;
    }
  }
);

// Add Aksiyon
export const addAksiyon = createAsyncThunk(
  'aksiyonlar/addAksiyon',
  async (aksiyonData, { rejectWithValue, getState }) => {
    try {
      const formData = new FormData();
      formData.append('aksiyon_ismi', aksiyonData.aksiyon_ismi);
      formData.append('aksiyon_aciklamasi', aksiyonData.aksiyon_aciklamasi);
      formData.append('risk', aksiyonData.risk);
      
      // Kullanıcı bilgilerini al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // Şirket ID'sini belirle
      let company_id = null;
      if (userInfo) {
        if (userInfo.role === 'danışman') {
          const activeCompany = userInfo.companies.find(company => company.company_active === true);
          if (activeCompany) {
            company_id = activeCompany.company_id;
          }
        } else if (userInfo.companies && userInfo.companies.length > 0) {
          company_id = userInfo.companies[0].company_id;
        }
      }
      
      if (!company_id) {
        return rejectWithValue('Şirket bilgisi bulunamadı');
      }
      
      formData.append('company_id', company_id);
      formData.append('department_id', aksiyonData.department_id);
      
      if (aksiyonData.dokuman_linki) {
        formData.append('dokuman_linki', aksiyonData.dokuman_linki);
      }

      const response = await axios.post(`${API_URL}/api/aksiyonlar/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        aksiyon: response.data,
        userInfo
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Aksiyon eklenirken bir hata oluştu');
    }
  }
);

// Aksiyon güncelle
export const updateAksiyon = createAsyncThunk(
  'aksiyonlar/updateAksiyon',
  async (aksiyonData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('aksiyon_ismi', aksiyonData.aksiyon_ismi);
      formData.append('aksiyon_aciklamasi', aksiyonData.aksiyon_aciklamasi);
      formData.append('risk', aksiyonData.risk);
      formData.append('department_id', aksiyonData.department_id);
      
      // Sadece yeni bir dosya seçildiyse formData'ya ekle
      if (aksiyonData.dokuman_linki instanceof File) {
        formData.append('dokuman_linki', aksiyonData.dokuman_linki);
      }
      // Dosya silinmişse veya değiştirilmemişse hiçbir şey gönderme

      console.log('Gönderilen form verisi:', {
        aksiyon_ismi: aksiyonData.aksiyon_ismi,
        aksiyon_aciklamasi: aksiyonData.aksiyon_aciklamasi,
        risk: aksiyonData.risk,
        department_id: aksiyonData.department_id,
        dokuman_linki: aksiyonData.dokuman_linki instanceof File ? 'Yeni Dosya' : 'Gönderilmedi'
      });

      const response = await axios.post(`${API_URL}/api/aksiyonlar/update/${aksiyonData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Aksiyon güncellenirken bir hata oluştu');
    }
  }
);

// Tekil aksiyon getir
export const fetchSingleAksiyon = createAsyncThunk(
  'aksiyonlar/fetchSingleAksiyon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/aksiyonlar/single/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Aksiyon bilgileri alınırken bir hata oluştu');
    }
  }
);

const initialState = {
  rawAksiyonlar: [],
  filteredAksiyonlar: [],
  departments: [],
  loading: false,
  error: null,
  deleteSuccess: false,
  archiveSuccess: false,
  updateDurumSuccess: false,
  addLoading: false,
  addSuccess: false,
  addError: null,
  selectedAksiyon: null,
  updateLoading: false,
  updateSuccess: false,
  updateError: null,
};

const aksiyonlarSlice = createSlice({
  name: 'aksiyonlar',
  initialState,
  reducers: {
    clearDeleteStatus: (state) => {
      state.deleteSuccess = false;
    },
    clearArchiveStatus: (state) => {
      state.archiveSuccess = false;
    },
    clearUpdateDurumStatus: (state) => {
      state.updateDurumSuccess = false;
    },
    clearAddStatus: (state) => {
      state.addSuccess = false;
      state.addError = null;
    },
    updateFilteredAksiyonlar: (state, action) => {
      const { user, isArchive } = action.payload;
      
      if (state.rawAksiyonlar && user) {
        // Aksiyonları filtrele - arşiv durumuna göre
        if (isArchive) {
          state.filteredAksiyonlar = filterArsivAksiyonlarByRole(state.rawAksiyonlar, user);
        } else {
          state.filteredAksiyonlar = filterGuncelAksiyonlarByRole(state.rawAksiyonlar, user);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Aksiyonları getir
      .addCase(fetchAksiyonlar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAksiyonlar.fulfilled, (state, action) => {
        // Ham aksiyon verilerini kaydet
        state.rawAksiyonlar = action.payload.aksiyonlar || [];
        
        // Kullanıcı bilgilerini al
        const userInfo = action.payload.userInfo;
        
        // Aksiyonları filtrele - varsayılan olarak güncel aksiyonları göster
        state.filteredAksiyonlar = filterGuncelAksiyonlarByRole(state.rawAksiyonlar, userInfo);
        
        state.loading = false;
      })
      .addCase(fetchAksiyonlar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Aksiyonlar yüklenirken bir hata oluştu.';
        state.filteredAksiyonlar = [];
      })
      // Departmanları getir
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Aksiyon sil
      .addCase(deleteAksiyon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAksiyon.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        const { id } = action.payload;
        
        // Ham veriyi güncelle
        state.rawAksiyonlar = state.rawAksiyonlar.filter(aksiyon => aksiyon.id !== id);
        
        // Filtrelenmiş veriyi güncelle
        state.filteredAksiyonlar = state.filteredAksiyonlar.filter(aksiyon => aksiyon.id !== id);
      })
      .addCase(deleteAksiyon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Aksiyon arşivle
      .addCase(archiveAksiyon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveAksiyon.fulfilled, (state, action) => {
        state.loading = false;
        state.archiveSuccess = true;
        state.rawAksiyonlar = state.rawAksiyonlar.filter(aksiyon => aksiyon.id !== action.payload);
        state.filteredAksiyonlar = state.filteredAksiyonlar.filter(aksiyon => aksiyon.id !== action.payload);
      })
      .addCase(archiveAksiyon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Aksiyon durumunu güncelle
      .addCase(updateAksiyonDurum.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, durum } = action.payload;
          state.rawAksiyonlar = state.rawAksiyonlar.map(aksiyon => 
            aksiyon.id === id ? { ...aksiyon, durum } : aksiyon
          );
          state.filteredAksiyonlar = state.filteredAksiyonlar.map(aksiyon => 
            aksiyon.id === id ? { ...aksiyon, durum } : aksiyon
          );
        }
      })
      // Add Aksiyon
      .addCase(addAksiyon.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addAksiyon.fulfilled, (state, action) => {
        state.addLoading = false;
        state.addSuccess = true;
        state.rawAksiyonlar.push(action.payload.aksiyon);
        // Kullanıcı bilgileri ile filtreleme yap
        if (action.payload.userInfo) {
          state.filteredAksiyonlar = filterGuncelAksiyonlarByRole(state.rawAksiyonlar, action.payload.userInfo);
        }
      })
      .addCase(addAksiyon.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload;
      })
      // Aksiyon güncelle
      .addCase(updateAksiyon.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateAksiyon.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        // Güncellenmiş aksiyonu listede güncelle
        state.rawAksiyonlar = state.rawAksiyonlar.map(aksiyon =>
          aksiyon.id === action.payload.id ? action.payload : aksiyon
        );
        state.filteredAksiyonlar = state.filteredAksiyonlar.map(aksiyon =>
          aksiyon.id === action.payload.id ? action.payload : aksiyon
        );
      })
      .addCase(updateAksiyon.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      .addCase(fetchSingleAksiyon.fulfilled, (state, action) => {
        state.selectedAksiyon = action.payload;
      });
  }
});

export const { 
  clearDeleteStatus, 
  clearArchiveStatus, 
  clearUpdateDurumStatus,
  clearAddStatus,
  updateFilteredAksiyonlar 
} = aksiyonlarSlice.actions;

export default aksiyonlarSlice.reducer;

