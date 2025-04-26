import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API'den envanter ve departman verilerini çeken thunk
export const fetchEnvanterData = createAsyncThunk(
  'envanterGuncelleme/fetchData',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Kullanıcı bilgilerini Redux store'dan al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // API istekleri yap
      const envanterResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/envanter/list`);
      const departmentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/list`);
      
      if (!envanterResponse.data || !departmentsResponse.data) {
        throw new Error('API yanıtında veri yok');
      }
      
      // API'den gelen verileri döndür
      return {
        envanterler: envanterResponse.data,
        departments: departmentsResponse.data,
        userInfo // Kullanıcı bilgilerini de döndür
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Veri çekilirken bir hata oluştu');
    }
  }
);

// Kullanıcı rolüne göre şirket ID'lerini belirleyen yardımcı fonksiyon
const getCompanyIds = (user) => {
  let companyIds = [];
  
  if (!user || !user.companies || user.companies.length === 0) {
    return companyIds;
  }
  
  // Danışman rolü: Sadece aktif şirket
  if (user.role === 'danışman') {
    const activeCompany = user.companies.find(company => company.company_active === true);
    if (activeCompany) {
      companyIds = [String(activeCompany.company_id)];
    } else {
      // Aktif şirket bulunamazsa, ilk şirketi kullan
      if (user.companies.length > 0) {
        companyIds = [String(user.companies[0].company_id)];
      }
    }
  } 
  // Yönetici rolü: Kendi şirketi
  else if (user.role === 'yönetici') {
    companyIds = [String(user.companies[0].company_id)];
  }
  // Temsilci rolü için de şirket ID'si ekle
  else if (user.role === 'temsilci' && user.companies.length > 0) {
    companyIds = [String(user.companies[0].company_id)];
  }
  
  return companyIds;
};

// Verileri şirket ID'lerine göre filtreleyen fonksiyon
const filterDataByCompany = (data, companyIds) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  if (companyIds.length === 0) {
    return data; // Şirket ID'si yoksa tüm verileri göster
  }
  
  // Şirkete ait kayıtları filtrele
  const filteredData = data.filter(item => {
    if (!item.company_id) return false; // company_id yoksa filtreleme dışında tut
    return companyIds.includes(String(item.company_id));
  });
  
  return filteredData;
};

// Departmanları şirket ID'lerine göre filtreleyen fonksiyon
const filterDepartmentsByCompany = (departments, companyIds) => {
  if (!departments || !Array.isArray(departments)) {
    return [];
  }
  
  if (companyIds.length === 0) {
    return departments; // Şirket ID'si yoksa tüm departmanları göster
  }
  
  // Şirkete ait departmanları filtrele
  const filteredDepartments = departments.filter(department => {
    if (!department.company_id) return false;
    return companyIds.includes(String(department.company_id));
  });
  
  return filteredDepartments;
};

const envanterGuncellemeSlice = createSlice({
  name: 'envanterGuncelleme',
  initialState: {
    rawData: {
      envanterler: [],
      departments: []
    },
    filteredData: {
      envanterler: [],
      departments: []
    },
    loading: true,
    error: null,
    userRole: null
  },
  reducers: {
    // Şirket değiştiğinde verileri yeniden filtrele
    updateEnvanterData: (state, action) => {
      const { user } = action.payload;
      
      if (state.rawData && user) {
        const companyIds = getCompanyIds(user);
        
        state.filteredData = {
          envanterler: filterDataByCompany(state.rawData.envanterler, companyIds),
          departments: filterDepartmentsByCompany(state.rawData.departments, companyIds)
        };
        
        state.userRole = user.role;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvanterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnvanterData.fulfilled, (state, action) => {
        // Ham verileri kaydet
        state.rawData = {
          envanterler: action.payload.envanterler || [],
          departments: action.payload.departments || []
        };
        
        // Kullanıcı bilgilerini al
        const userInfo = action.payload.userInfo;
        
        if (userInfo) {
          const companyIds = getCompanyIds(userInfo);
          
          state.filteredData = {
            envanterler: filterDataByCompany(state.rawData.envanterler, companyIds),
            departments: filterDepartmentsByCompany(state.rawData.departments, companyIds)
          };
          
          state.userRole = userInfo.role;
        } else {
          // Kullanıcı bilgisi yoksa tüm verileri göster
          state.filteredData = {
            envanterler: state.rawData.envanterler,
            departments: state.rawData.departments
          };
        }
        
        state.loading = false;
      })
      .addCase(fetchEnvanterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Bilinmeyen bir hata oluştu';
        state.filteredData = {
          envanterler: [],
          departments: []
        };
      });
  }
});

export const { updateEnvanterData } = envanterGuncellemeSlice.actions;
export default envanterGuncellemeSlice.reducer;
