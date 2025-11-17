import { useState, useEffect } from 'react';
import { CameraUpload } from './components/CameraUpload';
import { DataDisplay } from './components/DataDisplay';
import { ManualEntry } from './components/ManualEntry';
import { CollectionView } from './components/CollectionView';
import { VinylLogo } from './components/VinylLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Camera, Edit3, Library } from 'lucide-react';
import { api } from './utils/api';
import { toast } from 'sonner';

export interface VinylData {
  artistName: string;
  albumName: string;
  serialNumber: string;
  matrixRunout: string;
}

export interface VinylRecord extends VinylData {
  id: string;
  imageUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<VinylData | null>({
    artistName: 'Led Zeppelin',
    albumName: 'Led Zeppelin II',
    serialNumber: 'SD 8236 / ATL 40 037',
    matrixRunout: 'SD 8236-A RL SS // ATLANTIC // ⊗ // STERLING // Robert Ludwig // 1969',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ocr');
  const [isSaving, setIsSaving] = useState(false);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [dataSource, setDataSource] = useState<'ocr' | 'manual' | null>('ocr');

  // Load records when switching to collection tab
  useEffect(() => {
    if (activeTab === 'collection') {
      loadRecords();
    }
  }, [activeTab]);

  const loadRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const data = await api.getRecords();
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading records:', error);
      toast.error('Failed to load records');
      setRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    setDataSource('ocr');

    // Simulate OCR processing
    setTimeout(() => {
      // Mock extracted data with detailed realistic vinyl information
      setExtractedData({
        artistName: 'Led Zeppelin',
        albumName: 'Led Zeppelin II',
        serialNumber: 'SD 8236 / ATL 40 037',
        matrixRunout: 'SD 8236-A RL SS // ATLANTIC // ⊗ // STERLING // Robert Ludwig // 1969',
      });
      setIsProcessing(false);
      toast.info('OCR processing simulated - please edit the extracted data as needed');
    }, 2000);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setExtractedData(null);
    setIsProcessing(false);
    setDataSource(null);
  };

  const handleDataUpdate = async (data: VinylData) => {
    setExtractedData(data);
  };

  const handleSaveRecord = async () => {
    if (!extractedData) return;

    setIsSaving(true);
    try {
      // Create record with image
      await api.createRecord({
        ...extractedData,
        imageUrl: uploadedImage,
      });

      toast.success('Vinyl record saved to collection!');
      
      // Reset form
      handleReset();
      
      // Switch to collection tab
      setActiveTab('collection');
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Failed to save record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSubmit = async (data: VinylData) => {
    setIsSaving(true);
    try {
      await api.createRecord(data);
      toast.success('Vinyl record saved to collection!');
      setActiveTab('collection');
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Failed to save record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteRecord(id);
      toast.success('Record deleted');
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-[var(--header-bg)] backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <VinylLogo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 bg-card border border-border">
              <TabsTrigger 
                value="ocr" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              >
                <Camera className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Upload & Scan</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manual" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Manual Entry</span>
                <span className="sm:hidden">Manual</span>
              </TabsTrigger>
              <TabsTrigger 
                value="collection" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              >
                <Library className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">My Collection</span>
                <span className="sm:hidden">Collection</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ocr" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Camera/Upload */}
                <div>
                  <CameraUpload
                    onImageUpload={handleImageUpload}
                    uploadedImage={uploadedImage}
                    onReset={handleReset}
                    isProcessing={isProcessing}
                  />
                </div>

                {/* Right Column - Extracted Data */}
                <div>
                  <DataDisplay
                    data={extractedData}
                    isProcessing={isProcessing}
                    onDataUpdate={handleDataUpdate}
                    onSave={handleSaveRecord}
                    isSaving={isSaving}
                    dataSource={dataSource}
                  />
                </div>
              </div>

              {/* Info Section */}
              {!uploadedImage && !extractedData && (
                <div className="mt-12 text-center max-w-2xl mx-auto">
                  <div className="bg-card border border-border rounded-xl p-8 backdrop-blur-sm">
                    <h3 className="text-foreground mb-4">How to Add Vinyl Records</h3>
                    <div className="space-y-3 text-left text-muted-foreground text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-primary shrink-0">1.</span>
                        <p><strong className="text-foreground">Upload Photo:</strong> Take a photo of your vinyl label to extract text data that you can edit.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary shrink-0">2.</span>
                        <p><strong className="text-foreground">Manual Entry:</strong> Use the Manual Entry tab to type in details yourself</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary shrink-0">3.</span>
                        <p><strong className="text-foreground">Your Collection:</strong> All records are saved locally in your browser's storage</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual" className="mt-0">
              <div className="max-w-2xl mx-auto">
                <ManualEntry onSubmit={handleManualSubmit} isSaving={isSaving} />
              </div>
            </TabsContent>

            <TabsContent value="collection" className="mt-0">
              <CollectionView
                records={records}
                isLoading={isLoadingRecords}
                onDelete={handleDeleteRecord}
                onRefresh={loadRecords}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
