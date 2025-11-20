// ============================================================================
// DISCOGS SEARCH COMPONENT
// ============================================================================
// This component provides the UI for searching the Discogs database and
// viewing detailed release information. It's the main interface between
// the user and the Discogs API.
//
// WHERE THE DISCOGS API IS CALLED:
// - Line ~49: discogsAPI.searchByBarcode() - Search by barcode
// - Line ~78: discogsAPI.search() - General search
// - Line ~103: discogsAPI.getRelease() - Get full release details
//
// COMPONENT FLOW:
// 1. User enters search query (artist/album or barcode)
// 2. handleSearch() calls appropriate Discogs API method
// 3. Search results are displayed in a grid
// 4. User clicks result to view details
// 5. handleSelectResult() fetches full details via getRelease()
// 6. User can add the release to their collection
// ============================================================================

import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Search, Plus, Info, Settings } from 'lucide-react';
import { toast } from 'sonner';
// IMPORT DISCOGS API: This is where we import the singleton API instance
import { discogsAPI, DiscogsSearchResult, DiscogsReleaseDetails } from '../utils/discogs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface DiscogsSearchProps {
  onSelectRelease: (release: DiscogsReleaseDetails) => void;
  onConfigure?: () => void;
}

export function DiscogsSearch({ onSelectRelease, onConfigure }: DiscogsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [artistQuery, setArtistQuery] = useState('');
  const [albumQuery, setAlbumQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscogsSearchResult[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<DiscogsReleaseDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Check if Discogs API credentials are configured
  const isConfigured = discogsAPI.isConfigured();

  // --------------------------------------------------------------------------
  // SEARCH HANDLER - Main function that calls Discogs API
  // --------------------------------------------------------------------------
  // This function determines the search type (barcode vs regular) and
  // calls the appropriate Discogs API method
  const handleSearch = async () => {
    if (!isConfigured) {
      toast.error('Please configure your Discogs API credentials first');
      onConfigure?.();
      return;
    }

    // BARCODE SEARCH PATH
    // If barcode field has content, use the barcode search API
    if (barcodeQuery.trim()) {
      setIsSearching(true);
      setResults([]);

      try {
        // API CALL #1: Search by barcode
        // This hits the /database/search endpoint with barcode parameter
        const response = await discogsAPI.searchByBarcode(barcodeQuery.trim());
        setResults(response.results || []);

        if (!response.results || response.results.length === 0) {
          toast.info('No results found for this barcode. Try a different search.');
        } else {
          toast.success(`Found ${response.pagination.items} results`);
        }
      } catch (error) {
        console.error('Search error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to search Discogs');
      } finally {
        setIsSearching(false);
      }
      return;
    }

    // REGULAR SEARCH PATH
    // Combine quick search or artist + album fields into a single query
    const query = searchQuery.trim() || `${artistQuery.trim()} ${albumQuery.trim()}`.trim();

    if (!query) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      // API CALL #2: General search
      // This hits the /database/search endpoint with the query string
      // Filtered to 'release' type to only show vinyl releases
      const response = await discogsAPI.search(query, 'release');
      setResults(response.results || []);

      if (!response.results || response.results.length === 0) {
        toast.info('No results found. Try a different search.');
      } else {
        toast.success(`Found ${response.pagination.items} results`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to search Discogs');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // --------------------------------------------------------------------------
  // RELEASE DETAILS HANDLER
  // --------------------------------------------------------------------------
  // When user clicks a search result, fetch complete release details
  const handleSelectResult = async (result: DiscogsSearchResult) => {
    setIsLoadingDetails(true);
    try {
      // API CALL #3: Get detailed release information
      // This hits the /releases/{id} endpoint to get full metadata
      // including tracklist, images, identifiers, etc.
      const details = await discogsAPI.getRelease(result.id);
      setSelectedRelease(details);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading release details:', error);
      toast.error('Failed to load release details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleAddToCollection = () => {
    if (selectedRelease) {
      onSelectRelease(selectedRelease);
      setShowDetails(false);
      setSelectedRelease(null);
      toast.success('Added to collection!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Warning */}
      {!isConfigured && (
        <Card className="bg-yellow-950/20 border-yellow-700/50 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-yellow-200 font-medium mb-1">API Configuration Required</h4>
              <p className="text-yellow-200/80 text-sm mb-3">
                To search Discogs, you need to configure your API credentials.
              </p>
              <Button
                onClick={onConfigure}
                variant="outline"
                size="sm"
                className="border-yellow-700 text-yellow-200 hover:bg-yellow-900/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure API
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search Form */}
      <Card className="bg-card border-border backdrop-blur-sm">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Search Discogs Database</h2>
            <p className="text-muted-foreground text-sm">
              Search the Discogs database for vinyl records by artist and album
            </p>
          </div>

          <div className="space-y-4">
            {/* Combined Search */}
            <div className="space-y-2">
              <Label htmlFor="search-query" className="text-foreground">
                Quick Search
              </Label>
              <div className="flex gap-2">
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by artist, album, or catalog number..."
                  className="flex-1 bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                  disabled={!isConfigured}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !isConfigured}
                  className="bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or search by fields</span>
              </div>
            </div>

            {/* Artist/Album Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="artist-search" className="text-foreground">
                  Artist Name
                </Label>
                <Input
                  id="artist-search"
                  value={artistQuery}
                  onChange={(e) => setArtistQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter artist name"
                  className="bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                  disabled={!isConfigured}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="album-search" className="text-foreground">
                  Album Name
                </Label>
                <Input
                  id="album-search"
                  value={albumQuery}
                  onChange={(e) => setAlbumQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter album name"
                  className="bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                  disabled={!isConfigured}
                />
              </div>
            </div>

            {/* Barcode/Identifier Search */}
            <div className="space-y-2">
              <Label htmlFor="barcode-search" className="text-foreground">
                Barcode/Other Identifiers
              </Label>
              <Input
                id="barcode-search"
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter barcode, UPC, or other identifier"
                className="bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={!isConfigured}
              />
              <p className="text-xs text-muted-foreground">
                Search by barcode, UPC, EAN, or other release identifiers for exact matches
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      {isSearching && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card border-border p-4">
              <Skeleton className="h-48 w-full bg-muted mb-3" />
              <Skeleton className="h-5 w-3/4 bg-muted mb-2" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </Card>
          ))}
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground">Search Results</h3>
            <p className="text-muted-foreground text-sm">{results.length} results</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card
                key={result.id}
                className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => handleSelectResult(result)}
              >
                {/* Cover Image */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {result.cover_image || result.thumb ? (
                    <img
                      src={result.cover_image || result.thumb}
                      alt={result.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h4 className="text-foreground font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {result.title}
                  </h4>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    {result.year && (
                      <p>Year: {result.year}</p>
                    )}
                    {result.country && (
                      <p>Country: {result.country}</p>
                    )}
                    {result.format && result.format.length > 0 && (
                      <p>Format: {result.format.join(', ')}</p>
                    )}
                    {result.label && result.label.length > 0 && (
                      <p className="line-clamp-1">Label: {result.label.join(', ')}</p>
                    )}
                    {result.catno && (
                      <p className="font-mono text-xs">Cat#: {result.catno}</p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectResult(result);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Release Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Release Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review the details before adding to your collection
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="space-y-4 py-6">
              <Skeleton className="h-64 w-full bg-muted" />
              <Skeleton className="h-6 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </div>
          ) : selectedRelease ? (
            <div className="space-y-6 py-4">
              {/* Cover Image */}
              {selectedRelease.images && selectedRelease.images.length > 0 && (
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedRelease.images[0].uri}
                    alt={selectedRelease.title}
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Title</p>
                  <p className="text-foreground font-medium">{selectedRelease.title}</p>
                </div>

                {selectedRelease.artists && selectedRelease.artists.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Artist</p>
                    <p className="text-foreground">
                      {selectedRelease.artists.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {selectedRelease.year && (
                    <div>
                      <p className="text-muted-foreground text-xs">Year</p>
                      <p className="text-foreground">{selectedRelease.year}</p>
                    </div>
                  )}

                  {selectedRelease.country && (
                    <div>
                      <p className="text-muted-foreground text-xs">Country</p>
                      <p className="text-foreground">{selectedRelease.country}</p>
                    </div>
                  )}
                </div>

                {selectedRelease.labels && selectedRelease.labels.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Label & Catalog #</p>
                    {selectedRelease.labels.map((label, idx) => (
                      <p key={idx} className="text-foreground">
                        {label.name} - <span className="font-mono text-sm">{label.catno}</span>
                      </p>
                    ))}
                  </div>
                )}

                {selectedRelease.formats && selectedRelease.formats.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Format</p>
                    {selectedRelease.formats.map((format, idx) => (
                      <p key={idx} className="text-foreground">
                        {format.qty} × {format.name}
                        {format.descriptions && format.descriptions.length > 0 && (
                          <span className="text-muted-foreground text-sm">
                            {' '}
                            ({format.descriptions.join(', ')})
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                )}

                {selectedRelease.genres && selectedRelease.genres.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Genre</p>
                    <p className="text-foreground">{selectedRelease.genres.join(', ')}</p>
                  </div>
                )}

                {selectedRelease.styles && selectedRelease.styles.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Style</p>
                    <p className="text-foreground">{selectedRelease.styles.join(', ')}</p>
                  </div>
                )}

                {selectedRelease.identifiers && selectedRelease.identifiers.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Identifiers</p>
                    <div className="space-y-1">
                      {selectedRelease.identifiers.map((id, idx) => (
                        <p key={idx} className="text-foreground text-sm font-mono">
                          {id.type}: {id.value}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Button */}
              <Button
                onClick={handleAddToCollection}
                className="w-full bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
