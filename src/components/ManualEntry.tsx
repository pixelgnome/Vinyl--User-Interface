import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { VinylData } from '../App';

interface ManualEntryProps {
  onSubmit: (data: VinylData) => void;
  isSaving?: boolean;
}

export function ManualEntry({ onSubmit, isSaving }: ManualEntryProps) {
  const [formData, setFormData] = useState<VinylData>({
    artistName: '',
    albumName: '',
    serialNumber: '',
    matrixRunout: '',
  });

  const handleInputChange = (field: keyof VinylData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one field is filled
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    
    if (!hasData) {
      toast.error('Please fill in at least one field');
      return;
    }

    onSubmit(formData);
    toast.success('Vinyl data saved successfully');
  };

  const handleReset = () => {
    setFormData({
      artistName: '',
      albumName: '',
      serialNumber: '',
      matrixRunout: '',
    });
    toast.info('Form cleared');
  };

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-foreground mb-2">Manual Entry</h2>
          <p className="text-muted-foreground text-sm">
            Manually enter your vinyl record details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Artist Name */}
          <div className="space-y-2">
            <Label htmlFor="manual-artist" className="text-foreground">
              Artist Name
            </Label>
            <Input
              id="manual-artist"
              value={formData.artistName}
              onChange={(e) => handleInputChange('artistName', e.target.value)}
              placeholder="Enter artist name"
              className="bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Album Name */}
          <div className="space-y-2">
            <Label htmlFor="manual-album" className="text-foreground">
              Album Name
            </Label>
            <Input
              id="manual-album"
              value={formData.albumName}
              onChange={(e) => handleInputChange('albumName', e.target.value)}
              placeholder="Enter album name"
              className="bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Serial Number */}
          <div className="space-y-2">
            <Label htmlFor="manual-serial" className="text-foreground">
              Album Serial Number
            </Label>
            <Input
              id="manual-serial"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              placeholder="Enter serial number"
              className="bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Matrix/Runout */}
          <div className="space-y-2">
            <Label htmlFor="manual-matrix" className="text-foreground">
              Matrix / Runout
            </Label>
            <Input
              id="manual-matrix"
              value={formData.matrixRunout}
              onChange={(e) => handleInputChange('matrixRunout', e.target.value)}
              placeholder="Enter matrix/runout code"
              className="bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Data'}
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Form
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
          <p className="text-muted-foreground text-sm">
            <span className="text-primary">💡 Tip:</span> Fill in as many details as you know. You can always edit the information later.
          </p>
        </div>
      </div>
    </Card>
  );
}
