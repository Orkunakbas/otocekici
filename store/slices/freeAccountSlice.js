import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Free account form gönderme işlemi için async thunk
export const submitFreeAccount = createAsyncThunk(
  'freeAccount/submitFreeAccount',
  async (formData, { rejectWithValue }) => {
    try {
      // FormData'yı string değerlere dönüştür
      const stringifiedData = {
        fullname: String(formData.fullname || ''),
        email: String(formData.email || ''),
        numberoff: String(formData.numberoff || ''),
        country: String(formData.country || ''),
        company_name: String(formData.company_name || '')
      }

      console.log('API\'ye gönderilen veri:', stringifiedData)
      
      // .env dosyasından API URL'sini al
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiUrl}/api/free-account/add`;
      
      console.log('API endpoint:', endpoint);
      
      const response = await axios.post(endpoint, stringifiedData);
      return response.data;
    } catch (error) {
      console.error('API hatası:', error);
      return rejectWithValue(error.response?.data?.message || 'Bir hata oluştu');
    }
  }
)

const freeAccountSlice = createSlice({
  name: 'freeAccount',
  initialState: {
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetFreeAccountStatus: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFreeAccount.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitFreeAccount.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(submitFreeAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Bir hata oluştu'
        state.success = false
      })
  }
})

export const { resetFreeAccountStatus } = freeAccountSlice.actions
export default freeAccountSlice.reducer





