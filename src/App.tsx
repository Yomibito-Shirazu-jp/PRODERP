import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { TaskTable } from "./components/TaskTable";
import { AIInsights } from "./components/AIInsights";

// Import new pages
import { LeadManagement } from "./pages/LeadManagement";
import { EstimateManagement } from "./pages/EstimateManagement";
import { OrderManagement } from "./pages/OrderManagement";
import { CustomerManagement } from "./pages/CustomerManagement";

function TemplatePage({ title }: { title: string }) {
  return (
    <div className="bg-white w-full mt-6 p-4 md:p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 font-medium">このページは現在テンプレートとして準備中です。</p>
      <button className="mt-6 px-4 py-2 bg-[#00a699]/10 text-[#00a699] font-bold rounded-md hover:bg-[#00a699]/20 transition-colors">
        開発リクエストを送る
      </button>
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("リード管理");

  return (
    <div className="flex min-h-screen bg-[#f4f6f8] font-sans text-gray-900 font-medium">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header onMenuClick={() => setIsSidebarOpen(true)} title={currentPage} />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="w-full">
            {currentPage === "買掛管理" ? (
              <>
                <AIInsights />
                <TaskTable />
              </>
            ) : currentPage === "リード管理" ? (
              <LeadManagement />
            ) : currentPage === "見積管理" ? (
              <EstimateManagement />
            ) : currentPage === "受注管理" ? (
              <OrderManagement />
            ) : currentPage === "顧客管理" ? (
              <CustomerManagement />
            ) : (
              <TemplatePage title={currentPage} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
