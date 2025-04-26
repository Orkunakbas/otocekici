import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Form gönderme işlemi için async thunk
export const submitForm = createAsyncThunk(
  'formGonder/submitForm',
  async (formData, { rejectWithValue }) => {
    try {
      // FormData'yı string değerlere dönüştür
      const stringifiedData = {
        fullname: String(formData.fullname || ''),
        email: String(formData.email || ''),
        tel: String(formData.tel || ''),
        country: String(formData.country || ''),
        company: String(formData.company || ''),
        position: formData.position === 'yes' ? 'yes' : 'no',
        return_contact: Array.isArray(formData.return_contact) ? formData.return_contact.join(',') : '',
        data_privacy: Array.isArray(formData.data_privacy) ? formData.data_privacy.join(',') : '',
        approval: formData.approval === true || formData.approval === 'true' ? 'true' : 'false'
      }

      console.log('API\'ye gönderilen veri:', stringifiedData)
      
      // .env dosyasından API URL'sini al
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiUrl}/api/forms/add`;
      
      console.log('API endpoint:', endpoint);
      
      const response = await axios.post(endpoint, stringifiedData);
      return response.data;
    } catch (error) {
      console.error('API hatası:', error);
      return rejectWithValue(error.response?.data?.message || 'Bir hata oluştu');
    }
  }
)

const formGonderSlice = createSlice({
  name: 'formGonder',
  initialState: {
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetFormStatus: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Bir hata oluştu'
        state.success = false
      })
  }
})

export const { resetFormStatus } = formGonderSlice.actions
export default formGonderSlice.reducer
