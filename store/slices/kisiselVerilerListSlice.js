import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'i
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Kişisel verileri getir
export const fetchKisiselVeriler = createAsyncThunk(
  'kisiselVeriler/fetchList',
  async (lang, { rejectWithValue }) => {
    try {
      // API'den kişisel verileri çek, dil parametresini query olarak gönder
      const response = await axios.get(`${API_URL}/api/kisisel-veriler/list`, {
        params: { lang }
      });
      
      // API'den gelen verileri döndür
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kişisel veriler yüklenirken bir hata oluştu'
      );
    }
  }
);

// Slice başlatma
const kisiselVerilerListSlice = createSlice({
  name: 'kisiselVerilerList',
  initialState: {
    kisiselVeriler: [],
    loading: false,
    error: null
  },
  reducers: {
    // Gerekirse burada daha fazla reducer eklenebilir
  },
  extraReducers: (builder) => {
    builder
      // Veri yüklenirken
      .addCase(fetchKisiselVeriler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Veri başarıyla alındığında
      .addCase(fetchKisiselVeriler.fulfilled, (state, action) => {
        state.kisiselVeriler = action.payload;
        state.loading = false;
      })
      // Veri alınırken hata oluştuğunda
      .addCase(fetchKisiselVeriler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default kisiselVerilerListSlice.reducer;
