import { useState, useEffect } from 'react';
import { Plus, Tag, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import axiosInstance from '../../config/apiConfig.js';
import { toast } from 'react-toastify';
import DataProvider from '../../context/DataProvider.jsx';
import { useContext } from 'react';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const isExpired = (d) => new Date(d) < new Date();

const DiscountManagement = () => {
  const { account } = useContext(DataProvider.DataContext);
  const [discounts, setDiscounts]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    expiresAt: '',
  });

  const fetchDiscounts = async () => {
    try {
      const { data } = await axiosInstance.get('/api/discount/all');
      setDiscounts(data.discounts || []);
    } catch {
      toast.error('Failed to load discount codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleCreate = async () => {
    if (!form.code.trim() || !form.value || !form.expiresAt) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post('/api/discount/create', {
        ...form,
        value: Number(form.value),
        adminId: account._id,
      });
      toast.success('Discount code created');
      setForm({ code: '', type: 'percentage', value: '', expiresAt: '' });
      setShowForm(false);
      fetchDiscounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create discount code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this discount code? It will no longer be usable.')) return;
    try {
      await axiosInstance.patch(`/api/discount/deactivate/${id}`);
      toast.success('Discount code deactivated');
      fetchDiscounts();
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Discount Codes</h2>
          <p className="text-gray-500 text-sm mt-1">Create and manage fellowship discount codes. One use per user.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Code'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">Create Discount Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                className="w-full border text-black border-gray-200 rounded-lg p-2.5 text-sm uppercase focus:outline-none focus:border-black transition-colors"
                placeholder="e.g. FELLOW25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border text-black border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black transition-colors"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.type === 'percentage' ? 'Percentage Off (1–100)' : 'Amount Off (USD)'} *
              </label>
              <input
                type="number"
                min="1"
                max={form.type === 'percentage' ? 100 : undefined}
                value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                className="w-full text-black border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder={form.type === 'percentage' ? 'e.g. 25' : 'e.g. 500'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
              <input
                type="date"
                value={form.expiresAt}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
                className="w-full text-black border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create Code'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
          </div>
        ) : discounts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No discount codes yet. Create one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Code', 'Type', 'Value', 'Expiry', 'Uses', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {discounts.map((d) => {
                  const expired = isExpired(d.expiresAt);
                  return (
                    <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono font-medium text-gray-900">{d.code}</td>
                      <td className="px-5 py-4 capitalize text-gray-600">{d.type}</td>
                      <td className="px-5 py-4 text-gray-900">
                        {d.type === 'percentage' ? `${d.value}%` : `$${d.value}`}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className={expired ? 'text-red-500' : ''}>{fmt(d.expiresAt)}</span>
                          {expired && <span className="text-xs text-red-500">(expired)</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{d.usedBy?.length || 0}</td>
                      <td className="px-5 py-4">
                        {d.isActive && !expired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                            <XCircle className="w-3 h-3" /> {expired ? 'Expired' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {d.isActive && !expired && (
                          <button
                            onClick={() => handleDeactivate(d._id)}
                            className="text-red-500 hover:text-red-700 text-xs underline transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountManagement;
