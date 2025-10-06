
'use client';

import { useState } from 'react';
import './UnlockForm.css';

export default function UnlockForm({ onUnlock }) {
    const [masterPassword, setMasterPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUnlock(masterPassword);
    };

    return (
        <div className="unlock-screen">
            <form onSubmit={handleSubmit} className="unlock-form">
                <h2 className="unlock-form-title">Enter Master Password</h2>
                <p className="unlock-form-description">
                    Your vault is locked. Enter your master password to access your stored passwords.
                </p>
                <input
                    type="password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="unlock-form-input"
                    placeholder="Master Password"
                    required
                />
                <button type="submit" className="unlock-btn">
                    Unlock Vault
                </button>
            </form>
        </div>
    );
}
