export default function ActivityCalendar() {
  return (
    <div className="p-4">
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
  );
}
