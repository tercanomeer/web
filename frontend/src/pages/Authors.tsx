import { useState, useEffect } from 'react';
import { authorsService } from '../services/api';
import type { Author, CreateAuthorDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRoleValues } from '../types';
import { GuestRestrictionModal } from '../components/GuestRestrictionModal';
import './CRUD.css';

export const Authors = () => {
  const { user } = useAuth();
  const isGuest = user?.role === UserRoleValues.GUEST;
  const isAdmin = user?.role === UserRoleValues.ADMIN;
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<CreateAuthorDto>({
    name: '',
    bio: '',
  });

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const data = await authorsService.getAll();
      setAuthors(data);
    } catch (error) {
      console.error('Error loading authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    try {
      if (editingAuthor) {
        await authorsService.update(editingAuthor.id, formData);
      } else {
        await authorsService.create(formData);
      }
      resetForm();
      loadAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
      alert('Error saving author');
    }
  };

  const handleEdit = (author: Author) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      bio: author.bio || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    if (!confirm('Are you sure you want to delete this author?')) return;
    try {
      await authorsService.delete(id);
      loadAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Error deleting author');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
    });
    setEditingAuthor(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  const handleAddNew = () => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="crud-container">
      <GuestRestrictionModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
      <div className="crud-header">
        <h1>Authors Management</h1>
        {isAdmin && (
          <button onClick={handleAddNew} className="btn-primary">
            Add New Author
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-card">
            <h2>{editingAuthor ? 'Edit Author' : 'Add New Author'}</h2>
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
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingAuthor ? 'Update' : 'Create'}
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
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                No authors found
              </td>
            </tr>
          ) : (
            authors.map((author) => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.bio || 'N/A'}</td>
                <td>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleEdit(author)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(author.id)} className="btn-delete">
                        Delete
                      </button>
                    </>
                  )}
                  {!isAdmin && <span style={{ color: '#999' }}>Read Only</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

