"use client";

import { MemoItem } from "@/app/indexdb/EchoDataTypes";
import { useState } from "react";
import { deleteMemoFromDB, updateMemoInDB } from "@/app/indexdb/indexedDBManager";
import Modal from "@/app/components/Modal";

interface MemoItemViewProps {
  memos: MemoItem[];
  onMemoUpdated?: () => void; // 回调函数，用于通知父组件数据已更新
}

export default function MemoItemView({ memos, onMemoUpdated }: MemoItemViewProps) {
  const [hoveredMemoId, setHoveredMemoId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMemo, setCurrentMemo] = useState<MemoItem | null>(null);
  const [editContent, setEditContent] = useState("");

  // 处理鼠标悬停
  const handleMouseEnter = (id: number) => {
    setHoveredMemoId(id);
  };

  const handleMouseLeave = () => {
    setHoveredMemoId(null);
  };

  // 打开编辑模态框
  const handleEdit = (memo: MemoItem) => {
    setCurrentMemo(memo);
    setEditContent(memo.content);
    setIsEditModalOpen(true);
  };

  // 打开删除确认模态框
  const handleDelete = (memo: MemoItem) => {
    setCurrentMemo(memo);
    setIsDeleteModalOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!currentMemo) return;

    try {
      await updateMemoInDB(currentMemo.id, { content: editContent });
      setIsEditModalOpen(false);
      // 通知父组件数据已更新
      if (onMemoUpdated) {
        onMemoUpdated();
      }
    } catch (error) {
      console.error("更新备忘录失败:", error);
      alert("更新失败，请重试");
    }
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!currentMemo) return;

    try {
      await deleteMemoFromDB(currentMemo.id);
      setIsDeleteModalOpen(false);
      // 通知父组件数据已更新
      if (onMemoUpdated) {
        onMemoUpdated();
      }
    } catch (error) {
      console.error("删除备忘录失败:", error);
      alert("删除失败，请重试");
    }
  };

  return (
    <div className="overflow-y-auto scrollbar-hide">
      {memos.map((memo, index) => (
        <div
          key={index}
          className="p-4 hover:shadow-lg m-2 bg-white overflow-x-auto rounded-[6px] transition-shadow duration-300 ease-in-out relative"
          onMouseEnter={() => handleMouseEnter(memo.id)}
          onMouseLeave={handleMouseLeave}
        >
          {/* 悬浮操作菜单 */}
          {hoveredMemoId === memo.id && (
            <div className="absolute top-2 right-2 bg-white shadow-md rounded-md p-1 flex space-x-2">
              <button
                onClick={() => handleEdit(memo)}
                className="text-blue-500 hover:text-blue-700 p-1"
                title="编辑"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(memo)}
                className="text-red-500 hover:text-red-700 p-1"
                title="删除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

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

      {/* 编辑模态框 */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="编辑备忘录">
        <div className="p-4">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 min-h-[200px]"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              取消
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="确认删除">
        <div className="p-4">
          <p className="mb-4">确定要删除这条备忘录吗？此操作不可撤销。</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              取消
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
