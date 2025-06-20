import React from 'react';
import { Bell, User } from 'lucide-react';

const TopBar = ({ title, user = "Admin" }) => {
    return (
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={20} />
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium">{user}</span>
                </div>
            </div>
        </div>
    );
};

export default TopBar;