import { Card } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Trash2, RefreshCw, Disc3 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { AlbumCover } from './AlbumCover';
import type { VinylRecord } from '../App';

interface CollectionViewProps {
  records: VinylRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function CollectionView({ records, isLoading, onDelete, onRefresh }: CollectionViewProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">My Vinyl Collection</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {records.length} {records.length === 1 ? 'record' : 'records'} in your collection
          </p>
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          className="border-border text-foreground hover:bg-muted"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border p-6">
              <Skeleton className="h-48 w-full bg-muted mb-4" />
              <Skeleton className="h-6 w-3/4 bg-muted mb-2" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && records.length === 0 && (
        <Card className="bg-card border-border p-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Disc3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-foreground mb-2">No Records Yet</h3>
            <p className="text-muted-foreground text-sm">
              Start building your collection by uploading or manually entering vinyl records
            </p>
          </div>
        </Card>
      )}

      {/* Records Grid */}
      {!isLoading && records.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.filter(record => record != null).map((record) => (
            <Card key={record.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors">
              {/* Image */}
              <AlbumCover
                artistName={record.artistName}
                albumName={record.albumName}
                uploadedImageUrl={record.imageUrl}
              />

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Artist */}
                {record?.artistName && (
                  <div>
                    <p className="text-muted-foreground text-xs">Artist</p>
                    <p className="text-foreground">{record.artistName}</p>
                  </div>
                )}

                {/* Album */}
                {record?.albumName && (
                  <div>
                    <p className="text-muted-foreground text-xs">Album</p>
                    <p className="text-foreground">{record.albumName}</p>
                  </div>
                )}

                {/* Serial */}
                {record?.serialNumber && (
                  <div>
                    <p className="text-muted-foreground text-xs">Serial Number</p>
                    <p className="text-foreground text-sm font-mono">{record.serialNumber}</p>
                  </div>
                )}

                {/* Matrix */}
                {record?.matrixRunout && (
                  <div>
                    <p className="text-muted-foreground text-xs">Matrix / Runout</p>
                    <p className="text-foreground text-sm font-mono">{record.matrixRunout}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <p className="text-muted-foreground text-xs">
                    Added {formatDate(record?.createdAt || Date.now())}
                  </p>
                  
                  {/* Delete Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Delete Record</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Are you sure you want to delete this record? This action cannot be undone.
                          {record?.albumName && (
                            <span className="block mt-2 text-foreground">
                              "{record.albumName}" by {record?.artistName || 'Unknown Artist'}
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-muted border-border text-foreground hover:bg-secondary">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(record?.id || '')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
