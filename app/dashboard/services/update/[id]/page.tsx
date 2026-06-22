"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import { Service, UpdateServiceRequest } from '../../service';
import { ServiceService } from '../../services.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/dashboard/components/ui/card';
import { Input } from '@/app/dashboard/components/ui/input';
import { Textarea } from '@/app/dashboard/components/ui/textarea';
import { Button } from '@/app/dashboard/components/ui/button';
import { Label } from '@/app/dashboard/components/ui/label';
import { Skeleton } from '@/app/dashboard/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/dashboard/components/ui/select';

const UpdateServicePage = () => {
  const [service, setService] = useState<Service | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'general' | 'design'>('general');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [featured, setFeatured] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  useEffect(() => {
    if (id) {
      const serviceId = Number(id);
      if (!Number.isNaN(serviceId)) {
        const serviceService = new ServiceService();
        serviceService.getServiceById(serviceId).then((res) => {
          const data = res?.data;
          if (!data) return;
          setService(data);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setContent(data.content || '');
          setSlug(data.slug || '');
          setType(data.type ?? 'general');
          setFeatured(data.featured ?? true);

          // Set image preview for the current image (if available)
          if (data.image) {
            setImagePreviewUrl(data.image.url);
          }
          // Set icon preview for the current icon (if available)
          if (data.url) {
            setIconPreviewUrl(data.url);
          }
        });
      }
    }
  }, [id]);

  const handleSubmit = async () => {
    if (service) {
      const serviceService = new ServiceService();
      const payload: UpdateServiceRequest = {
        id: service.id,
        title,
        description,
        content,
        type,
        slug,
        image,
        icon,
        featured,
      };
      setSaving(true);
      try {
        await serviceService.updateService(payload);
        toast.success('Service updated');
        router.push('/dashboard/services');
      } catch (err: any) {
        const details = err?.details ?? err?.message ?? 'Update failed';
        toast.error(typeof details === 'string' ? details : JSON.stringify(details));
      } finally {
        setSaving(false);
      }
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

  if (!service)
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 max-w-full">
              <div className="space-y-2">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-28 mb-2" />
                <Skeleton className="h-24 w-full rounded" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>

              <div className="space-y-2 flex items-center gap-4">
                <Skeleton className="h-32 w-32 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>

              <div>
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Service</CardTitle>
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

            {/* Service Type Select */}
            <div className="space-y-2">
              <Label htmlFor="type">Service Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as 'general' | 'design')}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
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
              {saving ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateServicePage;