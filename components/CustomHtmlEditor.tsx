'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { updateStore } from '@/lib/store';
import DOMPurify from 'dompurify';
import { Save, Code } from 'lucide-react';

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
  storeId: string;
  initialHtml?: string;
  onSave?: (sanitizedHtml: string) => void;
}

export default function CustomHtmlEditor({ storeId, initialHtml = '', onSave }: CustomHtmlEditorProps) {
  const { user, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when initialHtml changes
  useEffect(() => {
    setHtmlContent(initialHtml);
  }, [initialHtml]);

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

  // Save HTML content with client-side sanitization
  const handleSaveHtml = async () => {
    if (!user) {
      showError('You must be logged in to save custom HTML.');
      return;
    }

    setIsSaving(true);
    
    try {
      // Perform client-side sanitization
      const { sanitizedHtml, wasModified } = sanitizeHtml(htmlContent);
      
      // Update store with sanitized HTML
      await updateStore(user.uid, {
        customHtml: sanitizedHtml
      });
      
      showSuccess('Custom HTML updated successfully!');
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(sanitizedHtml);
      }
      
      if (wasModified) {
        setHtmlContent(sanitizedHtml); // Update editor with sanitized version
      }
    } catch (error: any) {
      console.error('Save error:', error);
      showError('Save failed: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while authentication is being resolved
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Code className="w-5 h-5 mr-2 text-primary-600" />
            Custom HTML Editor
          </h3>
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
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
            placeholder="Enter your custom HTML here..."
          />
          <div className="mt-2 text-xs text-gray-500">
            <p><strong>Allowed tags:</strong> p, br, strong, em, u, h1-h6, ul, ol, li, blockquote, a, img, div, span, hr, table elements, pre, code</p>
            <p><strong>Note:</strong> Script tags and event handlers will be removed for security.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveHtml}
            disabled={isSaving || !htmlContent.trim() || !user || loading}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save HTML'}
          </button>
        </div>
      </div>
    </div>
  );
}
