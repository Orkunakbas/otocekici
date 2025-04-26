import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// Async thunks
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log('Verify email response:', data)

      if (!response.ok) {
        toast.error(data.message || 'E-posta doğrulanamadı')
        return rejectWithValue(data.message || 'E-posta doğrulanamadı')
      }

      if (data.valid) {
        return { email, valid: true }
      } else {
        toast.error(data.message || 'E-posta bulunamadı')
        return rejectWithValue(data.message || 'E-posta bulunamadı')
      }
    } catch (error) {
      console.error('Verify email error:', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
      return rejectWithValue('Bir hata oluştu')
    }
  }
)

// Şifre alma işlemi için dummy fonksiyon
export const getOTP = createAsyncThunk(
  'auth/getOTP',
  async (email, { rejectWithValue }) => {
    try {
      // Burada gerçek API çağrısı olacak
      // Şimdilik sadece başarılı dönüyoruz
      toast.success('Şifre gönderildi')
      return true
    } catch (error) {
      toast.error('Şifre gönderilirken bir hata oluştu')
      return rejectWithValue('Şifre gönderilirken bir hata oluştu')
    }
  }
)

const initialState = {
  email: null,
  isEmailVerified: false,
  loading: false,
  error: null,
  showOTPModal: false,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setShowOTPModal: (state, action) => {
      state.showOTPModal = action.payload
    },
    resetAuth: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.email = action.payload.email
        state.isEmailVerified = true
        state.showOTPModal = true
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isEmailVerified = false
      })
      // Get OTP
      .addCase(getOTP.pending, (state) => {
        state.loading = true
      })
      .addCase(getOTP.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setShowOTPModal, resetAuth, setUser } = authSlice.actions
export default authSlice.reducer 