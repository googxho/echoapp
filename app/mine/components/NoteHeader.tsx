"use client"

import dynamic from "next/dynamic";

const Editor = dynamic(() => import('@/app/components/Editor'), {
  ssr: false, // 👈 禁用服务端渲染
});

export default function NoteHeader({onMemoUpdated}: {onMemoUpdated: () => void}) {

  return (
    <div className="border-none">
      <div className="flex items-center m-2">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="⌘+K"
            className="w-full p-2 mb-4 bg-[#efefef] rounded-md focus:outline-none "
          />
        </div>
      </div>
      <div className="m-2">
        <Editor onMemoUpdated={onMemoUpdated}/>
      </div>
    </div>
  );
}
