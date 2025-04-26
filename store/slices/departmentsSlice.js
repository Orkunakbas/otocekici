import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCompanyIds } from './userInfoSlice';

// API URL'leri
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Departmanları getir
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { getState }) => {
    try {
      const state = getState();
      const userInfo = state.userInfo?.data;
      const companyIds = getCompanyIds(userInfo);
      
      const response = await axios.get(`${API_URL}/api/departments/list`);
      const allDepartments = response.data;
      
      // Aktif şirkete göre verileri filtrele
      const filteredDepartments = allDepartments.filter(department => 
        companyIds.includes(String(department.company_id))
      );
      
      return filteredDepartments;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Departmanları getir
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
      });
  }
});

export default departmentsSlice.reducer;
