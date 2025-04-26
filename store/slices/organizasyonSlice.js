import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCompanyIds } from './userInfoSlice';

// API URL'leri
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Departmanları getir
export const fetchDepartments = createAsyncThunk(
  'organizasyon/fetchDepartments',
  async (_, { getState }) => {
    try {
      const state = getState();
      const userInfo = state.userInfo?.data;
      const companyIds = getCompanyIds(userInfo);
      
      const response = await axios.get(`${API_URL}/api/departments/list`);
      const allDepartments = response.data;
      
      // Aktif şirkete göre departmanları filtrele
      const filteredDepartments = allDepartments.filter(dept => 
        companyIds.includes(String(dept.company_id))
      );
      
      return filteredDepartments;
    } catch (error) {
      throw error;
    }
  }
);

// Temsilcileri getir
export const fetchTemsilciler = createAsyncThunk(
  'organizasyon/fetchTemsilciler',
  async (_, { getState }) => {
    try {
      const state = getState();
      const userInfo = state.userInfo?.data;
      const companyIds = getCompanyIds(userInfo);
      
      const response = await axios.get(`${API_URL}/api/users/list-temsilci`);
      const allTemsilciler = response.data;
      
      // Aktif şirkete göre temsilcileri filtrele
      const filteredTemsilciler = allTemsilciler.filter(temsilci => 
        temsilci.departments.some(dept => companyIds.includes(String(dept.company_id)))
      );
      
      return filteredTemsilciler;
    } catch (error) {
      throw error;
    }
  }
);

// Departman ekle
export const addDepartment = createAsyncThunk(
  'organizasyon/addDepartment',
  async ({ department_name, company_id }) => {
    try {
      const response = await axios.post(`${API_URL}/api/departments/add`, {
        department_name,
        company_id,
      });

      if (![200, 201, 204].includes(response.status)) {
        throw new Error('Departman eklenirken bir hata oluştu');
      }

      return response.data.department;
    } catch (error) {
      throw error;
    }
  }
);

// Departman sil
export const deleteDepartment = createAsyncThunk(
  'organizasyon/deleteDepartment',
  async (departmentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/departments/delete/${departmentId}`);
      return departmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Departman silinirken bir hata oluştu');
    }
  }
);

// Temsilci sil
export const deleteTemsilci = createAsyncThunk(
  'organizasyon/deleteTemsilci',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/users/delete/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Temsilci silinirken bir hata oluştu');
    }
  }
);

// Temsilci ekle
export const addTemsilci = createAsyncThunk(
  'organizasyon/addTemsilci',
  async ({ fullname, email, varlik_sorumlusu, department_id, company_id }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/add`, {
        fullname,
        email,
        password: '123456', // Varsayılan şifre
        varlik_sorumlusu,
        company_id,
        role: 'temsilci',
        department_id,
      });

      if (![200, 201, 204].includes(response.status)) {
        throw new Error('Temsilci eklenirken bir hata oluştu');
      }

      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  departments: [],
  temsilciler: [],
  loading: false,
  temsilcilerLoading: false,
  error: null,
  temsilcilerError: null,
  deleteSuccess: false,
  deleteError: null,
  addSuccess: false,
  addError: null,
  addTemsilciSuccess: false,
  addTemsilciError: null,
};

const organizasyonSlice = createSlice({
  name: 'organizasyon',
  initialState,
  reducers: {
    clearDeleteStatus: (state) => {
      state.deleteSuccess = false;
      state.deleteError = null;
    },
    clearAddStatus: (state) => {
      state.addSuccess = false;
      state.addError = null;
      state.addTemsilciSuccess = false;
      state.addTemsilciError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Departman durumları
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Temsilci durumları
      .addCase(fetchTemsilciler.pending, (state) => {
        state.temsilcilerLoading = true;
        state.temsilcilerError = null;
      })
      .addCase(fetchTemsilciler.fulfilled, (state, action) => {
        state.temsilciler = action.payload;
        state.temsilcilerLoading = false;
      })
      .addCase(fetchTemsilciler.rejected, (state, action) => {
        state.temsilcilerLoading = false;
        state.temsilcilerError = action.error.message;
      })
      // Departman ekle
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
        state.addSuccess = true;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.addError = action.error.message;
      })
      // Silme işlemleri
      .addCase(deleteTemsilci.fulfilled, (state, action) => {
        state.temsilciler = state.temsilciler.filter(temsilci => temsilci.user_id !== action.payload);
        state.deleteSuccess = true;
      })
      .addCase(deleteTemsilci.rejected, (state, action) => {
        state.deleteError = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(dept => dept.department_id !== action.payload);
        state.deleteSuccess = true;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.deleteError = action.payload;
      })
      // Temsilci ekle
      .addCase(addTemsilci.fulfilled, (state, action) => {
        state.temsilciler.push(action.payload);
        state.addTemsilciSuccess = true;
      })
      .addCase(addTemsilci.rejected, (state, action) => {
        state.addTemsilciError = action.error.message;
      });
  }
});

export const { clearDeleteStatus, clearAddStatus } = organizasyonSlice.actions;

export default organizasyonSlice.reducer;


