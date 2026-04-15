import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Download, Plus, MessageSquare, Globe, Tag, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Drawer } from "../components/ui/Drawer";
import { analyzeWithHighThinkingAndSearch } from "../lib/gemini";
import ReactMarkdown from "react-markdown";

const mockLeads = [
  { 
    id: "1", company: "株式会社AGE technologies", name: "田中太郎", status: "新規", email: "tanaka@example.com", phone: "03-1234-5678", inquiry_type: "新規導入", source: "website", created_at: "2023-11-01 10:00:00", 
    message: "御社のサービスについて詳しくお話を伺いたいです。特に見積管理機能に興味があります。", tags: ["BtoB", "急ぎ"],
    assignee_id: "鈴木 一郎", ai_investigation: "SaaS事業を展開。直近で資金調達を実施しており、バックオフィスDXへの投資意欲が高いと推測される。", info_sales_activity: "11/2: 初回架電、不在。11/4: 再架電予定。",
    city: "渋谷区", region: "東京都", budget: "100万〜300万", timeline: "3ヶ月以内", employees: "50-100名"
  },
  { 
    id: "2", company: "ベータ商事", name: "佐藤 花子", status: "コンタクト済", email: "sato@beta.example.com", phone: "06-9876-5432", inquiry_type: "資料請求", source: "website_form", created_at: "2023-11-02 14:30:00", 
    message: "最新のパンフレットを送付してください。", tags: ["資料請求"],
    assignee_id: "佐藤 健太", ai_investigation: "老舗の専門商社。アナログな業務フローが残っている可能性あり。", info_sales_activity: "11/3: 資料送付済み。1週間後にフォローアップ予定。",
    city: "大阪市", region: "大阪府", budget: "未定", timeline: "未定", employees: "100-300名"
  },
  { 
    id: "3", company: "ガンマ工業株式会社", name: "鈴木 一郎", status: "見込みあり", email: "suzuki@gamma.example.com", phone: "092-111-2222", inquiry_type: "見積依頼", source: "PDF分析", created_at: "2023-11-03 09:15:00", 
    message: "添付の仕様で見積もりをお願いします。", tags: ["見積依頼", "大口"],
    assignee_id: "高橋 美咲", ai_investigation: "製造業。工場向けのシステム導入実績あり。", info_sales_activity: "11/4: 見積作成中。11/6に提出予定。",
    city: "福岡市", region: "福岡県", budget: "500万以上", timeline: "1ヶ月以内", employees: "300名以上"
  },
];

const mockWebAnalytics = {
  ip_address: "192.168.1.1", device_type: "Desktop", landing_page_url: "https://example.com/lp/sales",
  referrer: "https://google.com", utm_source: "google", utm_medium: "cpc", utm_campaign: "autumn_sale",
  is_first_visit: "1", visit_count: "3", time_on_page: "120", browser_name: "Chrome", os_name: "Windows"
};

export function LeadManagement() {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<Record<string, string>>({});

  const handleAnalyze = async (companyName: string, id: string) => {
    setIsAnalyzing(true);
    try {
      const prompt = `${companyName} について、Google検索を用いて最新の企業情報、最近のニュース、および営業アプローチの提案をまとめてください。`;
      const result = await analyzeWithHighThinkingAndSearch(prompt);
      setAiAnalysisResult(prev => ({ ...prev, [id]: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case '新規': return 'info';
      case 'コンタクト済': return 'warning';
      case '見込みあり': return 'success';
      case '見込みなし': return 'danger';
      case 'コンバート済': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="bg-white w-full mt-6 p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900">リード管理 (111件)</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Search size={16} className="mr-2"/>検索</Button>
          <Button variant="outline"><Filter size={16} className="mr-2"/>絞り込み</Button>
          <Button variant="outline"><Download size={16} className="mr-2"/>エクスポート</Button>
          <Button variant="primary"><Plus size={16} className="mr-2"/>新規リード</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>会社名</TableHead>
            <TableHead>担当者名</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>メール</TableHead>
            <TableHead>電話</TableHead>
            <TableHead>問合せ種別</TableHead>
            <TableHead>流入元</TableHead>
            <TableHead>作成日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLeads.map(lead => (
            <TableRow 
              key={lead.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedLead(lead)}
            >
              <TableCell className="font-bold text-[#00a699]">{lead.company}</TableCell>
              <TableCell className="font-medium text-gray-800">{lead.name}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadge(lead.status) as any}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">{lead.email}</TableCell>
              <TableCell className="text-gray-600">{lead.phone}</TableCell>
              <TableCell className="text-gray-800">{lead.inquiry_type}</TableCell>
              <TableCell className="text-gray-600">{lead.source}</TableCell>
              <TableCell className="text-gray-600">{lead.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? `リード詳細: ${selectedLead.company}` : ""}
        width="w-full max-w-[700px]"
      >
        {selectedLead && (
          <div className="space-y-8">
            {/* 基本情報 */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <MessageSquare className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">問合せ内容・基本情報</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">担当者(社内)</div>
                  <div className="font-bold text-gray-900">{selectedLead.assignee_id || "未設定"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">予算</div>
                  <div className="font-bold text-gray-900">{selectedLead.budget || "未設定"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">導入時期</div>
                  <div className="font-bold text-gray-900">{selectedLead.timeline || "未設定"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">従業員数</div>
                  <div className="font-bold text-gray-900">{selectedLead.employees || "未設定"}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <div className="text-xs text-gray-500 mb-2 font-bold">問合せメッセージ</div>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedLead.message}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-blue-600 font-bold flex items-center gap-1">
                    <Sparkles size={14} />
                    AI企業調査結果
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs bg-white"
                    onClick={() => handleAnalyze(selectedLead.company, selectedLead.id)}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "調査中..." : "最新情報をAIで調査"}
                  </Button>
                </div>
                {aiAnalysisResult[selectedLead.id] ? (
                  <div className="markdown-body prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown>{aiAnalysisResult[selectedLead.id]}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedLead.ai_investigation}</p>
                )}
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4">
                <div className="text-xs text-yellow-600 mb-2 font-bold">営業メモ</div>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedLead.info_sales_activity}</p>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                <div className="flex gap-2">
                  {selectedLead.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </section>

            {/* Web解析カラム */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <Globe className="text-[#00a699]" size={20} />
                <h4 className="text-lg font-bold text-gray-900">Web解析データ</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">地域 (都道府県 / 市区町村)</span>
                  <span className="font-medium text-gray-900">{selectedLead.region} / {selectedLead.city}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">ランディングページ</span>
                  <span className="font-medium text-gray-900 truncate" title={mockWebAnalytics.landing_page_url}>
                    {mockWebAnalytics.landing_page_url}
                  </span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">リファラ</span>
                  <span className="font-medium text-gray-900">{mockWebAnalytics.referrer}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">UTMソース / メディア</span>
                  <span className="font-medium text-gray-900">
                    {mockWebAnalytics.utm_source} / {mockWebAnalytics.utm_medium}
                  </span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">UTMキャンペーン</span>
                  <span className="font-medium text-gray-900">{mockWebAnalytics.utm_campaign}</span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">デバイス / OS / ブラウザ</span>
                  <span className="font-medium text-gray-900">
                    {mockWebAnalytics.device_type} / {mockWebAnalytics.os_name} / {mockWebAnalytics.browser_name}
                  </span>
                </div>
                <div className="flex flex-col border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs mb-1">訪問回数 / 滞在時間</span>
                  <span className="font-medium text-gray-900">
                    {mockWebAnalytics.visit_count}回 / {mockWebAnalytics.time_on_page}秒
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
