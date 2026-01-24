const UsersManagement = () => {
  // mock users data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", plan: "GOLD" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", plan: "SILVER" },
  ];

  return (
    <div className="admin-page">
      <h2>Users Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Plan</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.plan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
