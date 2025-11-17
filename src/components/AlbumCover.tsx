import { useState, useEffect } from 'react';
import { Disc3 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AlbumCoverProps {
  artistName: string;
  albumName: string;
  uploadedImageUrl?: string | null;
  className?: string;
}

export function AlbumCover({ artistName, albumName, uploadedImageUrl, className = '' }: AlbumCoverProps) {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If there's an uploaded image, use it
    if (uploadedImageUrl) {
      setCoverImageUrl(uploadedImageUrl);
      return;
    }

    // Otherwise fetch from Unsplash
    const fetchAlbumCover = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Create search query from artist and album name
        const query = `${artistName} ${albumName} album cover`.trim();
        
        // Use Unsplash Source API for direct image access
        const unsplashUrl = `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`;
        
        setCoverImageUrl(unsplashUrl);
      } catch (error) {
        console.error('Error fetching album cover:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (artistName || albumName) {
      fetchAlbumCover();
    }
  }, [artistName, albumName, uploadedImageUrl]);

  // Show uploaded image if available
  if (uploadedImageUrl) {
    return (
      <div className={`aspect-square bg-muted overflow-hidden ${className}`}>
        <img
          src={uploadedImageUrl}
          alt={`${albumName} label`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`aspect-square bg-muted flex items-center justify-center ${className}`}>
        <Disc3 className="w-16 h-16 text-primary/40 animate-pulse" />
      </div>
    );
  }

  // Show error state or no image available
  if (hasError || !coverImageUrl) {
    return (
      <div className={`aspect-square bg-muted flex items-center justify-center ${className}`}>
        <Disc3 className="w-16 h-16 text-primary/40" />
      </div>
    );
  }

  // Show fetched album cover
  return (
    <div className={`aspect-square bg-muted overflow-hidden ${className}`}>
      <ImageWithFallback
        src={coverImageUrl}
        alt={`${albumName} by ${artistName}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
