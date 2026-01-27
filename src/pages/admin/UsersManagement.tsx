import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

import '../../styles/admin.css';
import { useUsers } from '../../context/UserContext';

const UsersManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: number;
    name: string;
    email: string;
    plan: 'GOLD' | 'SILVER' | 'BRONZE' | 'FREE';
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'FREE' as 'GOLD' | 'SILVER' | 'BRONZE' | 'FREE',
  });

  const handleEdit = (user: typeof users[0]) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, plan: user.plan });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', plan: 'FREE' });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Users Management</h1>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add New User
          </button>
        </div>

        <div className="admin-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.plan.toLowerCase()}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(u)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* User Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <select
                value={formData.plan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    plan: e.target.value as 'GOLD' | 'SILVER' | 'BRONZE' | 'FREE',
                  })
                }
                required
              >
                <option value="FREE">Free</option>
                <option value="BRONZE">Bronze</option>
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Save
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
