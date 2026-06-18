// page.tsx
"use client";

import { useState, useEffect } from "react";
import { AboutSection } from "./types";
import { getAboutSection, updateAboutSection } from "./about.service";
import { toast } from "react-toastify";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AboutPage() {
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAboutSection = async () => {
      setLoading(true);
      try {
        const res = await getAboutSection();
        const payload = res && typeof res === 'object' && 'data' in res ? (res as any).data : res;
        setAboutSection(payload ?? null);
      } catch (err) {
        toast.error("Failed to fetch About section data.");
      }
      finally {
        setLoading(false);
      }
    };
    fetchAboutSection();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (!aboutSection) return;
    setLoading(true);

    const updatedData: any = { ...aboutSection };

    try {
      let response: any;
      if (imageFile) {
        const form = new FormData();
        form.append('title', String(updatedData.title ?? ''));
        form.append('description', String(updatedData.description ?? ''));
        if (updatedData.image_media_id) form.append('image_media_id', String(updatedData.image_media_id));
        form.append('image', imageFile);

        response = await updateAboutSection(form as unknown as any);
      } else {
        response = await updateAboutSection(updatedData);
      }

      const updatedPayload = response && typeof response === 'object' && 'data' in response ? (response as any).data : response;
      setAboutSection(updatedPayload ?? null);
      toast.success('About section updated successfully!');
    } catch (err: any) {
      console.error('Error updating About section:', err);
      const details = err?.details ?? err?.response?.data ?? null;
      if (details) toast.error(String(typeof details === 'object' ? JSON.stringify(details) : details));
      else toast.error('Error updating About section.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !aboutSection) {
    return (
      <div className="p-6 max-w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full rounded" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
              <div className="mt-4">
                <Skeleton className="h-40 w-56 rounded" />
              </div>
            </div>
            <Skeleton className="h-10 w-40 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
        </CardHeader>

        <CardContent>
          {aboutSection ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={aboutSection.title}
                  onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={aboutSection.description}
                  onChange={(e) => setAboutSection({ ...aboutSection, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                />
                {aboutSection?.image?.url && (
                  <div className="mt-3">
                    <img
                      src={aboutSection.image.url}
                      alt={aboutSection.image?.alt_text}
                      width={aboutSection.image?.width}
                      height={aboutSection.image?.height}
                      className="max-w-[200px] rounded border"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
