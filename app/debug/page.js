'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    if (session) {
      setSessionInfo(JSON.stringify(session, null, 2));
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <RefreshCw size={32} />
          NextAuth Debug Info
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {status === 'loading' ? (
              <>
                <div className="animate-spin inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                Loading...
              </>
            ) : status === 'authenticated' ? (
              <>
                <CheckCircle className="text-green-400" size={24} />
                Authenticated
              </>
            ) : (
              <>
                <AlertTriangle className="text-red-400" size={24} />
                Not Authenticated
              </>
            )}
          </h2>

          <div className="bg-gray-900 rounded p-4 text-gray-100 font-mono text-sm overflow-auto max-h-96">
            {status === 'loading' ? (
              <p>Loading session...</p>
            ) : (
              <>
                <p className="text-gray-400">Status: <span className="text-white">{status}</span></p>
                {session ? (
                  <>
                    <p className="text-gray-400 mt-4">Session Data:</p>
                    <pre className="whitespace-pre-wrap break-words text-green-400">
                      {sessionInfo || 'Loading...'}
                    </pre>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs uppercase">Email</p>
                        <p className="text-white font-bold">{session.user?.email || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs uppercase">Name</p>
                        <p className="text-white font-bold">{session.user?.name || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs uppercase">Role</p>
                        <p className={`font-bold ${session.user?.role === 'admin' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {session.user?.role || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs uppercase">Status</p>
                        <p className="text-white font-bold">{session.user?.status || 'N/A'}</p>
                      </div>
                    </div>

                    {session.user?.role === 'admin' ? (
                      <div className="mt-6 p-4 bg-green-900 border border-green-500 rounded text-green-100">
                        <p className="font-bold">✅ Admin access granted!</p>
                        <p className="text-sm mt-2">You can now access <a href="/admin" className="underline text-green-300">the admin dashboard</a></p>
                      </div>
                    ) : (
                      <div className="mt-6 p-4 bg-red-900 border border-red-500 rounded text-red-100">
                        <p className="font-bold">❌ Not an admin user</p>
                        <p className="text-sm mt-2">Your role is: <span className="font-mono font-bold">{session.user?.role || 'undefined'}</span></p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-red-400">No session data. Please login first at <a href="/customer" className="underline text-red-300">/customer</a></p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Go to <a href="/customer" className="text-blue-400 underline">/customer</a> and login as admin@laundry.com</li>
            <li>You will be redirected here automatically, or click the refresh button</li>
            <li>Check if the role shows as "admin"</li>
            <li>If role is "admin", you can access <a href="/admin" className="text-blue-400 underline">/admin</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}