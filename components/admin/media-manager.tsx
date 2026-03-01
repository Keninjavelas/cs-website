"use client";

/**
 * MEDIA MANAGER COMPONENT
 * 
 * Manages multiple images/videos for Events and Achievements
 * - Upload multiple files
 * - Display existing media
 * - Delete individual items
 * - Preview images and videos
 */

import { useState, useRef } from "react";
import { Upload, X, AlertCircle, Image as ImageIcon, Video } from "lucide-react";
import {
  uploadMultipleMedia,
  deleteMediaItem,
  isImageFile,
  isVideoFile,
  type MediaItem,
} from "@/lib/media-upload";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import Image from "next/image";

interface MediaManagerProps {
  parentId: string | null; // null for new items
  parentType: "event" | "achievement";
  existingMedia: MediaItem[];
  onMediaUpdate: (media: MediaItem[]) => void;
}

export function MediaManager({
  parentId,
  parentType,
  existingMedia,
  onMediaUpdate,
}: MediaManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(existingMedia);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowser();

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Clear previous errors
    setError(null);

    // For new items (no parentId yet), just store files temporarily
    if (!parentId) {
      setError("Please save the item first before uploading media");
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const result = await uploadMultipleMedia(
        files,
        parentId,
        parentType,
        supabase,
        (fileIndex, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileIndex]: progress,
          }));
        }
      );

      if (result.success && result.mediaItems) {
        const updatedMedia = [...media, ...result.mediaItems];
        setMedia(updatedMedia);
        onMediaUpdate(updatedMedia);
      }

      if (result.failedCount > 0 && result.errors) {
        setError(
          `${result.uploadedCount} uploaded, ${result.failedCount} failed:\n${result.errors.join("\n")}`
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress({});
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle delete media
  const handleDelete = async (mediaItem: MediaItem) => {
    if (!confirm("Delete this media? This action cannot be undone.")) {
      return;
    }

    try {
      const result = await deleteMediaItem(mediaItem.id, supabase);
      
      if (result.success) {
        const updatedMedia = media.filter((m) => m.id !== mediaItem.id);
        setMedia(updatedMedia);
        onMediaUpdate(updatedMedia);
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete media");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Media Gallery
        </label>
        
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={uploading || !parentId}
            className="hidden"
            id="media-upload"
          />
          
          <label
            htmlFor="media-upload"
            className={`cursor-pointer ${
              uploading || !parentId ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-300 mb-1">
              {uploading
                ? "Uploading..."
                : !parentId
                ? "Save the item first to upload media"
                : "Click to upload images or videos"}
            </p>
            <p className="text-xs text-gray-500">
              Supports: JPG, PNG, WebP, MP4, WebM (max 15MB per file)
            </p>
          </label>
        </div>

        {/* Upload Progress */}
        {uploading && Object.keys(uploadProgress).length > 0 && (
          <div className="mt-3 space-y-2">
            {Object.entries(uploadProgress).map(([index, progress]) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">
                  File {parseInt(index) + 1}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-12">{progress}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 whitespace-pre-line">{error}</p>
          </div>
        )}
      </div>

      {/* Existing Media Grid */}
      {media.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3 text-gray-200">
            Uploaded Media ({media.length})
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
              >
                {/* Media Preview */}
                <div className="aspect-square relative">
                  {isImageFile(item.file_url) ? (
                    <Image
                      src={item.file_url}
                      alt="Media"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  ) : isVideoFile(item.file_url) ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.file_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <ImageIcon className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete media"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* File Type Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {item.file_type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
