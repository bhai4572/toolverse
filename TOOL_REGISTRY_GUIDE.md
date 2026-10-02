# ToolVerse — Central Tool Registry Guide

The central tool registry is located at [`lib/tools/registry.ts`](file:///e:/All%20Tools/lib/tools/registry.ts).

## Tool Registry Entry Schema

Every tool registered in `TOOLS` array must strictly conform to the `ToolDefinition` interface:

```typescript
export interface ToolDefinition {
  id: string; // Unique identifier
  slug: string; // URL route slug (e.g. image-compressor)
  canonicalName: string; // Display name
  aliases: string[]; // Search synonyms and alternate queries
  category: string; // Category display name
  categorySlug: string; // Category route slug
  subcategory?: string; // Optional subcategory
  shortDescription: string; // Brief 1-sentence summary
  longDescription: string; // Extended page description
  instructions: string[]; // Step-by-step usage guide
  useCases: string[]; // Common practical applications
  privacyMessage: string; // Privacy guarantee text
  limitations: string[]; // Technical boundaries
  keywords: string[]; // SEO tags
  relatedToolIds: string[]; // Array of related tool IDs
  featured?: boolean; // Highlight on home page
  popular?: boolean; // Highlight in popular tools
  processingMode: 'client' | 'worker' | 'api' | 'server';
  status: 'live' | 'admin_configuration_required' | 'disabled';
  requiredEnvironmentVariables?: string[];
  icon: string; // Lucide icon identifier
}
```

## Tool Status Guidelines

1. **`live`**: Core functionality is genuinely implemented in client/worker JS and verified by tests. Shown publicly in navigation and sitemap.
2. **`admin_configuration_required`**: Requires administrator API keys or server compute. Shown with configuration guide in admin preview mode; hidden from public production navigation.
3. **`disabled`**: Excluded from public navigation and sitemap.

## Duplicate Prevention Rule

Never register duplicate tools for the same underlying engine.
- All target-size image tools (e.g. "Image to 50 KB", "Image to 100 KB") reuse the `ImageCompressorTool` component.
- All target dimension resizers reuse `ImageResizerTool`.
- All social presets reuse `ImageResizerTool` with `isSocialMode={true}`.
