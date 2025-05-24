'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { useCallback, useRef, useState } from 'react';
import { addMemoToDB } from '../indexdb/indexedDBManager';

export default function Editor() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isEmpty, setIsEmpty] = useState(true);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: '现在的想法是...',
        showOnlyWhenEditable: true,
        includeChildren: true,
        showOnlyCurrent: true,
        emptyNodeClass: 'is-empty',
      }),
      // 添加标题扩展
      Heading.configure({
        levels: [1, 2, 3],
      }),
      // 添加无序列表扩展
      BulletList,
      // 添加有序列表扩展
      OrderedList,
      // 添加加粗扩展
      Bold,
      // 添加斜体扩展
      Italic,
      // 添加下划线扩展
      Underline,
    ],
    content: undefined,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setIsEmpty(!editor.getText().trim());
    },
  });

  const outerDivRef = useRef<HTMLDivElement>(null);

  // 点击最外层 div 时让编辑器聚焦
  const handleOuterDivClick = useCallback(() => {
    editor?.chain().focus().run();
  }, [editor]);

  // 处理发送按钮点击事件
  const handleSendClick = async () => {
    if (isEmpty || isSaving) return;
    
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      
      // 获取编辑器内容
      const content = editor?.getHTML() || '';
      
      // 保存到IndexDB
      await addMemoToDB({
        content,
        // 其他字段会在addMemoToDB函数中设置默认值
      });
      
      // 清空编辑器
      editor?.commands.clearContent();
      
      // 设置保存成功状态
      setSaveStatus('success');
      
      // 2秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('保存备忘录失败:', error);
      setSaveStatus('error');
      
      // 2秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={outerDivRef}
      onClick={handleOuterDivClick}
      className="border-[0.5px] border-gray-200 rounded-lg p-3 bg-white focus-within:border-transparent focus-within:ring-1 focus-within:ring-[#30cf79] transition-all duration-300"
      style={{
        // 去掉默认聚焦边框，使用自定义的聚焦环效果
        outline: 'none',
        // 设置光标颜色
        caretColor: '#30cf79'
      }}
    >
      {/* 编辑区域 */}
      <EditorContent
        editor={editor}
        className="min-h-[120px] max-h-[400px] overflow-y-auto resize-none"
      />

      {/* 底部工具栏 */}
      <div className="mt-3 flex items-center justify-between text-gray-400 text-xl">
        <div className="flex space-x-4">
          <button title="话题">#</button>
          <button
            title="图片"
            onClick={() =>
              editor?.chain().focus().setImage({ src: '/window.svg' }).run()
            }
          >Q
            </button>
          <button
            title="一级标题"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>
          <button
            title="二级标题"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            title="三级标题"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
          <button
            title="加粗"
            onClick={() =>
              editor?.chain().focus().toggleBold().run()
            }
          >
            B
          </button>
          <button
            title="斜体"
            onClick={() =>
              editor?.chain().focus().toggleItalic().run()
            }
          >
            I
          </button>
          <button
            title="下划线"
            onClick={() =>
              editor?.chain().focus().toggleUnderline().run()
            }
          >
            U
          </button>
          <button
            title="无序列表"
            onClick={() =>
              editor?.chain().focus().toggleBulletList().run()
            }
          >
            •
          </button>
          <button
            title="有序列表"
            onClick={() =>
              editor?.chain().focus().toggleOrderedList().run()
            }
          >
            1.
          </button>
          <button title="@">＠</button>
        </div>

        <button
          disabled={isEmpty || isSaving}
          title="发送"
          onClick={handleSendClick}
          className={`rounded px-3 py-0 ${isEmpty || isSaving ? 'bg-gray-300 text-white' : 'bg-green-500 text-white hover:bg-green-600'}
            ${saveStatus === 'success' ? 'bg-blue-500' : ''}
            ${saveStatus === 'error' ? 'bg-red-500' : ''}
            transition-colors duration-300`}
        >
          {isSaving ? '...' : saveStatus === 'success' ? '✓' : saveStatus === 'error' ? '✗' : '➤'}
        </button>
      </div>
    </div>
  );
}

