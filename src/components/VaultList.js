
'use client';

import { useState, useEffect } from 'react';
import { decryptData } from '@/lib/encryption';
import './VaultList.css';

export default function VaultList({ encryptionKey, onEdit }) {
  const [vaultItems, setVaultItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaultItems();
  }, []);

  const fetchVaultItems = async () => {
    try {
      const response = await fetch('/api/vault');
      if (!response.ok) throw new Error('Failed to fetch vault items');
      
      const items = await response.json();
      const decryptedItems = items.map(item => ({
        ...item,
        data: decryptData(item.encryptedData, encryptionKey)
      })).filter(item => item.data); // Filter out failed decryptions

      setVaultItems(decryptedItems);
      setError(null);
    } catch (err) {
      setError('Failed to load vault items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/vault?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete item');
      
      setVaultItems(vaultItems.filter(item => item._id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Clear clipboard after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('');
      }, 15000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredItems = vaultItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const data = item.data;
    return data.title.toLowerCase().includes(searchLower) ||
           data.username.toLowerCase().includes(searchLower);
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="vault-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search vault..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-vault-message">
          {searchTerm ? 'No items match your search' : 'No items in vault yet'}
        </div>
      ) : (
        <div className="vault-items-grid">
          {filteredItems.map(item => (
            <div key={item._id} className="vault-item">
              <div className="item-content">
                <h3 className="item-title">{item.data.title}</h3>
                <p className="item-username">{item.data.username}</p>
                {item.data.url && (
                  <a
                    href={item.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item-url"
                  >
                    {item.data.url}
                  </a>
                )}
                <div className="item-actions">
                  <button
                    onClick={() => handleCopy(item.data.username)}
                    className="action-btn copy-username-btn"
                  >
                    Copy Username
                  </button>
                  <button
                    onClick={() => handleCopy(item.data.password)}
                    className="action-btn copy-password-btn"
                  >
                    Copy Password
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="action-btn edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
