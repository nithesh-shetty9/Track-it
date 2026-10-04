import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import api, { errorMessage } from "../../../api/index";
import { setUser } from "../../../store/features/user";
import { setTheme, toast } from "../../../store/features/ui";
import { useLogout } from "../../../hooks/useLogout";

const SECTIONS = [
  ["account", "Account"],
  ["appearance", "Appearance"],
  ["notifications", "Notifications"],
  ["security", "Security"],
];

const THEMES = [
  ["light", "Light"],
  ["dark", "Dark"],
  ["system", "System"],
];

const Security = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.changePassword(form);
      setForm({ currentPassword: "", newPassword: "" });
      dispatch(toast("Password updated"));
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
    setBusy(false);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <h2>Change password</h2>
      <label className="field">
        Current password
        <input className="input" type="password" required autoComplete="current-password" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} />
      </label>
      <label className="field">
        New password
        <input className="input" type="password" required minLength={6} autoComplete="new-password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} />
      </label>
      <button className="btn primary" disabled={busy}>
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
};

const Setting = () => {
  const dispatch = useDispatch();
  const logout = useLogout();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.ui.theme);
  const [section, setSection] = useState("account");

  const toggleNotifications = async (event) => {
    try {
      const result = await api.updateProfile({ notificationsEnabled: event.target.checked });
      dispatch(setUser(result.user));
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
  };

  return (
    <div className="stack gap-lg narrow">
      <h1>Settings</h1>
      <div className="tabs" role="tablist">
        {SECTIONS.map(([key, text]) => (
          <button key={key} role="tab" aria-selected={section === key} className={section === key ? "on" : ""} onClick={() => setSection(key)}>
            {text}
          </button>
        ))}
      </div>
      <section className="card stack">
        {section === "account" && (
          <>
            <h2>Account</h2>
            <p>
              {user.name} · <span className="muted">{user.email}</span>
            </p>
            <div className="row">
              <Link className="btn" to="/profile">
                Edit profile
              </Link>
              <button className="btn danger" onClick={logout}>
                Log out
              </button>
            </div>
          </>
        )}
        {section === "appearance" && (
          <>
            <h2>Appearance</h2>
            <div className="seg" role="radiogroup" aria-label="Theme">
              {THEMES.map(([key, text]) => (
                <button key={key} role="radio" aria-checked={theme === key} className={theme === key ? "on" : ""} onClick={() => dispatch(setTheme(key))}>
                  {text}
                </button>
              ))}
            </div>
          </>
        )}
        {section === "notifications" && (
          <>
            <h2>Notifications</h2>
            <label className="row switch">
              <input type="checkbox" checked={user.notificationsEnabled} onChange={toggleNotifications} />
              Receive in-app notifications for assignments, completions and deadlines
            </label>
          </>
        )}
        {section === "security" && <Security />}
      </section>
    </div>
  );
};

export default Setting;
