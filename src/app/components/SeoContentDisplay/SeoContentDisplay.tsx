import React from 'react';

interface SeoContentProps {
  seoTitle: string;
  seoDescription: string;
  productDescription: string;
  features: string[];
}

const SeoContentDisplay: React.FC<SeoContentProps> = ({ seoTitle, seoDescription, productDescription, features }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Generated SEO Content
      </h2>

      <div className="p-4 bg-blue-50 shadow-sm rounded-lg border-l-4 border-purple-500 mb-4">
        <h3 className="text-lg font-semibold text-purple-700">SEO Title</h3>
        <p className="text-gray-700">{seoTitle}</p>
      </div>

      <div className="p-4 bg-blue-50 shadow-sm rounded-lg border-l-4 border-indigo-500 mb-4">
        <h3 className="text-lg font-semibold text-indigo-700">SEO Description</h3>
        <p className="text-gray-700">{seoDescription}</p>
      </div>

      <div className="p-4 bg-blue-50 shadow-sm rounded-lg border-l-4 border-blue-500 mb-4">
        <h3 className="text-lg font-semibold text-blue-700">Product Description</h3>
        <p className="text-gray-700">{productDescription}</p>
      </div>

      <div className="p-4 bg-blue-50 shadow-sm rounded-lg border-l-4 border-green-500">
        <h3 className="text-lg font-semibold text-green-700">Features</h3>
        <ul className="list-disc pl-6 text-gray-700">
          {features.map((feature, index) => (
            <li key={index} className="py-1">{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SeoContentDisplay;
