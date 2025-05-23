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
import { getDataFromDB, initDB } from '../indexdb/indexedDBManager';
import { MemoItem, Tags } from '../indexdb/EchoDataTypes';
import echodata from '../indexdb/echo_data.json'
import MemoItemView from './components/MemoItem';

export default function HomePage() {

  const [memos, setMemos] = useState<MemoItem[]>([]); // 用于存储从数据库获取的笔记数据
  const [tags, setTags] = useState<Tags>([]); // 用于存储从数据库获取的标签数据


  useEffect(() => {
    const initializeDB = async () => {
      try {
        // 示例：从对象存储空间获取数据
        // 检查是否存在echoapp数据库 如果存在则直接返回db
        const db = await indexedDB.databases()
        if (!db.find(item => item.name === 'echoapp')) {
          await initDB(echodata);
        }
        const memos = await getDataFromDB('memos');
        const tags = await getDataFromDB('tags');
        setMemos(memos);
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
      noteList={<MemoItemView memos={memos} />}
    />
  );
}
