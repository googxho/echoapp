"use client"

import { useState } from 'react';
import { Tags } from "@/app/indexdb/EchoDataTypes";
import WebDAVBrowser from '@/app/components/WebDAVBrowser';
import WebDAVSync from '@/app/components/WebDAVSync';
import Modal from '@/app/components/Modal';

// 定义侧边栏菜单项类型
type SidebarMenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export default function FunctionMenu({ tags }: { tags: Tags }) {
  const [isWebDAVModalOpen, setIsWebDAVModalOpen] = useState(false);
  const [webDAVModalType, setWebDAVModalType] = useState<'browser' | 'sync'>('browser');

  // 打开WebDAV浏览器
  const openWebDAVBrowser = () => {
    setWebDAVModalType('browser');
    setIsWebDAVModalOpen(true);
  };

  // 打开WebDAV同步
  const openWebDAVSync = () => {
    setWebDAVModalType('sync');
    setIsWebDAVModalOpen(true);
  };

  // 定义功能菜单数据
  const functionMenuItems: SidebarMenuItem[] = [
    {
      label: '便捷输入',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: '每日回顾',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: '快一找',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: '我的进步',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'WebDAV浏览',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      onClick: openWebDAVBrowser
    },
    {
      label: 'WebDAV同步',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      onClick: openWebDAVSync
    }
  ];

  // 定义侧边栏菜单项组件
  const SidebarMenuItem = ({ item }: { item: SidebarMenuItem }) => (
    <div
      className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={item.onClick}
    >
      {item.icon}
      <span>{item.label}</span>
    </div>
  );

  return (
    <div className="flex-grow p-2">
      <button className="flex items-center w-full p-2 mb-2 text-white bg-green-500 rounded-md">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        全部笔记
      </button>

      <div className="space-y-1 mt-4">
        {functionMenuItems.map((item, index) => (
          <SidebarMenuItem key={index} item={item} />
        ))}
      </div>

      <div className="mt-6 space-y-1">
        <div className="text-xs font-medium text-gray-500 px-2 py-1">全部笔记</div>
        {tags.map((item, index) => (
          <div key={index} className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* WebDAV模态窗口 */}
      <Modal 
        isOpen={isWebDAVModalOpen} 
        onClose={() => setIsWebDAVModalOpen(false)}
        title={webDAVModalType === 'browser' ? "WebDAV文件浏览器" : "WebDAV同步"}
      >
        <div className="h-[70vh] overflow-hidden">
          {webDAVModalType === 'browser' ? (
            <WebDAVBrowser />
          ) : (
            <WebDAVSync onClose={() => setIsWebDAVModalOpen(false)} />
          )}
        </div>
      </Modal>
    </div>
  );
}
