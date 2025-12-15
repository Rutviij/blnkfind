import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Camera, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Navbar from '../components/Navbar';
import DotPattern from '../components/DotPattern';

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Accessories',
  'Sports Equipment',
  'Keys',
  'ID/Cards',
  'Other',
];

export default function Report() {
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    description: '',
    location_found: '',
    date_found: '',
    finder_name: '',
    finder_email: '',
    photo_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, photo_url: file_url }));
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await base44.entities.FoundItem.create({
      ...formData,
      status: 'pending',
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white relative">
        <DotPattern />
        <Navbar currentPage="Report" />
        
        <div className="pt-32 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#473472] mb-4">Item Reported Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for helping a fellow student. Your submission is pending admin review and will be listed shortly.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  item_name: '',
                  category: '',
                  description: '',
                  location_found: '',
                  date_found: '',
                  finder_name: '',
                  finder_email: '',
                  photo_url: '',
                });
              }}
              className="bg-[#473472] hover:bg-[#53629E]"
            >
              Report Another Item
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <DotPattern />
      <Navbar currentPage="Report" />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#473472] mb-4">Report a Found Item</h1>
            <p className="text-gray-600">Help reunite someone with their belongings by submitting details about the item you found.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-[#87BAC3]/20 p-8 space-y-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="text-[#473472]">Item Photo</Label>
              <div className="border-2 border-dashed border-[#87BAC3]/50 rounded-2xl p-8 text-center hover:border-[#473472]/50 transition-colors">
                {formData.photo_url ? (
                  <div className="relative">
                    <img 
                      src={formData.photo_url} 
                      alt="Uploaded" 
                      className="max-h-48 mx-auto rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('photo_url', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-[#473472]" size={32} />
                    <span className="text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-[#87BAC3]/20 rounded-xl flex items-center justify-center">
                      <Camera size={24} className="text-[#53629E]" />
                    </div>
                    <span className="text-gray-600">Click to upload a photo</span>
                    <span className="text-sm text-gray-400">PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#473472]">Item Name *</Label>
                <Input
                  value={formData.item_name}
                  onChange={(e) => handleInputChange('item_name', e.target.value)}
                  placeholder="e.g., Blue Backpack"
                  required
                  className="rounded-xl border-[#87BAC3]/30 focus:border-[#473472]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#473472]">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  required
                >
                  <SelectTrigger className="rounded-xl border-[#87BAC3]/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#473472]">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide additional details about the item (color, brand, distinguishing features...)"
                className="rounded-xl border-[#87BAC3]/30 focus:border-[#473472] min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#473472]">Location Found *</Label>
                <Input
                  value={formData.location_found}
                  onChange={(e) => handleInputChange('location_found', e.target.value)}
                  placeholder="e.g., Library, Room 201"
                  required
                  className="rounded-xl border-[#87BAC3]/30 focus:border-[#473472]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#473472]">Date Found *</Label>
                <Input
                  type="date"
                  value={formData.date_found}
                  onChange={(e) => handleInputChange('date_found', e.target.value)}
                  required
                  className="rounded-xl border-[#87BAC3]/30 focus:border-[#473472]"
                />
              </div>
            </div>

            {/* Finder Details */}
            <div className="pt-4 border-t border-[#87BAC3]/20">
              <h3 className="font-semibold text-[#473472] mb-4">Your Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#473472]">Your Name *</Label>
                  <Input
                    value={formData.finder_name}
                    onChange={(e) => handleInputChange('finder_name', e.target.value)}
                    placeholder="Your full name"
                    required
                    className="rounded-xl border-[#87BAC3]/30 focus:border-[#473472]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#473472]">Your Email *</Label>
                  <Input
                    type="email"
                    value={formData.finder_email}
                    onChange={(e) => handleInputChange('finder_email', e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="rounded-xl border-[#87BAC3]/30 focus:border-[#473472]"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-[#473472] hover:bg-[#53629E] rounded-xl text-lg font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Upload size={20} />
                  Submit Report
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
