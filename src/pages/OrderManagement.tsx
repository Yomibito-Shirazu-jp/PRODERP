import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Download, Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";

const mockOrdersV2 = [
  { id: "1", order_code: "ORD-000001", customer_name: "株式会社アルファ", item_name: "会社案内パンフレット制作", amount: 1500000, variable_cost: 500000, status: "入金待ち", order_date: "2023-11-05", delivery_date: "2023-12-01", cost_confirmed: true, sales_rep: "田中" },
  { id: "2", order_code: "ORD-000002", customer_name: "ガンマ工業株式会社", item_name: "展示会用ポスター・チラシ", amount: 450000, variable_cost: 150000, status: "作業完了待ち", order_date: "2023-11-06", delivery_date: "2023-11-20", cost_confirmed: false, sales_rep: "佐藤" },
  { id: "3", order_code: "ORD-000003", customer_name: "株式会社ゼータ", item_name: "製品カタログ 2024年版", amount: 2100000, variable_cost: 800000, status: "請求待ち", order_date: "2023-11-07", delivery_date: "2024-02-28", cost_confirmed: true, sales_rep: "鈴木" },
];

const mockOrdersOld = [
  { row_uuid: "1", orders_id: "O2311001", project_id: "100234", client_custmer: "秦野様", amount: "1500000", subamount: "1350000", quantity: "1000", copies: "1000", order_date: "2023-11-05", delivery_date: "2023-12-01", claim_month: "2023-12", user_id: "U001" },
  { row_uuid: "2", orders_id: "O2311002", project_id: "100235", client_custmer: "田中様", amount: "450000", subamount: "400000", quantity: "500", copies: "500", order_date: "2023-11-06", delivery_date: "2023-11-20", claim_month: "2023-11", user_id: "U002" },
];

export function OrderManagement() {
  const [activeTab, setActiveTab] = useState<'v2' | 'old'>('v2');

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
              <TableRow key={order.id}>
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
              <TableRow key={order.row_uuid}>
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
    </div>
  );
}
