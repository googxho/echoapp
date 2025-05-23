"use client";

import { MemoItem } from "@/app/indexdb/EchoDataTypes";

export default function MemoItemView({ memos }: { memos: MemoItem[] }) {
  return (
    <div className="overflow-y-auto scrollbar-hide">
      {memos.map((memo, index) => (
        <div
          key={index}
          // 添加过渡效果和鼠标悬停阴影样式
          className="p-4 hover:shadow-lg m-2 bg-white overflow-x-auto rounded-[6px] transition-shadow duration-300 ease-in-out"
        >
          <div className="text-xs text-[#8f9193] mb-1">
            {new Date(memo.created_at).toLocaleString()}
          </div>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: memo.content }}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              {memo.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-[#eef3fe] text-[#5783f7] rounded-[3px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <button className="text-xs text-blue-500 hover:text-blue-700">
              展开
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
