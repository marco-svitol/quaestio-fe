import React from "react";

const users = [
  { name: "John Doe", role: "Admin", permissions: ["Read", "Write", "Delete"] },
  { name: "Jane Smith", role: "Editor", permissions: ["Read", "Write"] },
  { name: "Tom Brown", role: "Viewer", permissions: ["Read"] },
];

const AccessControls = () => {
  return (
    <div className="access-controls">
      <div className="disabled-component">
        <h3>Access Controls</h3>
        <table className="access-controls-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.permissions.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessControls;
