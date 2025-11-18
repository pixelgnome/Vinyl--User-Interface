# Vinyl$ User Interface

A modern vinyl record collection manager with Discogs API integration.

## Features

- **Discogs Integration**: Search the vast Discogs database and add records with complete metadata
- **OCR Upload**: Upload photos of vinyl labels for text extraction (simulated)
- **Manual Entry**: Manually add vinyl records to your collection
- **Collection View**: Browse and manage your vinyl collection
- **Local Storage**: All data stored locally in your browser

## Setup

### 1. Install Dependencies

```bash
npm i
```

### 2. Configure Discogs API (Optional but Recommended)

To use the Discogs search feature, you need to set up API credentials:

#### Option 1: Personal Access Token (Recommended)

1. Go to [Discogs Developer Settings](https://www.discogs.com/settings/developers)
2. Create a new application (if you haven't already)
3. Click "Generate new token" under Personal Access Token
4. Copy the token

#### Option 2: Consumer Key & Secret

1. Go to [Discogs Developer Settings](https://www.discogs.com/settings/developers)
2. Create a new application
3. Copy your Consumer Key and Consumer Secret

#### Add Credentials

You can add your credentials in two ways:

**A. Via Environment Variables:**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your credentials:
   ```
   VITE_DISCOGS_TOKEN=your_personal_access_token_here
   ```
   OR
   ```
   VITE_DISCOGS_CONSUMER_KEY=your_consumer_key_here
   VITE_DISCOGS_CONSUMER_SECRET=your_consumer_secret_here
   ```

**B. Via Settings Tab:**

1. Run the app
2. Click on the "Settings" tab
3. Enter your credentials and click "Save Configuration"

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

### Adding Vinyl Records

1. **Discogs Search** (recommended): Search the Discogs database for your vinyl and add it with complete metadata including artwork, label info, catalog numbers, and more.

2. **Upload & Scan**: Take a photo of your vinyl label. The app will simulate OCR text extraction (currently mock data).

3. **Manual Entry**: Type in the details yourself for complete control.

### Managing Your Collection

- View all your records in the "Collection" tab
- Each record displays cover art, artist, album, and detailed metadata
- Delete records with the trash icon
- Refresh the collection with the refresh button

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Privacy

- All data is stored locally in your browser's localStorage
- Discogs API credentials are stored locally and never sent to any server except Discogs
- No data is collected or transmitted to third parties

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Discogs API
