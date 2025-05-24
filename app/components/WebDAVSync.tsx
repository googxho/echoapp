/*
 * @Auther: googxho
 * @Date: 2025-05-22
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-24 12:02:16
 * @FilePath: \echoapp\app\components\WebDAVSync.tsx
 * @Description: WebDAV同步组件
 */
'use client';

import { useState, useEffect } from 'react';
import { MemoItem, FileItem, HistoryItem, LinkItem, MemoContentHistory, EchoData } from '../indexdb/EchoDataTypes';
import { getDataFromDB } from '../indexdb/indexedDBManager';
import { uploadFile, isWebDAVConfigured, createDirectory } from '../utils/webdavClient';
import WebDAVConfigModal from './WebDAVConfigModal';

interface WebDAVSyncProps {
  onClose: () => void;
}

// 定义数据类型
type DataType = 'memos' | 'files' | 'history' | 'links' | 'memo_content_histories' | 'all';

// 数据类型显示名称映射
const dataTypeNames: Record<DataType, string> = {
  all: '所有数据',
  memos: '备忘录',
  files: '文件',
  history: '历史记录',
  links: '链接',
  memo_content_histories: '备忘录历史',
};

export default function WebDAVSync({ onClose }: WebDAVSyncProps) {
  // 数据状态
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [memoContentHistories, setMemoContentHistories] = useState<MemoContentHistory[]>([]);

  // 选择状态
  const [selectedMemos, setSelectedMemos] = useState<number[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<number[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<number[]>([]);
  const [selectedMemoContentHistories, setSelectedMemoContentHistories] = useState<number[]>([]);

  // 当前选择的数据类型
  const [currentDataType, setCurrentDataType] = useState<DataType>('memos');

  // 其他状态
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 加载所有类型的数据
        const memosData = await getDataFromDB('memos') as MemoItem[];
        const filesData = await getDataFromDB('files') as FileItem[];
        const historyData = await getDataFromDB('history') as HistoryItem[];
        const linksData = await getDataFromDB('links') as LinkItem[];
        const memoContentHistoriesData = await getDataFromDB('memo_content_histories') as MemoContentHistory[];

        setMemos(memosData);
        setFiles(filesData);
        setHistory(historyData);
        setLinks(linksData);
        setMemoContentHistories(memoContentHistoriesData);
      } catch (err) {
        console.error('加载数据失败:', err);
        setStatusMessage('加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    // 检查WebDAV配置
    const checkWebDAVConfig = async () => {
      const configured = await isWebDAVConfigured();
      setIsConfigured(configured);
      if (!configured) {
        setIsConfigModalOpen(true);
      }
    };

    loadData();
    checkWebDAVConfig();
  }, []);

  // 获取当前数据类型的数据和选择状态
  const getCurrentData = () => {
    switch (currentDataType) {
      case 'memos':
        return { data: memos, selected: selectedMemos, setSelected: setSelectedMemos };
      case 'files':
        return { data: files, selected: selectedFiles, setSelected: setSelectedFiles };
      case 'history':
        return { data: history, selected: selectedHistory, setSelected: setSelectedHistory };
      case 'links':
        return { data: links, selected: selectedLinks, setSelected: setSelectedLinks };
      case 'memo_content_histories':
        return { data: memoContentHistories, selected: selectedMemoContentHistories, setSelected: setSelectedMemoContentHistories };
      case 'all':
        return {
          data: [...memos, ...files, ...history, ...links, ...memoContentHistories],
          selected: [...selectedMemos, ...selectedFiles, ...selectedHistory, ...selectedLinks, ...selectedMemoContentHistories],
          setSelected: () => { } // 全部数据模式下不支持单独选择
        };
      default:
        return { data: [], selected: [], setSelected: () => { } };
    }
  };

  // 处理选择数据项
  const handleSelectItem = (id: number) => {
    const { selected, setSelected } = getCurrentData();
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    const { data, selected, setSelected } = getCurrentData();
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map(item => item.id));
    }
  };

  // 将数据转换为JSON字符串
  const convertDataToJson = (data: any[]): string => {
    return JSON.stringify(data, null, 2);
  };

  // 将备忘录转换为Markdown
  const convertMemoToMarkdown = (memo: MemoItem): string => {
    return `---
title: ${memo.slug || 'Untitled'}
created: ${memo.created_at}
updated: ${memo.updated_at}
tags: ${memo.tags.join(', ')}
---

${memo.content}`;
  };

  // 同步到WebDAV
  const handleSync = async () => {
    if (currentDataType === 'all') {
      await syncAllData();
      return;
    }

    const { data, selected } = getCurrentData();

    if (selected.length === 0) {
      setStatusMessage(`请选择要同步的${dataTypeNames[currentDataType]}`);
      return;
    }

    setSyncStatus('syncing');
    setStatusMessage('正在同步...');
    setSyncProgress(0);

    try {
      // 创建目录
      const dirPath = `/echoapp_${currentDataType}`;
      await createDirectory(dirPath);

      // 筛选选中的数据
      const itemsToSync = data.filter(item => selected.includes(item.id));

      // 同步每个数据项
      for (let i = 0; i < itemsToSync.length; i++) {
        const item = itemsToSync[i];
        let fileName, content;

        // 根据数据类型处理
        if (currentDataType === 'memos') {
          fileName = `${(item as MemoItem).slug || item.id}.md`;
          content = convertMemoToMarkdown(item as MemoItem);
        } else {
          fileName = `${item.id}.json`;
          content = convertDataToJson([item]);
        }

        const filePath = `${dirPath}/${fileName}`;

        // 上传到WebDAV
        await uploadFile(filePath, content);

        // 更新进度
        const progress = Math.round(((i + 1) / itemsToSync.length) * 100);
        setSyncProgress(progress);
      }

      setSyncStatus('success');
      setStatusMessage(`成功同步 ${itemsToSync.length} 个${dataTypeNames[currentDataType]}到WebDAV`);
    } catch (err) {
      console.error('同步失败:', err);
      setSyncStatus('error');
      setStatusMessage('同步失败，请检查WebDAV配置');
    }
  };

  // 同步所有数据
  const syncAllData = async () => {
    setSyncStatus('syncing');
    setStatusMessage('正在同步所有数据...');
    setSyncProgress(0);

    try {
      // 创建主目录
      await createDirectory('/echoapp_backup');

      // 准备所有数据
      const allData: EchoData = {
        memos,
        files,
        history,
        links,
        memo_content_histories: memoContentHistories,
        memo_actions: [],
        tagInfos: [],
        tagSort: [],
        tag_tree_name: [],
        tag_actions: [],
        tags: [],
        zipCache: []
      };

      // 创建备份文件名（使用时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `echoapp_backup_${timestamp}.json`;
      const filePath = `/echoapp_backup/${fileName}`;

      // 转换为JSON并上传
      const content = JSON.stringify(allData, null, 2);
      await uploadFile(filePath, content);

      setSyncProgress(100);
      setSyncStatus('success');
      setStatusMessage(`成功备份所有数据到WebDAV: ${fileName}`);
    } catch (err) {
      console.error('备份失败:', err);
      setSyncStatus('error');
      setStatusMessage('备份失败，请检查WebDAV配置');
    }
  };

  // 配置保存后的回调
  const handleConfigSave = () => {
    setIsConfigured(true);
  };

  // 渲染数据项
  const renderDataItem = (item: any) => {
    switch (currentDataType) {
      case 'memos':
        return renderMemoItem(item as MemoItem);
      case 'files':
        return renderFileItem(item as FileItem);
      case 'history':
        return renderHistoryItem(item as HistoryItem);
      case 'links':
        return renderLinkItem(item as LinkItem);
      case 'memo_content_histories':
        return renderMemoContentHistoryItem(item as MemoContentHistory);
      default:
        return <div>未知数据类型</div>;
    }
  };

  // 渲染备忘录项
  const renderMemoItem = (memo: MemoItem) => (
    <div className="flex-grow">
      <div className="text-sm font-medium truncate">{memo.slug || '无标题'}</div>
      <div className="text-xs text-gray-500">{new Date(memo.created_at).toLocaleString()}</div>
      <div className="text-xs text-gray-600 mt-1 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: memo.content }}
      >
      </div>
      {memo.tags.length > 0 && (
        <div className="flex flex-wrap mt-1 gap-1">
          {memo.tags.map((tag, index) => (
            <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-xs rounded">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );

  // 渲染文件项
  const renderFileItem = (file: FileItem) => (
    <div className="flex-grow">
      <div className="text-sm font-medium truncate">{file.name}</div>
      <div className="text-xs text-gray-500">{file.type}</div>
      <div className="text-xs text-gray-600 mt-1">{(file.size / 1024).toFixed(2)} KB</div>
    </div>
  );

  // 渲染历史记录项
  const renderHistoryItem = (history: HistoryItem) => (
    <div className="flex-grow">
      <div className="text-sm font-medium truncate">{history.slug}</div>
      <div className="text-xs text-gray-500">{new Date(history.timestamp).toLocaleString()}</div>
      <div className="text-xs text-gray-600 mt-1 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: history.content }}></div>
    </div>
  );

  // 渲染链接项
  const renderLinkItem = (link: LinkItem) => (
    <div className="flex-grow">
      <div className="text-sm font-medium truncate">{link.source}</div>
      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{link.link}</div>
    </div>
  );

  // 渲染备忘录内容历史项
  const renderMemoContentHistoryItem = (history: MemoContentHistory) => (
    <div className="flex-grow">
      <div className="text-sm font-medium truncate">{history.slug}</div>
      <div className="text-xs text-gray-500">{history.updated_at || '无更新时间'}</div>
      <div className="text-xs text-gray-600 mt-1">Hash: {history.hash}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* WebDAV配置模态窗口 */}
      <WebDAVConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleConfigSave}
      />

      {/* 标题和操作按钮 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">WebDAV同步</h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            配置
          </button>

          {isConfigured && (
            <button
              onClick={handleSync}
              disabled={currentDataType !== 'all' && getCurrentData().selected.length === 0 || syncStatus === 'syncing'}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {syncStatus === 'syncing' ? '同步中...' : `同步${dataTypeNames[currentDataType]}到WebDAV`}
            </button>
          )}
        </div>
      </div>

      {/* 数据类型选择器 */}
      {isConfigured && (
        <div className="flex overflow-x-auto p-2 border-b min-h-14">
          {(Object.keys(dataTypeNames) as DataType[]).map(type => (
            <button
              key={type}
              onClick={() => setCurrentDataType(type)}
              className={`px-3 py-1 text-sm rounded mr-2 whitespace-nowrap ${currentDataType === type ? 'bg-[#30ef89] text-black' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {dataTypeNames[type]}
            </button>
          ))}
        </div>
      )}

      {/* 同步状态 */}
      {statusMessage && (
        <div className={`p-2 text-sm ${syncStatus === 'error' ? 'text-red-500' : syncStatus === 'success' ? 'text-green-500' : 'text-gray-500'}`}>
          {statusMessage}
        </div>
      )}

      {/* 同步进度条 */}
      {syncStatus === 'syncing' && (
        <div className="px-4 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1 text-gray-500">{syncProgress}%</div>
        </div>
      )}

      {/* 数据列表 */}
      {isConfigured ? (
        <div className="flex-grow overflow-auto p-2">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : currentDataType === 'all' ? (
            <div className="text-center p-4">
              <p className="mb-4">将备份所有数据到WebDAV服务器</p>
              <p className="text-sm text-gray-500">包含备忘录、文件、历史记录、链接等所有数据</p>
            </div>
          ) : getCurrentData().data.length === 0 ? (
            <div className="text-center p-4 text-gray-500">没有可同步的{dataTypeNames[currentDataType]}</div>
          ) : (
            <div>
              <div className="flex items-center p-2 border-b">
                <input
                  type="checkbox"
                  checked={getCurrentData().selected.length === getCurrentData().data.length && getCurrentData().data.length > 0}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span className="text-sm font-medium">全选 ({getCurrentData().selected.length}/{getCurrentData().data.length})</span>
              </div>

              <div className="divide-y">
                {getCurrentData().data.map(item => (
                  <div key={item.id} className="flex items-start p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={getCurrentData().selected.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="mt-1 mr-2"
                    />
                    {renderDataItem(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow p-8">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-600 mb-4">WebDAV未配置</p>
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            配置WebDAV
          </button>
        </div>
      )}

      {/* 底部按钮 */}
      <div className="p-4 border-t flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
