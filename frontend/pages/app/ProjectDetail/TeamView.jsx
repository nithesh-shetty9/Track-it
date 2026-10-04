import { FiLogOut, FiUserMinus } from "react-icons/fi";
import api from "../../../api/index";
import { Avatar, Select } from "../../../components/Common";

const ROLES = [
  ["ADMIN", "Admin"],
  ["MEMBER", "Member"],
];

const TeamView = ({ project, members, me, role, ask, act, onLeave }) => {
  const locked = project.isArchived;

  const changeRole = async (member, next) => {
    if (next === "OWNER" && !(await ask(`Transfer ownership to ${member.user.name}? You will become an admin.`))) return;
    act(() => api.projects.updateMember(project._id, member._id, { role: next }), "Role updated");
  };

  const remove = async (member, self) => {
    const text = self ? "Leave this project?" : `Remove ${member.user.name} from this project?`;
    if (!(await ask(text))) return;
    await act(() => api.projects.removeMember(project._id, member._id), self ? "You left the project" : "Member removed");
    if (self) onLeave();
  };

  return (
    <div className="stack">
      {project.type === "TEAM" && members.length <= 1 && (
        <p className="notice">No team members yet. Share your join code to invite teammates.</p>
      )}
      <div className="grid-cards">
        {members.map((member) => {
          const self = member.user._id === me._id;
          const canRemove = !locked && member.role !== "OWNER" && (self || role === "OWNER" || (role === "ADMIN" && member.role === "MEMBER"));
          return (
            <article className="card member" key={member._id}>
              <div className="row">
                <Avatar name={member.user.name} size={40} />
                <div className="grow">
                  <strong>
                    {member.user.name}
                    {self && <span className="muted"> (you)</span>}
                  </strong>
                  <div className="muted small">{member.user.email}</div>
                </div>
                <span className={`badge role-${member.role}`}>{member.role}</span>
              </div>
              <div className="row between small">
                <span>
                  {member.taskCount} assigned {member.taskCount === 1 ? "task" : "tasks"}
                </span>
                <span className="row">
                  {role === "OWNER" && member.role !== "OWNER" && !locked && (
                    <Select
                      label={`Role for ${member.user.name}`}
                      value={member.role}
                      options={[...ROLES, ["OWNER", "Make owner"]]}
                      onChange={(next) => changeRole(member, next)}
                    />
                  )}
                  {canRemove && (
                    <button className="btn danger" onClick={() => remove(member, self)}>
                      {self ? <FiLogOut /> : <FiUserMinus />} {self ? "Leave" : "Remove"}
                    </button>
                  )}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TeamView;
