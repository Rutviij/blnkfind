import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Package, Users, CheckCircle, XCircle, Clock, 
  Eye, Trash2, Check, X, Loader2, AlertCircle, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '../components/Navbar';
import DotPattern from '../components/DotPattern';

export default function Admin() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const navigate = useNavigate();

  // Check if admin is logged in
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate(createPageUrl('AdminLogin'));
  };
  
  const queryClient = useQueryClient();

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['allItems'],
    queryFn: () => base44.entities.FoundItem.list('-created_date'),
  });

  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ['allClaims'],
    queryFn: () => base44.entities.ClaimRequest.list('-created_date'),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FoundItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allItems'] }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id) => base44.entities.FoundItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allItems'] }),
  });

  const updateClaimMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClaimRequest.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allClaims'] }),
  });

  const pendingItems = items.filter(i => i.status === 'pending');
  const approvedItems = items.filter(i => i.status === 'approved');
  const pendingClaims = claims.filter(c => c.status === 'pending');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    claimed: 'bg-blue-100 text-blue-800',
  };

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#87BAC3]/20">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="text-3xl font-bold text-[#473472] mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative">
      <DotPattern />
      <Navbar currentPage="Admin" />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-[#473472] mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage found items and claim requests</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-[#473472] text-[#473472] hover:bg-[#473472] hover:text-white rounded-xl"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard icon={Clock} value={pendingItems.length} label="Pending Items" color="bg-yellow-500" />
            <StatCard icon={Package} value={approvedItems.length} label="Approved Items" color="bg-green-500" />
            <StatCard icon={Users} value={pendingClaims.length} label="Pending Claims" color="bg-[#53629E]" />
            <StatCard icon={CheckCircle} value={items.filter(i => i.status === 'claimed').length} label="Items Claimed" color="bg-[#473472]" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="items" className="space-y-6">
            <TabsList className="bg-[#87BAC3]/10 p-1 rounded-xl">
              <TabsTrigger value="items" className="rounded-lg data-[state=active]:bg-[#473472] data-[state=active]:text-white px-6">
                Found Items
              </TabsTrigger>
              <TabsTrigger value="claims" className="rounded-lg data-[state=active]:bg-[#473472] data-[state=active]:text-white px-6">
                Claim Requests
              </TabsTrigger>
            </TabsList>

            {/* Found Items Tab */}
            <TabsContent value="items">
              {itemsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-[#473472]" size={48} />
                </div>
              ) : items.length === 0 ? (
                <Alert className="bg-[#87BAC3]/10 border-[#87BAC3]/30">
                  <AlertCircle className="text-[#53629E]" />
                  <AlertDescription>No items have been reported yet.</AlertDescription>
                </Alert>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#87BAC3]/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#87BAC3]/10">
                        <tr>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Item</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Category</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Location</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Date</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Status</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#87BAC3]/20">
                        {items.map(item => (
                          <tr key={item.id} className="hover:bg-[#87BAC3]/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {item.photo_url && (
                                  <img src={item.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                )}
                                <span className="font-medium text-[#473472]">{item.item_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{item.category}</td>
                            <td className="px-6 py-4 text-gray-600">{item.location_found}</td>
                            <td className="px-6 py-4 text-gray-600">
                              {format(new Date(item.date_found), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={statusColors[item.status]}>
                                {item.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedItem(item)}
                                  className="text-[#53629E]"
                                >
                                  <Eye size={16} />
                                </Button>
                                {item.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => updateItemMutation.mutate({ id: item.id, data: { status: 'approved' } })}
                                      className="text-green-600"
                                    >
                                      <Check size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => updateItemMutation.mutate({ id: item.id, data: { status: 'rejected' } })}
                                      className="text-red-600"
                                    >
                                      <X size={16} />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteItemMutation.mutate(item.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Claims Tab */}
            <TabsContent value="claims">
              {claimsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-[#473472]" size={48} />
                </div>
              ) : claims.length === 0 ? (
                <Alert className="bg-[#87BAC3]/10 border-[#87BAC3]/30">
                  <AlertCircle className="text-[#53629E]" />
                  <AlertDescription>No claim requests have been submitted yet.</AlertDescription>
                </Alert>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#87BAC3]/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#87BAC3]/10">
                        <tr>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Item</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Claimant</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Email</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#473472]">Date</th>
 
