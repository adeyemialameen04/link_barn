export default function Preview({ className }: { className?: string }) {
  return (
    <div
      className={`p-6 rounded-xl bg-white flex justify-center items-center ${className}`}
    >
      <div className="border-[1px] border-gray-dark rounded-[56px] max-w-[100vw] w-[307px] h-[631px] p-[11px] relative">
        <div className="border-[1px] border-gray-dark rounded-[45px] w-full h-full px-6 pt-[53px] flex flex-col items-center justify-between">
          <div className="flex flex-col items-center gap-[25px]">
            <div className="bg-gray-preview size-24 rounded-full"></div>
            <div className=" flex flex-col items-center gap-[13px]">
              <div className="bg-gray-preview w-40 h-4 rounded-full"></div>
              <div className="bg-gray-preview w-[72px] h-2 rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-5 w-full pb-11">
            <div className="bg-gray-preview w-full h-11 rounded-lg"></div>
            <div className="bg-gray-preview w-full h-11 rounded-lg"></div>
            <div className="bg-gray-preview w-full h-11 rounded-lg"></div>
            <div className="bg-gray-preview w-full h-11 rounded-lg"></div>
            <div className="bg-gray-preview w-full h-11 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
