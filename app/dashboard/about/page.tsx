// page.tsx
"use client";

import { useState, useEffect } from "react";
import { AboutSection } from "./types";
import { getAboutSection, updateAboutSection } from "./about.service";
import { toast } from "react-toastify";  // If you want to show success/error messages
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

export default function AboutPage() {
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch about section data on page load
  useEffect(() => {
    const fetchAboutSection = async () => {
      try {
        const res = await getAboutSection();
        const payload = res && typeof res === 'object' && 'data' in res ? (res as any).data : res;
        setAboutSection(payload ?? null);
      } catch (err) {
        toast.error("Failed to fetch About section data.");
      }
    };
    fetchAboutSection();
  }, []);

  // Handle the image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle saving the updated data
  const handleSave = async () => {
    if (!aboutSection) return;
    setLoading(true);

    // Prepare the payload: keep `image` as an object to satisfy `AboutSection` type.
    const updatedData: any = { ...aboutSection };

    try {
      let response: any;
      if (imageFile) {
        // Send multipart form when a new image file is provided
        const form = new FormData();
        form.append('title', String(updatedData.title ?? ''));
        form.append('description', String(updatedData.description ?? ''));
        if (updatedData.image_media_id) form.append('image_media_id', String(updatedData.image_media_id));
        form.append('image', imageFile);

        response = await updateAboutSection(form as unknown as any);
      } else {
        // No file: send the typed object
        response = await updateAboutSection(updatedData);
      }

      // update state with returned AboutSection (unwrap ApiResponse if present)
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

  return (
    <div className="p-8 max-w-full">
      <h1 className="text-3xl font-bold mb-6"> About Section</h1>

      {aboutSection ? (
        <div>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={aboutSection.title}
              onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
              className="w-full mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={aboutSection.description}
              onChange={(e) => setAboutSection({ ...aboutSection, description: e.target.value })}
              className="w-full mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="image">Image</Label>
            <Input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full mt-2"
            />
            {aboutSection?.image?.url && (
              <div className="mt-4">
                <img
                  src={aboutSection.image.url}
                  alt={aboutSection.image?.alt_text}
                  width={aboutSection.image?.width}
                  height={aboutSection.image?.height}
                  className="max-w-[200px]"
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="mt-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}