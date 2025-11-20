import { useState, useEffect } from "react";
import { CameraUpload } from "./components/CameraUpload";
import { DataDisplay } from "./components/DataDisplay";
import { CollectionView } from "./components/CollectionView";
import { DiscogsSearch } from "./components/DiscogsSearch";
import { VinylLogo } from "./components/VinylLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Camera, Library, Search } from "lucide-react";
import { api } from "./utils/api";
import { toast } from "sonner";
import type { DiscogsReleaseDetails } from "./utils/discogs";

export interface VinylData {
  artistName: string;
  albumName: string;
  serialNumber: string;
  matrixRunout: string;
  // Optional Discogs metadata
  year?: number;
  country?: string;
  genre?: string[];
  style?: string[];
  label?: string;
  format?: string;
  discogsId?: number;
  discogsUrl?: string;
}

export interface VinylRecord extends VinylData {
  id: string;
  imageUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<VinylData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ocr");
  const [isSaving, setIsSaving] = useState(false);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [dataSource, setDataSource] = useState<"ocr" | null>("ocr");

  // Load records when switching to collection tab
  useEffect(() => {
    if (activeTab === "collection") {
      loadRecords();
    }
  }, [activeTab]);

  const loadRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const data = await api.getRecords();
      setRecords(data || []);
    } catch (error) {
      console.error("Error loading records:", error);
      toast.error("Failed to load records");
      setRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    setDataSource("ocr");

    // Simulate OCR processing
    setTimeout(() => {
      // OCR processing would extract data here
      // For now, just clear the processing state
      setExtractedData(null);
      setIsProcessing(false);
      toast.info("OCR processing complete - no text detected.");
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
        imageUrl: uploadedImage ?? undefined,
      });

      toast.success("Vinyl record saved to collection!");

      // Reset form
      handleReset();

      // Switch to collection tab
      setActiveTab("collection");
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Failed to save record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteRecord(id);
      toast.success("Record deleted");
      loadRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  const handleDiscogsSelect = async (release: DiscogsReleaseDetails) => {
    setIsSaving(true);
    try {
      // Convert Discogs release to VinylData format
      const vinylData: Partial<VinylData> & { imageUrl?: string } = {
        artistName:
          release.artists?.map((a: { name: string }) => a.name).join(", ") ||
          "",
        albumName: release.title || "",
        serialNumber: release.labels?.[0]?.catno || "",
        matrixRunout:
          release.identifiers
            ?.filter(
              (id: { type: string; value: string }) =>
                id.type.toLowerCase().includes("matrix") ||
                id.type.toLowerCase().includes("runout")
            )
            .map((id: { type: string; value: string }) => id.value)
            .join(" // ") || "",
        year: release.year,
        country: release.country,
        genre: release.genres,
        style: release.styles,
        label: release.labels?.[0]?.name,
        format: release.formats
          ?.map(
            (f: { qty: string; name: string; descriptions?: string[] }) =>
              `${f.qty} × ${f.name}${
                f.descriptions ? ` (${f.descriptions.join(", ")})` : ""
              }`
          )
          .join(", "),
        discogsId: release.id,
        discogsUrl: release.uri,
        imageUrl: release.images?.[0]?.uri ?? undefined,
      };

      await api.createRecord(vinylData);
      toast.success("Vinyl record added from Discogs!");
      setActiveTab("collection");
    } catch (error) {
      console.error("Error saving Discogs record:", error);
      toast.error("Failed to save record");
    } finally {
      setIsSaving(false);
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

      {/* Main Content and Tabs */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex flex-wrap justify-center gap-2 w-full max-w-4xl mx-auto mb-8 bg-card border border-border p-2">
              <TabsTrigger
                value="discogs"
                className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Manual Search</span>
                <span className="sm:hidden">Search</span>
              </TabsTrigger>
              <TabsTrigger
                value="ocr"
                className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              >
                <Camera className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Image Upload</span>
                <span className="sm:hidden">Scan</span>
              </TabsTrigger>
              <TabsTrigger
                value="collection"
                className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              >
                <Library className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Your Collection</span>
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
                    <h3 className="text-foreground mb-4">
                      How to Add Vinyl Records
                    </h3>
                    <div className="space-y-3 text-left text-muted-foreground text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-primary shrink-0">1.</span>
                        <p>
                          <strong className="text-foreground">
                            Upload Photo:
                          </strong>{" "}
                          Take a photo of your vinyl label to extract text data
                          that you can edit.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary shrink-0">2.</span>
                        <p>
                          <strong className="text-foreground">
                            Your Collection:
                          </strong>{" "}
                          All records are saved locally in your browser's
                          storage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="collection" className="mt-0">
              <CollectionView
                records={records}
                isLoading={isLoadingRecords}
                onDelete={handleDeleteRecord}
                onRefresh={loadRecords}
              />
            </TabsContent>

            <TabsContent value="discogs" className="mt-0">
              <DiscogsSearch onSelectRelease={handleDiscogsSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
