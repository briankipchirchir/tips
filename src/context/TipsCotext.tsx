import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Tip {
  id: number;
  league: string;
  fixture: string;
  tip: string;
  odds: string;
  type: 'Free' | 'Premium';
}

interface TipsContextType {
  tips: Tip[];
  addTip: (tip: Omit<Tip, 'id'>) => void;
  updateTip: (id: number, tip: Omit<Tip, 'id'>) => void;
  deleteTip: (id: number) => void;
}

const TipsContext = createContext<TipsContextType | undefined>(undefined);

export const TipsProvider = ({ children }: { children: ReactNode }) => {
  const [tips, setTips] = useState<Tip[]>([
    {
      id: 1,
      league: 'EPL',
      fixture: 'Arsenal vs Chelsea',
      tip: 'Over 2.5',
      odds: '1.85',
      type: 'Premium',
    },
    {
      id: 2,
      league: 'Serie A',
      fixture: 'Inter vs Milan',
      tip: 'BTTS',
      odds: '1.72',
      type: 'Free',
    },
    {
      id: 3,
      league: 'La Liga',
      fixture: 'Barcelona vs Real Madrid',
      tip: 'Home Win',
      odds: '2.10',
      type: 'Premium',
    },
  ]);

  const addTip = (tip: Omit<Tip, 'id'>) => {
    const newTip = {
      ...tip,
      id: Math.max(...tips.map(t => t.id), 0) + 1,
    };
    setTips([...tips, newTip]);
  };

  const updateTip = (id: number, updatedTip: Omit<Tip, 'id'>) => {
    setTips(tips.map(tip => (tip.id === id ? { ...updatedTip, id } : tip)));
  };

  const deleteTip = (id: number) => {
    setTips(tips.filter(tip => tip.id !== id));
  };

  return (
    <TipsContext.Provider value={{ tips, addTip, updateTip, deleteTip }}>
      {children}
    </TipsContext.Provider>
  );
};

export const useTips = () => {
  const context = useContext(TipsContext);
  if (!context) {
    throw new Error('useTips must be used within a TipsProvider');
  }
  return context;
};