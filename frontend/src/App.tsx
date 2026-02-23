// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Suspense } from 'react-router-dom';
import { Navigate, lazy } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import PerformanceMonitor from './components/PerformanceMonitor';

// Lazy load dashboard pages for code splitting
const Overview = lazy(() => import('./app/dashboard/Overview'));
const Proposals = lazy(() => import('./app/dashboard/Proposals'));
const Activity = lazy(() => import('./app/dashboard/Activity'));
const Analytics = lazy(() => import('./app/dashboard/Analytics'));
const Settings = lazy(() => import('./app/dashboard/Settings'));
const Templates = lazy(() => import('./app/dashboard/Templates'));
const RecurringPayments = lazy(() => import('./app/dashboard/RecurringPayments'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PerformanceMonitor enableConsoleLogging={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Overview />
              </Suspense>
            }
          />
          <Route
            path="proposals"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Proposals />
              </Suspense>
            }
          />
          <Route
            path="activity"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Activity />
              </Suspense>
            }
          />
          <Route
            path="templates"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Templates />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="recurring-payments"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <RecurringPayments />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;