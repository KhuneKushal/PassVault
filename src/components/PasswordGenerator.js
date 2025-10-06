'use client';

import { useState, useEffect } from 'react';
import { generatePassword, checkPasswordStrength } from '@/lib/encryption';
import './PasswordGenerator.css';

export default function PasswordGenerator({ onPasswordGenerated }) {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, feedback: '' });
  const [options, setOptions] = useState({
    length: 16,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
    excludeSimilar: false
  });
  const [copied, setCopied] = useState(false);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setStrength(checkPasswordStrength(newPassword));
    // immediately pass it to the parent so it appears in the form password field
    if (typeof onPasswordGenerated === 'function') {
      onPasswordGenerated(newPassword);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 15000); // Clear after 15 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Do not auto-generate on mount; only generate when user clicks "Generate"

  const strengthBarFillStyle = {
    height: '100%',
    width: `${(strength.score / 4) * 100}%`,
    backgroundColor: 
      strength.score === 0 ? '#ef4444' :
      strength.score === 1 ? '#f59e0b' :
      strength.score === 2 ? '#fbbf24' :
      strength.score === 3 ? '#34d399' :
      '#10b981',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="password-generator-container">
      
      
      <div className="password-section">

        <div className="strength-meter">
          <div className="strength-bar">
            <div style={strengthBarFillStyle} />
          </div>
          <p className="strength-text">{strength.feedback}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleGeneratePassword}
              className="btn btn-success"
              style={{
                flex: 1,
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.6rem 0.75rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Generate & Use
            </button>
          </div>
        </div>
      </div>

      <div className="options-section">
        <div className="length-control">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Length: {options.length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div className="checkbox-group">
          <label className="option-row">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
            />
            Include Uppercase Letters
          </label>

          <label className="option-row">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
            />
            Include Lowercase Letters
          </label>

          <label className="option-row">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
            />
            Include Numbers
          </label>

          <label className="option-row">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
            />
            Include Symbols
          </label>

          <label className="option-row">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
            />
            Exclude Similar Characters
          </label>
        </div>
      </div>
    </div>
  );
}