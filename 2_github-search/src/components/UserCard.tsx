import React from 'react';
import type { GitHubUser } from '../types/github';

interface UserCardProps {
  user: GitHubUser;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card animate-in">
      <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="card-avatar" />
      <div className="card-info">
        <h2 className="card-title">@{user.login}</h2>
        <p className="card-bio">{user.bio || 'This user has no bio.'}</p>
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-value">{user.public_repos}</span>
            <span className="stat-label">Repos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
        </div>
        <a 
          href={`https://github.com/${user.login}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="card-button"
        >
          View Profile
        </a>
      </div>
    </div>
  );
};
