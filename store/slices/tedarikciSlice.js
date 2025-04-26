import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'i
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tedarikçi listesini getir
export const fetchTedarikciListesi = createAsyncThunk(
  'tedarikci/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/veriaktarim/list`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Tedarikçi listesi yüklenirken bir hata oluştu'
      );
    }
  }
);

// Tedarikçi ekle
export const addTedarikci = createAsyncThunk(
  'tedarikci/addTedarikci',
  async (tedarikciData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/tedarikci-listesi/create`, tedarikciData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Tedarikçi eklenirken bir hata oluştu'
      );
    }
  }
);

// Slice başlatma
const tedarikciSlice = createSlice({
  name: 'tedarikciList',
  initialState: {
    tedarikciler: [],
    filteredTedarikciler: [],
    loading: false,
    saving: false,
    error: null,
    saveError: null,
    saveSuccess: false
  },
  reducers: {
    // Kullanıcının şirketine göre tedarikçileri filtrele
    filterByCompanyId: (state, action) => {
      const companyId = action.payload;
      if (companyId) {
        state.filteredTedarikciler = state.tedarikciler.filter(
          tedarikci => String(tedarikci.company_id) === String(companyId)
        );
      } else {
        state.filteredTedarikciler = [];
      }
    },
    // Kaydetme durumunu sıfırla
    resetSaveStatus: (state) => {
      state.saveSuccess = false;
      state.saveError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Veri yüklenirken
      .addCase(fetchTedarikciListesi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Veri başarıyla alındığında
      .addCase(fetchTedarikciListesi.fulfilled, (state, action) => {
        state.tedarikciler = action.payload;
        state.loading = false;
      })
      // Veri alınırken hata oluştuğunda
      .addCase(fetchTedarikciListesi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Tedarikçi eklenirken
      .addCase(addTedarikci.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      // Tedarikçi başarıyla eklendiğinde
      .addCase(addTedarikci.fulfilled, (state, action) => {
        state.tedarikciler.push(action.payload);
        state.saving = false;
        state.saveSuccess = true;
      })
      // Tedarikçi eklenirken hata oluştuğunda
      .addCase(addTedarikci.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
  }
});

export const { filterByCompanyId, resetSaveStatus } = tedarikciSlice.actions;
export default tedarikciSlice.reducer; 
