import { FiAlertCircle } from "react-icons/fi";
import { COLORS, initials, label, STATUSES, PRIORITIES } from "../utils/format";

export const Avatar = ({ name = "?", size = 28 }) => {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span className="avatar" title={name} style={{ width: size, height: size, background: COLORS[hash % COLORS.length], fontSize: size * 0.4 }}>
      {initials(name)}
    </span>
  );
};

export const AvatarStack = ({ members = [], max = 4 }) => (
  <span className="avatar-stack">
    {members.slice(0, max).map((member) => (
      <Avatar key={member._id} name={member.name} size={24} />
    ))}
    {members.length > max && <span className="avatar more">+{members.length - max}</span>}
  </span>
);

export const Badge = ({ kind, value }) => (
  <span className={`badge ${kind}-${value}`}>{label(kind === "status" ? STATUSES : PRIORITIES, value)}</span>
);

export const Empty = ({ icon: Icon, title, text, action }) => (
  <div className="empty">
    {Icon && <Icon aria-hidden="true" />}
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="empty error">
    <FiAlertCircle aria-hidden="true" />
    <h3>Something went wrong</h3>
    <p>{message}</p>
    {onRetry && (
      <button className="btn" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export const Skeleton = ({ rows = 3 }) => (
  <div className="skeleton-list" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }, (_, index) => (
      <div className="skeleton" key={index} />
    ))}
  </div>
);

export const Progress = ({ value, color }) => (
  <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
    <span style={{ width: `${value}%`, background: color }} />
  </div>
);

export const Select = ({ value, onChange, options, label: aria, className = "", disabled }) => (
  <select className={`select ${className}`} value={value ?? ""} aria-label={aria} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
    {options.map(([key, text]) => (
      <option key={key} value={key}>
        {text}
      </option>
    ))}
  </select>
);
