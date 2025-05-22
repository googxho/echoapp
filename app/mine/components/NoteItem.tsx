"use client";

import { MemoItem } from "@/app/indexdb/EchoDataTypes";

export default function MemoItemView({ memos }: { memos: MemoItem[] }) {
  return (
    <div className="divide-y divide-gray-200">
      {memos.map((memo, index) => (
        <div key={index} className="p-4 hover:bg-gray-50  overflow-x-auto">
          <div className="text-xs text-gray-500 mb-1">
            {new Date(memo.created_at_long).toLocaleString()}
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
                  className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
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
