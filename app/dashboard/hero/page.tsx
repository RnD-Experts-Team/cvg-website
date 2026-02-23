"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HeroService } from "./hero.service";
import { HeroSection } from "./hero";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

const MAX_VIDEO_SIZE_MB = 50;

export default function HeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<HeroSection | null>(null);
  const [newMedia, setNewMedia] = useState<File[]>([]);

  useEffect(() => {
    fetchHero();
  }, []);

  async function fetchHero() {
    try {
      setLoading(true);
      const res = await HeroService.get();
      setData(res.data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load hero section");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!data) return;

    try {
      setSaving(true);

      // ✅ Validate video size before upload
      for (const file of newMedia) {
        if (file.type.startsWith("video")) {
          const sizeMB = file.size / 1024 / 1024;

          if (sizeMB > MAX_VIDEO_SIZE_MB) {
            toast.error(
              `Video "${file.name}" exceeds ${MAX_VIDEO_SIZE_MB}MB limit.`
            );
            setSaving(false);
            return;
          }
        }
      }

      const fd = new FormData();

      fd.append("title", data.title);
      fd.append("subtitle", data.subtitle);
      fd.append("button_text", data.button_text);
      fd.append("button_link", data.button_link);

      newMedia.forEach((file, index) => {
        fd.append(`media[${index}][file]`, file);
        fd.append(`media[${index}][alt_text]`, file.name);
        fd.append(`media[${index}][title]`, file.name);
        fd.append(`media[${index}][sort_order]`, String(index + 1));
      });

      const res = await HeroService.update(fd);

      toast.success(res.message || "Hero updated successfully");
      fetchHero();
      setNewMedia([]);
    } catch (err: any) {
      console.error("Upload error:", err);

      const backendMessage =
        err?.details?.message ||
        err?.details?.error ||
        (typeof err?.details === "object"
          ? JSON.stringify(err.details)
          : null) ||
        err?.message ||
        "Update failed";

      toast.error(backendMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return <div className="p-6">Loading hero section...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Fields */}
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={data.title}
                onChange={(e) =>
                  setData({ ...data, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={data.subtitle}
                onChange={(e) =>
                  setData({ ...data, subtitle: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Button Text</Label>
              <Input
                value={data.button_text}
                onChange={(e) =>
                  setData({ ...data, button_text: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Button Link</Label>
              <Input
                value={data.button_link}
                onChange={(e) =>
                  setData({ ...data, button_link: e.target.value })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Existing Media */}
          <div className="space-y-4">
            <h3 className="font-semibold">Current Media</h3>

            <div className="grid grid-cols-2 gap-4">
              {data.media.map((item) => {
                const isVideo =
                  item.media.mime_type?.startsWith("video");

                return (
                  <div
                    key={item.id}
                    className="border rounded p-2"
                  >
                    {isVideo ? (
                      <video
                        src={item.media.url}
                        controls
                        className="w-full rounded"
                      />
                    ) : (
                      <img
                        src={item.media.url}
                        alt={item.media.alt_text}
                        className="w-full rounded object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Upload New Media */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              Upload New Media (Images or Videos)
            </h3>

            <Input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) =>
                setNewMedia(
                  e.target.files
                    ? Array.from(e.target.files)
                    : []
                )
              }
            />

            {newMedia.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {newMedia.map((file, index) => {
                  const previewUrl =
                    URL.createObjectURL(file);
                  const isVideo =
                    file.type.startsWith("video");

                  return (
                    <div
                      key={index}
                      className="border rounded p-2"
                    >
                      {isVideo ? (
                        <video
                          src={previewUrl}
                          controls
                          className="w-full rounded"
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          className="w-full rounded object-cover"
                        />
                      )}

                      <p className="text-sm mt-2 truncate">
                        {file.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          <Button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Update Hero Section"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}