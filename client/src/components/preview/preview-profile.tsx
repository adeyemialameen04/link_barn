import Image from "next/image";
import { UserProfileDetails } from "@/utils/linkSync";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface PreviewProps {
  userProfileDetails: UserProfileDetails | null;
}

export default function PreviewProfile({ userProfileDetails }: PreviewProps) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-center gap-[25px]">
      {userProfileDetails ? (
        <>
          {userProfileDetails?.profile_picture ? (
            <Image
              src={userProfileDetails?.profile_picture}
              alt={userProfileDetails?.first_name}
              width={104}
              height={104}
              className={cn(
                "rounded-full border-4 size-24 border-base-dark object-cover",
                {
                  "size-28": pathname === "/preview",
                },
              )}
            />
          ) : (
            <div
              className={cn(`bg-gray-preview size-24 rounded-full`, {
                "size-28": pathname === "/preview",
              })}
            ></div>
          )}
          {userProfileDetails?.first_name || userProfileDetails?.last_name ? (
            <div className="flex flex-col items-center gap-[13px]">
              <p
                className={cn("hS text-black", { hM: pathname === "/preview" })}
              >
                {userProfileDetails?.first_name} {userProfileDetails?.last_name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-[13px]">
              <div className="bg-gray-preview w-40 h-4 rounded-full"></div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="bg-gray-preview size-24 rounded-full"></div>
          <div className="flex flex-col items-center gap-[13px]">
            <div className="bg-gray-preview w-40 h-4 rounded-full"></div>
          </div>
        </>
      )}
    </div>
  );
}
