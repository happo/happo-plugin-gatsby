import { navigate } from 'gatsby';

if (typeof window !== 'undefined' && typeof window.initHappo === 'function') {
  window.initHappo({ navigate });
}
