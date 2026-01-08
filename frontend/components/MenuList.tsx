'use client';

import { useState, useEffect } from 'react';
import { menuApi } from '@/lib/api';
import { MenuSummary } from '@/types/menu';

interface MenuListProps {
  onSelectMenu: (menuId: string) => void;
}

export default function MenuList({ onSelectMenu }: MenuListProps) {
  const [menus, setMenus] = useState<MenuSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuApi.getAllMenus();
      setMenus(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();


    try {
      await menuApi.deleteMenu(menuId);
      setMenus(menus.filter(m => m.id !== menuId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete menu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadMenus}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">No menus saved yet</p>
        <p className="text-gray-500">Upload your first menu to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {menus.map((menu) => (
        <div
          key={menu.id}
          onClick={() => onSelectMenu(menu.id)}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
            <h3 className="text-xl font-bold truncate">
              {menu.restaurant_name || 'Unknown Restaurant'}
            </h3>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-500 mb-4">
              Uploaded: {new Date(menu.created_at).toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => onSelectMenu(menu.id)}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                
                View Menu

              </button>
              <button
                onClick={(e) => handleDelete(menu.id, e)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                  Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
