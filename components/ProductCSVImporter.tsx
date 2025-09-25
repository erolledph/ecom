'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import PremiumFeatureGate from '@/components/PremiumFeatureGate';
import { isPremium } from '@/lib/auth';
import { addProductsBatch, Product } from '@/lib/store';
import Papa from 'papaparse';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface CSVProduct {
  title: string;
  description: string;
  price: string;
  category: string;
  productLink: string;
  imageUrl: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export default function ProductCSVImporter() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importResults, setImportResults] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);


  const validateProduct = (product: CSVProduct, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!product.title?.trim()) {
      errors.push({ row: rowIndex, field: 'title', message: 'Title is required' });
    }
    
    if (!product.description?.trim()) {
      errors.push({ row: rowIndex, field: 'description', message: 'Description is required' });
    }
    
    if (!product.price?.trim()) {
      errors.push({ row: rowIndex, field: 'price', message: 'Price is required' });
    } else {
      const price = parseFloat(product.price);
      if (isNaN(price) || price < 0) {
        errors.push({ row: rowIndex, field: 'price', message: 'Price must be a valid positive number' });
      }
    }
    
    if (!product.category?.trim()) {
      errors.push({ row: rowIndex, field: 'category', message: 'Category is required' });
    }
    
    if (!product.productLink?.trim()) {
      errors.push({ row: rowIndex, field: 'productLink', message: 'Product link is required' });
    } else {
      try {
        new URL(product.productLink);
      } catch {
        errors.push({ row: rowIndex, field: 'productLink', message: 'Product link must be a valid URL' });
      }
    }
    
    if (product.imageUrl?.trim()) {
      try {
        new URL(product.imageUrl);
      } catch {
        errors.push({ row: rowIndex, field: 'imageUrl', message: 'Image URL must be a valid URL' });
      }
    }
    
    return errors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      showError('Please select a valid CSV file');
      return;
    }

    setIsImporting(true);
    setValidationErrors([]);
    setImportResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const csvData = results.data as CSVProduct[];
          const allErrors: ValidationError[] = [];
          const validProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [];

          // Validate each product
          csvData.forEach((product, index) => {
            const errors = validateProduct(product, index + 2); // +2 because CSV rows start at 2 (header is row 1)
            allErrors.push(...errors);

            if (errors.length === 0) {
              validProducts.push({
                title: product.title.trim(),
                description: product.description.trim(),
                price: parseFloat(product.price),
                category: product.category.trim(),
                productLink: product.productLink.trim(),
                images: product.imageUrl?.trim() ? [product.imageUrl.trim()] : [],
                storeId: user!.uid
              });
            }
          });

          setValidationErrors(allErrors);

          if (allErrors.length > 0) {
            showWarning(`Found ${allErrors.length} validation errors. Please check the details below.`);
          }

          if (validProducts.length > 0) {
            // Import valid products
            await addProductsBatch(validProducts, user!.uid, isPremium(userProfile));
            
            setImportResults({
              total: csvData.length,
              successful: validProducts.length,
              failed: csvData.length - validProducts.length
            });

            if (validProducts.length === csvData.length) {
              showSuccess(`Successfully imported ${validProducts.length} products!`);
            } else {
              showWarning(`Imported ${validProducts.length} products. ${csvData.length - validProducts.length} products failed validation.`);
            }

            // Refresh the page after successful import
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            showError('No valid products found to import. Please check your CSV file.');
          }
        } catch (error) {
          console.error('Error importing products:', error);
          showError(error instanceof Error ? error.message : 'Failed to import products. Please try again.');
        } finally {
          setIsImporting(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        showError('Failed to parse CSV file. Please check the file format.');
        setIsImporting(false);
      }
    });
  };

  const downloadTemplate = () => {
    const template = `title,description,price,category,productLink,imageUrl
"Wireless Bluetooth Headphones","High-quality wireless headphones with noise cancellation",99.99,"Electronics","https://example.com/affiliate-link-1","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
"Organic Cotton T-Shirt","Comfortable organic cotton t-shirt in various colors",29.99,"Fashion","https://example.com/affiliate-link-2","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
"Stainless Steel Water Bottle","Insulated water bottle keeps drinks cold for 24 hours",24.99,"Home & Garden","https://example.com/affiliate-link-3","https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <PremiumFeatureGate feature="csv_import" showUpgrade={false}>
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Upload className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Import Products from CSV</h3>
            <p className="text-sm text-gray-600">Upload a CSV file to add multiple products at once</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Instructions
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center px-3 py-2 text-sm bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </button>
        </div>
      </div>

      {/* Instructions Panel */}
      {showInstructions && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">CSV Format Instructions</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Required columns:</strong> title, description, price, category, productLink</p>
                <p><strong>Optional columns:</strong> imageUrl</p>
                <div className="mt-3">
                  <p className="font-medium mb-1">Column descriptions:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>title:</strong> Product name (required)</li>
                    <li><strong>description:</strong> Product description (required)</li>
                    <li><strong>price:</strong> Product price as a number (required)</li>
                    <li><strong>category:</strong> Product category name (required)</li>
                    <li><strong>productLink:</strong> Affiliate link URL (required)</li>
                    <li><strong>imageUrl:</strong> Direct link to product image (optional)</li>
                  </ul>
                </div>
                <p className="text-xs mt-2 font-medium">💡 Tip: Download the template above to get started with the correct format.</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-8 h-8 mb-2 ${isImporting ? 'text-primary-600 animate-bounce' : 'text-gray-400'}`} />
            <p className="mb-2 text-sm text-gray-500">
              {isImporting ? (
                <span className="font-semibold text-primary-600">Processing CSV file...</span>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> your CSV file
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="hidden"
          />
        </label>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">Import Complete</h4>
          </div>
          <div className="text-sm text-green-800">
            <p>Total products processed: <strong>{importResults.total}</strong></p>
            <p>Successfully imported: <strong>{importResults.successful}</strong></p>
            {importResults.failed > 0 && (
              <p>Failed validation: <strong>{importResults.failed}</strong></p>
            )}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900">Validation Errors ({validationErrors.length})</h4>
          </div>
          <div className="max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm text-red-800">
                  <strong>Row {error.row}:</strong> {error.field} - {error.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </PremiumFeatureGate>
  );
}