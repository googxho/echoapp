export default function TopInfoArea() {
  return (
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
  );
}
