import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Kullanıcı rolüne göre şirket ID'lerini belirleyen yardımcı fonksiyon
export const getCompanyIds = (user) => {
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

export const fetchUserInfo = createAsyncThunk(
  'userInfo/fetchUserInfo',
  async (token, { rejectWithValue }) => {
    try {
      console.log('fetchUserInfo çağrıldı, token:', token);
      
      if (!token) {
        console.error('Token bulunamadı!');
        throw new Error('Token bulunamadı')
      }

      console.log('API isteği yapılıyor:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user-info`);
      console.log('Authorization header:', `Bearer ${token}`);
      
      const response = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user-info`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API yanıtı status:', response.status);
      console.log('API yanıtı data:', response.data);

      return response.data;
    } catch (error) {
      console.error('fetchUserInfo hata yakalandı:', error.response?.data || error.message);
      
      // HTTP 401 veya 403 hatası - token geçersiz
      if (error.response?.status === 401 || error.response?.status === 403) {
        return rejectWithValue('Token geçersiz veya süresi dolmuş');
      }
      
      // Kullanıcı bulunamadı hatası
      if (error.response?.data?.message?.includes('Kullanıcı bulunamadı') || 
          error.response?.data?.error?.includes('Kullanıcı bulunamadı')) {
        return rejectWithValue('Kullanıcı bulunamadı - oturum sonlandırıldı');
      }
      
      // Diğer hatalar
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Kullanıcı bilgileri alınamadı'
      );
    }
  }
)

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    clearUserInfo: (state) => {
      state.data = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.data = null
      })
  }
})

export const { clearUserInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
