"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SiteMetadata } from "./site-metadata";
import { SiteMetadataService } from "./site-metadata.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";

export default function SiteMetadataPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SiteMetadata | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    try {
      setLoading(true);
      const res = await SiteMetadataService.get();
      setData(res.data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load site metadata");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!data) return;

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("description", data.description);
      fd.append("keywords", data.keywords);
      fd.append("title", data.title || "");

      fd.append("logo_alt_text", data.logo?.alt_text || "");
      fd.append("logo_title", data.logo?.title || "");
      fd.append("favicon_alt_text", data.favicon?.alt_text || "");
      fd.append("favicon_title", data.favicon?.title || "");

      if (logoFile) fd.append("logo", logoFile);
      if (faviconFile) fd.append("favicon", faviconFile);

      const res = await SiteMetadataService.update(fd);

      toast.success(res.message || "Updated successfully");
      fetchMetadata();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return <div className="p-6">Loading site metadata...</div>;
  }

  return (
    <div className="p-6 max-w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Metadata</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            {/* 
            <div>
              <Label>Title</Label>
              <Input
                value={data.title || ""}
                onChange={(e) =>
                  setData({ ...data, title: e.target.value })
                }
              />
            </div> */}

            <div>
              <Label>Description</Label>
              <Textarea
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Keywords</Label>
              <Input
                value={data.keywords}
                onChange={(e) => setData({ ...data, keywords: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Logo */}
          {/* Logo */}
          <div className="space-y-4">
            <h3 className="font-semibold">Logo</h3>

            <img
              src={
                logoFile
                  ? URL.createObjectURL(logoFile) // 🔥 preview selected file
                  : data.logo?.url || "/placeholder.png"
              }
              alt={data.logo?.alt_text || "Logo"}
              className="h-20 object-contain border rounded p-2"
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />

            <Input
              placeholder="Logo Alt Text"
              value={data.logo?.alt_text || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  logo: {
                    ...(data.logo || {}),
                    alt_text: e.target.value,
                  } as any,
                })
              }
            />

            <Input
              placeholder="Logo Title"
              value={data.logo?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  logo: {
                    ...(data.logo || {}),
                    title: e.target.value,
                  } as any,
                })
              }
            />
          </div>

          <Separator />

          {/* Favicon */}
          {/* Favicon */}
          <div className="space-y-4">
            <h3 className="font-semibold">Favicon</h3>

            <img
              src={
                faviconFile
                  ? URL.createObjectURL(faviconFile) // 🔥 preview selected file
                  : data.favicon?.url || "/placeholder.png"
              }
              alt={data.favicon?.alt_text || "Favicon"}
              className="h-10 object-contain border rounded p-2"
            />

            <Input
              type="file"
              accept="image/*,.ico"
              onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
            />

            <Input
              placeholder="Favicon Alt Text"
              value={data.favicon?.alt_text || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  favicon: {
                    ...(data.favicon || {}),
                    alt_text: e.target.value,
                  } as any,
                })
              }
            />

            <Input
              placeholder="Favicon Title"
              value={data.favicon?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  favicon: {
                    ...(data.favicon || {}),
                    title: e.target.value,
                  } as any,
                })
              }
            />
          </div>

          <Separator />

          <Button onClick={handleUpdate} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Update Site Metadata"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
