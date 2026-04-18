"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EnrollButton({
  courseSlug,
  isLoggedIn,
}: {
  courseSlug: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/courses/${courseSlug}/enroll`, { method: "POST" });
    if (res.ok) {
      router.push(`/courses/${courseSlug}/learn`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
    >
      {loading ? "Inscribiendo..." : isLoggedIn ? "Inscribirse Gratis" : "Iniciar sesión para inscribirse"}
    </button>
  );
}
