import { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function AIInsights() {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const prompt = `
          あなたは金融プラットフォームの優秀なAI監視アシスタントです。
          以下の直近のトランザクション状況を分析し、管理者向けにセキュリティや資金フローに関するインサイト（気づきや警告）を1段落（100文字程度）で提供してください。
          
          【現在の状況】
          - 総トランザクション: 124件
          - AIリスク検知: 2件の不審な入金（自動ブロック済み）
          - 大口資金移動: JPYの大口移動が複数発生中
          - 全体的なシステムステータス: 正常
          
          出力はマークダウンを使わず、プレーンテキストでお願いします。
        `;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        setInsight(response.text || 'インサイトを生成できませんでした。');
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
        setInsight('AIインサイトの取得に失敗しました。APIキーの設定を確認してください。');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white border border-[#00a699]/30 rounded-md p-4 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,166,153,0.06)] overflow-hidden group"
    >
      {/* Animated background glow */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00a699] to-blue-400"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00a699]/0 via-[#00a699]/5 to-[#00a699]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-lg pointer-events-none"></div>
      
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#00a699]/10 text-[#00a699] shrink-0 mt-0.5">
        <Sparkles size={16} strokeWidth={1.5} className={loading ? "animate-spin" : "animate-pulse"} />
      </div>
      
      <div className="relative flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[13px] font-bold text-gray-800 flex items-center gap-2">
            AI Transaction Analysis
            {loading && (
              <span className="flex items-center gap-1 text-[10px] text-[#00a699] bg-[#00a699]/10 px-2 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a699] animate-ping"></span>
                Analyzing...
              </span>
            )}
          </h3>
          {!loading && (
            <div className="flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
              <ShieldCheck size={12} />
              System Secure
            </div>
          )}
        </div>
        
        <div className="text-[14px] text-gray-800 font-medium leading-relaxed min-h-[38px]">
          {loading ? (
            <div className="space-y-2 mt-2">
              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-3/4"></div>
              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {insight}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
