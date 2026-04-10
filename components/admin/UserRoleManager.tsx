"use client";

import { useState } from "react";

export function UserRoleManager({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);

  async function updateRole(newRole: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) setRole(newRole);
    setSaving(false);
  }

  return (
    <select
      value={role}
      onChange={(e) => updateRole(e.target.value)}
      disabled={saving}
      className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="STUDENT">STUDENT</option>
      <option value="INSTRUCTOR">INSTRUCTOR</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
