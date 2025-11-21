
import React, { useState, useCallback } from 'react';
import { PrintRequest, AppView } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import TeacherForm from './components/TeacherForm';
import StaffView from './components/StaffView';
import PrintableView from './components/PrintableView';

function App() {
  const [view, setView] = useState<AppView>(AppView.TEACHER);
  const [requests, setRequests] = useLocalStorage<PrintRequest[]>('printRequests', []);
  const [selectedRequest, setSelectedRequest] = useState<PrintRequest | null>(null);

  const addRequest = (request: PrintRequest) => {
    setRequests(prev => [...prev, request]);
    setSelectedRequest(request);
    setView(AppView.PRINT);
  };

  const updateRequest = useCallback((updatedRequest: PrintRequest) => {
    setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
  }, [setRequests]);

  const handleBack = () => {
    setSelectedRequest(null);
    setView(AppView.TEACHER);
  };

  const renderView = () => {
    switch(view) {
      case AppView.TEACHER:
        return <TeacherForm onSubmit={addRequest} />;
      case AppView.STAFF:
        return <StaffView requests={requests} updateRequest={updateRequest} />;
      case AppView.PRINT:
        return selectedRequest && <PrintableView request={selectedRequest} onBack={handleBack} />;
      default:
        return <TeacherForm onSubmit={addRequest} />;
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <Header currentView={view} setView={setView} setSelectedRequest={setSelectedRequest} />
      <main className="p-4 sm:p-6 md:p-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
