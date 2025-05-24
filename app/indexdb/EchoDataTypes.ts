// 文件对象类型
export type FileItem = {
  id: number;
  creator_id: number;
  type: string;
  name: string;
  path: string;
  size: number;
  seconds: null;
  content: null;
  url: string;
  thumbnail_url: string;
};

// 历史记录对象类型
export type HistoryItem = {
  slug: string;
  content: string;
  timestamp: number;
  id: number;
};

// 链接对象类型
export type LinkItem = {
  source: string;
  link: string;
  id: number;
};

// 备忘录内容历史记录类型
export type MemoContentHistory = {
  slug: string;
  hash: number;
  id: number;
  updated_at?: string;
};

// 备忘录对象类型
export type MemoItem = {
  content: string;
  creator_id: number;
  source: string;
  tags: string[];
  pin: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  slug: string;
  linked_count: number;
  files: [];
  created_at_long: number;
  deleted_at_long: number;
  updated_at_long: number;
  local_updated_at_long: number;
  local_updated_at: string;
  links: string[] | null;
  linked_memos: [];
  id: number;
};

// 整体数据结构类型
export type EchoData = {
  files: FileItem[];
  history: HistoryItem[];
  links: LinkItem[];
  memo_actions: never[];
  memo_content_histories: MemoContentHistory[];
  memos: MemoItem[];
  tagInfos: [];
  tagSort: [];
  tag_tree_name: TagTreeName;
  tag_actions: [];
  tags: Tags;
  zipCache: [];
  [key: string]: unknown[];
};

// 定义 tagTreeName 数组中的对象类型
export type TagTreeItem = {
  id: number;
  name: string;
};

// 定义 tags 数组中的对象类型
export type Tag = {
  name: string;
  count: number;
  latest_used_at: number;
  id: number;
};

// 定义 tagTreeName 数组类型
export type TagTreeName = TagTreeItem[];

// 定义 tags 数组类型
export type Tags = Tag[];
