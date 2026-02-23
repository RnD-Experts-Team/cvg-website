"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { ProjectsService } from "../projects.service";
import type { Category } from "../projects";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function CreateProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const imagePreviewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoadingCategories(true);
      const res = await ProjectsService.getCategories();
      const list = res.data ?? [];
      setCategories(list);
      if (list.length > 0) setCategoryId(String(list[0].id));
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  }

  async function handleCreate() {
    if (!title.trim()) return toast.error("Title is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!content.trim()) return toast.error("Content is required");
    if (!categoryId) return toast.error("Category is required");

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("content", content);
      fd.append("featured", "1");
      fd.append("category_id", categoryId);

      // ✅ Image (matches your Postman keys)
      if (imageFile) {
        fd.append("images[0][file]", imageFile);
        fd.append("images[0][alt_text]", imageFile.name);
        fd.append("images[0][title]", imageFile.name);
        fd.append("images[0][sort_order]", "1");
      }

      await ProjectsService.createProject(fd);

      toast.success("Project created successfully");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-full">
      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Content</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            {loadingCategories ? (
              <div className="text-sm text-muted-foreground">Loading categories...</div>
            ) : (
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* ✅ Image Upload */}
          <div className="space-y-2">
            <Label>Project Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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

          <Button onClick={handleCreate} disabled={saving || loadingCategories}>
            {saving ? "Creating..." : "Create Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}