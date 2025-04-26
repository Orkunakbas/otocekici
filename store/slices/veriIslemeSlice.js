import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCompanyIds } from './userInfoSlice';

// API URL'leri
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Veri İşleme Faaliyetlerini getir
export const fetchVeriIslemeFaaliyetleri = createAsyncThunk(
  'veriIsleme/fetchVeriIslemeFaaliyetleri',
  async (_, { getState }) => {
    try {
      const state = getState();
      const userInfo = state.userInfo?.data;
      const companyIds = getCompanyIds(userInfo);
      
      const response = await axios.get(`${API_URL}/api/veriharita/list`);
      const allFaaliyetler = response.data;
      
      // Aktif şirkete göre verileri filtrele
      const filteredFaaliyetler = allFaaliyetler.filter(faaliyet => 
        companyIds.includes(String(faaliyet.company_id))
      );
      
      return filteredFaaliyetler;
    } catch (error) {
      throw error;
    }
  }
);

// Tek bir Veri İşleme Faaliyeti detayını getir
export const fetchVeriIslemeFaaliyeti = createAsyncThunk(
  'veriIsleme/fetchVeriIslemeFaaliyeti',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/veriharita/single/${id}`);
      
      if (response.status !== 200) {
        throw new Error('Veri işleme faaliyeti bulunamadı');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Veri işleme faaliyeti getirilirken bir hata oluştu');
    }
  }
);

// Veri İşleme Faaliyeti ekle
export const addVeriIslemeFaaliyeti = createAsyncThunk(
  'veriIsleme/addVeriIslemeFaaliyeti',
  async (faaliyetData) => {
    try {
      const response = await axios.post(`${API_URL}/api/veriharita/add`, faaliyetData);

      if (![200, 201, 204].includes(response.status)) {
        throw new Error('Veri işleme faaliyeti eklenirken bir hata oluştu');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Veri İşleme Faaliyeti sil
export const deleteVeriIslemeFaaliyeti = createAsyncThunk(
  'veriIsleme/deleteVeriIslemeFaaliyeti',
  async (faaliyetId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/veriharita/delete/${faaliyetId}`);
      return faaliyetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Veri işleme faaliyeti silinirken bir hata oluştu');
    }
  }
);

// Veri İşleme Faaliyeti güncelle
export const updateVeriIslemeFaaliyeti = createAsyncThunk(
  'veriIsleme/updateVeriIslemeFaaliyeti',
  async (faaliyetData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/veriharita/update/${faaliyetData.id}`, faaliyetData);
      
      if (![200, 201, 204].includes(response.status)) {
        throw new Error('Veri işleme faaliyeti güncellenirken bir hata oluştu');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Veri işleme faaliyeti güncellenirken bir hata oluştu');
    }
  }
);

const initialState = {
  veriIslemeFaaliyetleri: [],
  currentVeriIsleme: null,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
  deleteSuccess: false,
  deleteError: null,
  addSuccess: false,
  addError: null,
  updateSuccess: false,
  updateError: null,
};

const veriIslemeSlice = createSlice({
  name: 'veriIsleme',
  initialState,
  reducers: {
    clearDeleteStatus: (state) => {
      state.deleteSuccess = false;
      state.deleteError = null;
    },
    clearAddStatus: (state) => {
      state.addSuccess = false;
      state.addError = null;
    },
    clearCurrentVeriIsleme: (state) => {
      state.currentVeriIsleme = null;
      state.detailError = null;
    },
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Veri İşleme Faaliyetleri durumları
      .addCase(fetchVeriIslemeFaaliyetleri.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVeriIslemeFaaliyetleri.fulfilled, (state, action) => {
        state.veriIslemeFaaliyetleri = action.payload;
        state.loading = false;
      })
      .addCase(fetchVeriIslemeFaaliyetleri.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Tek Veri İşleme Faaliyeti detayı getir
      .addCase(fetchVeriIslemeFaaliyeti.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchVeriIslemeFaaliyeti.fulfilled, (state, action) => {
        state.currentVeriIsleme = action.payload;
        state.detailLoading = false;
      })
      .addCase(fetchVeriIslemeFaaliyeti.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // Veri İşleme Faaliyeti ekle
      .addCase(addVeriIslemeFaaliyeti.fulfilled, (state, action) => {
        state.veriIslemeFaaliyetleri.push(action.payload);
        state.addSuccess = true;
      })
      .addCase(addVeriIslemeFaaliyeti.rejected, (state, action) => {
        state.addError = action.error.message;
      })
      // Veri İşleme Faaliyeti sil
      .addCase(deleteVeriIslemeFaaliyeti.fulfilled, (state, action) => {
        state.veriIslemeFaaliyetleri = state.veriIslemeFaaliyetleri.filter(faaliyet => faaliyet.id !== action.payload);
        state.deleteSuccess = true;
      })
      .addCase(deleteVeriIslemeFaaliyeti.rejected, (state, action) => {
        state.deleteError = action.payload;
      })
      // Veri İşleme Faaliyeti güncelle
      .addCase(updateVeriIslemeFaaliyeti.pending, (state) => {
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updateVeriIslemeFaaliyeti.fulfilled, (state, action) => {
        // Mevcut listedeki ilgili faaliyeti güncelle
        const index = state.veriIslemeFaaliyetleri.findIndex(faaliyet => faaliyet.id === action.payload.id);
        if (index !== -1) {
          state.veriIslemeFaaliyetleri[index] = action.payload;
        }
        // Detaylı görünümdeki faaliyeti de güncelle
        state.currentVeriIsleme = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateVeriIslemeFaaliyeti.rejected, (state, action) => {
        state.updateError = action.payload;
      });
  }
});

export const { clearDeleteStatus, clearAddStatus, clearCurrentVeriIsleme, clearUpdateStatus } = veriIslemeSlice.actions;

export default veriIslemeSlice.reducer;
