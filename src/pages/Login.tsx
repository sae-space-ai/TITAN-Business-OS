import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Login() {
  const navigate = useNavigate();
  const login = useStore(s => s.login);
  const registerCompany = useStore(s => s.registerCompany);
  const currentSession = useStore(s => s.currentSession);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regCommercialName, setRegCommercialName] = useState('');
  const [regTaxId, setRegTaxId] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regProvince, setRegProvince] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  // Redirect if already logged in
  if (currentSession) {
    navigate('/home');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (regPassword !== regPasswordConfirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = registerCompany(
      {
        name: regCompanyName,
        commercialName: regCommercialName || regCompanyName,
        taxId: regTaxId,
        address: regAddress,
        postalCode: regPostalCode,
        city: regCity,
        province: regProvince,
        country: 'España',
        email: regEmail,
        phone: regPhone,
      },
      regEmail,
      regOwnerName,
      regPassword
    );

    setLoading(false);

    if (result.success) {
      // Auto-login after registration
      const loginResult = login(regEmail, regPassword);
      if (loginResult.success) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    } else {
      setError(result.error || 'Error al registrar la empresa');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7FE] via-white to-[#F8D7E7]/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#288FC5] to-[#1a6fa0] shadow-lg shadow-[#288FC5]/20 mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-[#334155]">TITAN Business OS</h1>
          <p className="text-sm text-gray-500 mt-1">Máxima inteligencia dentro. Máxima sencillez fuera.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-50 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#288FC5] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#288FC5] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrar empresa
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5] transition-all"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5] transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#288FC5] text-white font-medium text-sm hover:bg-[#1a6fa0] transition-colors disabled:opacity-50"
              >
                {loading ? 'Accediendo...' : 'Acceder a TITAN'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Datos de la empresa</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">Razón social *</label>
                    <input
                      type="text"
                      value={regCompanyName}
                      onChange={(e) => setRegCompanyName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="Mi Empresa S.L."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">Nombre comercial</label>
                    <input
                      type="text"
                      value={regCommercialName}
                      onChange={(e) => setRegCommercialName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="Mi Empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">NIF/CIF *</label>
                    <input
                      type="text"
                      value={regTaxId}
                      onChange={(e) => setRegTaxId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="B12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">Dirección</label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="Calle Mayor 1, 2ºA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">C. Postal</label>
                    <input
                      type="text"
                      value={regPostalCode}
                      onChange={(e) => setRegPostalCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="28001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="Madrid"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#334155] mb-1">Provincia</label>
                    <input
                      type="text"
                      value={regProvince}
                      onChange={(e) => setRegProvince(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="Madrid"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Datos del propietario</p>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    value={regOwnerName}
                    onChange={(e) => setRegOwnerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    placeholder="Juan García López"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">Email *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    placeholder="juan@miempresa.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Contraseña *</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Confirmar *</label>
                    <input
                      type="password"
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#288FC5] text-white font-medium text-sm hover:bg-[#1a6fa0] transition-colors disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Crear empresa y acceder'}
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                Al registrarte aceptas que TITAN procese tus datos conforme al RGPD.
                No se envían datos a servicios externos sin tu autorización.
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          TITAN Business OS v1.0 — Etapa 1: Fundación
        </p>
      </div>
    </div>
  );
}
