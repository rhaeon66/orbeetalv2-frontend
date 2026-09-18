import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import './features/health/healthApi';
import './features/contact/contactApi';
import './features/auth/authApi';
import './features/admin/dashboardApi';
import './features/cms/slidesApi';
import './features/cms/projectsApi';
import './features/cms/servicesApi';
import './features/cms/teamApi';
import './features/cms/testimonialsApi';
import './features/cms/faqsApi';
import './features/cms/productsApi';
import './features/cms/departmentsApi';
import './features/cms/clientsApi';
import './features/cms/homepageApi';
import './features/cms/mediaApi';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
