'use client'
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useGetHealthQuery } from "@/redux/features/health/healthApi";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

function HealthProbe() {
  useGetHealthQuery();
  return null;
}

export function Providers({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <HealthProbe />
          {children}
        </ThemeProvider>
      </Provider>
    );
}
