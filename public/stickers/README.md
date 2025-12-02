# Stickers Directory

This directory contains sticker images used throughout the application for aesthetic purposes.

## Image Specifications

- **Format**: WebP (recommended for best compression and transparency support)
- **Size**: ~500x500px (can vary, but should be square-ish)
- **Background**: Transparent (PNG/WebP with alpha channel)
- **Naming**: Use descriptive names like `sticker-1.webp`, `sticker-2.webp`, etc.

## Usage

Stickers are automatically loaded from this directory. To use a sticker in code:

```tsx
<Sticker 
  src="/stickers/sticker-1.webp"
  position={{ x: '-30px', y: '10%' }}
  width={100}
  height={100}
  rotation={-15}
/>
```

## Current Implementation

Stickers are currently implemented as placeholder white boxes. Once you add your sticker images to this directory, update the sticker configurations in:

- `src/components/views/AboutView.tsx`
- `src/components/views/HomeView.tsx`
- `src/components/views/MyPetsView.tsx`
- `src/components/views/SettingsView.tsx`

Add the `src` property to each sticker configuration object to use your images.

## Placement Strategy

- **Desktop**: Stickers are scattered around edges, overlapping panel borders
- **Mobile**: Stickers are positioned more neatly, fewer stickers, smaller sizes
- Stickers use responsive classes (`hidden md:block` and `block md:hidden`)
