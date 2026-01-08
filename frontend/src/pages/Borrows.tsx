import { useState, useEffect } from 'react';
import { borrowsService, usersService } from '../services/api';
import type { Borrow, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRoleValues } from '../types';
import './CRUD.css';

export const Borrows = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRoleValues.ADMIN;
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUserId, setFilterUserId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    // User'lar için otomatik olarak kendi ödünçlerini göster
    if (!isAdmin && user) {
      setFilterUserId(user.id);
    }
  }, []);

  useEffect(() => {
    loadBorrows();
  }, [filterUserId]);

  const loadData = async () => {
    try {
      const usersData = await usersService.getAll();
      setUsers(usersData);
      await loadBorrows();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBorrows = async () => {
    try {
      const data = filterUserId 
        ? await borrowsService.getAll(filterUserId)
        : await borrowsService.getAll();
      setBorrows(data);
    } catch (error) {
      console.error('Error loading borrows:', error);
    }
  };


  const handleReturn = async (id: number) => {
    if (!confirm('Are you sure you want to return this book?')) return;
    try {
      await borrowsService.returnBook(id);
      loadBorrows();
    } catch (error: any) {
      console.error('Error returning book:', error);
      alert(error.response?.data?.message || 'Error returning book');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this borrow record?')) return;
    try {
      await borrowsService.delete(id);
      loadBorrows();
    } catch (error) {
      console.error('Error deleting borrow:', error);
      alert('Error deleting borrow');
    }
  };


  if (loading) return <div className="loading">Loading...</div>;

  const activeBorrows = borrows.filter((b) => !b.returnDate);
  const returnedBorrows = borrows.filter((b) => b.returnDate);

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Borrows Management</h1>
      </div>

      {isAdmin && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Filter by User:</label>
          <select
            value={filterUserId || ''}
            onChange={(e) => setFilterUserId(e.target.value ? parseInt(e.target.value) : null)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}


      <h2 style={{ marginTop: '30px', marginBottom: '15px' }}>Active Borrows</h2>
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Book</th>
            <th>Author</th>
            <th>Borrow Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeBorrows.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No active borrows
              </td>
            </tr>
          ) : (
            activeBorrows.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.id}</td>
                <td>{borrow.user?.name || 'N/A'}</td>
                <td>{borrow.book?.title || 'N/A'}</td>
                <td>{borrow.book?.author?.name || 'N/A'}</td>
                <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                <td>
                  {/* User'lar kendi ödünç aldıkları kitapları iade edebilir, admin'ler hepsini iade edebilir */}
                  {(!isAdmin && user && borrow.userId === user.id) || isAdmin ? (
                    <button
                      onClick={() => handleReturn(borrow.id)}
                      className="btn-edit"
                      style={{ backgroundColor: '#FF9800' }}
                    >
                      Return
                    </button>
                  ) : null}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(borrow.id)}
                      className="btn-delete"
                      style={{ marginLeft: '5px' }}
                    >
                      Delete
                    </button>
                  )}
                  {!isAdmin && (!user || borrow.userId !== user.id) && (
                    <span style={{ color: '#999' }}>Read Only</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: '30px', marginBottom: '15px' }}>Returned Books</h2>
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Book</th>
            <th>Author</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {returnedBorrows.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>
                No returned books
              </td>
            </tr>
          ) : (
            returnedBorrows.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.id}</td>
                <td>{borrow.user?.name || 'N/A'}</td>
                <td>{borrow.book?.title || 'N/A'}</td>
                <td>{borrow.book?.author?.name || 'N/A'}</td>
                <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                <td>{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : 'N/A'}</td>
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => handleDelete(borrow.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
