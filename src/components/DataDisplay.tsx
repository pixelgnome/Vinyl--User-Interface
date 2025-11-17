import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { Check, Copy, Save, Database, Disc3, Camera } from "lucide-react";
import { toast } from "sonner";
import type { VinylData } from "../App";

interface DataDisplayProps {
  data: VinylData | null;
  isProcessing: boolean;
  onDataUpdate: (data: VinylData) => void;
  onSave?: () => void;
  isSaving?: boolean;
  dataSource?: "ocr" | "discogs" | null;
}

export function DataDisplay({
  data,
  isProcessing,
  onDataUpdate,
  onSave,
  isSaving,
  dataSource,
}: DataDisplayProps) {
  const [editedData, setEditedData] = useState<VinylData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  const handleInputChange = (field: keyof VinylData, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedData) {
      onDataUpdate(editedData);
      toast.success("Data saved successfully");
    }
  };

  const handleCopyAll = () => {
    if (editedData) {
      const text = `Artist: ${editedData.artistName}\nAlbum: ${editedData.albumName}\nSerial: ${editedData.serialNumber}\nMatrix/Runout: ${editedData.matrixRunout}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">Extracted Data</h2>
          {dataSource && (
            <Badge
              variant="outline"
              className={
                dataSource === "discogs"
                  ? "bg-green-900/40 border-green-700/50 text-green-300"
                  : "bg-primary/20 border-primary/50 text-primary"
              }
            >
              {dataSource === "discogs" ? (
                <>
                  <Disc3 className="w-3 h-3 mr-1" />
                  From Discogs
                </>
              ) : (
                <>
                  <Camera className="w-3 h-3 mr-1" />
                  From OCR
                </>
              )}
            </Badge>
          )}
        </div>

        {isProcessing ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-10 w-full bg-muted" />
              </div>
            ))}
          </div>
        ) : data && editedData ? (
          <div className="space-y-4">
            {/* Artist Name */}
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-foreground">
                Artist Name
              </Label>
              <Input
                id="artist"
                value={editedData.artistName}
                onChange={(e) =>
                  handleInputChange("artistName", e.target.value)
                }
                className="bg-input-background border-border text-foreground focus:border-primary"
              />
            </div>

            {/* Album Name */}
            <div className="space-y-2">
              <Label htmlFor="album" className="text-foreground">
                Album Name
              </Label>
              <Input
                id="album"
                value={editedData.albumName}
                onChange={(e) => handleInputChange("albumName", e.target.value)}
                className="bg-input-background border-border text-foreground focus:border-primary"
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serial" className="text-foreground">
                Album Serial Number
              </Label>
              <Input
                id="serial"
                value={editedData.serialNumber}
                onChange={(e) =>
                  handleInputChange("serialNumber", e.target.value)
                }
                className="bg-input-background border-border text-foreground focus:border-primary"
              />
            </div>

            {/* Matrix/Runout */}
            <div className="space-y-2">
              <Label htmlFor="matrix" className="text-foreground">
                Matrix / Runout
              </Label>
              <Input
                id="matrix"
                value={editedData.matrixRunout}
                onChange={(e) =>
                  handleInputChange("matrixRunout", e.target.value)
                }
                className="bg-input-background border-border text-foreground focus:border-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {onSave && (
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Database className="w-4 h-4 mr-2 animate-pulse" />
                      Saving to Collection...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Save to Collection
                    </>
                  )}
                </Button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update
                </Button>
                <Button
                  onClick={handleCopyAll}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Disc3 className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground mb-2">No Data Yet</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Upload an image to extract vinyl label data
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
