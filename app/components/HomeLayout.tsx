/*
 * @Auther: googxho
 * @Date: 2025-05-21 23:20:00
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-24 16:37:06
 * @FilePath: \echoapp\app\components\HomeLayout.tsx
 * @Description: 主页布局组件
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import '../mine/mine.css';

interface HomeLayoutProps {
  leftSidebar: React.ReactNode;
  noteHeader: React.ReactNode;
  noteList: React.ReactNode;
  onScrollEnd?: () => void; // 新增：滚动到底部时的回调函数
  isLoading?: boolean; // 新增：是否正在加载更多数据
}

export default function HomeLayout({
  leftSidebar,
  noteHeader,
  noteList,
  onScrollEnd,
  isLoading = false
}: HomeLayoutProps) {
  // 左侧栏初始宽度
  const [leftWidth, setLeftWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noteListRef = useRef<HTMLDivElement>(null);

  // 处理拖拽调整宽度
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !container) return;

      // 计算新的宽度，但限制最小宽度为180px，最大宽度为容器宽度的50%
      const containerWidth = container.getBoundingClientRect().width;
      const maxWidth = Math.min(containerWidth * 0.5, containerWidth - 620);
      const newWidth = Math.max(180, Math.min(maxWidth, e.clientX));

      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // 添加拖拽事件监听
    const dragHandle = dragHandleRef.current;
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', handleMouseDown);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (dragHandle) {
        dragHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 处理滚动到底部加载更多数据
  const handleScroll = () => {
    if (!noteListRef.current || !onScrollEnd || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = noteListRef.current;
    // 当滚动到距离底部20px以内时，触发加载更多
    if (scrollHeight - scrollTop - clientHeight < 20) {
      onScrollEnd();
    }
  };

  return (
    <div className="flex justify-center h-screen overflow-hidden bg-[#fafafa]">
      <div
        ref={containerRef}
        className={`flex h-full ${isDragging ? 'dragging' : ''}`}
        style={{
          cursor: isDragging ? 'col-resize' : 'auto',
          maxWidth: `${Math.min(620 + leftWidth, 1240)}px`
        }}
      >
        {/* 左侧边栏 */}
        <div
          className="h-full min-w-64 overflow-y-auto  bg-gray-50 "
          style={{ width: `${leftWidth}px`, flexShrink: 0 }}
        >
          {leftSidebar}
        </div>

        {/* 拖拽调整宽度的把手 */}
        <div
          ref={dragHandleRef}
          className="w-1 h-full resize-handle "
        />

        {/* 右侧内容区域 - 固定宽度620px，居中显示 */}
        <div className="flex-grow h-full flex items-center justify-center overflow-hidden">
          <div className="flex-shrink-0 h-full overflow-hidden mx-auto" style={{ width: '620px' }}>
            <div className="flex flex-col h-full">
              {/* 顶部固定区域 */}
              <div className="flex-shrink-0">
                {noteHeader}
              </div>

              {/* 笔记列表区域 - 可滚动 */}
              <div
                ref={noteListRef}
                className="flex-grow overflow-y-auto"
                style={{ width: '100%', boxSizing: 'border-box' }}
                onScroll={handleScroll}
                onMouseEnter={e => {
                  e.currentTarget.classList.remove('scrollbar-hide')
                  e.currentTarget.classList.add('custom-scrollbar')
                  // 预留滚动条空间，避免内容宽度变化
                  e.currentTarget.style.paddingRight = '0px'
                }}
                onMouseLeave={e => {
                  e.currentTarget.classList.add('scrollbar-hide')
                  e.currentTarget.classList.remove('custom-scrollbar')
                  e.currentTarget.style.paddingRight = '6px'
                }}
              >
                {noteList}

                {/* 加载更多指示器 */}
                {isLoading
                  ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                      <span className="ml-2 text-gray-500">加载中...</span>
                    </div>
                  )
                  : (
                    // 已经加载完所有数据
                    <div className="flex justify-center items-center py-4 text-gray-500">
                      <span>已加载全部笔记</span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
