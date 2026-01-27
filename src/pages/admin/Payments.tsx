import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { usePayment } from '../../context/PaymentContext';
import type { PaymentStatus } from '../../context/PaymentContext';
import '../../styles/admin.css';

/* ======================
   STATUS MAPPING
====================== */

type UIStatus = 'Completed' | 'Pending' | 'Failed';

const statusToUI: Record<PaymentStatus, UIStatus> = {
  idle: 'Pending',
  initiated: 'Pending',
  pending: 'Pending',
  success: 'Completed',
  failed: 'Failed',
};

const uiToStatus: Record<UIStatus, PaymentStatus> = {
  Completed: 'success',
  Pending: 'pending',
  Failed: 'failed',
};

/* ======================
   COMPONENT
====================== */

const Payments = () => {
  const { payments, updatePaymentStatus } = usePayment();
  const [selectedDate, setSelectedDate] = useState('');

  /* ======================
     FILTER PAYMENTS BY DAY
  ====================== */
  const filteredPayments = selectedDate
    ? payments.filter(p => {
        const paymentDate = new Date(p.createdAt)
          .toISOString()
          .split('T')[0]; // YYYY-MM-DD
        return paymentDate === selectedDate;
      })
    : payments;

  /* ======================
     STATS
  ====================== */
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  /* ======================
     ACTIONS
  ====================== */
  const handleStatusChange = (id: number, uiStatus: UIStatus) => {
    if (window.confirm(`Change payment status to ${uiStatus}?`)) {
      updatePaymentStatus(id, uiToStatus[uiStatus]);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Payments (M-Pesa)</h1>
        </div>

        {/* DATE FILTER */}
        <div className="filter-bar">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="date-filter"
          />

          {selectedDate && (
            <button
              className="filter-btn"
              onClick={() => setSelectedDate('')}
            >
              Clear
            </button>
          )}
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stats-card">
            <p className="stats-title">Total Revenue</p>
            <h3 className="stats-value">
              KSH {totalRevenue.toLocaleString()}
            </h3>
          </div>

          <div className="stats-card">
            <p className="stats-title">Pending Payments</p>
            <h3 className="stats-value">
              KSH {pendingAmount.toLocaleString()}
            </h3>
          </div>

          <div className="stats-card">
            <p className="stats-title">Transactions</p>
            <h3 className="stats-value">
              {filteredPayments.length}
            </h3>
          </div>
        </div>

        {/* TABLE */}
        <div className="admin-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>Amount (KSH)</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td data-label="ID">{p.id}</td>
                  <td data-label="Phone">{p.phone}</td>
                  <td data-label="Amount">
                    {p.amount.toLocaleString()}
                  </td>
                  <td data-label="Date">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`badge badge-${statusToUI[
                        p.status
                      ].toLowerCase()}`}
                    >
                      {statusToUI[p.status]}
                    </span>
                  </td>
                  <td data-label="Action">
                    <select
                      value={statusToUI[p.status]}
                      onChange={e =>
                        handleStatusChange(
                          p.id,
                          e.target.value as UIStatus
                        )
                      }
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No payments found for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Payments;
