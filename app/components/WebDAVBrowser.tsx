/*
 * @Auther: googxho
 * @Date: 2025-05-22
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-22
 * @FilePath: /echoapp/app/components/WebDAVBrowser.tsx
 * @Description: WebDAV文件浏览器组件
 */
'use client';

import { useState, useEffect } from 'react';
import { FileStat } from 'webdav';
import { listFiles, getFileContents, createDirectory, uploadFile, deleteItem, isWebDAVConfigured } from '../utils/webdavClient';
import WebDAVConfigModal from './WebDAVConfigModal';

export default function WebDAVBrowser() {
  const [files, setFiles] = useState<FileStat[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileStat | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  
  // 检查WebDAV是否已配置
  useEffect(() => {
    const checkConfig = async () => {
      const configured = await isWebDAVConfigured();
      setIsConfigured(configured);
      
      if (configured) {
        loadFiles(currentPath);
      } else {
        // 如果未配置，显示配置模态窗口
        setIsConfigModalOpen(true);
      }
    };
    
    checkConfig();
  }, []);
  
  // 加载目录内容
  const loadFiles = async (path: string) => {
    setIsLoading(true);
    setError('');
    setFileContent(null);
    setSelectedFile(null);
    
    try {
      const fileList = await listFiles(path);
      setFiles(fileList);
      setCurrentPath(path);
    } catch (err) {
      console.error('加载文件列表失败:', err);
      setError('加载文件列表失败，请检查WebDAV配置');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理文件或目录点击
  const handleItemClick = async (item: FileStat) => {
    if (item.type === 'directory') {
      // 如果是目录，进入该目录
      loadFiles(item.filename);
    } else {
      // 如果是文件，显示文件内容
      setIsLoading(true);
      setSelectedFile(item);
      
      try {
        const content = await getFileContents(item.filename);
        setFileContent(content);
      } catch (err) {
        console.error('获取文件内容失败:', err);
        setError('获取文件内容失败');
        setFileContent(null);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 返回上级目录
  const handleGoUp = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop(); // 移除最后一个部分
    const parentPath = pathParts.join('/') || '/';
    
    loadFiles(parentPath);
  };
  
  // 创建新文件夹
  const handleCreateFolder = async () => {
    if (!newFolderName) {
      setError('请输入文件夹名称');
      return;
    }
    
    setIsCreatingFolder(true);
    setError('');
    
    try {
      const folderPath = `${currentPath === '/' ? '' : currentPath}/${newFolderName}`;
      await createDirectory(folderPath);
      setNewFolderName('');
      // 重新加载当前目录
      loadFiles(currentPath);
    } catch (err) {
      console.error('创建文件夹失败:', err);
      setError('创建文件夹失败');
    } finally {
      setIsCreatingFolder(false);
    }
  };
  
  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${currentPath === '/' ? '' : currentPath}/${file.name}`;
        
        // 读取文件内容
        const content = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
        
        // 上传文件
        await uploadFile(filePath, content);
      }
      
      // 重新加载当前目录
      loadFiles(currentPath);
    } catch (err) {
      console.error('上传文件失败:', err);
      setError('上传文件失败');
    } finally {
      setIsLoading(false);
      // 清空文件输入框
      event.target.value = '';
    }
  };
  
  // 删除文件或目录
  const handleDelete = async (item: FileStat) => {
    if (!confirm(`确定要删除 ${item.basename} 吗？`)) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await deleteItem(item.filename);
      // 重新加载当前目录
      loadFiles(currentPath);
    } catch (err) {
      console.error('删除失败:', err);
      setError('删除失败');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 配置保存后的回调
  const handleConfigSave = () => {
    setIsConfigured(true);
    loadFiles('/');
  };
  
  // 渲染文件图标
  const renderFileIcon = (item: FileStat) => {
    if (item.type === 'directory') {
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* 配置模态窗口 */}
      <WebDAVConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleConfigSave}
      />
      
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGoUp}
            disabled={currentPath === '/' || isLoading}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            title="返回上级目录"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => loadFiles(currentPath)}
            disabled={isLoading}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            title="刷新"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <span className="text-sm text-gray-600">{currentPath}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="p-1 rounded hover:bg-gray-100"
            title="WebDAV配置"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* 创建文件夹和上传文件 */}
      <div className="flex items-center p-2 border-b">
        <div className="flex items-center space-x-2 mr-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="新文件夹名称"
            className="px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleCreateFolder}
            disabled={isCreatingFolder || !newFolderName}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            创建文件夹
          </button>
        </div>
        
        <div>
          <label className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 cursor-pointer">
            上传文件
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {/* 错误信息 */}
      {error && (
        <div className="p-2 text-red-500 text-sm">{error}</div>
      )}
      
      {/* 加载中 */}
      {isLoading && (
        <div className="flex justify-center items-center p-4">
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {/* 文件列表 */}
      {!isLoading && isConfigured && (
        <div className="flex-grow overflow-auto">
          {files.length === 0 ? (
            <div className="p-4 text-center text-gray-500">此目录为空</div>
          ) : (
            <div className="divide-y">
              {files.map((item) => (
                <div
                  key={item.filename}
                  className={`flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer ${selectedFile?.filename === item.filename ? 'bg-blue-50' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center space-x-2">
                    {renderFileIcon(item)}
                    <span className="text-sm">{item.basename}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {item.lastmod ? new Date(item.lastmod).toLocaleString() : ''}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="p-1 text-red-500 rounded hover:bg-red-50"
                      title="删除"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 文件内容预览 */}
      {fileContent !== null && (
        <div className="mt-4 p-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{selectedFile?.basename}</h3>
            <button
              onClick={() => setFileContent(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-gray-50 p-2 rounded overflow-auto max-h-40">
            <pre className="text-xs">{fileContent}</pre>
          </div>
        </div>
      )}
      
      {/* 未配置提示 */}
      {!isConfigured && !isLoading && !isConfigModalOpen && (
        <div className="flex flex-col items-center justify-center p-8">
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
    </div>
  );
}
