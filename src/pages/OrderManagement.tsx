import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Download, Plus, FileText, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Drawer } from "../components/ui/Drawer";
import { analyzeWithHighThinkingAndSearch } from "../lib/gemini";
import ReactMarkdown from "react-markdown";

const mockOrdersV2 = [
  { id: "1", order_code: "ORD-000001", customer_name: "株式会社アルファ", item_name: "会社案内パンフレット制作", amount: 1500000, variable_cost: 500000, status: "入金待ち", order_date: "2023-11-05", delivery_date: "2023-12-01", cost_confirmed: true, sales_rep: "田中", memo: "特急料金含む", payment_terms: "月末締め翌月末払い" },
  { id: "2", order_code: "ORD-000002", customer_name: "ガンマ工業株式会社", item_name: "展示会用ポスター・チラシ", amount: 450000, variable_cost: 150000, status: "作業完了待ち", order_date: "2023-11-06", delivery_date: "2023-11-20", cost_confirmed: false, sales_rep: "佐藤", memo: "デザインデータ支給", payment_terms: "納品後一括払い" },
  { id: "3", order_code: "ORD-000003", customer_name: "株式会社ゼータ", item_name: "製品カタログ 2024年版", amount: 2100000, variable_cost: 800000, status: "請求待ち", order_date: "2023-11-07", delivery_date: "2024-02-28", cost_confirmed: true, sales_rep: "鈴木", memo: "全100ページ", payment_terms: "着手金50%、残金納品後" },
];

const mockOrdersOld = [
  { row_uuid: "1", orders_id: "O2311001", project_id: "100234", client_custmer: "秦野様", amount: "1500000", subamount: "1350000", quantity: "1000", copies: "1000", order_date: "2023-11-05", delivery_date: "2023-12-01", claim_month: "2023-12", user_id: "U001", remarks: "Access移行データ" },
  { row_uuid: "2", orders_id: "O2311002", project_id: "100235", client_custmer: "田中様", amount: "450000", subamount: "400000", quantity: "500", copies: "500", order_date: "2023-11-06", delivery_date: "2023-11-20", claim_month: "2023-11", user_id: "U002", remarks: "Access移行データ" },
];

