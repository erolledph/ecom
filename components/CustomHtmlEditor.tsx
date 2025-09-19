'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { updateCustomHtml, validateCustomHtml } from '@/lib/customHtml';
import { Eye, Save, AlertTriangle, CheckCircle, Code, Loader } from 'lucide-react';

interface CustomHtmlEditorProps {
  storeId: string;
  initialHtml?: string;
  onSave?: (sanitizedHtml: string) => void;
}

export default function CustomHtmlEditor({ storeId, initialHtml = '', onSave }: CustomHtmlEditorProps) {
  const { user } = useAuth();
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
      const result = await validateCustomHtml(htmlContent);
      setPreviewHtml(result.sanitizedHtml);
      setValidationResult({
        wasModified: result.wasModified,
        message: result.message
      });

      if (result.wasModified) {
        showWarning('Some content was removed for security reasons. Check the preview.');
      } else {
        showInfo('HTML is safe and ready to use.');
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      showError('Failed to validate HTML: ' + error.message);
      setPreviewHtml('');
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  // Save HTML content with server-side sanitization
  const handleSaveHtml = async () => {
    if (!user) {
      showError('You must be logged in to save custom HTML.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateCustomHtml(storeId, htmlContent);
      
      if (result.success) {
        showSuccess(result.message);
        
        // Update preview with sanitized content
        setPreviewHtml(result.sanitizedHtml);
        
        // Call onSave callback if provided
        if (onSave) {
          onSave(result.sanitizedHtml);
        }
        
        // Check if content was modified during sanitization
        if (result.sanitizedHtml !== htmlContent) {
          showWarning('Some content was sanitized for security. The saved version may differ slightly.');
          setHtmlContent(result.sanitizedHtml); // Update editor with sanitized version
        }
      }
    } catch (error: any) {
      console.error('Save error:', error);
      showError('Failed to save custom HTML: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

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
            disabled={isValidating || !htmlContent.trim() || !user}
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
            disabled={isSaving || !htmlContent.trim() || !user}
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
    </div>
  );
}