import { Suspense } from "react";
import { notFound } from "next/navigation";
import { checkUserExists, getUserProfileByUsername } from "@/lib/queries";
import { LinkSchema } from "@/components/preview/preview";
import { Loader } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { linkAttributes } from "@/components/common/links-attr";
import { FaArrowRight } from "react-icons/fa6";

interface PageProps {
  params: { username: string };
}

export default async function Page({ params }: PageProps) {
  const { username } = params;
  const user_exists = await checkUserExists("username", username);
  let userProfile = null;
  let links = null;
  console.log(user_exists);

  if (user_exists.status) {
    userProfile = await getUserProfileByUsername(username);
    links = userProfile && userProfile?.links;
  } else {
    console.log("HERERE");
    notFound();
  }

  return (
    <div
      suppressHydrationWarning={true}
      className="w-full h-full md:px-[18%] pt-[53px] flex flex-col items-center gap-14"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <Loader className="animate-spin" />
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3">
          {userProfile ? (
            <>
              {userProfile?.profile_picture ? (
                <Image
                  src={userProfile?.profile_picture}
                  alt={userProfile?.first_name}
                  width={104}
                  height={104}
                  className={cn(
                    "rounded-full border-4 size-28 border-base-dark object-cover",
                  )}
                />
              ) : (
                <div
                  className={cn(`bg-gray-preview size-28 rounded-full`)}
                ></div>
              )}
              {/* {userProfile?.first_name || userProfile?.last_name ? ( */}
              {userProfile?.username ? (
                <div className="flex flex-col items-center gap-[13px]">
                  <p className={cn("text-lg font-semibold text-black")}>
                    {/* {userProfile?.first_name} {userProfile?.last_name} */}@
                    {userProfile?.username}
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
                <div className="bg-gray-preview w-40 h-4 rounded-full"></div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-3 w-full max-w-80 px-4">
          {links?.length < 1 ? (
            <div>This user hasn&apos;t added any links</div>
          ) : (
            links
              ?.slice()
              .sort((a: LinkSchema, b: LinkSchema) => a.index - b.index)
              .map((link: LinkSchema, index: number) => {
                const normalizedLinkName =
                  link.platform.toLowerCase() as keyof typeof linkAttributes;
                const attributes =
                  linkAttributes[normalizedLinkName] || linkAttributes.link;
                return (
                  <a
                    href={link.url}
                    target="_blank"
                    key={index}
                    className={`flex justify-between items-center py-[11px] px-4 rounded-lg w-full border-[1px] border-gray capitalize ${attributes.bg} ${attributes.text}`}
                  >
                    <p className="flex items-center justify-start gap-2">
                      {attributes.icon}
                      <span>{link.platform}</span>
                    </p>
                    <FaArrowRight className="size-4" />
                  </a>
                );
              })
          )}
        </div>
      </Suspense>
    </div>
  );
}
