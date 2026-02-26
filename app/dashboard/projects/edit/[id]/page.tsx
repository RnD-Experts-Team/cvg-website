"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { ProjectsService } from "../../projects.service";
import type { Category, Project } from "../../projects";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const imagePreviewUrl = useMemo(() => {
      if (!imageFile) return "";
      return URL.createObjectURL(imageFile);
    }, [imageFile]);
  
    useEffect(() => {
      return () => {
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      };
    }, [imagePreviewUrl]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);

      const [projectRes, categoriesRes] = await Promise.all([
        ProjectsService.getProject(projectId),
        ProjectsService.getCategories(),
      ]);

      const projectData = projectRes.data;
      const categoriesData = categoriesRes.data;

      setProject(projectData);
      setCategories(categoriesData);

      setForm({
        title: projectData.title,
        description: projectData.description,
        content: projectData.content,
        category_id: String(projectData.category?.id || ""),
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.content.trim()) return toast.error("Content is required");
    if (!form.category_id) return toast.error("Category is required");

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("content", form.content);
      fd.append("featured", String(project?.featured ?? 1));
      fd.append("category_id", form.category_id);

      // optional new image
      if (imageFile) {
        fd.append("images[0][file]", imageFile);
        fd.append("images[0][alt_text]", imageFile.name);
        fd.append("images[0][title]", imageFile.name);
        fd.append("images[0][sort_order]", "1");
      }

      await ProjectsService.updateProject(projectId, fd);

      toast.success("Project updated successfully");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !project) {
    return (
      <div className="p-6 max-w-full">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>

            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-24 w-full rounded" />
            </div>

            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-24 w-full rounded" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-1/2" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>

            <div>
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Content */}
          <div>
            <Label>Content</Label>
            <Textarea
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>

            <Select
              value={form.category_id}
              onValueChange={(value) =>
                setForm({ ...form, category_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Existing Image */}
          {project.images?.length > 0 && (
            <div>
              <Label>Current Image</Label>
              <img
                src={
                  (project.images[0] as any)?.url ||
                  (project.images[0] as any)?.media?.url ||
                  ""
                }
                alt="Current"
                className="w-24 h-24 rounded object-cover border"
              />
            </div>
          )}

          {/* Upload New Image */}
          <div>
            <Label>Replace Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
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

          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? "Updating..." : "Update Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}