import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

/* =======================
   TYPES
======================= */

export type PaymentStatus =
  | 'idle'
  | 'initiated'
  | 'pending'
  | 'success'
  | 'failed';

export interface Payment {
  id: number;
  phone: string;
  amount: number;
  reference: string;
  status: PaymentStatus;
  createdAt: string;
}

interface PaymentContextType {
  payments: Payment[];
  currentPayment: Payment | null;

  initiatePayment: (data: {
    phone: string;
    amount: number;
    reference: string;
  }) => void;

  updatePaymentStatus: (id: number, status: PaymentStatus) => void;

  clearCurrentPayment: () => void;
}

/* =======================
   CONTEXT
======================= */

const PaymentContext = createContext<PaymentContextType | undefined>(
  undefined
);

/* =======================
   PROVIDER
======================= */

export const PaymentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] =
    useState<Payment | null>(null);

  const initiatePayment = ({
    phone,
    amount,
    reference,
  }: {
    phone: string;
    amount: number;
    reference: string;
  }) => {
    const newPayment: Payment = {
      id: Math.max(...payments.map(p => p.id), 0) + 1,
      phone,
      amount,
      reference,
      status: 'initiated',
      createdAt: new Date().toISOString(),
    };

    setPayments(prev => [...prev, newPayment]);
    setCurrentPayment(newPayment);
  };

  const updatePaymentStatus = (
    id: number,
    status: PaymentStatus
  ) => {
    setPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );

    setCurrentPayment(prev =>
      prev?.id === id ? { ...prev, status } : prev
    );
  };

  const clearCurrentPayment = () => {
    setCurrentPayment(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        currentPayment,
        initiatePayment,
        updatePaymentStatus,
        clearCurrentPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

/* =======================
   HOOK
======================= */

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error(
      'usePayment must be used within a PaymentProvider'
    );
  }
  return context;
};
