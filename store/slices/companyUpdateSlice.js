import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'

export const updateActiveCompany = createAsyncThunk(
  'company/updateActive',
  async ({ user_id, company_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update/company-active`,
        {
          user_id: user_id,
          company_id: company_id,
          company_active: true
        },
        {
          withCredentials: true
        }
      )

      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Şirket güncellenirken bir hata oluştu'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

const initialState = {
  loading: false,
  error: null
}

const companyUpdateSlice = createSlice({
  name: 'companyUpdate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateActiveCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateActiveCompany.fulfilled, (state) => {
        state.loading = false
        window.location.reload()
      })
      .addCase(updateActiveCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default companyUpdateSlice.reducer
