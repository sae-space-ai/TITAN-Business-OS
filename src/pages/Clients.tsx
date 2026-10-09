import { useState } from 'react';
import { useStore } from '../store';
import { Users, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { Client } from '../types';

export default function Clients() {
  const session = useStore(s => s.currentSession);
  const getClientsByCompany = useStore(s => s.getClientsByCompany);
  const addClient = useStore(s => s.addClient);
  const updateClient = useStore(s => s.updateClient);
  const deleteClient = useStore(s => s.deleteClient);
  const hasPermission = useStore(s => s.hasPermission);

  const clients = session ? getClientsByCompany(session.companyId) : [];
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.taxId?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setName('');
    setTaxId('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
    setEditingClient(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (editingClient) {
      updateClient(editingClient.id, { name, taxId, email, phone, address, notes });
    } else {
      addClient({
        companyId: session.companyId,
        name,
        taxId,
        email,
        phone,
        address,
        notes,
        tags: [],
        isSynthetic: false,
      });
    }
    resetForm();
  };

  const startEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setTaxId(client.taxId || '');
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setNotes(client.notes || '');
    setShowForm(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <Users size={24} className="text-[#288FC5]" />
            Clientes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients.length} {clients.length === 1 ? 'cliente registrado' : 'clientes registrados'}
          </p>
        </div>
        {hasPermission('clients.create') && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0] transition-colors"
          >
            <Plus size={16} />
            Nuevo cliente
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o NIF..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#334155]">
                  {editingClient ? 'Editar cliente' : 'Nuevo cliente'}
                </h3>
                <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">NIF/CIF</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Dirección</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Notas</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5] resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
                  >
                    {editingClient ? 'Guardar cambios' : 'Crear cliente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">
            {search ? 'No se encontraron clientes con ese criterio' : 'Aún no hay clientes registrados'}
          </p>
          {!search && hasPermission('clients.create') && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-[#288FC5] font-medium hover:underline"
            >
              Crear primer cliente →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#334155] truncate">{client.name}</h3>
                    {client.isSynthetic && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                        SINTÉTICO
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {client.taxId && <span>NIF: {client.taxId}</span>}
                    {client.email && <span>{client.email}</span>}
                    {client.phone && <span>{client.phone}</span>}
                  </div>
                  {client.notes && (
                    <p className="text-xs text-gray-400 mt-2 truncate">{client.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {hasPermission('clients.update') && (
                    <button
                      onClick={() => startEdit(client)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#288FC5]"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {hasPermission('clients.delete') && (
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este cliente?')) deleteClient(client.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
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
