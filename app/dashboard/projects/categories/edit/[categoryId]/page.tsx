"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { toast } from "react-toastify";
import { ProjectsService } from "../../../projects.service";
import { Input } from "@/app/dashboard/components/ui/input";
import { Label } from "@/app/dashboard/components/ui/label";
import { Textarea } from "@/app/dashboard/components/ui/textarea";
import { Button } from "@/app/dashboard/components/ui/button";
import { Category } from "../../../projects"; // Make sure the type is imported

export default function EditCategoryPage() {
  const router = useRouter();
  const { categoryId } = useParams(); // Use useParams to get categoryId

  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  async function fetchCategory() {
    try {
      setLoading(true);
      const res = await ProjectsService.getCategory(Number(categoryId));
      setCategory(res.data); // Set category to the fetched data
      setTitle(res.data.title);
      setDescription(res.data.description);
      setSlug(res.data.slug);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch category");
    } finally {
      setLoading(false);
    }
  }

  async function updateCategory() {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("slug", slug);

      await ProjectsService.updateCategory(Number(categoryId), formData);
      toast.success("Category updated successfully");
      router.push("/dashboard/projects/categories");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1>Edit Category</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter category title"
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter category slug"
              disabled={saving}
            />
          </div>
          <Button onClick={updateCategory} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}