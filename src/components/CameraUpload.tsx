import { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CameraUploadProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
  onReset: () => void;
  isProcessing: boolean;
}

export function CameraUpload({
  onImageUpload,
  uploadedImage,
  onReset,
  isProcessing,
}: CameraUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="bg-card border-border backdrop-blur-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-foreground mb-4">Upload Vinyl Label</h2>

        {!uploadedImage ? (
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/70 hover:bg-muted transition-colors"
            >
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-foreground mb-2">Click to upload image</p>
              <p className="text-muted-foreground text-sm">
                Supports JPG, PNG, or HEIC formats
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative rounded-lg overflow-hidden bg-background">
              <img
                src={uploadedImage}
                alt="Vinyl label"
                className="w-full h-auto"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-foreground">Processing OCR...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4 mr-2" />
              Upload Different Image
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
