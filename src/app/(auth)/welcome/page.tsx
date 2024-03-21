import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/server/auth";
import { UserDetailsForm } from "./user-details-form";
import { notFound } from "next/navigation";

export default async function WelcomePage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <UserDetailsForm
          user={{
            id: user.id,
            name: user.name ?? "",
          }}
        />
      </CardContent>
    </Card>
  );
}
