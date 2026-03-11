"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ServiceService } from '../services.service';
import { CreateServiceRequest } from '../service';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; 
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

const CreateServicePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [featured, setFeatured] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async () => {
    setSaving(true);
    const serviceService = new ServiceService();
    const payload: CreateServiceRequest = {
      title,
      description,
      content,
      image,
      icon,
      featured,
      alt_text: title,
      image_title: title,
    };

    try {
      await serviceService.createService(payload);
      toast.success('Service created');
      router.push('/dashboard/services');
    } catch (err: any) {
      const details = err?.details ?? err?.message ?? 'Create failed';
      toast.error(typeof details === 'string' ? details : JSON.stringify(details));
      throw err;
    }
  };

  // Handle image file change and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  // Handle icon file change and preview
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIcon(file);
    if (file) {
      setIconPreviewUrl(URL.createObjectURL(file));
    } else {
      setIconPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Service</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 max-w-full">
            {/* Service Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Service Title"
              />
            </div>

            {/* Service Description Textarea */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Service Description"
              />
            </div>

            {/* Service Content Textarea */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter Content"
              />
            </div>

            {/* Service Image Input */}
            <div className="space-y-2">
              <Label>Service Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="h-24 w-24 rounded border object-cover"
                />
              ) : (
                <div className="text-sm text-muted-foreground">No image selected</div>
              )}
            </div>

            {/* Service Icon Input */}
            <div className="space-y-2">
              <Label>Service Icon</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
              />

              {iconPreviewUrl ? (
                <img
                  src={iconPreviewUrl}
                  alt="Icon Preview"
                  className="h-12 w-12 rounded border object-contain"
                />
              ) : (
                <div className="text-sm text-muted-foreground">No icon selected</div>
              )}
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} className="w-full">
              {saving ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateServicePage;