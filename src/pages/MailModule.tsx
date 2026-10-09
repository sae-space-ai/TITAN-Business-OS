import { useState } from 'react';
import { useStore } from '../store';
import { Mail, Plus, Search, Send, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function MailModule() {
  const session = useStore(s => s.currentSession);
  const emails = useStore(s => s.emails);
  const clients = useStore(s => s.clients);
  const addEmail = useStore(s => s.addEmail);
  const updateEmail = useStore(s => s.updateEmail);
  const authorizationRequests = useStore(s => s.authorizationRequests);
  const addAuthorizationRequest = useStore(s => s.addAuthorizationRequest);

  const [showCompose, setShowCompose] = useState(false);
  const [search, setSearch] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [clientId, setClientId] = useState('');

  const companyEmails = session ? emails.filter(e => e.companyId === session.companyId) : [];
  const companyClients = session ? clients.filter(c => c.companyId === session.companyId) : [];

  const filteredEmails = companyEmails.filter(e =>
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.to.toLowerCase().includes(search.toLowerCase()) ||
    e.body.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveDraft = () => {
    if (!session || !to || !subject) return;

    addEmail({
      companyId: session.companyId,
      from: 'usuario@empresa.com', // En producción: cuenta configurada
      to,
      subject,
      body,
      status: 'draft',
      clientId: clientId || undefined,
      createdBy: session.userId,
    });

    setTo('');
    setSubject('');
    setBody('');
    setClientId('');
    setShowCompose(false);
  };

  const handleSendRequest = (emailId: string) => {
    if (!session) return;

    const email = emails.find(e => e.id === emailId);
    if (!email) return;

    addAuthorizationRequest({
      companyId: session.companyId,
      type: 'email_send',
      title: `Enviar correo a ${email.to}`,
      description: `Asunto: ${email.subject}`,
      requestData: { emailId },
      status: 'pending',
      requestedBy: session.userId,
      requestedByName: 'Usuario',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  const statusColors = {
    draft: 'bg-gray-50 text-gray-700 border-gray-200',
    sent: 'bg-green-50 text-green-700 border-green-200',
    received: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <Mail size={24} className="text-[#288FC5]" />
            Correo Empresarial
          </h1>
          <p className="text-sm text-gray-500 mt-1">{companyEmails.length} mensajes</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
        >
          <Plus size={16} /> Nuevo mensaje
        </button>
      </div>

      {/* Aviso de integración */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Estado:</strong> Módulo operativo para gestión de borradores y solicitudes de aprobación.
          El envío real requiere configuración de cuenta de correo (Gmail/Outlook) mediante OAuth.
        </p>
      </div>

      {/* Compose */}
      {showCompose && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-[#334155] mb-4">Nuevo mensaje</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Para *</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="cliente@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Asunto *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Cliente relacionado</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              >
                <option value="">Sin cliente</option>
                {companyClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Mensaje</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-700"
              >
                <Save size={14} /> Guardar borrador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar mensajes..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm"
        />
      </div>

      {/* Emails List */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          <Mail size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">No hay mensajes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map(email => (
            <div key={email.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[email.status]}`}>
                      {email.status === 'draft' ? 'Borrador' : email.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(email.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="font-medium text-[#334155]">{email.subject}</p>
                  <p className="text-sm text-gray-600">Para: {email.to}</p>
                  {email.body && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{email.body}</p>
                  )}
                </div>
                {email.status === 'draft' && (
                  <button
                    onClick={() => handleSendRequest(email.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#288FC5] text-white text-xs font-medium hover:bg-[#1a6fa0]"
                  >
                    <Send size={12} /> Solicitar envío
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
