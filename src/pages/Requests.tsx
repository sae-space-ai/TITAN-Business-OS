import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Plus, Eye, Search, ArrowRight } from 'lucide-react';
import { ServiceRequest, RequestChannel, RequestStatus } from '../types';

const statusLabels: Record<RequestStatus, string> = {
  received: 'Recibida',
  analyzing: 'Analizando',
  analyzed: 'Analizada',
  budgeting: 'Presupuestando',
  budget_ready: 'Presupuesto listo',
  approved: 'Aprobada',
  sent: 'Enviada',
  completed: 'Completada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
};

const statusColors: Record<RequestStatus, string> = {
  received: 'bg-blue-50 text-blue-700 border-blue-200',
  analyzing: 'bg-amber-50 text-amber-700 border-amber-200',
  analyzed: 'bg-violet-50 text-violet-700 border-violet-200',
  budgeting: 'bg-amber-50 text-amber-700 border-amber-200',
  budget_ready: 'bg-green-50 text-green-700 border-green-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sent: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  completed: 'bg-gray-50 text-gray-700 border-gray-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
};

const channelLabels: Record<RequestChannel, string> = {
  web: 'Web',
  email: 'Email',
  phone: 'Teléfono',
  in_person: 'Presencial',
  other: 'Otro',
};

export default function Requests() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = useStore(s => s.currentSession);
  const getRequestsByCompany = useStore(s => s.getRequestsByCompany);
  const getClientsByCompany = useStore(s => s.getClientsByCompany);
  const addRequest = useStore(s => s.addRequest);
  const hasPermission = useStore(s => s.hasPermission);

  const requests = session ? getRequestsByCompany(session.companyId) : [];
  const clients = session ? getClientsByCompany(session.companyId) : [];

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [channel, setChannel] = useState<RequestChannel>('web');

  // Prefill from URL params
  useEffect(() => {
    const desc = searchParams.get('description');
    if (desc) {
      setDescription(desc);
      setShowForm(true);
    }
  }, [searchParams]);

  const filteredRequests = requests
    .filter(r => filterStatus === 'all' || r.status === filterStatus)
    .filter(r =>
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    addRequest({
      companyId: session.companyId,
      clientId: clientId || undefined,
      channel,
      description,
      rawInput: description,
      status: 'received',
      attachments: [],
      createdBy: session.userId,
    });

    setDescription('');
    setClientId('');
    setChannel('web');
    setShowForm(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <FileText size={24} className="text-[#288FC5]" />
            Solicitudes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {requests.length} {requests.length === 1 ? 'solicitud' : 'solicitudes'} registradas
          </p>
        </div>
        {hasPermission('requests.create') && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0] transition-colors"
          >
            <Plus size={16} />
            Nueva solicitud
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar solicitudes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#334155] mb-4">Nueva solicitud</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Descripción del servicio solicitado *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe qué necesita el cliente o qué servicio se solicita..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5] resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Esta información será analizada por el empleado digital
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">Cliente</label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    >
                      <option value="">Sin asignar</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">Canal de entrada</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as RequestChannel)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    >
                      {Object.entries(channelLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Nota:</span> Los datos se registrarán tal cual los proporcionas.
                    No se inventarán clientes ni operaciones.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
                  >
                    Registrar solicitud
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">
            {search || filterStatus !== 'all'
              ? 'No se encontraron solicitudes con esos filtros'
              : 'Aún no hay solicitudes registradas'}
          </p>
          {!search && filterStatus === 'all' && hasPermission('requests.create') && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-[#288FC5] font-medium hover:underline"
            >
              Registrar primera solicitud →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const client = clients.find(c => c.id === request.clientId);
            return (
              <div
                key={request.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">#{request.id.slice(0, 8)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {channelLabels[request.channel]}
                      </span>
                    </div>
                    <p className="text-sm text-[#334155] line-clamp-2">{request.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {client && <span>Cliente: {client.name}</span>}
                      <span>{new Date(request.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/solicitudes/${request.id}`)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#288FC5] shrink-0"
                    title="Ver detalle y analizar"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
