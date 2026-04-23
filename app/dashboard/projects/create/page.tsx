"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowDown, ArrowUp, X } from "lucide-react";

import { ProjectsService } from "../projects.service";
import type { Category } from "../projects";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("../../components/RichTextEditor"),
  { ssr: false },
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type NewImage = {
  uid: string;
  file: File;
  alt_text: string;
  title: string;
  isVideo: boolean;
};

export default function CreateProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [images, setImages] = useState<NewImage[]>([]);
  const [saving, setSaving] = useState(false);

  const previewUrls = useMemo(
    () => images.map((img) => URL.createObjectURL(img.file)),
    [images],
  );

  useEffect(() => {
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewUrls]);

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

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const additions: NewImage[] = Array.from(fileList).map((file) => ({
      uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      alt_text: file.name,
      title: file.name,
      isVideo: file.type.startsWith("video/"),
    }));
    setImages((prev) => [...prev, ...additions]);
  }

  function updateImageMeta(uid: string, field: "alt_text" | "title", value: string) {
    setImages((prev) =>
      prev.map((i) => (i.uid === uid ? { ...i, [field]: value } : i)),
    );
  }

  function removeImage(uid: string) {
    setImages((prev) => prev.filter((i) => i.uid !== uid));
  }

  function moveImage(uid: string, dir: -1 | 1) {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.uid === uid);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  }

  async function handleCreate() {
    if (!title.trim()) return toast.error("Title is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!categoryId) return toast.error("Category is required");

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("content", content ?? "");
      fd.append("featured", "1");
      fd.append("category_id", categoryId);

      images.forEach((img, i) => {
        fd.append(`images[${i}][file]`, img.file);
        fd.append(`images[${i}][alt_text]`, img.alt_text || img.file.name);
        fd.append(`images[${i}][title]`, img.title || img.file.name);
        fd.append(`images[${i}][sort_order]`, String(i + 1));
      });

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
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Content</Label>
            <RichTextEditor initialHtml={content} onChange={setContent} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            {loadingCategories ? (
              <div className="text-sm text-muted-foreground">
                Loading categories...
              </div>
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

          {/* Multi-image upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Project Images</Label>
              <span className="text-xs text-muted-foreground">
                {images.length} selected — reorder with arrows
              </span>
            </div>

            <Input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                handleAddFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />

            {images.length === 0 ? (
              <div className="text-sm text-muted-foreground border rounded p-4 text-center">
                No images selected. Use the picker above to add one or more
                images.
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <li
                    key={img.uid}
                    className="flex gap-3 border rounded p-3 bg-muted/30"
                  >
                    <div className="relative h-24 w-24 shrink-0 rounded overflow-hidden border bg-black/5">
                      {img.isVideo ? (
                        <video
                          src={previewUrls[idx]}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrls[idx]}
                          alt={img.alt_text}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute -top-1 -left-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-white">
                        {img.isVideo ? "VIDEO" : "IMG"}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <Input
                        placeholder="Alt text"
                        value={img.alt_text}
                        onChange={(e) =>
                          updateImageMeta(img.uid, "alt_text", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Title"
                        value={img.title}
                        onChange={(e) =>
                          updateImageMeta(img.uid, "title", e.target.value)
                        }
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Order: {idx + 1}</span>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => moveImage(img.uid, -1)}
                            disabled={idx === 0}
                            aria-label="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => moveImage(img.uid, 1)}
                            disabled={idx === images.length - 1}
                            aria-label="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => removeImage(img.uid)}
                            aria-label="Remove"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
