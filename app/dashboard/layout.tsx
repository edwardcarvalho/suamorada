import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Sua Morada" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/entrar?callbackUrl=/dashboard");

  const user = {
    name:  session.user.name  ?? "Utilizador",
    email: session.user.email ?? "",
    image: session.user.image ?? null,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0EFF0]">
      <DashboardSidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
