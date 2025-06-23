import React from 'react';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const StatusProgressTracker = ({ status, eta, children }) => {
    const steps = [
        { key: 'PENDING', label: 'Order Received', icon: Package },
        { key: 'IN_PROGRESS', label: 'In Wash', icon: Clock },
        { key: 'COMPLETED', label: 'Ready', icon: CheckCircle },
        { key: 'DELIVERED', label: 'Delivered', icon: Truck }
    ];

    const getCurrentStep = () => {
        const stepIndex = steps.findIndex(step => step.key === status);
        return stepIndex !== -1 ? stepIndex : 0;
    };

    const currentStep = getCurrentStep();

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">Order Status</h3>

            <div className="relative">
                <div className="flex justify-between items-center mb-8">
                    {steps.map((step, index) => {
                        const isActive = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                    } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}>
                                    <step.icon size={20} />
                                </div>
                                <span className={`text-sm text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {status !== 'DELIVERED' && eta && (
                <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                    {children}
                </div>
            )}
        </div>
    );
};

export default StatusProgressTracker;