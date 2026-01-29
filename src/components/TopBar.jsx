import React from "react";
import "./TopBar.css";

export const TopBar = ({ user, onBalanceClick }) => {
  const getInitial = () => {
    if (user?.first_name) return user.first_name[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    return "?";
  };

  return (
    <div className="topbar">
      <div className="user-info">
        {user?.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.username || user.first_name}
            className="avatar"
          />
        ) : (
          <div className="avatar-placeholder">{getInitial()}</div>
        )}
        <span className="username">
          {user?.username ? `@${user.username}` : user?.first_name || "Игрок"}
        </span>
      </div>

      <div className="balance-container" onClick={onBalanceClick}>
        <svg className="balance-icon" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFD700" />
          <path
            d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5L12 6z"
            fill="#FFA500"
          />
        </svg>
        <span className="balance-amount">{user?.balance ?? 0}</span>
        <span className="balance-plus">+</span>
      </div>
    </div>
  );
};
