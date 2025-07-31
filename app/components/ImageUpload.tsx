'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  isLoading?: boolean;
}

export default function ImageUpload({ onImageSelect, isLoading = false }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    disabled: isLoading
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setPreviewUrl(urlInput);
      onImageSelect(urlInput);
      setUrlInput('');
      toast.success('Image URL processed!');
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setUrlInput('');
  };

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Phone preview"
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to browse files (JPEG, PNG, GIF, BMP, WebP)
        </p>
      </div>

      {/* URL Input */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Or provide an image URL:</p>
        <form onSubmit={handleUrlSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!urlInput.trim() || isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Link size={16} />
            Load
          </button>
        </form>
      </div>
    </div>
  );
} 