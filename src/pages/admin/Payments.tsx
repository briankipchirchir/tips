const Payments = () => {
  const payments = [
    { id: 1, user: "John Doe", amount: 50, status: "Completed" },
    { id: 2, user: "Jane Smith", amount: 70, status: "Pending" },
  ];

  return (
    <div className="admin-page">
      <h2>Payments (Mpesa)</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount (KSH)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.user}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
