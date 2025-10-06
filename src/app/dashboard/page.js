 'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VaultList from '@/components/VaultList';
import AddVaultItem from '@/components/AddVaultItem';
import { generateEncryptionKey } from '@/lib/encryption';
import './Dashboard.css';

export default function Dashboard() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        // clear persisted encryption key
        try { localStorage.removeItem('pv_encryption_key'); } catch (e) {}
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    // Always derive or load an encryption key so we don't show an Unlock form
    try {
      const stored = localStorage.getItem('pv_encryption_key');
      if (stored) {
        setEncryptionKey(stored);
        return;
      }
    } catch (e) {
      // ignore
    }

    // If no stored key, derive one from NEXT_PUBLIC_DEV_MASTER if provided, else create a deterministic fallback
    const devMaster = process.env.NEXT_PUBLIC_DEV_MASTER || 'dev_default_master';
    const key = generateEncryptionKey(devMaster, process.env.NEXT_PUBLIC_ENCRYPTION_SALT);
    setEncryptionKey(key);
    try { localStorage.setItem('pv_encryption_key', key); } catch (e) {}
  }, []);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-content">
          <div>
            <h1 className="dashboard-logo">PassVault</h1>
          </div>
          <div className="dashboard-nav-actions">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowAddForm(true);
                }}
                className="dashboard-action-btn add-credential-btn"
              >
                Add New Credential
              </button>
              <button
                onClick={handleLogout}
                className="dashboard-action-btn logout-btn"
              >
                Logout
              </button>
                      </div>
                    </div>
                  </nav>
      <div className="dashboard-content">
        {showAddForm ? (
          <div className="add-item-container">
            <h2 className="add-item-title">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <AddVaultItem
              encryptionKey={encryptionKey}
              onAdd={() => {
                setShowAddForm(false);
                setEditingItem(null);
                router.refresh();
              }}
              editingItem={editingItem}
              onCancel={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        ) : (
          <VaultList
            encryptionKey={encryptionKey}
            onEdit={(item) => {
              setEditingItem(item);
              setShowAddForm(true);
            }}
          />
        )}
      </div>
    </div>
  );
}