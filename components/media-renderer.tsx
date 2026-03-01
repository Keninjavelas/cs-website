/**
 * MEDIA RENDERER COMPONENT
 * 
 * Renders images or videos based on file type
 */

import Image from "next/image";
import { isImageFile, isVideoFile } from "@/lib/media-upload";

interface MediaRendererProps {
  url?: string;
  alt?: string;
  imageClassName?: string;
  videoClassName?: string;
}

export function MediaRenderer({
  url,
  alt = "Media",
  imageClassName = "",
  videoClassName = "",
}: MediaRendererProps) {
  if (!url) {
    return null;
  }

  const isImage = isImageFile(url);
  const isVideo = isVideoFile(url);

  if (isImage) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={`object-cover ${imageClassName}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }

  if (isVideo) {
    return (
      <video
        controls
        className={`w-full h-full object-cover ${videoClassName}`}
        src={url}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // Fallback
  return null;
}

/**
 * MEDIA PREVIEW COMPONENT
 * 
 * Shows inline preview of image/video
 */
interface MediaPreviewProps {
  url?: string;
  alt?: string;
  containerClassName?: string;
}

export function MediaPreview({
  url,
  alt = "Preview",
  containerClassName = "relative h-48 w-full overflow-hidden rounded-lg border border-border bg-muted",
}: MediaPreviewProps) {
  if (!url) {
    return null;
  }

  const isImage = isImageFile(url);
  const isVideo = isVideoFile(url);

  return (
    <div className={containerClassName}>
      {isImage && (
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 100vw"
        />
      )}
      {isVideo && (
        <video
          controls
          className="w-full h-full object-cover"
          src={url}
          style={{ aspectRatio: "16/9" }}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
