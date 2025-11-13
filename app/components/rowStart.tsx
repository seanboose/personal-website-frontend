export const RowStart = ({ className }: { className?: string }) => {
  return (
    <div className={`flex flex-row ${className || ''}`}>
      <div className="w-3 bg-nav-unselected"></div>
      <div className="w-1"></div>
      <div className="w-0.5 bg-nav-unselected"></div>
    </div>
  );
};
