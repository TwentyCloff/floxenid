import React, { useState } from 'react';

const FileUpload = ({ attachments, setAttachments }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachments([...attachments, ...files]);
  };

  const removeFile = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <div className="mb-4">
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
        >
          {isDragging
            ? 'Drop files here'
            : 'Drag & drop files here or click to browse'}
        </label>
        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
      </div>

      {attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm truncate max-w-xs">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;