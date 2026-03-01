/**
 * MEDIA UPLOAD UTILITY
 * 
 * Handles file uploads to Supabase Storage
 * Supports images and videos
 * Validates file size and types
 */

import { createSupabaseBrowser } from "@/lib/supabase-ssr";

const ALLOWED_EXTENSIONS = {
  images: ['jpg', 'jpeg', 'png', 'webp'],
  videos: ['mp4', 'webm'],
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Get file extension
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file is image
 */
export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.images.includes(ext);
}

/**
 * Check if file is video
 */
export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.videos.includes(ext);
}

/**
 * Validate uploaded file
 */
function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size exceeds 15MB limit' };
  }

  const ext = getFileExtension(file.name);
  const allAllowed = [
    ...ALLOWED_EXTENSIONS.images,
    ...ALLOWED_EXTENSIONS.videos,
  ];

  if (!allAllowed.includes(ext)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Allowed: JPG, PNG, WebP, MP4, WebM',
    };
  }

  return { isValid: true };
}

/**
 * UPLOAD MEDIA TO SUPABASE STORAGE
 * 
 * @param file - File to upload
 * @param folder - Destination folder (achievements or events)
 * @param supabaseClient - Supabase client instance
 * @param onProgress - Progress callback (0-100)
 * @returns Upload result with public URL
 */
export async function uploadMediaToStorage(
  file: File,
  folder: 'achievements' | 'events',
  supabaseClient: ReturnType<typeof createSupabaseBrowser>,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = getFileExtension(file.name);
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const path = `${folder}/${filename}`;

    // Report initial progress
    onProgress?.(10);

    // Upload file
    const { error: uploadError } = await supabaseClient.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage error:', uploadError);
      return {
        success: false,
        error: uploadError.message || 'Failed to upload file',
      };
    }

    // Report upload complete
    onProgress?.(70);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('media')
      .getPublicUrl(path);

    onProgress?.(100);

    return {
      success: true,
      url: urlData.publicUrl,
      path: path,
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during upload',
    };
  }
}

/**
 * DELETE MEDIA FROM STORAGE
 * 
 * @param path - File path to delete
 * @param supabaseClient - Supabase client instance
 */
export async function deleteMediaFromStorage(
  path: string,
  supabaseClient: ReturnType<typeof createSupabaseBrowser>
): Promise<UploadResult> {
  try {
    if (!path) {
      return { success: true }; // No file to delete
    }

    const { error } = await supabaseClient.storage
      .from('media')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete error:', err);
    return {
      success: false,
      error: 'Failed to delete file',
    };
  }
}

