"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ProjectsService } from "../../projects.service";
import { Label } from "@/app/dashboard/components/ui/label";
import { Input } from "@/app/dashboard/components/ui/input";
import { Textarea } from "@/app/dashboard/components/ui/textarea";
import { Button } from "@/app/dashboard/components/ui/button";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(false);

  async function createCategory() {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("slug", slug);

      await ProjectsService.createCategory(formData);
      toast.success("Category created successfully");
      router.push("/dashboard/projects/categories");
    } catch (err: unknown) {
      // Cast the error to an instance of Error to access the 'message' property
      const error = err as Error;
      toast.error(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1>Create Category</h1>
      <div className="space-y-4 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter category title"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter category slug"
            disabled={loading}
          />
        </div>
        <Button onClick={createCategory} disabled={loading}>
          {loading ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </div>
  );
}