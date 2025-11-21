
import React, { useState, useMemo } from 'react';
import { PrintRequest, ClassRequest } from '../types';

interface TeacherFormProps {
    onSubmit: (request: PrintRequest) => void;
}

const InputField: React.FC<{label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, name: string}> = 
    ({ label, value, onChange, type = 'text', name }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="mb-1 font-semibold text-slate-600">{label}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange} className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

const CheckboxField: React.FC<{label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string}> = ({ label, checked, onChange, name }) => (
    <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        <span>{label}</span>
    </label>
);

const TeacherForm: React.FC<TeacherFormProps> = ({ onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        class: 'F.5T, 6S',
        teacherInCharge: 'Alli Li',
        subject: 'GCZ Chinese',
        dateOfSubmission: today,
        dateOfCollection: today,
        noOfPagesOriginal: 4,
        noOfCopies: 40,
        singleSided: false,
        stapling: true,
        whitePaper: true,
        remarks: '',
        signature: 'Alli',
    });
    
    const [classRequests, setClassRequests] = useState<ClassRequest[]>([
        { id: crypto.randomUUID(), form: '5', className: 'T', noOfCopies: 40, teacherInCharge: 'A.Li' },
        { id: crypto.randomUUID(), form: '6', className: 'S', noOfCopies: 40, teacherInCharge: 'A.Li' }
    ]);

    const totalCopies = useMemo(() => classRequests.reduce((sum, req) => sum + Number(req.noOfCopies || 0), 0), [classRequests]);
    const totalPrintedPages = useMemo(() => formData.noOfPagesOriginal * totalCopies, [formData.noOfPagesOriginal, totalCopies]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleClassRequestChange = (id: string, field: keyof Omit<ClassRequest, 'id'>, value: string | number) => {
        setClassRequests(prev => prev.map(req => req.id === id ? { ...req, [field]: value } : req));
    };

    const addClassRequest = () => {
        setClassRequests(prev => [...prev, { id: crypto.randomUUID(), form: '', className: '', noOfCopies: 0, teacherInCharge: '' }]);
    };

    const removeClassRequest = (id: string) => {
        setClassRequests(prev => prev.filter(req => req.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRequest: PrintRequest = {
            id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            ...formData,
            noOfPagesOriginal: Number(formData.noOfPagesOriginal),
            noOfCopies: Number(formData.noOfCopies),
            totalPrintedPages: totalPrintedPages,
            classRequests,
            status: 'Pending',
        };
        onSubmit(newRequest);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Stationery & Printing Request</h1>
            <p className="text-center text-slate-500 mb-8">St. Paul's Convent School</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <InputField label="Class 班別" name="class" value={formData.class} onChange={handleChange} />
                    <InputField label="Teacher-in-charge 姓名" name="teacherInCharge" value={formData.teacherInCharge} onChange={handleChange} />
                    <InputField label="Subject 科目" name="subject" value={formData.subject} onChange={handleChange} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Date of submission 交件日期" name="dateOfSubmission" type="date" value={formData.dateOfSubmission} onChange={handleChange} />
                    <InputField label="Date of collection 取件日期" name="dateOfCollection" type="date" value={formData.dateOfCollection} onChange={handleChange} />
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4 text-blue-700">Details 影印細節</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <InputField label="No. of pages of original copy 正本頁數" name="noOfPagesOriginal" type="number" value={formData.noOfPagesOriginal} onChange={handleChange} />
                        <div className="flex flex-col">
                             <label className="mb-1 font-semibold text-slate-600">Total No. of copies 影印份數</label>
                             <div className="px-3 py-2 border bg-slate-100 border-slate-300 rounded-md">{totalCopies}</div>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-slate-600">Total No. of printed pages 總影印頁數</label>
                            <div className="px-3 py-2 border bg-slate-100 border-slate-300 rounded-md">{totalPrintedPages}</div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4 text-blue-700">Other request 其他要求</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CheckboxField label="Single-sided 單面影印" name="singleSided" checked={formData.singleSided} onChange={handleChange} />
                        <CheckboxField label="Double-sided 雙面影印" name="singleSided" checked={!formData.singleSided} onChange={(e) => setFormData(p => ({...p, singleSided: !e.target.checked}))} />
                        <CheckboxField label="Stapling 釘裝" name="stapling" checked={formData.stapling} onChange={handleChange} />
                         <CheckboxField label="No stapling required 不需釘裝" name="stapling" checked={!formData.stapling} onChange={(e) => setFormData(p => ({...p, stapling: !e.target.checked}))} />
                        <CheckboxField label="White paper 白紙" name="whitePaper" checked={formData.whitePaper} onChange={handleChange} />
                        <CheckboxField label="Newsprint paper 新聞紙" name="whitePaper" checked={!formData.whitePaper} onChange={(e) => setFormData(p => ({...p, whitePaper: !e.target.checked}))} />
                    </div>
                </div>

                <div className="border-t pt-6 grid md:grid-cols-2 gap-6 items-start">
                    <div>
                         <h2 className="text-xl font-bold mb-4 text-blue-700">Distribution 派發列表</h2>
                         {classRequests.map((req, index) => (
                            <div key={req.id} className="grid grid-cols-5 gap-2 mb-2 items-center">
                                <input type="text" placeholder="Form" value={req.form} onChange={e => handleClassRequestChange(req.id, 'form', e.target.value)} className="px-2 py-1 border rounded-md col-span-1"/>
                                <input type="text" placeholder="Class" value={req.className} onChange={e => handleClassRequestChange(req.id, 'className', e.target.value)} className="px-2 py-1 border rounded-md col-span-1"/>
                                <input type="number" placeholder="Copies" value={req.noOfCopies} onChange={e => handleClassRequestChange(req.id, 'noOfCopies', Number(e.target.value))} className="px-2 py-1 border rounded-md col-span-1"/>
                                <input type="text" placeholder="Teacher" value={req.teacherInCharge} onChange={e => handleClassRequestChange(req.id, 'teacherInCharge', e.target.value)} className="px-2 py-1 border rounded-md col-span-1"/>
                                <button type="button" onClick={() => removeClassRequest(req.id)} className="text-red-500 hover:text-red-700 font-bold col-span-1">X</button>
                            </div>
                         ))}
                         <button type="button" onClick={addClassRequest} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold">+ Add Class</button>
                    </div>
                    <div>
                        <InputField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
                        <InputField label="Signed by 簽名" name="signature" value={formData.signature} onChange={handleChange} />
                    </div>
                </div>

                <div className="text-center pt-6">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg text-lg">
                        Submit & Generate Printable Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherForm;
