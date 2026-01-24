import { useState } from "react";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tip: { league: string; fixture: string; tip: string; odds: string }) => void;
  editTip?: { league: string; fixture: string; tip: string; odds: string };
}

const TipModal = ({ isOpen, onClose, onSave, editTip }: TipModalProps) => {
  const [league, setLeague] = useState(editTip?.league || "");
  const [fixture, setFixture] = useState(editTip?.fixture || "");
  const [tip, setTip] = useState(editTip?.tip || "");
  const [odds, setOdds] = useState(editTip?.odds || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ league, fixture, tip, odds });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{editTip ? "Edit Tip" : "Create Tip"}</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="League" value={league} onChange={(e) => setLeague(e.target.value)} required />
          <input placeholder="Fixture" value={fixture} onChange={(e) => setFixture(e.target.value)} required />
          <input placeholder="Tip" value={tip} onChange={(e) => setTip(e.target.value)} required />
          <input placeholder="Odds" value={odds} onChange={(e) => setOdds(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TipModal;
