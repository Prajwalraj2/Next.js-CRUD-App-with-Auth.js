// src/app/admin/users/page.tsx
import { listUsers, setRole } from "./actions";

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.name ?? "—"}</td>
              <td className="p-2 border">{u.email ?? "—"}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">
                <form action={async () => { "use server"; await setRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN"); }}>
                  <button className="underline">
                    {u.role === "ADMIN" ? "Demote to USER" : "Promote to ADMIN"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}