import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { errorMessage } from "../../../api/index";
import { setUser } from "../../../store/features/user";
import { toast } from "../../../store/features/ui";
import { Avatar } from "../../../components/Common";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.workspace.projects);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [busy, setBusy] = useState(false);
  const dirty = form.name.trim() !== user.name || form.email.trim() !== user.email;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await api.updateProfile(form);
      dispatch(setUser(result.user));
      dispatch(toast("Profile updated"));
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
    setBusy(false);
  };

  return (
    <div className="stack gap-lg narrow">
      <h1>Profile</h1>
      <section className="card row">
        <Avatar name={user.name} size={64} />
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <p className="muted small">
            {projects.length} active {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </section>
      <form className="card stack" onSubmit={submit}>
        <h2>Account information</h2>
        <label className="field">
          Name
          <input className="input" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="field">
          Email
          <input className="input" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <button className="btn primary" disabled={busy || !dirty}>
          {busy ? "Saving…" : "Update profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
