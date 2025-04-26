// store/index.js veya store.js
import { configureStore } from "@reduxjs/toolkit"
import formGonderSlice from './slices/formGonderSlice'
import freeAccountSlice from './slices/freeAccountSlice'
import authReducer from './slices/authSlice'
import companyUpdateReducer from './slices/companyUpdateSlice'
import userInfoReducer from './slices/userInfoSlice'
import dashboardStatsReducer from './slices/dashboardStatsSlice'
import dashboardChartsReducer from './slices/dashboardChartsSlice'
import girisKayitlariReducer from './slices/girisKayitlariSlice'
import envanterGuncellemeReducer from './slices/envanterGuncellemeSlice'
import dokumanlarReducer from './slices/dokumanlarSlice'
import aksiyonlarReducer from './slices/aksiyonlarSlice'
import organizasyonReducer from './slices/organizasyonSlice'
import veriIslemeReducer from './slices/veriIslemeSlice'
import departmentsReducer from './slices/departmentsSlice'
import kisiselVerilerListReducer from './slices/kisiselVerilerListSlice'
import varlikListReducer from './slices/varlikSlice'
import tedarikciListReducer from './slices/tedarikciSlice'



export const store = configureStore({
  reducer: {
    formGonder: formGonderSlice,
    freeAccount: freeAccountSlice,
    auth: authReducer,
    companyUpdate: companyUpdateReducer,
    userInfo: userInfoReducer,
    dashboardStats: dashboardStatsReducer,
    dashboardCharts: dashboardChartsReducer,
    girisKayitlari: girisKayitlariReducer,
    envanterGuncelleme: envanterGuncellemeReducer,
    dokumanlar: dokumanlarReducer,
    aksiyonlar: aksiyonlarReducer,
    organizasyon: organizasyonReducer,
    veriIsleme: veriIslemeReducer,
    departments: departmentsReducer,
    kisiselVerilerList: kisiselVerilerListReducer,
    varlikList: varlikListReducer,
    tedarikciList: tedarikciListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})



export default store