/**
 * Extract storage path from public URL
 * Convert: https://...supabase.co/storage/v1/object/public/media/achievements/123-abc.jpg
 * To: achievements/123-abc.jpg
 */
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const match = publicUrl.match(/\/media\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * ====================================================
 * MULTI-MEDIA GALLERY FUNCTIONS
 * ====================================================
 */

export interface MediaItem {
  id: string;
  event_id?: string;
  achievement_id?: string;
  file_url: string;
  file_type: 'image' | 'video';
  display_order: number;
  created_at?: string;
}

export interface MultiUploadResult {
  success: boolean;
  uploadedCount: number;
  failedCount: number;
  mediaItems?: MediaItem[];
  errors?: string[];
}

/**
 * UPLOAD MULTIPLE FILES TO STORAGE AND CREATE MEDIA RECORDS
 * 
 * @param files - Array of files to upload
 * @param parentId - Event ID or Achievement ID
 * @param parentType - 'event' or 'achievement'
 * @param supabaseClient - Supabase client instance
 * @param onProgress - Progress callback for each file
 * @returns Upload result with created media items
 */
export async function uploadMultipleMedia(
  files: File[],
  parentId: string,
  parentType: 'event' | 'achievement',
  supabaseClient: ReturnType<typeof createSupabaseBrowser>,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<MultiUploadResult> {
  const folder = parentType === 'event' ? 'events' : 'achievements';
  let uploadedCount = 0;
  let failedCount = 0;
  const mediaItems: MediaItem[] = [];
  const errors: string[] = [];

  // Get current max display order
  const parentField = parentType === 'event' ? 'event_id' : 'achievement_id';
  const { data: existingMedia } = await supabaseClient
    .from('media')
    .select('display_order')
    .eq(parentField, parentId)
    .order('display_order', { ascending: false })
    .limit(1);

  let nextOrder = existingMedia && existingMedia.length > 0 
    ? existingMedia[0].display_order + 1 
    : 0;

  // Upload each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Upload to storage
      const uploadResult = await uploadMediaToStorage(
        file,
        folder,
        supabaseClient,
        (progress) => onProgress?.(i, progress)
      );

      if (!uploadResult.success || !uploadResult.url) {
        failedCount++;
        errors.push(`${file.name}: ${uploadResult.error || 'Upload failed'}`);
        continue;
      }

      // Determine file type
      const fileType = isImageFile(file.name) ? 'image' : 'video';

      // Create media record
      const mediaData = {
        [parentField]: parentId,
        file_url: uploadResult.url,
        file_type: fileType,
        display_order: nextOrder++,
      };

      const { data: mediaItem, error: dbError } = await supabaseClient
        .from('media')
        .insert(mediaData)
        .select()
        .single();

      if (dbError) {
        failedCount++;
        errors.push(`${file.name}: Database error - ${dbError.message}`);
        
        // Try to clean up uploaded file
        if (uploadResult.path) {
          await deleteMediaFromStorage(uploadResult.path, supabaseClient);
        }
        continue;
      }

      uploadedCount++;
      mediaItems.push(mediaItem);
    } catch (err) {
      failedCount++;
      errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return {
    success: uploadedCount > 0,
    uploadedCount,
    failedCount,
    mediaItems,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * FETCH MEDIA FOR EVENT OR ACHIEVEMENT
 * 
 * @param parentId - Event ID or Achievement ID
 * @param parentType - 'event' or 'achievement'
 * @param supabaseClient - Supabase client instance
 * @returns Array of media items
 */
export async function fetchMedia(
  parentId: string,
  parentType: 'event' | 'achievement',
  supabaseClient: ReturnType<typeof createSupabaseBrowser>
): Promise<MediaItem[]> {
  const parentField = parentType === 'event' ? 'event_id' : 'achievement_id';
  
  const { data, error } = await supabaseClient
    .from('media')
    .select('*')
    .eq(parentField, parentId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Fetch media error:', error);
    return [];
  }

  return data || [];
}

/**
 * DELETE MEDIA ITEM (removes from storage and database)
 * 
 * @param mediaId - Media item ID
 * @param supabaseClient - Supabase client instance
 * @returns Success status
 */
export async function deleteMediaItem(
  mediaId: string,
  supabaseClient: ReturnType<typeof createSupabaseBrowser>
): Promise<UploadResult> {
  try {
    // Get media item to extract file path
    const { data: mediaItem, error: fetchError } = await supabaseClient
      .from('media')
      .select('file_url')
      .eq('id', mediaId)
      .single();

    if (fetchError || !mediaItem) {
      return {
        success: false,
        error: 'Media item not found',
      };
    }

    // Extract storage path and delete file
    const storagePath = extractStoragePath(mediaItem.file_url);
    if (storagePath) {
      await deleteMediaFromStorage(storagePath, supabaseClient);
    }

    // Delete database record
    const { error: deleteError } = await supabaseClient
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || 'Failed to delete media record',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete media error:', err);
    return {
      success: false,
      error: 'Failed to delete media item',
    };
  }
}

/**
 * UPDATE MEDIA DISPLAY ORDER
 * 
 * @param updates - Array of {id, display_order} objects
 * @param supabaseClient - Supabase client instance
 * @returns Success status
 */
export async function updateMediaOrder(
  updates: Array<{ id: string; display_order: number }>,
  supabaseClient: ReturnType<typeof createSupabaseBrowser>
): Promise<UploadResult> {
  try {
    // Update each item's display order
    for (const update of updates) {
      const { error } = await supabaseClient
        .from('media')
        .update({ display_order: update.display_order })
        .eq('id', update.id);

      if (error) {
        return {
          success: false,
          error: `Failed to update order: ${error.message}`,
        };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Update order error:', err);
    return {
      success: false,
      error: 'Failed to update media order',
    };
  }
}

