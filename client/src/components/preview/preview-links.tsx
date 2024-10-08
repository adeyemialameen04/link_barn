// "use client";
// import { FaArrowRight } from "react-icons/fa6";
// import { linkAttributes } from "../common/links-attr";
// import { usePathname } from "next/navigation";
// import { Link } from "@/utils/linkSync";
//
// interface NewLink {
//   platform: string;
//   url: string;
//   index: number;
// }
//
// type PreviewProps =
//   | { type: "new"; links: NewLink[] }
//   | { type: "old"; links: Link[] };
//
// export default function PreviewLinks({ type, links }: PreviewProps) {
//   const pathname = usePathname();
//   console.log(links);
//
//   if (type === "new") {
//     return (
//       <div className="flex flex-col items-center gap-5 w-full max-w-60">
//         {links?.length < 1 && pathname !== "/user/preview"
//           ? Array(4)
//               .fill(null)
//               .map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-preview w-full h-11 rounded-lg"
//                 ></div>
//               ))
//           : links
//               .sort((a, b) => a.index - b.index)
//               ?.map((link, index) => {
//                 const normalizedLinkName =
//                   link.platform.toLowerCase() as keyof typeof linkAttributes;
//                 const attributes =
//                   linkAttributes[normalizedLinkName] || linkAttributes.link;
//
//                 return (
//                   <a
//                     href={link.url}
//                     target="_blank"
//                     key={index}
//                     className={`flex justify-between items-center py-[11px] px-4 rounded-lg w-full border-[1px] border-gray capitalize ${attributes.bg} ${attributes.text}`}
//                   >
//                     <p className="flex items-center justify-start gap-2">
//                       {attributes.icon}
//                       <span>{link.platform}</span>
//                     </p>
//                     <FaArrowRight className="size-4" />
//                   </a>
//                 );
//               })}
//       </div>
//     );
//   } else if (type === "old") {
//     return (
//       <div className="flex flex-col items-center gap-5 w-full max-w-60">
// =======
// import { useAppContext } from "@/context";
// import { Suspense } from "react";
// import LoadingLinks from "./loading-links";
//
// export default function PreviewLinks() {
//   const pathname = usePathname();
//   const { links } = useAppContext();
//
//   return (
//     <div className="flex flex-col items-center gap-5 w-full max-w-60">
//       <Suspense fallback={<LoadingLinks />}>
// >>>>>>> 8042861cb718817e311fb4764e61146dee72ee1b
//         {links?.length < 1 && pathname !== "/user/preview"
//           ? Array(4)
//               .fill(null)
//               .map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-preview w-full h-11 rounded-lg"
//                 ></div>
//               ))
//           : links?.map((link, index) => {
//               const normalizedLinkName =
//                 link.name.toLowerCase() as keyof typeof linkAttributes;
//               const attributes =
//                 linkAttributes[normalizedLinkName] || linkAttributes.link;
// <<<<<<< HEAD
//
// =======
// >>>>>>> 8042861cb718817e311fb4764e61146dee72ee1b
//               return (
//                 <a
//                   href={link.url}
//                   target="_blank"
//                   key={index}
//                   className={`flex justify-between items-center py-[11px] px-4 rounded-lg w-full border-[1px] border-gray capitalize ${attributes.bg} ${attributes.text}`}
//                 >
//                   <p className="flex items-center justify-start gap-2">
//                     {attributes.icon}
//                     <span>{link.name}</span>
//                   </p>
//                   <FaArrowRight className="size-4" />
//                 </a>
//               );
//             })}
// <<<<<<< HEAD
//       </div>
//     );
//   }
// =======
//       </Suspense>
//     </div>
//   );
// >>>>>>> 8042861cb718817e311fb4764e61146dee72ee1b
// }
"use client";
import { FaArrowRight } from "react-icons/fa6";
import { linkAttributes } from "../common/links-attr";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context";
import { Suspense } from "react";
import LoadingLinks from "./loading-links";

export default function PreviewLinks() {
  const pathname = usePathname();
  const { links } = useAppContext();

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-60 pb-14">
      <Suspense fallback={<LoadingLinks />}>
        {links?.length < 1 && pathname !== "/user/preview"
          ? Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-preview w-full h-11 rounded-lg"
                ></div>
              ))
          : links?.map((link, index) => {
              const normalizedLinkName =
                link.name.toLowerCase() as keyof typeof linkAttributes;
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
                    <span>{link.name}</span>
                  </p>
                  <FaArrowRight className="size-4" />
                </a>
              );
            })}
      </Suspense>
    </div>
  );
}
