import React from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';

const StatusProgressTracker = ({ status, eta, fulfillmentType, children }) => {
  const getDeliveredIcon = () => {
    return fulfillmentType === 'pickup' ? MapPin : Truck;
  };

  const getDeliveredLabel = () => {
    return fulfillmentType === 'pickup' ? 'Picked Up' : 'Delivered';
  };

  const steps = [
    { key: 'PENDING', label: 'Order Received', icon: Package },
    { key: 'IN_PROGRESS', label: 'In Wash', icon: Clock },
    { key: 'COMPLETED', label: 'Ready', icon: CheckCircle },
    { key: 'DELIVERED', label: getDeliveredLabel(), icon: getDeliveredIcon() },
  ];

  const getCurrentStep = () => {
    const stepIndex = steps.findIndex((step) => step.key === status);
    return stepIndex !== -1 ? stepIndex : 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">Order Status</h3>

      <div className="relative px-2">
        <div className="flex justify-between items-start mb-8 gap-6">
          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-colors flex-shrink-0 ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                >
                  <step.icon size={18} className="md:w-5 md:h-5" />
                </div>
                <span
                  className={`text-xs md:text-sm text-center leading-tight break-words ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {status !== 'DELIVERED' && eta && (
        <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">{children}</div>
      )}
    </div>
  );
};

export default StatusProgressTracker;
