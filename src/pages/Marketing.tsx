import { useState } from 'react';
import { useStore } from '../store';
import { Megaphone, Plus, Users, Calendar, Send, Eye } from 'lucide-react';

export default function Marketing() {
  const session = useStore(s => s.currentSession);
  const campaigns = useStore(s => s.campaigns);
  const clients = useStore(s => s.clients);
  const addCampaign = useStore(s => s.addCampaign);
  const updateCampaign = useStore(s => s.updateCampaign);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'email' | 'social' | 'promotion'>('email');
  const [startDate, setStartDate] = useState('');
  const [targetClients, setTargetClients] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const companyCampaigns = session ? campaigns.filter(c => c.companyId === session.companyId) : [];
  const companyClients = session ? clients.filter(c => c.companyId === session.companyId && c.status === 'active') : [];

  const handleCreate = () => {
    if (!session || !name || !startDate) return;

    addCampaign({
      companyId: session.companyId,
      name,
      description,
      type,
      status: 'draft',
      startDate,
      targetClients,
      message,
      results: { sent: 0, opened: 0, responded: 0 },
      createdBy: session.userId,
    });

    setName('');
    setDescription('');
    setType('email');
    setStartDate('');
    setTargetClients([]);
    setMessage('');
    setShowCreate(false);
  };

  const statusColors = {
    draft: 'bg-gray-50 text-gray-700 border-gray-200',
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <Megaphone size={24} className="text-[#288FC5]" />
            Marketing
          </h1>
          <p className="text-sm text-gray-500 mt-1">{companyCampaigns.length} campañas</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
        >
          <Plus size={16} /> Nueva campaña
        </button>
      </div>

      {/* Aviso de integración */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Estado:</strong> Módulo operativo para gestión de campañas.
          El envío real requiere integración con proveedor de email marketing y cumplimiento de RGPD.
        </p>
      </div>

      {/* Create Campaign */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-[#334155] mb-4">Nueva campaña</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Nombre *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="email">Email</option>
                  <option value="social">Redes sociales</option>
                  <option value="promotion">Promoción</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Fecha inicio *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Destinatarios</label>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {companyClients.map(client => (
                  <label key={client.id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={targetClients.includes(client.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTargetClients([...targetClients, client.id]);
                        } else {
                          setTargetClients(targetClients.filter(id => id !== client.id));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{client.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{targetClients.length} clientes seleccionados</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
                placeholder="Contenido de la campaña..."
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>RGPD:</strong> Asegúrate de tener consentimiento válido de los destinatarios antes de enviar comunicaciones comerciales.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
              >
                Crear campaña
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      {companyCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">No hay campañas creadas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companyCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[#334155]">{campaign.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[campaign.status]}`}>
                      {campaign.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                      {campaign.type}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {campaign.targetClients.length} destinatarios
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(campaign.startDate).toLocaleDateString('es-ES')}
                    </span>
                    {campaign.results && (
                      <>
                        <span>Enviados: {campaign.results.sent}</span>
                        <span>Abiertos: {campaign.results.opened}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => updateCampaign(campaign.id, { status: 'scheduled' })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600"
                    >
                      <Calendar size={12} /> Programar
                    </button>
                  )}
                  {campaign.status === 'scheduled' && (
                    <button
                      onClick={() => updateCampaign(campaign.id, { status: 'active' })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600"
                    >
                      <Send size={12} /> Activar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
