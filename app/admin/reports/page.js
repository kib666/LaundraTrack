'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
      <h2 className="text-xl font-semibold mb-2">
        Reports
      </h2>
      <p className="text-gray-600">This section is under development</p>
      <p className="text-gray-500 text-sm mt-2">Future features will include analytics, revenue reports, and performance metrics.</p>
    </div>
  );
} 