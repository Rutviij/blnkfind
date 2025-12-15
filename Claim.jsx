import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, CheckCircle, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '../components/Navbar';
import DotPattern from '../components/DotPattern';
import ItemCard from '../components/ItemCard';

const categories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Books',
  'Accessories',
  'Sports Equipment',
  'Keys',
  'ID/Cards',
  'Other',
];

export default function Claim() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimForm, setClaimForm] = useState({
    claimant_name: '',
    claimant_email: '',
    claimant_phone: '',
    proof_of_ownership: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['foundItems'],
    queryFn: () => base44.entities.FoundItem.filter({ status: 'approved' }),
  });

  const claimMutation = useMutation({
    mutationFn: (data) => base44.entities.ClaimRequest.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setSelectedItem(null);
    },
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location_found.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    await claimMutation.mutateAsync({
      item_id: selectedItem.id,
      item_name: selectedItem.item_name,
      ...claimForm,
      status: 'pending',
    });
  };

  const openClaimModal = (item) => {
    setSelectedItem(item);
    setClaimForm({
      claimant_name: '',
      claimant_email: '',
      claimant_phone: '',
      proof_of_ownership: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-white relative">
      <DotPattern />
      <Navbar currentPage="Claim" />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#473472] mb-4">Find Your Lost Item</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Browse through found items and submit a claim request if you recognize your belongings.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#87BAC3]/20 p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by item name, description, or location..."
                  className="pl-12 rounded-xl border-[#87BAC3]/30 focus:border-[#473472] h-12"
                />
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="rounded-xl border-[#87BAC3]/30 h-12">
                    <Filter size={18} className="mr-2 text-gray-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#473472]" size={48} />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[#87BAC3]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-[#53629E]" />
              </div>
              <h3 className="text-xl font-semibold text-[#473472] mb-2">No Items Found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'All Categories' 
                  ? 'Try adjusting your search or filters'
                  : 'There are no approved items at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} onClaim={openClaimModal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#473472]">
              {submitted ? 'Claim Submitted!' : `Claim: ${selectedItem?.item_name}`}
            </DialogTitle>
          </DialogHeader>
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Your claim has been submitted. An admin will review it and contact you shortly.
              </p>
              <Button onClick={() => setSelectedItem(null)} className="bg-[#473472] hover:bg-[#53629E]">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleClaimSubmit} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label className="text-[#473472]">Your Name *</Label>
                <Input
                  value={claimForm.claimant_name}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, claimant_name: e.target.value }))}
                  placeholder="Your full name"
                  required
                  className="rounded-xl border-[#87BAC3]/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#473472]">Your Email *</Label>
                <Input
                  type="email"
                  value={claimForm.claimant_email}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, claimant_email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                  className="rounded-xl border-[#87BAC3]/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#473472]">Phone Number</Label>
                <Input
                  value={claimForm.claimant_phone}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, claimant_phone: e.target.value }))}
                  placeholder="Optional"
                  className="rounded-xl border-[#87BAC3]/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#473472]">Proof of Ownership *</Label>
                <Textarea
                  value={claimForm.proof_of_ownership}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, proof_of_ownership: e.target.value }))}
                  placeholder="Describe unique features or provide details that prove this item belongs to you..."
                  required
                  className="rounded-xl border-[#87BAC3]/30 min-h-[120px]"
                />
              </div>
              
              <Button
                type="submit"
                disabled={claimMutation.isPending}
                className="w-full py-6 bg-[#473472] hover:bg-[#53629E] rounded-xl font-semibold"
              >
                {claimMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </span>
                ) : (
                  'Submit Claim Request'
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
