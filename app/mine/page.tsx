/*
 * @Auther: googxho
 * @Date: 2025-05-21 23:30:00
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 22:44:52
 * @FilePath: /echoapp/app/mine/page.tsx
 * @Description: 主页组件
 */
'use client';

import { useEffect, useState } from 'react';
import HomeLayout from '../components/HomeLayout';
import './mine.css';
import TopInfoArea from './components/TopInfoArea';
import ActivityCalendar from './components/ActivityCalendar';
import FunctionMenu from './components/FunctionMenu';
import NoteHeader from './components/NoteHeader';
import { getDataFromDB, initDB, getMemosByPage } from '../indexdb/indexedDBManager';
import { MemoItem, Tags } from '../indexdb/EchoDataTypes';
import echodata from '../indexdb/echo_data.json'
import MemoItemView from './components/MemoItem';

export default function HomePage() {
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [tags, setTags] = useState<Tags>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalMemos, setTotalMemos] = useState(0);
  const PAGE_SIZE = 150; // 每页加载50条数据
  console.log("[ku]log >> :30 >> HomePage >> totalMemos:", totalMemos);

  // 加载备忘录数据（分页）
  const loadMemos = async (page: number = 1, append: boolean = false) => {
    if (!hasMore && page > 1) return;
    
    try {
      setIsLoading(true);
      const { memos: newMemos, total } = await getMemosByPage(page, PAGE_SIZE);
      
      setTotalMemos(total);
      
      if (append) {
        // 追加模式：将新数据添加到现有数据后面
        setMemos(prevMemos => [...prevMemos, ...newMemos]);
      } else {
        // 替换模式：直接替换现有数据
        setMemos(newMemos);
      }
      
      // 判断是否还有更多数据
      setHasMore(page * PAGE_SIZE < total);
      setCurrentPage(page);
    } catch (error) {
      console.error('加载备忘录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载更多数据
  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    loadMemos(currentPage + 1, true);
  };

  // 当备忘录更新后刷新数据
  const handleMemoUpdated = () => {
    // 重置页码并重新加载第一页数据
    setCurrentPage(1);
    loadMemos(1, false);
  };

  useEffect(() => {
    const initializeDB = async () => {
      try {
        // 检查是否存在echoapp数据库 如果存在则直接返回db
        const db = await indexedDB.databases()
        if (!db.find(item => item.name === 'echoapp')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          await initDB(echodata);
        }
        
        // 加载第一页备忘录数据
        await loadMemos(1, false);
        
        // 加载标签数据
        const tags = await getDataFromDB('tags');
        setTags(tags);

      } catch (error) {
        console.error('数据库初始化失败:', error);
      }
    }
    initializeDB();
  }, [])
  
  return (
    <HomeLayout
      leftSidebar={
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          <TopInfoArea />
          <ActivityCalendar />
          <FunctionMenu tags={tags} />
        </div>
      }
      noteHeader={<NoteHeader />}
      noteList={<MemoItemView memos={memos} onMemoUpdated={handleMemoUpdated} />}
      onScrollEnd={handleLoadMore}
      isLoading={isLoading}
    />
  );
}
