"use client"
import { useState } from 'react'
import SeoContentDisplay from '@components/SeoContentDisplay/SeoContentDisplay';

interface SeoContent {
  seo_title: string;
  seo_description: string;
  product_description: string;
  features: string[];
}

const Home = () => {
  const [productCategory, setProductCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [features, setFeatures] = useState('')
  const [usage, setUsage] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [seoContent, setSeoContent] = useState<SeoContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous error and set loading
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('product_input', JSON.stringify({
      product_category: productCategory,
      brand: brand,
      features: JSON.parse(features),
      usage: usage,
    }))
    
    images.forEach(image => {
      formData.append('images', image)
    })

    try {
      const response = await fetch('http://localhost:8000/generate-product-seo/', {
        method: 'POST',
        body: formData,  // FormData automatically sets the correct headers
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate SEO content');
      }
  
      const responseData = await response.json();  // Parse the response body as JSON
      setSeoContent(responseData.seo_content);

  
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <h1 className="text-center text-2xl font-extrabold text-blue-700 mb-4">
        Generate SEO Content for Products
      </h1>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left Section - Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-blue-700">
                Product Category
              </label>
              <input
                type="text"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-blue-700">
                Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-blue-700">
                Features (JSON format)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px] transition-all"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-blue-700">
                Usage
              </label>
              <input
                type="text"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-blue-700">
                Upload Images
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:opacity-90 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0116 0H4z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate SEO Content"
              )}
            </button>

            {error && (
              <p className="text-red-500 text-center font-semibold">{error}</p>
            )}
          </form>
        </div>

        {/* Right Section - SEO Content */}
        <div className="w-full">
          {seoContent && (
            <SeoContentDisplay
              seoTitle={seoContent.seo_title}
              seoDescription={seoContent.seo_description}
              productDescription={seoContent.product_description}
              features={seoContent.features}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;