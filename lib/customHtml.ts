// This file has been refactored to use client-side sanitization with DOMPurify
// Custom HTML functionality is now handled directly in CustomHtmlEditor.tsx
// with the same security protections but without requiring Cloud Functions.

export const ALLOWED_HTML_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'code'
];

export const ALLOWED_HTML_ATTRIBUTES = [
  'href', 'src', 'alt', 'title', 'class', 'id', 'style',
  'target', 'rel', 'width', 'height'
];

export const FORBIDDEN_HTML_TAGS = [
  'script', 'object', 'embed', 'form', 'input', 'button'
];

export const FORBIDDEN_HTML_ATTRIBUTES = [
  'onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'
];