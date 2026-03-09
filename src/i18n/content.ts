import type { Locale } from './config';

const allContent = import.meta.glob('../content/*/*.json', { eager: true });

export function getContent(lang: Locale) {
  const content: Record<string, any> = {};
  for (const [path, module] of Object.entries(allContent)) {
    const match = path.match(/\/content\/([^/]+)\/([^/]+)\.json$/);
    if (match && match[1] === lang) {
      const key = match[2].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      content[key] = (module as any).default;
    }
  }
  return content;
}
