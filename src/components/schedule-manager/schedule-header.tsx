export function ScheduleHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-3 px-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
      <div className="col-span-2">Day</div>
      <div className="col-span-3">Start Time</div>
      <div className="col-span-3">End Time</div>
      <div className="col-span-2 text-center">Hours</div>
      <div className="col-span-2 text-right">Actions</div>
    </div>
  );
}
