import { ProfileForm } from "@/components/forms/profile-form";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Manage your account and website settings.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userData = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  return (
    <div className="container mx-auto mt-5">
      <div className="flex flex-row flex-wrap gap-4 pb-5 md:pt-2">
        <div className="w-full shrink-0 space-y-2 lg:w-80">
          <div className="space-y-2 rounded-lg border p-6">
            <h2 className="text-2xl font-bold tracking-wide">User Settings</h2>
            <p className="text-muted-foreground">
              I profile settings hrang hrang hetah hian i thlak thei e.
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-6 rounded-lg border p-8">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Heihi midangin website a an hmuh dan tur che ani.
            </p>
          </div>
          <Separator />
          <ProfileForm
            userData={{
              username: userData?.username ?? "",
              name: userData?.name ?? "",
              dob: userData?.dob ?? null,
              sex: userData?.sex ?? null,
              profession: userData?.profession ?? "",
              image: userData?.image ?? null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
