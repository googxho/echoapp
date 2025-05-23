/*
 * @Auther: googxho
 * @Date: 2025-05-21 23:00:00
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 23:00:00
 * @FilePath: /echoapp/app/components/Modal.tsx
 * @Description: 模态窗口组件
 */
'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      // 恢复背景滚动
      document.body.style.overflow = '';
    }

    // 处理ESC键关闭
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    dialog.addEventListener('keydown', handleEscKey);
    return () => {
      dialog.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog 
      ref={dialogRef}
      className="flex justify-center items-center fixed inset-0 z-50 bg-transparent min-w-svw min-h-svh "
      onClick={(e) => {
        // 点击对话框外部区域关闭
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">{title || '提示'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </dialog>
  );
}
