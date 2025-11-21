
import React from 'react';
import { PrintRequest } from '../types';

interface PrintableViewProps {
  request: PrintRequest;
  onBack: () => void;
}

// Simple component to simulate a barcode
const Barcode: React.FC<{ text: string }> = ({ text }) => {
    const bars = text.split('').map((char, i) => {
        const width = (char.charCodeAt(0) % 4) + 1; // pseudo-random width 1-4
        return <div key={i} className="bg-black" style={{ width: `${width}px`, height: '50px' }}></div>;
    });
    return (
        <div className="flex items-end space-x-px" aria-label={`Barcode for ${text}`}>
            {bars}
        </div>
    );
};


const PrintableView: React.FC<PrintableViewProps> = ({ request, onBack }) => {
  
  const totalCopies = request.classRequests.reduce((sum, req) => sum + req.noOfCopies, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg mb-4" id="print-section">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">St. Paul's Convent School</h1>
                    <h2 className="text-xl text-slate-600">Stationery & Printing</h2>
                </div>
                <div className="text-right">
                    <p className="font-mono text-sm">Form T1</p>
                    <Barcode text={request.id} />
                    <p className="text-xs font-mono tracking-wider mt-1">{request.id}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <p><span className="font-semibold w-48 inline-block">Class 班別:</span> {request.class}</p>
                <p><span className="font-semibold w-48 inline-block">Subject 科目:</span> {request.subject}</p>
                <p><span className="font-semibold w-48 inline-block">Teacher-in-charge 姓名:</span> {request.teacherInCharge}</p>
                <p><span className="font-semibold w-48 inline-block"></span></p>
                <p><span className="font-semibold w-48 inline-block">Date of submission 交件日期:</span> {request.dateOfSubmission}</p>
                <p><span className="font-semibold w-48 inline-block">Date of collection 取件日期:</span> {request.dateOfCollection}</p>
            </div>

            <div className="mt-6 pt-4 border-t">
                <h3 className="font-bold text-lg mb-2 underline">Details 影印細節</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <p><span className="font-semibold w-48 inline-block">No. of pages of original copy:</span> {request.noOfPagesOriginal}</p>
                    <p><span className="font-semibold w-48 inline-block">No. of copies 影印份數:</span> {totalCopies}</p>
                    <p><span className="font-semibold w-48 inline-block">Total No. of printed pages:</span> {request.totalPrintedPages}</p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t">
                <h3 className="font-bold text-lg mb-2 underline">Other request 其他要求</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <p>{request.singleSided ? '☑ Single-sided' : '☐ Single-sided'}</p>
                    <p>{!request.singleSided ? '☑ Double-sided' : '☐ Double-sided'}</p>
                    <p>{request.stapling ? '☑ Stapling' : '☐ Stapling'}</p>
                    <p>{!request.stapling ? '☑ No stapling' : '☐ No stapling'}</p>
                    <p>{request.whitePaper ? '☑ White paper' : '☐ White paper'}</p>
                    <p>{!request.whitePaper ? '☑ Newsprint paper' : '☐ Newsprint paper'}</p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t flex">
                <div className="w-1/2 pr-4">
                    <p className="font-semibold">Remarks:</p>
                    <p className="h-12">{request.remarks}</p>
                    <p className="mt-8"><span className="font-semibold">Signed by 簽名:</span></p>
                    <p className="font-serif text-lg h-12">{request.signature}</p>
                    <p>Signature of Teacher</p>
                </div>
                <div className="w-1/2 pl-4 border-l">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2">Form</th>
                                <th className="border p-2">Class</th>
                                <th className="border p-2">No of copies</th>
                                <th className="border p-2">Teacher in Charge</th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.classRequests.map(cr => (
                                <tr key={cr.id}>
                                    <td className="border p-2">{cr.form}</td>
                                    <td className="border p-2">{cr.className}</td>
                                    <td className="border p-2">{cr.noOfCopies}</td>
                                    <td className="border p-2">{cr.teacherInCharge}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <p className="text-xs text-slate-400 mt-8">(Revised in Feb 2021)</p>
        </div>

        <div className="text-center space-x-4 no-print">
            <button onClick={onBack} className="bg-slate-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-600 transition-colors">
                Back to Form
            </button>
            <button onClick={handlePrint} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Print
            </button>
        </div>
    </div>
  );
};

export default PrintableView;
