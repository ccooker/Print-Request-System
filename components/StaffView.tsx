import React, { useState, useEffect } from 'react';
import { PrintRequest } from '../types';
import CameraCapture from './CameraCapture';
import BarcodeScanner from './BarcodeScanner';
import { PrintIcon, CheckCircleIcon, CameraIcon, BarcodeScanIcon, ExportIcon } from './icons';

interface StaffViewProps {
  requests: PrintRequest[];
  updateRequest: (request: PrintRequest) => void;
}

const StaffView: React.FC<StaffViewProps> = ({ requests, updateRequest }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PrintRequest | null>(null);
  const [message, setMessage] = useState('');
  const [isCapturing, setIsCapturing] = useState<'before' | 'after' | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (searchId) {
      const foundRequest = requests.find(r => r.id === searchId);
      if (foundRequest) {
        setSelectedRequest(foundRequest);
        setMessage('');
      } else {
        setSelectedRequest(null);
        setMessage('Request ID not found.');
      }
    } else {
      setSelectedRequest(null);
      setMessage('');
    }
  }, [searchId, requests]);

  const handleUpdate = (field: keyof PrintRequest, value: any) => {
    if (selectedRequest) {
      const updated: PrintRequest = { ...selectedRequest, [field]: value };
      setSelectedRequest(updated);
      updateRequest(updated);
    }
  };

  const handleCapture = (dataUrl: string) => {
    if (isCapturing === 'before') {
      handleUpdate('meterPhotoBefore', dataUrl);
      handleUpdate('status', 'In Progress');
    } else if (isCapturing === 'after') {
      handleUpdate('meterPhotoAfter', dataUrl);
    }
    setIsCapturing(null);
  };
  
  const completeJob = () => {
     handleUpdate('status', 'Completed');
     setMessage('Job marked as complete!');
     setTimeout(() => {
        setSearchId('');
        setSelectedRequest(null);
        setMessage('');
     }, 2000);
  }

  const handleExport = () => {
    if (requests.length === 0) {
      alert("No requests to export.");
      return;
    }
  
    const headers = [
      'ID', 'Status', 'SubmissionDate', 'CollectionDate', 'Teacher', 'Subject', 
      'Class', 'OriginalPages', 'RequestedCopies', 'TotalPrintedPages', 
      'AdjustedCopies', 'StaffRemarks', 'RicohPages', 'ToshibaPages', 
      'Stapling', 'PaperType', 'Sided', 'TeacherRemarks'
    ];
  
    const rows = requests.map(req => {
      const totalCopies = req.classRequests.reduce((sum, r) => sum + r.noOfCopies, 0);
      const rowData = [
        req.id,
        req.status,
        req.dateOfSubmission,
        req.dateOfCollection,
        req.teacherInCharge,
        req.subject,
        req.class,
        req.noOfPagesOriginal,
        totalCopies,
        req.totalPrintedPages,
        req.adjustedCopies ?? '',
        req.staffRemarks ?? '',
        req.ricohPages ?? '',
        req.toshibaPages ?? '',
        req.stapling ? 'Yes' : 'No',
        req.whitePaper ? 'White' : 'Newsprint',
        !req.singleSided ? 'Double' : 'Single',
        req.remarks ?? ''
      ];
      return rowData.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
    });
  
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `printing_requests_${date}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Printing Staff Dashboard</h1>
            <button
                onClick={handleExport}
                className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                aria-label="Export all requests to CSV"
            >
                <ExportIcon />
                <span>Export All to CSV</span>
            </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Scan or enter barcode ID..."
            className="flex-grow px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={() => setIsScanning(true)} 
            className="bg-blue-500 text-white px-3 rounded-md hover:bg-blue-600 flex items-center space-x-2"
            aria-label="Scan Barcode"
          >
            <BarcodeScanIcon />
          </button>
          <button onClick={() => setSearchId('')} className="bg-slate-200 px-4 rounded-md hover:bg-slate-300">Clear</button>
        </div>
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>

      {selectedRequest && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg animate-fade-in">
          <h2 className="text-xl font-bold mb-1">Request Details (ID: {selectedRequest.id})</h2>
          <p className={`font-bold ${selectedRequest.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>{selectedRequest.status}</p>
          
          <div className="mt-4 border-t pt-4 grid md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Teacher:</span> {selectedRequest.teacherInCharge}</div>
            <div><span className="font-semibold">Subject:</span> {selectedRequest.subject}</div>
            <div><span className="font-semibold">Original Pages:</span> {selectedRequest.noOfPagesOriginal}</div>
            <div><span className="font-semibold">Total Copies:</span> {selectedRequest.classRequests.reduce((s,c) => s+c.noOfCopies, 0)}</div>
            <div><span className="font-semibold">Total Printed:</span> {selectedRequest.totalPrintedPages}</div>
            <div><span className="font-semibold">Paper:</span> {selectedRequest.whitePaper ? 'White' : 'Newsprint'}</div>
            <div className="md:col-span-2"><span className="font-semibold">Finishing:</span> {selectedRequest.stapling ? 'Stapled' : 'Not Stapled'}, {selectedRequest.singleSided ? 'Single-Sided' : 'Double-Sided'}</div>
            {(selectedRequest.ricohPages || selectedRequest.toshibaPages) ? (
                <div className="md:col-span-2"><span className="font-semibold">Machine Usage:</span> 
                    {selectedRequest.ricohPages ? ` Ricoh (${selectedRequest.ricohPages} pages)` : ''}
                    {selectedRequest.ricohPages && selectedRequest.toshibaPages ? ' | ' : ''}
                    {selectedRequest.toshibaPages ? ` Toshiba (${selectedRequest.toshibaPages} pages)` : ''}
                </div>
            ) : null}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Workflow</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Meter Photo Before */}
              <div className="flex flex-col items-center space-y-2 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold">1. Meter Before Printing</h4>
                {selectedRequest.meterPhotoBefore ? (
                  <img src={selectedRequest.meterPhotoBefore} alt="Printer meter before" className="w-full rounded-md shadow-sm" />
                ) : (
                  <button onClick={() => setIsCapturing('before')} className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <CameraIcon /><span>Take Photo</span>
                  </button>
                )}
              </div>
              
              {/* Meter Photo After */}
               <div className="flex flex-col items-center space-y-2 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold">3. Meter After Printing</h4>
                {selectedRequest.meterPhotoAfter ? (
                  <img src={selectedRequest.meterPhotoAfter} alt="Printer meter after" className="w-full rounded-md shadow-sm" />
                ) : (
                  <button disabled={!selectedRequest.meterPhotoBefore} onClick={() => setIsCapturing('after')} className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                     <CameraIcon /><span>Take Photo</span>
                  </button>
                )}
              </div>
              
               {/* Adjustments */}
               <div className="md:col-span-2 p-4 bg-slate-50 rounded-lg space-y-4">
                  <h4 className="font-semibold text-center">2. Adjustments & Remarks</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                       <div>
                            <label htmlFor="adjustedCopies" className="block text-sm font-medium text-slate-700">Adjusted Total Copies</label>
                            <input
                                id="adjustedCopies"
                                type="number"
                                placeholder="If different from request..."
                                value={selectedRequest.adjustedCopies || ''}
                                onChange={(e) => handleUpdate('adjustedCopies', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="staffRemarks" className="block text-sm font-medium text-slate-700">Staff Remarks</label>
                            <input
                                id="staffRemarks"
                                type="text"
                                placeholder="e.g., paper jam, toner low"
                                value={selectedRequest.staffRemarks || ''}
                                onChange={(e) => handleUpdate('staffRemarks', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="ricohPages" className="block text-sm font-medium text-slate-700">Pages on Ricoh</label>
                            <input
                                id="ricohPages"
                                type="number"
                                placeholder="e.g., 150"
                                value={selectedRequest.ricohPages || ''}
                                onChange={(e) => handleUpdate('ricohPages', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="toshibaPages" className="block text-sm font-medium text-slate-700">Pages on Toshiba</label>
                            <input
                                id="toshibaPages"
                                type="number"
                                placeholder="e.g., 170"
                                value={selectedRequest.toshibaPages || ''}
                                onChange={(e) => handleUpdate('toshibaPages', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                  </div>
               </div>
            </div>
            
             <div className="mt-6 border-t pt-4 text-center">
                 <button 
                    disabled={!selectedRequest.meterPhotoBefore || !selectedRequest.meterPhotoAfter}
                    onClick={completeJob}
                    className="w-full md:w-auto flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed text-lg">
                    <CheckCircleIcon />
                    <span>Mark Job as Complete</span>
                </button>
            </div>
          </div>
        </div>
      )}

      {isCapturing && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setIsCapturing(null)}
        />
      )}

      {isScanning && (
        <BarcodeScanner
          onScan={(scannedId) => {
            setSearchId(scannedId);
            setIsScanning(false);
          }}
          onClose={() => setIsScanning(false)}
        />
      )}
    </div>
  );
};

export default StaffView;