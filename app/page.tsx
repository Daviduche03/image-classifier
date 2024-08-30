"use client"

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [classification, setClassification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelVariant, setModelVariant] = useState('default');

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Upload image to Cloudinary via our backend
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error || 'Upload failed');

      const uploadedImageUrl = uploadData.url;
      setImageUrl(uploadedImageUrl);

      // Classify the image
      const classifyResponse = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadedImageUrl, modelVariant }),
      });

      const classifyData = await classifyResponse.json();
      setClassification(classifyData);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Image Classifier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Image Classifier</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Upload an Image</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="picture" className="text-sm font-medium text-gray-600">Select Image</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="model-variant" className="text-sm font-medium text-gray-600">Model Variant</Label>
                <Select onValueChange={setModelVariant} defaultValue={modelVariant}>
                  <SelectTrigger id="model-variant" className="mt-1">
                    <SelectValue placeholder="Select a model variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="accurate">Accurate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Preview</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : imageUrl ? (
              <div className="relative h-64">
                <Image src={imageUrl} alt="Uploaded image" fill style={{objectFit: 'contain'}} className="rounded-lg" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                <p className="text-gray-500">No image uploaded</p>
              </div>
            )}
          </Card>
        </div>

        {classification && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Classification Result</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-800">
              {JSON.stringify(classification, null, 2)}
            </pre>
          </Card>
        )}
      </main>
    </div>
  );
}