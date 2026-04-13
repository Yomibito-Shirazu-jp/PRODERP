import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Download, Plus, FileText, TrendingUp, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Drawer } from "../components/ui/Drawer";

const mockCustomers = [
  { id: "1", customer_code: "C0001", customer_name: "株式会社アルファ", customer_name_kana: "カブシキガイシャアルファ", customer_rank: "S", phone_number: "03-1234-5678", fax: "03-1234-5679", address_1: "東京都渋谷区...", customer_division: "119", sales_type: "既存", representative_title: "代表取締役", created_at: "2023-11-01 10:00:00" },
  { id: "2", customer_code: "C0002", customer_name: "ベータ商事", customer_name_kana: "ベータショウジ", customer_rank: "A", phone_number: "06-9876-5432", fax: "06-9876-5433", address_1: "大阪府大阪市...", customer_division: "128", sales_type: "新規", representative_title: "社長", created_at: "2023-11-02 14:30:00" },
  { id: "3", customer_code: "C0003", customer_name: "ガンマ工業株式会社", customer_name_kana: "ガンマコウギョウ", customer_rank: "", phone_number: "092-111-2222", fax: "", address_1: "福岡県福岡市...", customer_division: "119", sales_type: "既存", representative_title: "", created_at: "2023-11-03 09:15:00" },
];

const mockCustomerInfo = {
  pq: "15,000,000", vq: "5,000,000", mq: "10,000,000", m_rate: "66.6%",
  key_person: "山田 太郎 (購買部長)", main_products: "会社案内、カタログ",
  competitors: "A社、B印刷", needs: "コスト削減、短納期化",
  growth_potential: "高", sales_goal: "20,000,000",
  accident_history: "2022/05: 納品遅延", customer_voice: "レスポンスが早くて助かる"
};

const mockSalesRanking = [
  { month: "6月", sales: 1200000 }, { month: "7月", sales: 1500000 },
  { month: "8月", sales: 900000 }, { month: "9月", sales: 2100000 },
  { month: "10月", sales: 1800000 }, { month: "11月", sales: 2500000 },
];

export function CustomerManagement() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <div className="bg-white w-full mt-6 p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900">顧客管理 (3,026件)</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Search size={16} className="mr-2"/>検索</Button>
          <Button variant="outline"><Filter size={16} className="mr-2"/>絞り込み</Button>
          <Button variant="outline"><Download size={16} className="mr-2"/>エクスポート</Button>
          <Button variant="primary"><Plus size={16} className="mr-2"/>新規顧客</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>顧客コード</TableHead>
            <TableHead>顧客名</TableHead>
            <TableHead>顧客名カナ</TableHead>
            <TableHead>ランク</TableHead>
            <TableHead>電話 / FAX</TableHead>
            <TableHead>住所</TableHead>
            <TableHead>顧客区分</TableHead>
            <TableHead>営業区分</TableHead>
            <TableHead>代表者役職</TableHead>
            <TableHead>作成日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCustomers.map(customer => (
            <TableRow 
              key={customer.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedCustomer(customer)}
            >
              <TableCell className="font-medium text-gray-600">{customer.customer_code}</TableCell>
              <TableCell className="font-bold text-[#00a699]">{customer.customer_name}</TableCell>
              <TableCell className="text-gray-600 text-[12px]">{customer.customer_name_kana}</TableCell>
              <TableCell>
                {customer.customer_rank ? (
                  <Badge variant={
                    customer.customer_rank === 'S' ? 'success' : 
                    customer.customer_rank === 'A' ? 'info' : 
                    customer.customer_rank === 'B' ? 'warning' : 'default'
                  }>
                    {customer.customer_rank}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-xs">未設定</span>
                )}
              </TableCell>
              <TableCell className="text-gray-600">
                <div>{customer.phone_number}</div>
                {customer.fax && <div className="text-[11px] text-gray-400">FAX: {customer.fax}</div>}
              </TableCell>
              <TableCell className="text-gray-800 font-medium truncate max-w-[150px]">{customer.address_1}</TableCell>
              <TableCell className="text-gray-600">{customer.customer_division}</TableCell>
              <TableCell className="text-gray-600">{customer.sales_type}</TableCell>
              <TableCell className="text-gray-600">{customer.representative_title}</TableCell>
              <TableCell className="text-gray-600 text-[12px]">{customer.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer 
        isOpen={!!selectedCustomer} 
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? `${selectedCustomer.customer_name} の詳細` : ""}
        width="w-full md:w-[900px] max-w-full"
      >
        {selectedCustomer && (
          <div className="space-y-8">
            {/* 顧客カルテ (customers_info) */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <FileText className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">顧客カルテ (customers_info)</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">PQ (売上)</div>
                  <div className="font-bold text-gray-900">{mockCustomerInfo.pq}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">VQ (変動費)</div>
                  <div className="font-bold text-gray-900">{mockCustomerInfo.vq}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">MQ (粗利)</div>
                  <div className="font-bold text-gray-900">{mockCustomerInfo.mq}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">M率 (粗利率)</div>
                  <div className="font-bold text-[#00a699]">{mockCustomerInfo.m_rate}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">キーパーソン</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.key_person}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">主力商品</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.main_products}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">競合</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.competitors}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">ニーズ</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.needs}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">成長性</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.growth_potential}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">売上目標</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.sales_goal}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">事故歴</span>
                  <span className="font-medium text-red-600">{mockCustomerInfo.accident_history}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-xs mb-1">顧客の声</span>
                  <span className="font-medium text-gray-900">{mockCustomerInfo.customer_voice}</span>
                </div>
              </div>
            </section>

            {/* 月別売上 (customer_sales_ranking) */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <TrendingUp className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">月別売上ランキング (customer_sales_ranking)</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-gray-700">部門: 営業1部 / 担当: 佐藤</div>
                  <Badge variant="info">順位: 12位</Badge>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {mockSalesRanking.map((data, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[80px] bg-white p-2 rounded border border-gray-100 shadow-sm">
                      <span className="text-xs text-gray-500">{data.month}</span>
                      <span className="font-bold text-gray-900 text-sm mt-1">
                        {(data.sales / 10000).toFixed(0)}万
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center min-w-[100px] bg-[#00a699]/10 p-2 rounded border border-[#00a699]/20">
                    <span className="text-xs text-[#00a699] font-bold">合計</span>
                    <span className="font-bold text-[#00a699] text-sm mt-1">
                      1,000万
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
