import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API'den departman ve aksiyon verilerini çeken thunk
export const fetchDashboardCharts = createAsyncThunk(
  'dashboardCharts/fetchCharts',
  async (_, { getState }) => {
    try {
      // Kullanıcı bilgilerini Redux store'dan al
      const state = getState();
      const userInfo = state.userInfo?.data;
      
      // Gerçek API'den verileri çek - paralel olarak çek
      const [
        departmentsResponse, 
        aksiyonlarResponse
      ] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/list`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/aksiyonlar/list`)
      ]);
      
      // API'den gelen verileri döndür
      return {
        departments: departmentsResponse.data || [],
        aksiyonlar: aksiyonlarResponse.data || [],
        userInfo // Kullanıcı bilgilerini de döndür
      };
    } catch (error) {
      console.error('Dashboard grafik verileri çekilirken hata oluştu:', error);
      return { 
        departments: [],
        aksiyonlar: []
      };
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
    }
  } 
  // Yönetici rolü: Kendi şirketi
  else if (user.role === 'yönetici') {
    companyIds = [String(user.companies[0].company_id)];
  }
  
  return companyIds;
};

// Aksiyon verilerini departmanlara göre gruplandıran fonksiyon
const groupAksiyonlarByDepartment = (aksiyonlar, departments, companyIds) => {
  // Şirkete ait departmanları filtrele
  const filteredDepartments = departments.filter(dept => 
    companyIds.includes(String(dept.company_id))
  );
  
  // Şirkete ait aksiyonları filtrele
  const filteredAksiyonlar = aksiyonlar.filter(aksiyon => 
    companyIds.includes(String(aksiyon.company_id))
  );
  
  // Risk kategorileri
  const riskCategories = ["Tamamlanmış", "Düşük Risk", "Orta Risk", "Yüksek Risk"];
  
  // Her departman için aksiyon sayılarını hesapla
  const chartData = filteredDepartments.map(dept => {
    // Bu departmana ait aksiyonlar
    const deptAksiyonlar = filteredAksiyonlar.filter(
      aksiyon => String(aksiyon.department_id) === String(dept.department_id)
    );
    
    // Risk kategorilerine göre sayıları hesapla
    const tamamlanmis = deptAksiyonlar.filter(aksiyon => aksiyon.durum === true).length;
    const dusukRisk = deptAksiyonlar.filter(aksiyon => aksiyon.durum === false && aksiyon.risk === "Düşük Risk").length;
    const ortaRisk = deptAksiyonlar.filter(aksiyon => aksiyon.durum === false && aksiyon.risk === "Orta Risk").length;
    const yuksekRisk = deptAksiyonlar.filter(aksiyon => aksiyon.durum === false && aksiyon.risk === "Yüksek Risk").length;
    
    return {
      kategori: dept.department_name,
      "Tamamlanmış": tamamlanmis,
      "Düşük Risk": dusukRisk,
      "Orta Risk": ortaRisk,
      "Yüksek Risk": yuksekRisk
    };
  });
  
  // Toplam aksiyon sayısını hesapla
  const totalAksiyonlar = filteredAksiyonlar.length;
  
  return {
    chartData,
    totalAksiyonlar,
    riskCategories
  };
};

const dashboardChartsSlice = createSlice({
  name: 'dashboardCharts',
  initialState: {
    rawData: {
      departments: [],
      aksiyonlar: []
    },
    chartData: [],
    totalAksiyonlar: 0,
    riskCategories: ["Tamamlanmış", "Düşük Risk", "Orta Risk", "Yüksek Risk"],
    loading: true,
    error: null,
    userRole: null
  },
  reducers: {
    // Şirket değiştiğinde verileri yeniden filtrele
    updateChartData: (state, action) => {
      const { user } = action.payload;
      
      if (state.rawData && user) {
        // Sadece danışman ve yönetici rolleri için veri hazırla
        if (user.role === 'danışman' || user.role === 'yönetici') {
          const companyIds = getCompanyIds(user);
          const { chartData, totalAksiyonlar } = groupAksiyonlarByDepartment(
            state.rawData.aksiyonlar, 
            state.rawData.departments, 
            companyIds
          );
          
          state.chartData = chartData;
          state.totalAksiyonlar = totalAksiyonlar;
          state.userRole = user.role;
        } else {
          // Temsilci rolü için boş veri
          state.chartData = [];
          state.totalAksiyonlar = 0;
          state.userRole = user.role;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardCharts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardCharts.fulfilled, (state, action) => {
        // Ham verileri kaydet
        state.rawData = {
          departments: action.payload.departments || [],
          aksiyonlar: action.payload.aksiyonlar || []
        };
        
        // Kullanıcı bilgilerini al
        const userInfo = action.payload.userInfo;
        
        if (userInfo) {
          // Sadece danışman ve yönetici rolleri için veri hazırla
          if (userInfo.role === 'danışman' || userInfo.role === 'yönetici') {
            const companyIds = getCompanyIds(userInfo);
            const { chartData, totalAksiyonlar } = groupAksiyonlarByDepartment(
              state.rawData.aksiyonlar, 
              state.rawData.departments, 
              companyIds
            );
            
            state.chartData = chartData;
            state.totalAksiyonlar = totalAksiyonlar;
            state.userRole = userInfo.role;
          } else {
            // Temsilci rolü için boş veri
            state.chartData = [];
            state.totalAksiyonlar = 0;
            state.userRole = userInfo.role;
          }
        }
        
        state.loading = false;
      })
      .addCase(fetchDashboardCharts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.chartData = [];
        state.totalAksiyonlar = 0;
      });
  }
});

export const { updateChartData } = dashboardChartsSlice.actions;
export default dashboardChartsSlice.reducer;
