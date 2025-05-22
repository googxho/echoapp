/*
 * @Auther: xinhong.gong
 * @Date: 2025-05-21 23:30:00
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 22:44:52
 * @FilePath: /echoapp/app/mine/page.tsx
 * @Description: 主页组件
 */
'use client';

import HomeLayout from '../components/HomeLayout';
import './mine.css';

// 定义笔记项的类型
type NoteItem = {
  date: string;
  title: string;
  content: string[];
};

// 定义笔记数据数组
const notes: NoteItem[] = [
  {
    date: '2025-05-19 10:53:28',
    title: '如果你需要开发一个「回声」这样的笔记 App 的网页端，推荐使用的技术栈考虑以下几个维度：',
    content: [
      '用户体验：快速、流畅、沉浸式写作体验',
      '可维护性：易于迭代和更新',
      '数据同步：支持离线记录/云端同步',
      '安全性：保障用户隐私'
    ]
  },
  {
    date: '2025-05-18 10:30:17',
    title: '学习计划 - 前端技术',
    content: [
      '深入学习 React 和 Next.js',
      '掌握 TypeScript 高级特性',
      '学习状态管理库 Redux/Zustand',
      '了解 Tailwind CSS 最佳实践'
    ]
  }
];

// 定义侧边栏菜单项类型
type SidebarMenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
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
  }
];

// 定义全部笔记菜单项数据
const allNotesItems = [
  { label: '*' },
  { label: '2024计划表' },
  { label: '2046579' },
  { label: 'AI学习' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
  { label: 'Edge' },
];

// 定义侧边栏菜单项组件
const SidebarMenuItem = ({ item }: { item: SidebarMenuItem }) => (
  <div 
    className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
    onClick={item.onClick}
  >
    {item.icon}
    <span>{item.label}</span>
  </div>
);

export default function HomePage() {
  return (
    <HomeLayout
      leftSidebar={
        <div className="flex flex-col h-full">
          {/* 顶部信息区域 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-medium">googxh</div>
              <div className="text-xs text-gray-500">PRO</div>
            </div>
            <div className="flex mt-2 text-sm text-gray-500">
              <div className="mr-4">
                <span className="font-medium text-gray-700">903</span>
                <span className="ml-1">笔记</span>
              </div>
              <div className="mr-4">
                <span className="font-medium text-gray-700">39</span>
                <span className="ml-1">标签</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">1539</span>
                <span className="ml-1">天</span>
              </div>
            </div>
          </div>
          
          {/* 活动日历区域 */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-7 gap-1">
              {Array(35).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-sm ${i % 5 === 0 ? 'bg-green-200' : i % 7 === 3 ? 'bg-green-400' : 'bg-gray-100'}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div>三月</div>
              <div>四月</div>
              <div>五月</div>
            </div>
          </div>
          
          {/* 功能菜单区域 */}
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
              {allNotesItems.map((item, index) => (
                <div key={index} className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <span className="text-xs mr-2">#</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      noteHeader={
        <div className="p-4">
          <div className="flex items-center">
            <div className="flex-grow">
              <input 
                type="text" 
                placeholder="现在的想法是..." 
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex ml-2 space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
      noteList={
        <div className="divide-y divide-gray-200">
          {notes.map((note, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">{note.date}</div>
              <h3 className="font-medium mb-2">{note.title}</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {note.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className="flex justify-end mt-2">
                <button className="text-xs text-blue-500 hover:text-blue-700">展开</button>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
