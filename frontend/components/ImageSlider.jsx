import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

export default function ImageSlider({ images, currentIndex, onClose, onIndexChange }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(currentIndex);

  useEffect(() => {
    setCurrentImgIndex(currentIndex);
  }, [currentIndex]);

  const goToPrev = () => {
    const newIndex = (currentImgIndex - 1 + images.length) % images.length;
    setCurrentImgIndex(newIndex);
    onIndexChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentImgIndex + 1) % images.length;
    setCurrentImgIndex(newIndex);
    onIndexChange(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImgIndex]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl z-10"
      >
        <FaTimes />
      </button>

      <div className="relative w-full max-w-6xl h-full flex items-center">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Main Image */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={images[currentImgIndex]?.url}
            alt={images[currentImgIndex]?.title || 'Gallery image'}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <button
          onClick={goToNext}
          className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
        >
          <FaChevronRight size={24} />
        </button>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-4 left-0 right-0 overflow-x-auto py-2 px-4">
          <div className="flex justify-center gap-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => {
                  setCurrentImgIndex(index);
                  onIndexChange(index);
                }}
                className={`w-16 h-16 flex-shrink-0 border-2 ${
                  index === currentImgIndex ? 'border-indigo-500' : 'border-transparent'
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Image Info */}
        <div className="absolute top-4 left-4 text-white">
          <h2 className="text-xl font-bold">
            {images[currentImgIndex]?.title || 'Untitled'}
          </h2>
          <div className="flex flex-wrap gap-1 mt-1">
            {images[currentImgIndex]?.tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-indigo-600">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-300 mt-1">
            {currentImgIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </div>
  );
}