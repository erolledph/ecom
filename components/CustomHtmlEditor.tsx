'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { updateStore } from '@/lib/store';
import DOMPurify from 'dompurify';
import { Eye, Save, AlertTriangle, CheckCircle, Code, Loader } from 'lucide-react';

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
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [previewHtml, setPreviewHtml] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    wasModified: boolean;
    message: string;
  } | null>(null);

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
      FORBID_SCRIPT: true,
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

  // Validate HTML content for preview
  const handleValidateHtml = async () => {
    if (!user) {
      showError('You must be logged in to validate HTML.');
      return;
    }

    if (!htmlContent.trim()) {
      setPreviewHtml('');
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    
    try {
      // Perform client-side sanitization
      const { sanitizedHtml, wasModified } = sanitizeHtml(htmlContent);
      
      setPreviewHtml(sanitizedHtml);
      setValidationResult({
        wasModified,
        message: wasModified
          ? 'HTML was sanitized for security. Some content may have been removed.'
          : 'HTML is safe and ready to use.'
      });

      if (wasModified) {
        showWarning('Some content was removed for security reasons. Check the preview.');
      } else {
        showInfo('HTML is safe and ready to use.');
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      setPreviewHtml('');
      setValidationResult(null);
      showError('Validation failed: ' + error.message);
    } finally {
      setIsValidating(false);
    }
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
      
      // Update preview with sanitized content
      setPreviewHtml(sanitizedHtml);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(sanitizedHtml);
      }
      
      // Check if content was modified during sanitization
      if (wasModified) {
        showWarning('Some content was sanitized for security. The saved version may differ slightly.');
        setHtmlContent(sanitizedHtml); // Update editor with sanitized version
        setValidationResult({
          wasModified: true,
          message: 'HTML was sanitized for security. Some content may have been removed.'
        });
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
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-8 h-8 animate-spin text-primary-600" />
            <p className="text-gray-600">Loading authentication...</p>
          </div>
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
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-2">Security Protection Enabled</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>Your HTML content is automatically sanitized using DOMPurify to prevent XSS attacks.</p>
              <div className="mt-3">
                <p className="font-medium mb-1">Security features:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Script tags and event handlers are automatically removed</li>
                  <li>Only safe HTML elements and attributes are allowed</li>
                  <li>Malicious code is stripped before saving</li>
                  <li>Content is validated in real-time</li>
                </ul>
              </div>
            </div>
          </div>
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
        <div className="flex justify-between items-center">
          <button
            onClick={handleValidateHtml}
            disabled={isValidating || !htmlContent.trim() || !user || loading}
            className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Validate & Preview'}
          </button>

          <button
            onClick={handleSaveHtml}
            disabled={isSaving || !htmlContent.trim() || !user || loading}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save HTML'}
          </button>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className={`p-4 rounded-lg border ${
            validationResult.wasModified 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center">
              {validationResult.wasModified ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              )}
              <p className={`text-sm font-medium ${
                validationResult.wasModified ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {validationResult.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-4 h-4 mr-2 text-primary-600" />
              Preview (Sanitized Content)
            </h4>
            
            {previewHtml ? (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[200px]">
                <div 
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                  {htmlContent.trim() ? 'Click "Validate & Preview" to see how your HTML will look' : 'No content to preview'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">💡 Tips for Custom HTML</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Use semantic HTML elements for better accessibility</p>
          <p>• Test your HTML in the preview before saving</p>
          <p>• Keep your HTML simple and focused for better performance</p>
          <p>• Avoid inline styles when possible - use CSS classes instead</p>
        </div>
      </div>
    </div>
  );
}