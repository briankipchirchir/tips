import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import TipModal from '../../components/admin/TipModal';

import '../../styles/admin.css';
import { useTips } from '../../context/TipsCotext';

const TipsManagement = () => {
  const { tips, addTip, updateTip, deleteTip } = useTips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<{
    id: number;
    league: string;
    fixture: string;
    tip: string;
    odds: string;
    type: 'Free' | 'Premium';
  } | null>(null);
  const [filter, setFilter] = useState<'All' | 'Free' | 'Premium'>('All');

  const handleEdit = (tip: typeof tips[0]) => {
    setEditingTip(tip);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tip?')) {
      deleteTip(id);
    }
  };

  const handleSave = (tipData: {
    league: string;
    fixture: string;
    tip: string;
    odds: string;
    type: 'Free' | 'Premium';
  }) => {
    if (editingTip) {
      updateTip(editingTip.id, tipData);
    } else {
      addTip(tipData);
    }
    setEditingTip(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTip(null);
  };

  const filteredTips = filter === 'All' ? tips : tips.filter(tip => tip.type === filter);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Tips Management</h1>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Create New Tip
          </button>
        </div>

        <div className="filter-bar">
          <button
            className={filter === 'All' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('All')}
          >
            All ({tips.length})
          </button>
          <button
            className={filter === 'Free' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('Free')}
          >
            Free ({tips.filter(t => t.type === 'Free').length})
          </button>
          <button
            className={filter === 'Premium' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('Premium')}
          >
            Premium ({tips.filter(t => t.type === 'Premium').length})
          </button>
        </div>

        <div className="admin-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>League</th>
                <th>Fixture</th>
                <th>Tip</th>
                <th>Odds</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTips.map((tip) => (
                <tr key={tip.id}>
                  <td data-label="ID">{tip.id}</td>
                <td data-label="League">{tip.league}</td>
<td data-label="Fixture">{tip.fixture}</td>
<td data-label="Tip">{tip.tip}</td>
<td data-label="Odds">{tip.odds}</td>
<td data-label="Type">
  <span className={`badge badge-${tip.type.toLowerCase()}`}>
    {tip.type}
  </span>
</td>
<td data-label="Actions">
  <button className="btn-edit" onClick={() => handleEdit(tip)}>Edit</button>
  <button className="btn-delete" onClick={() => handleDelete(tip.id)}>Delete</button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <TipModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editTip={editingTip}
      />
    </div>
  );
};

export default TipsManagement;