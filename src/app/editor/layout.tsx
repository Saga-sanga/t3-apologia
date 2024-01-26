import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

interface EditorProps {
  children?: React.ReactNode;
}

export default async function EditorLayout({ children }: EditorProps) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === "writer" || currentUser?.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      {children}
    </div>
  );
}
