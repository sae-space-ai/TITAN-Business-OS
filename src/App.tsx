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
import {
  Authorizations, Agenda, Reports, Joule, Billing, Documents,
  Payments, MailModule, Marketing, AlgorithmicIntelligence
} from './pages/Modules';
import DigitalEmployee from './pages/DigitalEmployee';

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

          {/* Módulos operativos Etapa 3 */}
          <Route path="/empleado-digital" element={<DigitalEmployee />} />
          <Route path="/inteligencia" element={<AlgorithmicIntelligence />} />
          <Route path="/joule" element={<Joule />} />
          <Route path="/facturacion" element={<Billing />} />
          <Route path="/documentos" element={<Documents />} />
          <Route path="/informes" element={<Reports />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/cobros" element={<Payments />} />
          <Route path="/correo" element={<MailModule />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/autorizaciones" element={<Authorizations />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
