
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
    setSelectedRequest: (request: null) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, setSelectedRequest }) => {
    
    const handleViewChange = (newView: AppView) => {
        setSelectedRequest(null);
        setView(newView);
    }
    
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const activeClasses = "bg-blue-600 text-white shadow-md";
    const inactiveClasses = "bg-white text-blue-600 hover:bg-blue-100";

    return (
        <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-2xl font-bold text-slate-700">
                <span className="text-blue-600">SPCS</span> Printing Request
            </div>
            <div className="flex bg-slate-200 p-1 rounded-lg">
                <button 
                    onClick={() => handleViewChange(AppView.TEACHER)}
                    className={`${baseClasses} ${[AppView.TEACHER, AppView.PRINT].includes(currentView) ? activeClasses : inactiveClasses}`}
                >
                    Teacher
                </button>
                <button 
                    onClick={() => handleViewChange(AppView.STAFF)}
                    className={`${baseClasses} ${currentView === AppView.STAFF ? activeClasses : inactiveClasses}`}
                >
                    Printing Staff
                </button>
            </div>
        </header>
    );
};

export default Header;
