
'use client';

import { useState } from 'react';
import { encryptData } from '@/lib/encryption';
import PasswordGenerator from './PasswordGenerator';
import './AddVaultItem.css';

export default function AddVaultItem({ encryptionKey, onAdd, editingItem = null, onCancel }) {
  const [formData, setFormData] = useState({
    title: editingItem?.data.title || '',
    username: editingItem?.data.username || '',
    password: editingItem?.data.password || '',
    url: editingItem?.data.url || '',
    notes: editingItem?.data.notes || '',
    showPassword: false,
  });
  const [showGenerator, setShowGenerator] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      alert('Password is required.');
      return;
    }

    const encryptedData = encryptData(formData, encryptionKey);

    try {
      const url = '/api/vault';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem 
        ? JSON.stringify({ id: editingItem._id, encryptedData })
        : JSON.stringify({ encryptedData });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body
      });

      if (!response.ok) throw new Error('Failed to save vault item');

      await response.json();
      onAdd();
      
      if (!editingItem) {
        // Clear form if it's a new item
        setFormData({
          title: '',
          username: '',
          password: '',
          url: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Failed to save vault item:', error);
      alert('Failed to save vault item. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-vault-item-form">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="form-input"
          placeholder="e.g., Gmail Account"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Username/Email</label>
        <input
          type="text"
          required
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="form-input"
          placeholder="your.email@example.com"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type={formData.showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              background: 'white',
              cursor: 'pointer'
            }}
            title={formData.showPassword ? 'Hide password' : 'Show password'}
          >
            {formData.showPassword ? 'Hide' : 'Show'}
          </button>
          <button
            type="button"
            onClick={() => setShowGenerator(!showGenerator)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #2563eb',
              background: '#2563eb',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {showGenerator ? 'Hide Generator' : 'Generate'}
          </button>
        </div>

        {showGenerator && (
          <div style={{ marginTop: '1rem' }}>
            <PasswordGenerator
              onPasswordGenerated={(newPassword) => setFormData({ ...formData, password: newPassword })}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Website URL (optional)</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="form-input"
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="form-input"
          placeholder="Add any notes here..."
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {editingItem ? 'Save Changes' : 'Add to Vault'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-danger"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
