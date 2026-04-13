import {
  Briefcase,
  Factory,
  Banknote,
  FileText,
  Headset,
  MonitorPlay,
  LogIn,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export function Sidebar({ 
  isOpen, 
  setIsOpen,
  currentPage,
  setCurrentPage
}: { 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  currentPage: string;
  setCurrentPage: (p: string) => void;
}) {
  const menuGroups = [
    {
      title: "営業",
      icon: Briefcase,
      items: [
        { label: "リード管理", badge: "111件" },
        { label: "見積管理", badge: "38K件" },
        { label: "受注管理", badge: "35K件" },
        { label: "顧客管理", badge: "3K件" },
      ]
    },
    {
      title: "生産",
      icon: Factory,
      items: [
        { label: "プロジェクト管理", badge: "1K件" },
        { label: "スケジュール", badge: "380件" },
      ]
    },
    {
      title: "経理",
      icon: Banknote,
      items: [
        { label: "買掛管理", badge: "931件" },
        { label: "売掛管理", badge: "2件" },
        { label: "仕訳帳", badge: "2件" },
        { label: "試算表", badge: "復活", badgeType: "success" },
        { label: "損益計算書", badge: "復活", badgeType: "success" },
        { label: "貸借対照表", badge: "復活", badgeType: "success" },
        { label: "経費精算OCR", badge: "機能", badgeType: "info" },
      ]
    },
    {
      title: "申請",
      icon: FileText,
      items: [
        { label: "経費精算", badge: "1.4K件" },
        { label: "交通費 / 休暇 / 日報" },
      ]
    }
  ];

  const [openGroups, setOpenGroups] = useState<string[]>(menuGroups.map(g => g.title));

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  return (
    <aside className={`
      fixed md:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-gray-200 flex flex-col
      transition-transform duration-300 ease-in-out shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="h-[60px] flex items-center justify-between px-6 shrink-0 border-b border-gray-100">
        <div className="font-bold text-xl tracking-tighter text-gray-800 flex items-center gap-2">
          <span className="text-[#00a699]">文唱堂</span>ｘAI
        </div>
        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.title} className="px-3">
            <button 
              onClick={() => toggleGroup(group.title)}
              className="flex items-center justify-between w-full px-3 py-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <group.icon size={16} strokeWidth={2} />
                <span className="text-[12px] font-bold tracking-wider">{group.title}</span>
              </div>
              {openGroups.includes(group.title) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {openGroups.includes(group.title) && (
              <div className="mt-1 flex flex-col gap-0.5">
                {group.items.map(item => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setCurrentPage(item.label);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-left ${
                      currentPage === item.label
                        ? "bg-[#00a699]/10 text-[#00a699] font-bold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                    }`}
                  >
                    <span className="text-[13px] truncate pr-2">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold ${
                        item.badgeType === 'success' ? 'bg-green-100 text-green-700' :
                        item.badgeType === 'info' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
