# Setup Guide for npm Installation

This guide will help you set up the Vinyl$ project for local development with npm.

## Current File Structure (Figma Make)

The project currently has files in the root directory. To support npm installs, you'll need to reorganize them into a `src/` directory structure.

## Required File Migration

When you download this project, manually move the following files to create the proper structure:

### Step 1: Create Directory Structure

Create these directories:
```
src/
src/components/
src/components/ui/
src/utils/
src/styles/
public/
```

### Step 2: Move Files to src/

Move these files from the root to `src/`:

#### Already Created:
- ✅ `/src/App.tsx` (already created with correct imports)
- ✅ `/src/main.tsx` (already created)

#### Move These Manually:

**Components** (move from `/components/` to `/src/components/`):
- `/components/AlbumCover.tsx` → `/src/components/AlbumCover.tsx`
- `/components/CameraUpload.tsx` → `/src/components/CameraUpload.tsx`
- `/components/CollectionView.tsx` → `/src/components/CollectionView.tsx`
- `/components/DataDisplay.tsx` → `/src/components/DataDisplay.tsx`
- `/components/DiscogsSearch.tsx` → `/src/components/DiscogsSearch.tsx`
- `/components/VinylLogo.tsx` → `/src/components/VinylLogo.tsx`

**UI Components** (move from `/components/ui/` to `/src/components/ui/`):
- All files in `/components/ui/` → `/src/components/ui/`

**Utils** (move from `/utils/` to `/src/utils/`):
- `/utils/api.ts` → `/src/utils/api.ts`

**Styles** (move from `/styles/` to `/src/styles/`):
- `/styles/globals.css` → `/src/styles/globals.css`

### Step 3: Update Import Paths

After moving files, update any imports in your components that reference `./components/figma/ImageWithFallback`:

The `ImageWithFallback` component should be copied to:
- `/components/figma/ImageWithFallback.tsx` → `/src/components/figma/ImageWithFallback.tsx`

### Step 4: Files to Keep in Root

These configuration files stay in the root directory:
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `tsconfig.node.json`
- ✅ `vite.config.ts`
- ✅ `postcss.config.js`
- ✅ `.eslintrc.cjs`
- ✅ `.gitignore`
- ✅ `index.html`
- ✅ `README.md`

### Step 5: Install and Run

Once files are organized:

```bash
# Install all dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Quick Migration Script

If you're on macOS/Linux, you can use this bash script to automate the migration:

```bash
#!/bin/bash

# Create directories
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/utils
mkdir -p src/styles
mkdir -p public

# Move components
cp -r components/*.tsx src/components/ 2>/dev/null || true
cp -r components/ui/*.tsx src/components/ui/ 2>/dev/null || true
cp -r components/ui/*.ts src/components/ui/ 2>/dev/null || true
cp -r components/figma/*.tsx src/components/figma/ 2>/dev/null || true

# Move utils and styles
cp -r utils/*.ts src/utils/ 2>/dev/null || true
cp -r styles/*.css src/styles/ 2>/dev/null || true

echo "Files migrated! Now run: npm install"
```

Save this as `migrate.sh`, make it executable with `chmod +x migrate.sh`, and run `./migrate.sh`.

## Troubleshooting

### Import Errors

If you see import errors after migration, make sure:
1. All files are in the correct `src/` subdirectories
2. The imports use relative paths (e.g., `./components/` not `@/components/`)
3. TypeScript files use `.tsx` extension for components

### Sonner Toast Import

The import for sonner has been updated from `sonner@2.0.3` to just `sonner` in the new structure.

### Missing Dependencies

If you see dependency errors, run:
```bash
npm install
```

## Environment Support

This project works on:
- Node.js 18+
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

After successful setup:
1. Run `npm run dev` to start developing
2. Your app will be available at `http://localhost:5173`
3. Changes will hot-reload automatically
4. Build for production with `npm run build`
