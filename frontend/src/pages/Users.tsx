import { useState, useEffect } from 'react';
import { usersService } from '../services/api';
import type { User } from '../types';
import { UserRoleValues } from '../types';
import './CRUD.css';

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    password: '',
    name: '',
    role: UserRoleValues.USER,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // If password is empty, don't send it
        const updateData: Partial<{ email: string; password: string; name: string; role?: string }> = { ...formData };
        if (!updateData.password || updateData.password === '') {
          const { password, ...dataWithoutPassword } = updateData;
          await usersService.update(editingUser.id, dataWithoutPassword);
        } else {
          await usersService.update(editingUser.id, updateData);
        }
      } else {
        await usersService.create(formData);
      }
      resetForm();
      loadUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Error saving user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't show password
      name: user.name,
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersService.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      role: UserRoleValues.USER,
    });
    setEditingUser(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Users Management</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add New User
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-card">
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password {editingUser ? '(leave empty to keep current)' : '*'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={6}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value={UserRoleValues.USER}>User</option>
                  <option value={UserRoleValues.ADMIN}>Admin</option>
                  <option value={UserRoleValues.GUEST}>Guest</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: user.role === UserRoleValues.ADMIN ? '#4CAF50' : user.role === UserRoleValues.GUEST ? '#757575' : '#2196F3',
                    color: 'white'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(user)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

