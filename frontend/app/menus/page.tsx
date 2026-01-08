'use client';

import { useRouter } from 'next/navigation';
import MenuList from '@/components/MenuList';

export default function MenusPage() {
  const router = useRouter();

  const handleSelectMenu = (menuId: string) => {
    router.push(`/menus/${menuId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-12">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-8xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
                Saved Menus
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                View and manage your uploaded menus
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => router.push('/')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold cursor-pointer"
              >
                Upload New Menu
              </button>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <MenuList onSelectMenu={handleSelectMenu} />
      </div>
    </div>
  );
}
