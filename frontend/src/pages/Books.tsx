import { useState, useEffect } from 'react';
import { booksService, authorsService, categoriesService, borrowsService } from '../services/api';
import type { Book, Author, Category, CreateBookDto, Borrow } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRoleValues } from '../types';
import { GuestRestrictionModal } from '../components/GuestRestrictionModal';
import './CRUD.css';

export const Books = () => {
  const { user } = useAuth();
  const isGuest = user?.role === UserRoleValues.GUEST;
  const isAdmin = user?.role === UserRoleValues.ADMIN;
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    isbn: '',
    description: '',
    quantity: 0,
    authorId: 0,
    categoryIds: [],
    imageUrl: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [borrowingBookId, setBorrowingBookId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    loadBorrows();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, authorsData, categoriesData] = await Promise.all([
        booksService.getAll(),
        authorsService.getAll(),
        categoriesService.getAll(),
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBorrows = async () => {
    try {
      const data = await borrowsService.getAll();
      setBorrows(data);
    } catch (error) {
      console.error('Error loading borrows:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    try {
      let imageUrl = formData.imageUrl;
      
      // If a new image is selected, upload it first
      if (selectedImage) {
        setUploadingImage(true);
        try {
          const uploadResult = await booksService.uploadImage(selectedImage);
          imageUrl = uploadResult.url; // Store only the path, not full URL
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const submitData = { ...formData, imageUrl };
      
      if (editingBook) {
        await booksService.update(editingBook.id, submitData);
      } else {
        await booksService.create(submitData);
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error saving book');
    }
  };

  const handleEdit = (book: Book) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn,
      description: book.description || '',
      quantity: book.quantity,
      authorId: book.authorId,
      categoryIds: book.categories.map((c) => c.id),
      imageUrl: book.imageUrl || '',
    });
    setImagePreview(book.imageUrl ? (book.imageUrl.startsWith('http') ? book.imageUrl : `http://localhost:3000${book.imageUrl}`) : '');
    setSelectedImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      isbn: '',
      description: '',
      quantity: 0,
      authorId: 0,
      categoryIds: [],
      imageUrl: '',
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingBook(null);
    setShowForm(false);
  };

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds?.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...(prev.categoryIds || []), categoryId],
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  const handleAddNew = () => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    setShowForm(true);
  };

  const handleBorrowBook = async (bookId: number) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    
    if (!user) {
      alert('You must be logged in to borrow a book');
      return;
    }

    if (!confirm('Are you sure you want to borrow this book?')) return;

    try {
      setBorrowingBookId(bookId);
      await borrowsService.create({
        bookId,
        userId: user.id,
      });
      await loadBorrows();
      alert('Book borrowed successfully!');
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      alert(error.response?.data?.message || 'Error borrowing book');
    } finally {
      setBorrowingBookId(null);
    }
  };

  const getAvailableQuantity = (book: Book) => {
    const activeBorrows = borrows.filter(
      (borrow) => borrow.bookId === book.id && !borrow.returnDate
    ).length;
    return book.quantity - activeBorrows;
  };

  const isBookBorrowedByUser = (bookId: number) => {
    if (!user) return false;
    return borrows.some(
      (borrow) => borrow.bookId === bookId && borrow.userId === user.id && !borrow.returnDate
    );
  };

  return (
    <div className="crud-container">
      <GuestRestrictionModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
      <div className="crud-header">
        <h1>Books Management</h1>
        {isAdmin && (
          <button onClick={handleAddNew} className="btn-primary">
            Add New Book
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-card">
            <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>ISBN *</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: parseInt(e.target.value) })}
                  required
                >
                  <option value={0}>Select an author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Categories</label>
                <div className="checkbox-group">
                  {categories.map((category) => (
                    <label key={category.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds?.includes(category.id) || false}
                        onChange={() => toggleCategory(category.id)}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Book Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {!imagePreview && formData.imageUrl && (
                  <div className="image-preview">
                    <img src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:3000${formData.imageUrl}`} alt="Current" />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={uploadingImage}>
                  {uploadingImage ? 'Uploading...' : editingBook ? 'Update' : 'Create'}
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
            <th>Image</th>
            <th>Title</th>
            <th>ISBN</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>
                No books found
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  {book.imageUrl ? (
                    <img 
                      src={book.imageUrl.startsWith('http') ? book.imageUrl : `http://localhost:3000${book.imageUrl}`}
                      alt={book.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <span style={{ color: '#999' }}>No image</span>
                  )}
                </td>
                <td>{book.title}</td>
                <td>{book.isbn}</td>
                <td>{book.author?.name || 'N/A'}</td>
                <td>{book.categories?.map((c) => c.name).join(', ') || 'None'}</td>
                <td>
                  {book.quantity} (Available: {getAvailableQuantity(book)})
                </td>
                <td>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleEdit(book)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="btn-delete">
                        Delete
                      </button>
                    </>
                  )}
                  {!isGuest && getAvailableQuantity(book) > 0 && !isBookBorrowedByUser(book.id) && (
                    <button
                      onClick={() => handleBorrowBook(book.id)}
                      className="btn-primary"
                      style={{ marginLeft: isAdmin ? '5px' : '0', padding: '6px 12px', fontSize: '14px' }}
                      disabled={borrowingBookId === book.id}
                    >
                      {borrowingBookId === book.id ? 'Borrowing...' : 'Borrow'}
                    </button>
                  )}
                  {!isGuest && isBookBorrowedByUser(book.id) && (
                    <span style={{ marginLeft: isAdmin ? '5px' : '0', color: '#4CAF50', fontWeight: 'bold' }}>
                      Borrowed by you
                    </span>
                  )}
                  {isGuest && (
                    <>
                      <span style={{ color: '#999' }}>Read Only</span>
                      {getAvailableQuantity(book) > 0 && (
                        <span style={{ marginLeft: '10px', color: '#4CAF50' }}>
                          Available: {getAvailableQuantity(book)}
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

