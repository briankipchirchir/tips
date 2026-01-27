import { useState, useEffect } from "react";
import '../../styles/admin.css';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tip: {
    league: string;
    fixture: string;
    tip: string;
    odds: string;
    type: 'Free' | 'Premium';
  }) => void;
  editTip?: {
    league: string;
    fixture: string;
    tip: string;
    odds: string;
    type: 'Free' | 'Premium';
  } | null;
}

const TipModal = ({ isOpen, onClose, onSave, editTip }: TipModalProps) => {
  const [league, setLeague] = useState("");
  const [fixture, setFixture] = useState("");
  const [tip, setTip] = useState("");
  const [odds, setOdds] = useState("");
  const [type, setType] = useState<'Free' | 'Premium'>('Free');

  useEffect(() => {
    if (editTip) {
      setLeague(editTip.league);
      setFixture(editTip.fixture);
      setTip(editTip.tip);
      setOdds(editTip.odds);
      setType(editTip.type);
    } else {
      setLeague("");
      setFixture("");
      setTip("");
      setOdds("");
      setType('Free');
    }
  }, [editTip]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ league, fixture, tip, odds, type });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{editTip ? "Edit Tip" : "Create Tip"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="League"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            required
          />
          <input
            placeholder="Fixture"
            value={fixture}
            onChange={(e) => setFixture(e.target.value)}
            required
          />
          <input
            placeholder="Tip"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            required
          />
          <input
            placeholder="Odds"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value as 'Free' | 'Premium')} required>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
          <div className="modal-buttons">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipModal;
