import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImagesSelect: (images: { base64: string; mimeType: string; name: string }[]) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const promises = imageFiles.map(file => {
      return new Promise<{ base64: string; mimeType: string; name: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            base64: e.target?.result as string,
            mimeType: file.type,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(onImagesSelect);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={`relative h-48 w-full rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer
        ${dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-slate-500'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleChange}
        disabled={disabled}
      />
      
      <div className="p-3 rounded-full bg-slate-800/50">
        <Upload className="w-6 h-6 text-blue-500" />
      </div>
      
      <div className="text-center">
        <p className="text-base font-medium">Drop car photos here</p>
        <p className="text-xs text-slate-400">or click to browse multiple files</p>
      </div>
    </div>
  );
};
