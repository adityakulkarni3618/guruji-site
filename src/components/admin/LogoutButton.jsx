"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ label = "Log Out" }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-sm text-cream-dim hover:text-sindoor-light border border-ink-3 rounded-md px-3 py-2 text-left transition-colors cursor-pointer"
    >
      {label}
    </button>
  );
}
