'use client';

import { useState, useRef } from 'react';
import { MenuUploadProps } from '@/types/menu';
import { menuApi } from '@/lib/api';
import { FILE_CONFIG, ERROR_MESSAGES } from '@/lib/constants';

export default function MenuUpload({ onMenuProcessed, isLoading, setIsLoading }: MenuUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
        return;
      }

      if (file.size > FILE_CONFIG.MAX_SIZE) {
        setError(ERROR_MESSAGES.FILE_TOO_LARGE);
        return;
      }

      // Check if filename already exists
      try {
        const exists = await menuApi.checkFilename(file.name);
        if (exists) {
          setError(ERROR_MESSAGES.DUPLICATE_FILE);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
      } catch (err) {
        console.error('Error checking filename:', err);
        // Continue with upload if check fails
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await menuApi.uploadMenu(selectedFile);
      onMenuProcessed(data);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UPLOAD_FAILED);
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
        return;
      }

      if (file.size > FILE_CONFIG.MAX_SIZE) {
        setError(ERROR_MESSAGES.FILE_TOO_LARGE);
        return;
      }

      // Check if filename already exists
      try {
        const exists = await menuApi.checkFilename(file.name);
        if (exists) {
          setError(ERROR_MESSAGES.DUPLICATE_FILE);
          return;
        }
      } catch (err) {
        console.error('Error checking filename:', err);
        // Continue with upload if check fails
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div
        className={`border-3 border-dashed rounded-xl p-12 text-center transition-colors ${
          preview ? 'border-green-400' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Menu preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <p className="text-gray-600 font-medium">{selectedFile?.name}</p>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-sm text-red-600 hover:text-red-700 underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <label className="cursor-pointer ">
                <span className="text-indigo-600 hover:text-indigo-700 font-semibold">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white cursor-pointer transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing Menu...
            </span>
          ) : (
            'Process Menu'
          )}
        </button>
      )}
    </div>
  );
}