export function OrderManagement() {
  const [activeTab, setActiveTab] = useState<'v2' | 'old'>('v2');
  const [selectedOrderV2, setSelectedOrderV2] = useState<any>(null);
  const [selectedOrderOld, setSelectedOrderOld] = useState<any>(null);
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [riskAnalysisResult, setRiskAnalysisResult] = useState<Record<string, string>>({});

  const handleAnalyzeRisk = async (order: any) => {
    setIsAnalyzingRisk(true);
    try {
      const prompt = `以下の受注情報から、想定されるリスク（納期遅延、コスト超過、回収リスクなど）を分析し、対策を提案してください。\n顧客名: ${order.customer_name}\n案件名: ${order.item_name}\n受注金額: ${order.amount}円\n納期: ${order.delivery_date}\nステータス: ${order.status}\nメモ: ${order.memo}\n支払条件: ${order.payment_terms}`;
      const result = await analyzeWithHighThinkingAndSearch(prompt);
      setRiskAnalysisResult(prev => ({ ...prev, [order.id]: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case '入金待ち': return 'success';
      case '請求待ち': return 'info';
      case '作業完了待ち': return 'warning';
      case '作業指示入力待ち':
      case '作業指示承認待ち': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="bg-white w-full mt-6 p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900">受注管理</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Search size={16} className="mr-2"/>検索</Button>
          <Button variant="outline"><Filter size={16} className="mr-2"/>絞り込み</Button>
          <Button variant="outline"><Download size={16} className="mr-2"/>エクスポート</Button>
          <Button variant="primary"><Plus size={16} className="mr-2"/>新規受注</Button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 mb-4 whitespace-nowrap">
        <button 
          className={`px-4 py-2 font-bold text-sm transition-colors ${activeTab === 'v2' ? 'border-b-2 border-[#00a699] text-[#00a699]' : 'text-gray-500 hover:text-gray-800'}`}
          onClick={() => setActiveTab('v2')}
        >
          新システム (orders_v2: 2,565件)
        </button>
        <button 
          className={`px-4 py-2 font-bold text-sm transition-colors ${activeTab === 'old' ? 'border-b-2 border-[#00a699] text-[#00a699]' : 'text-gray-500 hover:text-gray-800'}`}
          onClick={() => setActiveTab('old')}
        >
          旧システム (orders: 35,710件)
        </button>
      </div>

      {activeTab === 'v2' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>受注No</TableHead>
              <TableHead>顧客名</TableHead>
              <TableHead>品名</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>変動費</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>受注日</TableHead>
              <TableHead>納期</TableHead>
              <TableHead>原価確定</TableHead>
              <TableHead>営業担当</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrdersV2.map(order => (
              <TableRow 
                key={order.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedOrderV2(order)}
              >
                <TableCell className="font-medium text-gray-600">{order.order_code}</TableCell>
                <TableCell className="font-bold text-gray-900">{order.customer_name}</TableCell>
                <TableCell className="text-gray-800 font-medium">{order.item_name}</TableCell>
                <TableCell className="font-bold text-gray-900">{order.amount.toLocaleString()} 円</TableCell>
                <TableCell className="text-gray-600">{order.variable_cost.toLocaleString()} 円</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(order.status) as any}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{order.order_date}</TableCell>
                <TableCell className="text-gray-600">{order.delivery_date}</TableCell>
                <TableCell>
                  {order.cost_confirmed ? <Badge variant="success">確定</Badge> : <Badge variant="outline">未確定</Badge>}
                </TableCell>
                <TableCell className="text-gray-800">{order.sales_rep}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>受注ID</TableHead>
              <TableHead>案件ID</TableHead>
              <TableHead>顧客名(client_custmer)</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>小計</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>部数</TableHead>
              <TableHead>受注日</TableHead>
              <TableHead>納期</TableHead>
              <TableHead>請求月</TableHead>
              <TableHead>担当者ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrdersOld.map(order => (
              <TableRow 
                key={order.row_uuid}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedOrderOld(order)}
              >
                <TableCell className="font-medium text-gray-600">{order.orders_id}</TableCell>
                <TableCell className="text-gray-600">{order.project_id}</TableCell>
                <TableCell className="font-bold text-gray-900">{order.client_custmer}</TableCell>
                <TableCell className="font-bold text-gray-900">{Number(order.amount).toLocaleString()} 円</TableCell>
                <TableCell className="text-gray-600">{Number(order.subamount).toLocaleString()} 円</TableCell>
                <TableCell className="text-gray-600">{order.quantity}</TableCell>
                <TableCell className="text-gray-600">{order.copies}</TableCell>
                <TableCell className="text-gray-600">{order.order_date}</TableCell>
                <TableCell className="text-gray-600">{order.delivery_date}</TableCell>
                <TableCell className="text-gray-600">{order.claim_month}</TableCell>
                <TableCell className="text-gray-600">{order.user_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 新システム (orders_v2) ドロワー */}
      <Drawer 
        isOpen={!!selectedOrderV2} 
        onClose={() => setSelectedOrderV2(null)}
        title={selectedOrderV2 ? `受注詳細 (新システム): ${selectedOrderV2.order_code}` : ""}
        width="w-full max-w-[800px]"
      >
        {selectedOrderV2 && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <ShoppingCart className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">基本情報</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">顧客名</span>
                  <span className="font-bold text-gray-900">{selectedOrderV2.customer_name}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">品名</span>
                  <span className="font-medium text-gray-900">{selectedOrderV2.item_name}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">金額</span>
                  <span className="font-bold text-gray-900">{selectedOrderV2.amount.toLocaleString()} 円</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">変動費</span>
                  <span className="font-medium text-gray-900">{selectedOrderV2.variable_cost.toLocaleString()} 円</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">ステータス</span>
                  <span><Badge variant={getStatusBadge(selectedOrderV2.status) as any}>{selectedOrderV2.status}</Badge></span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">原価確定</span>
                  <span>{selectedOrderV2.cost_confirmed ? <Badge variant="success">確定</Badge> : <Badge variant="outline">未確定</Badge>}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">受注日</span>
                  <span className="font-medium text-gray-900">{selectedOrderV2.order_date}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">納期</span>
                  <span className="font-medium text-gray-900">{selectedOrderV2.delivery_date}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">営業担当</span>
                  <span className="font-medium text-gray-900">{selectedOrderV2.sales_rep}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">支払条件</span>
                  <span className="font-medium text-gray-900">{selectedOrderV2.payment_terms}</span>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <div className="text-xs text-gray-500 mb-2 font-bold">メモ</div>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedOrderV2.memo}</p>
              </div>

              {/* AI Risk Analysis */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-red-700 font-bold flex items-center gap-1">
                    <Sparkles size={14} />
                    AI受注リスク分析
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs bg-white"
                    onClick={() => handleAnalyzeRisk(selectedOrderV2)}
                    disabled={isAnalyzingRisk}
                  >
                    {isAnalyzingRisk ? "分析中..." : "リスクをAIで分析"}
                  </Button>
                </div>
                {riskAnalysisResult[selectedOrderV2.id] ? (
                  <div className="markdown-body prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown>{riskAnalysisResult[selectedOrderV2.id]}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">「リスクをAIで分析」をクリックすると、納期やコストに関する潜在的なリスクを分析します。</p>
                )}
              </div>
            </section>
          </div>
        )}
      </Drawer>

      {/* 旧システム (orders) ドロワー */}
      <Drawer 
        isOpen={!!selectedOrderOld} 
        onClose={() => setSelectedOrderOld(null)}
        title={selectedOrderOld ? `受注詳細 (旧システム): ${selectedOrderOld.orders_id}` : ""}
        width="w-full max-w-[800px]"
      >
        {selectedOrderOld && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <FileText className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">Access移行データ詳細</h4>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4 text-sm text-yellow-800">
                注意: このデータは旧システム(Access)からの移行データであり、全カラムがtext型として保存されています。project_idには顧客名が格納されている場合があります。
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">案件ID (project_id)</span>
                  <span className="font-bold text-gray-900">{selectedOrderOld.project_id}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">顧客名 (client_custmer)</span>
                  <span className="font-bold text-gray-900">{selectedOrderOld.client_custmer}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">金額 (amount)</span>
                  <span className="font-bold text-gray-900">{Number(selectedOrderOld.amount).toLocaleString()} 円</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">小計 (subamount)</span>
                  <span className="font-medium text-gray-900">{Number(selectedOrderOld.subamount).toLocaleString()} 円</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">数量 (quantity)</span>
                  <span className="font-medium text-gray-900">{selectedOrderOld.quantity}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">部数 (copies)</span>
                  <span className="font-medium text-gray-900">{selectedOrderOld.copies}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">受注日 (order_date)</span>
                  <span className="font-medium text-gray-900">{selectedOrderOld.order_date}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">納期 (delivery_date)</span>
                  <span className="font-medium text-gray-900">{selectedOrderOld.delivery_date}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">請求月 (claim_month)</span>
                  <span className="font-medium text-gray-900">{selectedOrderOld.claim_month}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">担当者ID (user_id)</span>
                  <span className="font-medium text-gray-900">{selectedOrderOld.user_id}</span>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-2 font-bold">備考 (remarks)</div>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedOrderOld.remarks}</p>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
