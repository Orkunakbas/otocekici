import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'i
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Varlık listesini getir - temel endpoint
export const fetchVarlikListesi = createAsyncThunk(
  'varlik/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/varlik-listesi/list`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Varlık listesi yüklenirken bir hata oluştu'
      );
    }
  }
);

// Slice başlatma
const varlikSlice = createSlice({
  name: 'varlikList',
  initialState: {
    varliklar: [],
    filteredVarliklar: [],
    loading: false,
    error: null
  },
  reducers: {
    // Kullanıcının şirketine göre varlıkları filtrele
    filterByCompanyId: (state, action) => {
      const companyId = action.payload;
      if (companyId) {
        state.filteredVarliklar = state.varliklar.filter(
          varlik => String(varlik.company_id) === String(companyId)
        );
      } else {
        state.filteredVarliklar = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Veri yüklenirken
      .addCase(fetchVarlikListesi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Veri başarıyla alındığında
      .addCase(fetchVarlikListesi.fulfilled, (state, action) => {
        state.varliklar = action.payload;
        state.loading = false;
      })
      // Veri alınırken hata oluştuğunda
      .addCase(fetchVarlikListesi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { filterByCompanyId } = varlikSlice.actions;
export default varlikSlice.reducer;
