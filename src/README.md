# Vinyl$ - Vinyl Record Collection Manager

A modern web application for managing your vinyl record collection with OCR text extraction capabilities.

## Features

- 📸 **Upload & Scan** - Upload photos of vinyl labels with simulated OCR text extraction
- 🔍 **Discogs Search** - Search the Discogs database for vinyl records
- 📚 **Collection View** - Browse and manage your complete vinyl collection
- 💾 **localStorage** - All data persists locally in your browser
- 🎨 **Dark Vinyl Theme** - Beautiful dark interface with Helvetica Neue typography
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🖼️ **Album Artwork** - Automatically fetches album covers from Unsplash

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui components
- localStorage for data persistence
- Lucide React for icons
- Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## File Structure

```
vinyl-dollars/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AlbumCover.tsx
│   │   ├── CameraUpload.tsx
│   │   ├── CollectionView.tsx
│   │   ├── DataDisplay.tsx
│   │   ├── DiscogsSearch.tsx
│   │   └── VinylLogo.tsx
│   ├── utils/
│   │   ├── api.ts         # localStorage API
│   │   └── discogs.ts     # Discogs API client
│   ├── styles/
│   │   └── globals.css    # Global styles & Tailwind
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Usage

### Discogs Search
1. Configure your Discogs API credentials via browser console (instructions shown in the app)
2. Search for vinyl records by artist, album, or barcode
3. View detailed release information
4. Add records directly to your collection

### Upload & Scan Mode
1. Click or drag an image of a vinyl label
2. Wait for simulated OCR processing (2 seconds)
3. Edit the extracted data as needed
4. Save to your collection

### Collection View
1. Browse all your saved records
2. Delete records you no longer want
3. Refresh to reload from localStorage

## Data Storage

All vinyl records are stored in your browser's localStorage under the key `vinyl_records`. Your data persists across sessions but is tied to your browser and domain.

## License

MIT

## Author

Built with Figma Make
