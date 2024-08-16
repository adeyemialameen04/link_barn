"use client";
import { useState } from "react";
import { CgSelect } from "react-icons/cg";
import { linkAttributes } from "../common/links-attr";
import { Link } from "@/utils/linkSync";

interface SelectLinkProps {
  link: {
    id: string;
    name: string;
    url: string;
  };
  updateLink: (id: string, updatedLink: Partial<Link>) => void;
}

export function SelectLink({ link, updateLink }: SelectLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    link.name ? link.name.toLowerCase() : "link"
  );
  const [customLinkName, setCustomLinkName] = useState(link.name);

  console.log(link.name);
  console.log(selectedOption);

  const options = Object.entries(linkAttributes).map(([key, value]) => ({
    value: key,
    icon: value.icon,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-white border-[1px] border-gray rounded-lg cursor-pointer ${
          isOpen && "shadow-active"
        }`}
      >
        {selectedOption && (
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center text-gray-dark">
              {options.find((opt) => opt.value === selectedOption)?.icon ||
                linkAttributes.link.icon}
              {selectedOption === "link" ? (
                <input
                  type="text"
                  value={customLinkName}
                  onChange={(e) => {
                    setCustomLinkName(e.target.value);
                    updateLink(link.id, { name: e.target.value });
                  }}
                  placeholder="Enter custom link name"
                  className="bM text-black outline-none"
                />
              ) : (
                <span className="bM text-black">
                  {options.find((opt) => opt.value === selectedOption)?.label ||
                    link.name}
                </span>
              )}
            </div>
            <CgSelect className="size-6 text-base-dark" />
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-4 bg-white border border-gray shadow-dropdown rounded-lg px-4 h-[248px] overflow-y-auto z-10">
          {options.map((option, index) => (
            <div key={option.value}>
              <div
                className={`py-3 hover:bg-gray-100 cursor-pointer flex items-center
                gap-3 text-gray-dark {option.value === selectedOption ? 'text-base-dark' : "text-black"}`}
                onClick={() => {
                  setSelectedOption(option.value);
                  updateLink(link.id, { name: option.value });
                  setIsOpen(false);
                }}
              >
                {option.icon}
                <span className="bM capitalize">{option.label}</span>
              </div>
              {index !== options.length - 1 && (
                <hr className="h-px border-none bg-gray" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
