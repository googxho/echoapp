"use client"

import dynamic from "next/dynamic";

const Editor = dynamic(() => import('@/app/components/Editor'), {
  ssr: false, // 👈 禁用服务端渲染
});

export default function NoteHeader() {

  return (
    <div className="m-4 border-none">
      <div className="flex items-center">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="⌘+K"
            className="w-full p-2 mb-4 bg-[#efefef] rounded-md focus:outline-none "
          />
        </div>
      </div>
      <div className="">
      <Editor />
      </div>
    </div>
  );
}
