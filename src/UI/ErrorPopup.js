import React from 'react';

export function ErrorPopup({ message, onClose }) {
  return (
    <div className="error-popup">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
