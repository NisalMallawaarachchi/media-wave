import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (files.length === 0) {
    toast.error("Please select at least one file");
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  const formData = new FormData();
  files.forEach(file => {
    formData.append("files", file);
  });

  try {
    const res = await fetch("/api/upload/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    toast.success(`${data.files.length} file(s) uploaded successfully!`);
    setFiles([]);
  } catch (error) {
    toast.error(error.message || "Something went wrong!");
  } finally {
    setIsUploading(false);
    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 2000); // Reset progress bar
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#001f3f] to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Upload Media</h1>
        <p className="text-gray-300 text-center mb-8">Drag & drop files or click to browse</p>

        <form 
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl"
        >
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-600 hover:border-indigo-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FaCloudUploadAlt className="mx-auto text-4xl text-indigo-300 mb-4" />
            <p className="text-gray-300 mb-2">
              {isDragging ? 'Drop your files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG (Max 5MB each)</p>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              <span>Browse Files</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg,image/png"
              />
            </label>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-medium mb-3">Selected Files ({files.length})</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center">
                      <FaImage className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-white text-sm truncate max-w-xs">{file.name}</p>
                        <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-400 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex justify-between text-white text-sm mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={files.length === 0 || isUploading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                files.length === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } flex items-center justify-center`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="mr-2" />
                  Upload {files.length > 0 ? `(${files.length})` : ''}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Maximum upload size: 5MB per file</p>
          <p>Supported formats: JPG, PNG</p>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}