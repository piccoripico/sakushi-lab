export type PageId = 'home' | 'about' | 'explore';

export function readPageFromHash(): PageId {
  const page = window.location.hash.replace(/^#/, '');
  return isPageId(page) ? page : 'home';
}

export function isPageId(value: string): value is PageId {
  return value === 'home' || value === 'about' || value === 'explore';
}

export function pageHash(page: PageId): string {
  return page === 'home' ? '' : `#${page}`;
}
