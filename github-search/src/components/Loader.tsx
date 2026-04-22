import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-avatar skeleton"></div>
      <div className="skeleton-info">
        <div className="skeleton-title skeleton"></div>
        <div className="skeleton-bio skeleton"></div>
        <div className="skeleton-stats">
          <div className="skeleton-stat skeleton"></div>
          <div className="skeleton-stat skeleton"></div>
        </div>
      </div>
    </div>
  );
};
