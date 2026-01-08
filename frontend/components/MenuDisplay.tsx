'use client';

import { MenuDisplayProps } from '@/types/menu';
import { getCategoryImage } from '@/lib/categoryImages';
import Image from 'next/image';

export default function MenuDisplay({ menuData }: MenuDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold font-serif mb-2">
          {menuData.restaurant_name}
        </h1>
        <p className="text-indigo-100">Welcome to our restaurant</p>
      </div>

      {/* Menu Content */}
      {menuData.categories.length > 0 ? (
        <div className="space-y-10">
          {menuData.categories.map((category, categoryIndex) => {
            const isMain = category.is_main !== false;
            const categoryImage = getCategoryImage(category.name);

            return (
              <div key={categoryIndex}>
                {/* Category content with padding */}
                <div className="px-8 md:px-12 pb-6">
                  {/* Main Category with Side Image on Right */}
                  {category.name && categoryImage && isMain && (
                    <div className="mb-6">
                      <div className="flex items-center gap-8 mb-4">
                        {/* Category title on left */}
                        <div className="flex-1">
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide flex items-center gap-3">
                            <span className="text-4xl">{categoryImage.emoji}</span>
                            {category.name}
                          </h2>
                        </div>
                        {/* Rectangular Image on the right side */}
                        <div className="relative w-64 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                          <Image
                            src={categoryImage.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="border-b-2 border-indigo-300"></div>
                    </div>
                  )}

                  {/* Category Title for non-image categories */}
                  {category.name && !categoryImage && (
                    <div className={isMain ? "border-b-2 border-indigo-300 pb-3 mb-6" : "pb-2 mb-4"}>
                      <h2 className={`font-bold uppercase tracking-wide ${
                        isMain
                          ? 'text-3xl text-gray-900'
                          : 'text-xl text-gray-700'
                      }`}>
                        {category.name}
                      </h2>
                    </div>
                  )}

                  {/* Sub-category with emoji (no image) */}
                  {category.name && categoryImage && !isMain && (
                    <div className="pb-2 mb-4">
                      <h2 className="text-xl font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <span className="text-2xl">{categoryImage.emoji}</span>
                        {category.name}
                      </h2>
                    </div>
                  )}

                  {/* Menu Items - Single Column, No Bullets */}
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between items-baseline border-b border-gray-200 pb-2 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
                      >
                        <h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">
                          {item.name}
                        </h3>
                        <span className="text-lg font-semibold text-indigo-600 whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-8 md:px-12">
          <p className="text-gray-600 text-lg">
            No menu items found. Here's the extracted text:
          </p>
          <div className="mt-6 p-6 bg-gray-100 rounded-lg text-left max-w-2xl mx-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {menuData.raw_text}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
