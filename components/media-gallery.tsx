"use client";

/**
 * MEDIA GALLERY COMPONENT
 * 
 * Displays a responsive gallery of images and videos
 * Used on public achievements and event pages
 */

import { useState } from "react";
import Image from "next/image";
import { Video, X, ChevronLeft, ChevronRight } from "lucide-react";
import { isImageFile, isVideoFile, type MediaItem } from "@/lib/media-upload";

interface MediaGalleryProps {
  media: MediaItem[];
  className?: string;
}

export function MediaGallery({ media, className = "" }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  // Single item - large display
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className={`w-full ${className}`}>
        {isImageFile(item.file_url) ? (
          <div 
            className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={item.file_url}
              alt="Media"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        ) : isVideoFile(item.file_url) ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
            <video
              src={item.file_url}
              controls
              className="w-full h-full"
            />
          </div>
        ) : null}

        {lightboxOpen && <Lightbox media={media} currentIndex={currentIndex} onClose={closeLightbox} onPrev={goToPrevious} onNext={goToNext} />}
      </div>
    );
  }

  // Multiple items - grid display
  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => openLightbox(index)}
          >
            {isImageFile(item.file_url) ? (
              <Image
                src={item.file_url}
                alt={`Media ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : isVideoFile(item.file_url) ? (
              <div className="relative w-full h-full">
                <video
                  src={item.file_url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Video className="w-12 h-12 text-white" />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          media={media}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrevious}
          onNext={goToNext}
        />
      )}
    </div>
  );
}

/**
 * LIGHTBOX COMPONENT
 * Full-screen media viewer with navigation
 */
interface LightboxProps {
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ media, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const currentItem = media[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Previous Button */}
      {media.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Next Button */}
      {media.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Media Content */}
      <div
        className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isImageFile(currentItem.file_url) ? (
          <div className="relative w-full h-full">
            <Image
              src={currentItem.file_url}
              alt={`Media ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        ) : isVideoFile(currentItem.file_url) ? (
          <video
            src={currentItem.file_url}
            controls
            autoPlay
            className="max-w-full max-h-full"
          />
        ) : null}
      </div>

      {/* Counter */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}
