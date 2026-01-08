'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuUpload from '@/components/MenuUpload';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuProcessed = (data: any) => {
    // Redirect to the menu detail page after successful upload
    router.push(`/menus/${data.menu_id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-8xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
            Menu Scanner
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Upload your menu image and get a structured digital version
          </p>

          <p className="max-w-6xl mx-auto mt-8"></p>
          <MenuUpload
          onMenuProcessed={handleMenuProcessed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

          {/* Navigation Button */}
          <p className="max-w-6xl mx-auto mt-8">
            <button
              onClick={() => router.push('/menus')}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg cursor-pointer"
            >
              <span>📋</span> View Saved Menus
            </button>
          </p>
        </header>

        
      </div>
    </main>
  );
}
