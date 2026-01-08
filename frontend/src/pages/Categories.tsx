import { useState, useEffect } from 'react';
import { categoriesService } from '../services/api';
import type { Category, CreateCategoryDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRoleValues } from '../types';
import { GuestRestrictionModal } from '../components/GuestRestrictionModal';
import './CRUD.css';

export const Categories = () => {
  const { user } = useAuth();
  const isGuest = user?.role === UserRoleValues.GUEST;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
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
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData);
      } else {
        await categoriesService.create(formData);
      }
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    }
  };

  const handleEdit = (category: Category) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoriesService.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingCategory(null);
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
        <h1>Categories Management</h1>
        {!isGuest && (
          <button onClick={handleAddNew} className="btn-primary">
            Add New Category
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-card">
            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
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
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description || 'N/A'}</td>
                <td>
                  {!isGuest && (
                    <>
                      <button onClick={() => handleEdit(category)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="btn-delete">
                        Delete
                      </button>
                    </>
                  )}
                  {isGuest && <span style={{ color: '#999' }}>Read Only</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

