'use client';

import React from 'react';
import DOMPurify from 'dompurify';
import { Code } from 'lucide-react';

// Configure DOMPurify with safe HTML elements and attributes
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'code'
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id', 'style',
  'target', 'rel', 'width', 'height'
];

interface CustomHtmlEditorProps {
  value: string;
  onChange: (sanitizedHtml: string) => void;
}

export default function CustomHtmlEditor({ value, onChange }: CustomHtmlEditorProps) {

  // Client-side HTML sanitization function
  const sanitizeHtml = (html: string): { sanitizedHtml: string; wasModified: boolean } => {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return { sanitizedHtml: html, wasModified: false };
    }

    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      SANITIZE_DOM: true
    });

    const wasModified = sanitizedHtml !== html;
    return { sanitizedHtml, wasModified };
  };

  // Handle content change with sanitization
  const handleContentChange = (newContent: string) => {
    // Perform client-side sanitization
    const { sanitizedHtml } = sanitizeHtml(newContent);
    
    // Call onChange with sanitized content
    onChange(sanitizedHtml);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mt-1">
            Add custom HTML content to your store. Content will be sanitized for security.
          </p>
        </div>
      </div>

      {/* HTML Editor */}
      <div className="space-y-4">
        <div>
          <label htmlFor="customHtml" className="block text-sm font-medium text-gray-700 mb-2">
            HTML Content
          </label>
          <textarea
            id="customHtml"
            value={value}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
            placeholder="Enter your custom HTML here..."
          />
          <div className="mt-2 text-xs text-gray-500">
            <p><strong>Allowed tags:</strong> p, br, strong, em, u, h1-h6, ul, ol, li, blockquote, a, img, div, span, hr, table elements, pre, code</p>
            <p><strong>Note:</strong> Script tags and event handlers will be removed for security.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
