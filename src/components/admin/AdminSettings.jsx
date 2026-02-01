"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Shield, Settings as SettingsIcon, User, Upload } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

export function AdminSettings() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addresss: "",
    city: "",
    state: "",
    pincode: "",
    profileImageUrl: ""
  });

  // Settings State
  const [settings, setSettings] = useState({
    platformCommissionRate: 5,
    minimumOrderValue: 100,
    orderAutoCancelHours: 24,
    refundProcessingDays: 7,
    returnWindowDays: 3,
    autoApproveFarmers: false,
    autoApproveBuyers: true,
    emailVerificationRequired: false,
    sessionTimeoutMinutes: 60,
    productApprovalRequired: false,
    maxProductsPerFarmer: 100,
    maxProductImageSizeMB: 5,
    cashOnDeliveryEnabled: true,
    onlinePaymentEnabled: true,
    gstRate: 5
  });

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/admin/profile");
      const data = response.data;
      console.log("Fetched profile data:", data);
      setProfile({
        firstName: data.first_name || "",
        lastName: data.Last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        addresss: data.addresss || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        profileImageUrl: data.profileImageUrl || ""
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile");
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/settings");
      setSettings(response.data);
    } catch (error) {
      toast.error("Failed to load settings");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setProfileLoading(true);
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        addresss: profile.addresss,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode
      };
      console.log("Sending update data:", updateData);
      const response = await api.put("/admin/profile", updateData);
      console.log("Update response:", response.data);
      toast.success("Profile updated successfully");
      // Refresh profile data after update
      await fetchProfile();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await api.post("/admin/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setProfile({ ...profile, profileImageUrl: response.data.imageUrl });
      toast.success("Profile image updated successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setLoading(true);
      await api.put("/admin/settings", settings);
      toast.success("Settings updated successfully");
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and your profile</p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg py-2 font-semibold px-6">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg py-2 font-semibold px-6">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System Configuration
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Admin Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center gap-6 p-6 rounded-lg bg-muted/20 border">
                <Avatar className="w-24 h-24 border-4 border-primary/10">
                  <AvatarImage src={profile.profileImageUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <Button 
                      className="font-semibold" 
                      size="sm"
                      disabled={imageUploading}
                      onClick={() => document.getElementById('profile-image-input').click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imageUploading ? "Uploading..." : "Update Image"}
                    </Button>
                    <input
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Max size: 5MB. Supported: JPG, PNG</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input 
                    value={profile.addresss}
                    onChange={(e) => setProfile({...profile, addresss: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    value={profile.city}
                    onChange={(e) => setProfile({...profile, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input 
                    value={profile.state}
                    onChange={(e) => setProfile({...profile, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input 
                    value={profile.pincode}
                    onChange={(e) => setProfile({...profile, pincode: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={handleProfileUpdate} 
                disabled={profileLoading}
                className="font-semibold px-8"
              >
                {profileLoading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Revenue & Pricing */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Revenue & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Commission Rate (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={settings.platformCommissionRate}
                    onChange={(e) => handleSettingChange('platformCommissionRate', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Your cut from each order</p>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Order Value (₹)</Label>
                  <Input 
                    type="number"
                    value={settings.minimumOrderValue}
                    onChange={(e) => handleSettingChange('minimumOrderValue', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Min cart value to checkout</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Order Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Auto-Cancel Orders (hours)</Label>
                  <Input 
                    type="number"
                    value={settings.orderAutoCancelHours}
                    onChange={(e) => handleSettingChange('orderAutoCancelHours', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Refund Processing (days)</Label>
                  <Input 
                    type="number"
                    value={settings.refundProcessingDays}
                    onChange={(e) => handleSettingChange('refundProcessingDays', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Return Window (days)</Label>
                  <Input 
                    type="number"
                    value={settings.returnWindowDays}
                    onChange={(e) => handleSettingChange('returnWindowDays', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <Label className="font-semibold">Auto-Approve Farmers</Label>
                    <p className="text-xs text-muted-foreground mt-1">New farmers active immediately</p>
                  </div>
                  <Switch 
                    checked={settings.autoApproveFarmers}
                    onCheckedChange={(checked) => handleSettingChange('autoApproveFarmers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <Label className="font-semibold">Auto-Approve Buyers</Label>
                    <p className="text-xs text-muted-foreground mt-1">New buyers active immediately</p>
                  </div>
                  <Switch 
                    checked={settings.autoApproveBuyers}
                    onCheckedChange={(checked) => handleSettingChange('autoApproveBuyers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <Label className="font-semibold">Email Verification Required</Label>
                    <p className="text-xs text-muted-foreground mt-1">Force email verification on signup</p>
                  </div>
                  <Switch 
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(checked) => handleSettingChange('emailVerificationRequired', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input 
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => handleSettingChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Management */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Product Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                <div>
                  <Label className="font-semibold">Product Approval Required</Label>
                  <p className="text-xs text-muted-foreground mt-1">Admin must approve new products</p>
                </div>
                <Switch 
                  checked={settings.productApprovalRequired}
                  onCheckedChange={(checked) => handleSettingChange('productApprovalRequired', checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Products per Farmer</Label>
                  <Input 
                    type="number"
                    value={settings.maxProductsPerFarmer}
                    onChange={(e) => handleSettingChange('maxProductsPerFarmer', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Image Size (MB)</Label>
                  <Input 
                    type="number"
                    value={settings.maxProductImageSizeMB}
                    onChange={(e) => handleSettingChange('maxProductImageSizeMB', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Tax */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Payment & Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <Label className="font-semibold">Cash on Delivery</Label>
                    <p className="text-xs text-muted-foreground mt-1">Enable COD payment method</p>
                  </div>
                  <Switch 
                    checked={settings.cashOnDeliveryEnabled}
                    onCheckedChange={(checked) => handleSettingChange('cashOnDeliveryEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <Label className="font-semibold">Online Payment</Label>
                    <p className="text-xs text-muted-foreground mt-1">Enable online payment gateway</p>
                  </div>
                  <Switch 
                    checked={settings.onlinePaymentEnabled}
                    onCheckedChange={(checked) => handleSettingChange('onlinePaymentEnabled', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GST Rate (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={settings.gstRate}
                    onChange={(e) => handleSettingChange('gstRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSettingsUpdate}
              disabled={loading}
              className="font-semibold px-8"
              size="lg"
            >
              {loading ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
