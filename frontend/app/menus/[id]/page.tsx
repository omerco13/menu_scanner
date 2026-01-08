'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { menuApi } from '@/lib/api';
import { MenuData } from '@/types/menu';
import MenuDisplay from '@/components/MenuDisplay';

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params.id as string;

  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenu();
  }, [menuId]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuApi.getMenuById(menuId);
      setMenu(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/menus')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            <label className="cursor-pointer">
              <span>←</span> Back to All Menus
            </label>
          </button>
        </div>

        {/* Menu Display */}
        <MenuDisplay menuData={{ ...menu!, menu_id: menuId }} />
      </div>
    </div>
  );
}
