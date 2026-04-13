import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

export function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = "w-full md:w-[800px] max-w-full" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: ReactNode; 
  width?: string;
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity" 
          onClick={onClose} 
        />
      )}
      
      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${width} ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {children}
        </div>
      </div>
    </>
  );
}
