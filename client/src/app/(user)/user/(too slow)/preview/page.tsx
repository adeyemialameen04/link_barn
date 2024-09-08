import Header from "@/components/header";
import Preview from "@/components/preview/preview";
import Link from "next/link";
import { getUserProfile } from "@/lib/queries";
import { cookies } from "next/headers";
import { LuLayoutDashboard } from "react-icons/lu";

import type { Metadata } from "next";
import ResponsiveButton from "@/components/common/responsive-button";

export const metadata: Metadata = {
  title: "Preview",
  description: "Preview your links, see how they look",
};

export default async function PreviewPage() {
  const userProfileDetails = await getUserProfile(
    cookies().get("uuid")?.value || ""
  );
  const links = await userProfileDetails?.links;
  console.log(links, userProfileDetails);

  return (
    <div className="sm:p-6 w-full max-w-[1440px] mx-auto">
      <Header />
      <div className="sm:p-0 sm:pt-6 p-4">
        <div className="bg-white rounded-xl sm:sm:h-[calc(100vh-152px)] h-[calc(100vh-96.37px)] overflow-y-auto sm:p-10 p-6 relative">
          <Preview
            userProfileDetails={userProfileDetails}
            links={userProfileDetails && userProfileDetails.links}
          />
          <ResponsiveButton
            path="/user/appearance"
            title="Customize Appearance"
            className="absolute bottom-0 right-6"
          />
        </div>
      </div>
    </div>
  );
}
