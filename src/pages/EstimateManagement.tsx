import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Download, Plus, List } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Drawer } from "../components/ui/Drawer";

const mockEstimates = [
  { id: "EST-001", project_id: "100234", estimates_id: "E2311001", pattern_name: "会社案内パンフレット制作", total: "1500000", status: "1", order_flg: "1", delivery_date: "2023-12-01", create_date: "2023-11-01" },
  { id: "EST-002", project_id: "100235", estimates_id: "E2311002", pattern_name: "Webサイトリニューアル", total: "3200000", status: "0", order_flg: "0", delivery_date: "2024-01-15", create_date: "2023-11-02" },
  { id: "EST-003", project_id: "株式会社テスト", estimates_id: "E2311003", pattern_name: "展示会用ポスター・チラシ", total: "450000", status: "2", order_flg: "1", delivery_date: "2023-11-20", create_date: "2023-11-03" },
];

const mockEstimateDetails = [
  { id: "D1", record_no: "1", major_item: "企画・デザイン", medium_item: "表紙デザイン", detail: "A4 4P フルカラー", quantity: "1", unit_price: "150000", size: "A4", valiable_cost: "50000", margin: "100000", margin_rate: "66.6%", taxation_kbn: "課税" },
  { id: "D2", record_no: "2", major_item: "企画・デザイン", medium_item: "中面デザイン", detail: "フォーマット作成含む", quantity: "3", unit_price: "80000", size: "A4", valiable_cost: "80000", margin: "160000", margin_rate: "66.6%", taxation_kbn: "課税" },
  { id: "D3", record_no: "3", major_item: "印刷・製本", medium_item: "オフセット印刷", detail: "マットコート135kg", quantity: "1000", unit_price: "120", size: "A4", valiable_cost: "80000", margin: "40000", margin_rate: "33.3%", taxation_kbn: "課税" },
];

export function EstimateManagement() {
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case '0': return { label: '見積中', variant: 'info' as const };
      case '1': return { label: '受注待ち', variant: 'warning' as const };
      case '2': return { label: '完了/処理済', variant: 'outline' as const };
      default: return { label: '不明', variant: 'default' as const };
    }
  };

  return (
    <div className="bg-white w-full mt-6 p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900">見積管理 (38,365件)</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Search size={16} className="mr-2"/>検索</Button>
          <Button variant="outline"><Filter size={16} className="mr-2"/>絞り込み</Button>
          <Button variant="outline"><Download size={16} className="mr-2"/>エクスポート</Button>
          <Button variant="primary"><Plus size={16} className="mr-2"/>新規見積</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>見積番号</TableHead>
            <TableHead>顧客名/コード</TableHead>
            <TableHead>件名</TableHead>
            <TableHead>合計金額</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>受注フラグ</TableHead>
            <TableHead>納期</TableHead>
            <TableHead>作成日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockEstimates.map(est => {
            const statusInfo = getStatusBadge(est.status);
            return (
              <TableRow 
                key={est.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedEstimate(est)}
              >
                <TableCell className="font-medium text-gray-600">{est.estimates_id}</TableCell>
                <TableCell className="font-bold text-gray-900">{est.project_id}</TableCell>
                <TableCell className="text-[#00a699] font-bold">{est.pattern_name}</TableCell>
                <TableCell className="font-bold text-gray-900">{Number(est.total).toLocaleString()} 円</TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {est.order_flg === '1' ? (
                    <Badge variant="success">受注済</Badge>
                  ) : (
                    <Badge variant="outline">未受注</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">{est.delivery_date}</TableCell>
                <TableCell className="text-gray-600">{est.create_date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Drawer 
        isOpen={!!selectedEstimate} 
        onClose={() => setSelectedEstimate(null)}
        title={selectedEstimate ? `見積詳細: ${selectedEstimate.estimates_id}` : ""}
        width="w-full max-w-[1000px]"
      >
        {selectedEstimate && (
          <div className="space-y-8">
            {/* 見積ヘッダ情報 */}
            <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">{selectedEstimate.pattern_name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs mb-1">顧客名/コード (project_id)</div>
                  <div className="font-bold text-gray-900">{selectedEstimate.project_id}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">合計金額 (total)</div>
                  <div className="font-bold text-gray-900 text-lg">{Number(selectedEstimate.total).toLocaleString()} 円</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">納期 (delivery_date)</div>
                  <div className="font-medium text-gray-900">{selectedEstimate.delivery_date}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">ステータス</div>
                  <Badge variant={getStatusBadge(selectedEstimate.status).variant}>{getStatusBadge(selectedEstimate.status).label}</Badge>
                </div>
              </div>
            </section>

            {/* 見積明細 (estimate_details) */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <List className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">見積明細 (estimate_details)</h4>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[50px]">行</TableHead>
                      <TableHead>大項目</TableHead>
                      <TableHead>中項目</TableHead>
                      <TableHead>明細</TableHead>
                      <TableHead className="text-right">数量</TableHead>
                      <TableHead className="text-right">単価</TableHead>
                      <TableHead className="text-right">変動費</TableHead>
                      <TableHead className="text-right">粗利</TableHead>
                      <TableHead className="text-right">粗利率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEstimateDetails.map(detail => (
                      <TableRow key={detail.id}>
                        <TableCell className="text-gray-500 text-center">{detail.record_no}</TableCell>
                        <TableCell className="font-medium text-gray-800">{detail.major_item}</TableCell>
                        <TableCell className="text-gray-600">{detail.medium_item}</TableCell>
                        <TableCell className="text-gray-600 text-xs">{detail.detail}</TableCell>
                        <TableCell className="text-right font-medium">{detail.quantity}</TableCell>
                        <TableCell className="text-right text-gray-600">{Number(detail.unit_price).toLocaleString()}</TableCell>
                        <TableCell className="text-right text-gray-600">{Number(detail.valiable_cost).toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-gray-900">{Number(detail.margin).toLocaleString()}</TableCell>
                        <TableCell className="text-right text-[#00a699] font-bold">{detail.margin_rate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
