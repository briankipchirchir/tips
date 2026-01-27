import { useState } from 'react';
import TipModal from './TipModal';
import { useTips } from '../../context/TipsCotext';

type Tip = {
  id: number;
  league: string;
  fixture: string;
  tip: string;
  odds: string;
  type: 'Free' | 'Premium';
};

const TipsTable = () => {
  const { tips, updateTip, deleteTip } = useTips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);

  /* ======================
     ACTIONS
  ====================== */
  const handleEdit = (tip: Tip) => {
    setEditingTip(tip);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this tip?')) {
      deleteTip(id);
    }
  };

  const handleSave = (tipData: Omit<Tip, 'id'>) => {
    if (editingTip) {
      updateTip(editingTip.id, tipData);
    }
    setEditingTip(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTip(null);
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <>
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
            {tips.map((tip: Tip) => (
              <tr key={tip.id}>
                <td data-label="ID">{tip.id}</td>

                <td data-label="League">{tip.league}</td>

                <td data-label="Fixture">{tip.fixture}</td>

                <td data-label="Tip">{tip.tip}</td>

                <td data-label="Odds">{tip.odds}</td>

                <td data-label="Type">
                  <span
                    className={`badge badge-${tip.type.toLowerCase()}`}
                  >
                    {tip.type}
                  </span>
                </td>

                <td data-label="Actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(tip)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(tip.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {tips.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-state">
                  No tips available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TipModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editTip={editingTip}
      />
    </>
  );
};

export default TipsTable;
