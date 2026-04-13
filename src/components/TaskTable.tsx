import { Filter, Copy, Eye, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Info, Search, Calendar as CalendarIcon, Upload, Download, Sparkles, ChevronLeft, ChevronRight, Check, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import React, { useState, Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/Table";

export type Task = {
  id: string;
  createdAt: string;
  type: string;
  currency: string;
  amount: string;
  status: "完了" | "却下";
  aiRisk: "安全" | "要確認" | "危険";
  aiDetails: string;
};

const tasks: Task[] = [
  { id: "6418793", createdAt: "2023年11月08日 22時07分", type: "資金移動: eWalletから取引口座へ", currency: "JPY", amount: "-500,000", status: "完了", aiRisk: "安全", aiDetails: "通常の取引パターンです。過去のログインIPと一致しています。" },
  { id: "6418768", createdAt: "2023年11月08日 21時58分", type: "入金", currency: "JPY", amount: "+500,000", status: "完了", aiRisk: "安全", aiDetails: "KYC済みの銀行口座からの入金を確認しました。" },
  { id: "6413668", createdAt: "2023年11月08日 01時54分", type: "資金移動: eWalletから取引口座へ", currency: "JPY", amount: "-150,000", status: "完了", aiRisk: "安全", aiDetails: "通常の取引パターンです。" },
  { id: "6413662", createdAt: "2023年11月08日 01時53分", type: "入金", currency: "JPY", amount: "+150,000", status: "完了", aiRisk: "安全", aiDetails: "ホワイトリスト登録済みのウォレットからの入金です。" },
  { id: "6413537", createdAt: "2023年11月08日 01時09分", type: "資金移動: eWalletから取引口座へ", currency: "JPY", amount: "-3,400,000", status: "完了", aiRisk: "要確認", aiDetails: "普段より高額な資金移動です。自動モニタリングを継続します。" },
  { id: "6413535", createdAt: "2023年11月08日 01時09分", type: "eWalletへ資金移動", currency: "JPY", amount: "+3,400,000", status: "完了", aiRisk: "要確認", aiDetails: "短期間での連続した資金移動を検知しました。" },
  { id: "6413531", createdAt: "2023年11月08日 01時08分", type: "資金移動: eWalletから取引口座へ", currency: "JPY", amount: "-3,400,000", status: "完了", aiRisk: "安全", aiDetails: "通常の取引パターンです。" },
  { id: "6413503", createdAt: "2023年11月08日 01時03分", type: "入金", currency: "JPY", amount: "+500,000", status: "却下", aiRisk: "危険", aiDetails: "ブラックリストに登録されているIPアドレスからのアクセスを検知したため、自動ブロックしました。" },
  { id: "6413501", createdAt: "2023年11月08日 01時01分", type: "入金", currency: "JPY", amount: "+500,000", status: "却下", aiRisk: "危険", aiDetails: "不審なデバイスフィンガープリントを検知しました。" },
  { id: "6411050", createdAt: "2023年11月07日 15時39分", type: "資金移動: eWalletから取引口座へ", currency: "JPY", amount: "-3,000,000", status: "完了", aiRisk: "安全", aiDetails: "通常の取引パターンです。" },
];

export function TaskTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("2023/11/01 - 2023/11/30");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task, direction: 'asc' | 'desc' } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSort = (key: keyof Task) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = React.useMemo(() => {
    let sortableTasks = [...tasks];
    if (sortConfig !== null) {
      sortableTasks.sort((a, b) => {
        let aValue: any = a[sortConfig.key];
        let bValue: any = b[sortConfig.key];

        if (sortConfig.key === 'amount') {
          aValue = parseFloat(aValue.replace(/,/g, '').replace(/\+/g, ''));
          bValue = parseFloat(bValue.replace(/,/g, '').replace(/\+/g, ''));
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTasks;
  }, [sortConfig]);

  const handleCopy = () => {
    const headers = ["取引ID", "作成日", "取引タイプ", "通貨", "金額", "AI判定", "ステータス"];
    const rows = sortedTasks.map(t => [t.id, t.createdAt, t.type, t.currency, t.amount, t.aiRisk, t.status].join('\t'));
    const text = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const SortableHead = ({ label, sortKey }: { label: string, sortKey: keyof Task }) => (
    <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort(sortKey)}>
      <div className="flex items-center gap-1">
        {label}
        {sortConfig?.key === sortKey ? (
          sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-[#00a699]" /> : <ArrowDown size={14} className="text-[#00a699]" />
        ) : (
          <ArrowUpDown size={14} className="text-gray-300" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white w-full mt-6 p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input placeholder="取引ID、タイプで検索..." className="pl-9" />
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              className="text-gray-600 font-normal"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <CalendarIcon size={16} className="mr-2 text-gray-400" />
              {dateRange}
            </Button>
            
            <AnimatePresence>
              {isCalendarOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsCalendarOpen(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"><ChevronLeft size={18} /></button>
                      <span className="text-[14px] font-bold text-gray-800">2023年 11月</span>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-gray-400 mb-2">
                      <div className="text-red-400">日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div className="text-blue-400">土</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-[13px]">
                      <div className="p-1"></div>
                      <div className="p-1"></div>
                      <div className="p-1"></div>
                      {Array.from({ length: 30 }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = day === 1 || day === 30;
                        const isBetween = day > 1 && day < 30;
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              setDateRange(`2023/11/01 - 2023/11/${day.toString().padStart(2, '0')}`);
                              if (day !== 1) setIsCalendarOpen(false);
                            }}
                            className={`
                              h-8 w-full rounded flex items-center justify-center transition-colors
                              ${isSelected ? 'bg-[#00a699] text-white font-bold shadow-sm' : ''}
                              ${isBetween ? 'bg-[#00a699]/10 text-[#008f84]' : ''}
                              ${!isSelected && !isBetween ? 'text-gray-700 hover:bg-gray-100' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <Button variant="outline" className="text-gray-600">
            <Filter size={16} className="mr-2 text-gray-400" />
            絞り込み
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="icon" title="コピー" onClick={handleCopy}>
            {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </Button>
          <Button variant="outline" className="text-gray-600">
            <Upload size={16} className="mr-2 text-gray-400" />
            インポート
          </Button>
          <Button variant="outline" className="text-gray-600">
            <Download size={16} className="mr-2 text-gray-400" />
            エクスポート
          </Button>
          <Button variant="primary" className="bg-[#00a699] hover:bg-[#008f84] text-white border-transparent">
            <Sparkles size={16} className="mr-2" />
            AI一括分析
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <SortableHead label="取引ID" sortKey="id" />
            <SortableHead label="作成日" sortKey="createdAt" />
            <SortableHead label="取引タイプ" sortKey="type" />
            <SortableHead label="通貨" sortKey="currency" />
            <SortableHead label="金額" sortKey="amount" />
            <SortableHead label="AI判定" sortKey="aiRisk" />
            <SortableHead label="ステータス" sortKey="status" />
            <TableHead className="text-right">アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <Fragment key={task.id}>
              <TableRow 
                onClick={() => toggleRow(task.id)}
                className={`cursor-pointer ${expandedRow === task.id ? 'bg-gray-50/50' : ''}`}
              >
                <TableCell className="text-gray-400">
                  {expandedRow === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </TableCell>
                <TableCell className="text-gray-800 font-semibold">{task.id}</TableCell>
                <TableCell className="text-gray-800 whitespace-nowrap font-medium">{task.createdAt}</TableCell>
                <TableCell className="text-gray-900 font-bold">{task.type}</TableCell>
                <TableCell className="text-gray-800 font-medium">{task.currency}</TableCell>
                <TableCell className="text-gray-900 font-bold">{task.amount} 円</TableCell>
                <TableCell>
                  <Badge variant={task.aiRisk === '安全' ? 'success' : task.aiRisk === '要確認' ? 'warning' : 'danger'} className="gap-1.5">
                    {task.aiRisk === '安全' && <ShieldCheck size={12} />}
                    {task.aiRisk === '要確認' && <Info size={12} />}
                    {task.aiRisk === '危険' && <AlertTriangle size={12} />}
                    {task.aiRisk}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-medium
                    ${task.status === '完了' ? 'text-[#00c4a7]' : ''}
                    ${task.status === '却下' ? 'text-[#ff4d4f]' : ''}
                  `}>
                    {task.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-[#00a699] hover:text-[#008f84] hover:bg-[#00a699]/10" onClick={(e) => e.stopPropagation()}>
                    詳細
                  </Button>
                </TableCell>
              </TableRow>
              <AnimatePresence>
                {expandedRow === task.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#f8f9fa] border-b border-gray-100 overflow-hidden"
                  >
                    <TableCell colSpan={9} className="p-0">
                      <div className="py-4 pl-12 pr-4 flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-full 
                          ${task.aiRisk === '安全' ? 'bg-green-100 text-green-600' : ''}
                          ${task.aiRisk === '要確認' ? 'bg-yellow-100 text-yellow-600' : ''}
                          ${task.aiRisk === '危険' ? 'bg-red-100 text-red-600' : ''}
                        `}>
                          {task.aiRisk === '安全' && <ShieldCheck size={14} />}
                          {task.aiRisk === '要確認' && <Info size={14} />}
                          {task.aiRisk === '危険' && <AlertTriangle size={14} />}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-900 mb-1">AI Analysis Details</h4>
                          <p className="text-[14px] text-gray-800 font-medium">{task.aiDetails}</p>
                        </div>
                      </div>
                    </TableCell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
