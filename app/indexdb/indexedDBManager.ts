/*
 * @Auther: googxho
 * @Date: 2025-05-22
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-24 15:52:53
 * @FilePath: \echoapp\app\indexdb\indexedDBManager.ts
 * @Description: IndexedDB 数据库管理
 */

import { EchoData, MemoItem } from "./EchoDataTypes";

// 定义数据库名称和版本
const DB_NAME = 'echoapp';
const DB_VERSION = 1;

// 初始化数据库
export const initDB = (json: EchoData) => {
  if (!indexedDB) {
    return Promise.reject('IndexedDB is not supported in this browser.');
  }
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 数据库版本变更时触发
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 遍历 JSON 数据的每个键，为每个键创建一个对象存储空间
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          if (!db.objectStoreNames.contains(key)) {
            db.createObjectStore(key, { keyPath: 'id', autoIncrement: true });
          }
        }
      }
    };

    // 数据库打开成功
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(Object.keys(json), 'readwrite');

      // 将 JSON 数据插入到对应的对象存储空间
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          const store = transaction.objectStore(key);
          (json[key] as Array<unknown>).forEach((item) => {
            store.add(item);
          });
        }
      }

      transaction.oncomplete = () => {
        db.close();
        resolve(db);
      };

      transaction.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    // 数据库打开失败
    request.onerror = (error) => {
      reject(error);
    };
  });
};

// 获取数据库中的数据
export const getDataFromDB = (storeName: string) => {
  return new Promise<[]>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getDataRequest = store.getAll();

      getDataRequest.onsuccess = (event) => {
        db.close();
        resolve((event.target as IDBRequest).result);
      };

      getDataRequest.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};

// 添加备忘录到数据库
export const addMemoToDB = (memo: Partial<MemoItem>) => {
  return new Promise<number>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('memos', 'readwrite');
      const store = transaction.objectStore('memos');
      
      // 确保memo对象包含必要的字段
      const now = new Date();
      const timestamp = now.getTime();
      const isoString = now.toISOString();
      
      const newMemo: Partial<MemoItem> = {
        ...memo,
        created_at: memo.created_at || isoString,
        updated_at: memo.updated_at || isoString,
        local_updated_at: memo.local_updated_at || isoString,
        created_at_long: memo.created_at_long || timestamp,
        updated_at_long: memo.updated_at_long || timestamp,
        local_updated_at_long: memo.local_updated_at_long || timestamp,
        deleted_at: null,
        deleted_at_long: 0,
        creator_id: memo.creator_id || 1,
        source: memo.source || 'local',
        tags: memo.tags || [],
        pin: memo.pin || 0,
        slug: memo.slug || `memo-${timestamp}`,
        linked_count: memo.linked_count || 0,
        files: memo.files || [],
        links: memo.links || null,
        linked_memos: memo.linked_memos || []
      };

      const addRequest = store.add(newMemo);

      addRequest.onsuccess = (event) => {
        const id = (event.target as IDBRequest<number>).result;
        db.close();
        resolve(id);
      };

      addRequest.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};

// 更新备忘录
export const updateMemoInDB = (id: number, updatedMemo: Partial<MemoItem>) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('memos', 'readwrite');
      const store = transaction.objectStore('memos');
      
      // 先获取原始数据
      const getRequest = store.get(id);
      
      getRequest.onsuccess = (event) => {
        const existingMemo = (event.target as IDBRequest).result;
        
        if (!existingMemo) {
          db.close();
          reject(new Error(`备忘录ID ${id} 不存在`));
          return;
        }
        
        // 更新时间戳
        const now = new Date();
        const timestamp = now.getTime();
        const isoString = now.toISOString();
        
        // 合并原有数据和更新数据
        const newMemo = {
          ...existingMemo,
          ...updatedMemo,
          updated_at: isoString,
          updated_at_long: timestamp,
          local_updated_at: isoString,
          local_updated_at_long: timestamp
        };
        
        // 更新数据
        const updateRequest = store.put(newMemo);
        
        updateRequest.onsuccess = () => {
          db.close();
          resolve();
        };
        
        updateRequest.onerror = (error) => {
          db.close();
          reject(error);
        };
      };
      
      getRequest.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};

// 删除备忘录
export const deleteMemoFromDB = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('memos', 'readwrite');
      const store = transaction.objectStore('memos');
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        db.close();
        resolve();
      };
      
      deleteRequest.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};

// 分页获取备忘录数据
export const getMemosByPage = (page: number, pageSize: number = 50) => {
  return new Promise<{ memos: MemoItem[], total: number }>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('memos', 'readonly');
      const store = transaction.objectStore('memos');
      
      // 获取总数
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        const total = countRequest.result;
        
        // 获取所有数据
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = (event) => {
          const allMemos = (event.target as IDBRequest<MemoItem[]>).result;
          
          // 按创建时间倒序排序（最新的在前面）
          allMemos.sort((a, b) => b.created_at_long - a.created_at_long);
          
          // 分页
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const pagedMemos = allMemos.slice(start, end);
          
          db.close();
          resolve({ memos: pagedMemos, total });
        };
        
        getAllRequest.onerror = (error) => {
          db.close();
          reject(error);
        };
      };
      
      countRequest.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};
