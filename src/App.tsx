import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Clients from './pages/Clients';
import Requests from './pages/Requests';
import Budgets from './pages/Budgets';
import SettingsPage from './pages/Settings';
import Sources from './pages/Sources';
import ComingSoon from './pages/ComingSoon';
import Stage1Status from './pages/Stage1Status';
import RequestDetail from './pages/RequestDetail';
import BudgetEditor from './pages/BudgetEditor';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentSession = useStore(s => s.currentSession);

  if (!currentSession) {
    return <Navigate to="/login" replace />;
  }

  // Check if session is expired
  if (new Date(currentSession.expiresAt) < new Date()) {
    useStore.getState().logout();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const currentSession = useStore(s => s.currentSession);

  if (currentSession) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/solicitudes" element={<Requests />} />
          <Route path="/solicitudes/:id" element={<RequestDetail />} />
          <Route path="/presupuestos" element={<Budgets />} />
          <Route path="/presupuestos/nueva" element={<BudgetEditor />} />
          <Route path="/presupuestos/:id" element={<BudgetEditor />} />
          <Route path="/configuracion" element={<SettingsPage />} />
          <Route path="/fuentes" element={<Sources />} />
          <Route path="/estado-etapa-1" element={<Stage1Status />} />

          {/* Coming soon modules */}
          <Route path="/empleado-digital" element={<ComingSoon />} />
          <Route path="/inteligencia" element={<ComingSoon />} />
          <Route path="/joule" element={<ComingSoon />} />
          <Route path="/facturacion" element={<ComingSoon />} />
          <Route path="/documentos" element={<ComingSoon />} />
          <Route path="/informes" element={<ComingSoon />} />
          <Route path="/agenda" element={<ComingSoon />} />
          <Route path="/cobros" element={<ComingSoon />} />
          <Route path="/correo" element={<ComingSoon />} />
          <Route path="/marketing" element={<ComingSoon />} />
          <Route path="/autorizaciones" element={<ComingSoon />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
