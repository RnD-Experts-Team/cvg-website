"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowDown, ArrowUp, X } from "lucide-react";

import { ProjectsService } from "../../projects.service";
import type { Category, Project, ProjectImage } from "../../projects";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("../../../components/RichTextEditor"),
  { ssr: false },
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type GalleryItem =
  | {
      uid: string;
      kind: "existing";
      id: number;
      url: string;
      alt_text: string;
      title: string;
      isVideo: boolean;
    }
  | {
      uid: string;
      kind: "new";
      file: File;
      previewUrl: string;
      alt_text: string;
      title: string;
      isVideo: boolean;
    };

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [removedExistingIds, setRemovedExistingIds] = useState<number[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
  });

  // Cleanup new image preview URLs when items change/unmount
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.kind === "new") URL.revokeObjectURL(it.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);

      const [projectRes, categoriesRes] = await Promise.all([
        ProjectsService.getProject(projectId),
        ProjectsService.getCategories(),
      ]);

      const projectData = projectRes.data;
      setProject(projectData);
      setCategories(categoriesRes.data);

      setForm({
        title: projectData.title,
        description: projectData.description,
        content: projectData.content,
        category_id: String(projectData.category?.id || ""),
      });

      const existing: GalleryItem[] = (projectData.images || [])
        .slice()
        .sort(
          (a: ProjectImage, b: ProjectImage) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0),
        )
        .map((img: any) => ({
          uid: `existing-${img.id}`,
          kind: "existing" as const,
          id: img.id as number,
          url: img.url || img.media?.url || "",
          alt_text: img.alt_text || "",
          title: img.title || "",
          isVideo:
            img.type === "video" ||
            (typeof img.mime_type === "string" &&
              img.mime_type.startsWith("video/")),
        }));
      setItems(existing);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const additions: GalleryItem[] = Array.from(fileList).map((file) => ({
      uid: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      kind: "new",
      file,
      previewUrl: URL.createObjectURL(file),
      alt_text: file.name,
      title: file.name,
      isVideo: file.type.startsWith("video/"),
    }));
    setItems((prev) => [...prev, ...additions]);
  }

  function updateMeta(uid: string, field: "alt_text" | "title", value: string) {
    setItems((prev) =>
      prev.map((i) => (i.uid === uid ? { ...i, [field]: value } : i)),
    );
  }

  function moveItem(uid: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.uid === uid);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  }

  function removeItem(uid: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.uid === uid);
      if (target?.kind === "existing") {
        setRemovedExistingIds((ids) =>
          ids.includes(target.id) ? ids : [...ids, target.id],
        );
      } else if (target?.kind === "new") {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.uid !== uid);
    });
  }

  async function handleUpdate() {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim())
      return toast.error("Description is required");
    if (!form.category_id) return toast.error("Category is required");

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("content", form.content);
      fd.append("featured", project?.featured ? "1" : "0");
      fd.append("category_id", form.category_id);

      let existingIdx = 0;
      let newIdx = 0;
      items.forEach((it, order) => {
        const sortOrder = order + 1;
        if (it.kind === "existing") {
          fd.append(`existing_images[${existingIdx}][id]`, String(it.id));
          fd.append(
            `existing_images[${existingIdx}][sort_order]`,
            String(sortOrder),
          );
          fd.append(`existing_images[${existingIdx}][alt_text]`, it.alt_text);
          fd.append(`existing_images[${existingIdx}][title]`, it.title);
          existingIdx += 1;
        } else {
          fd.append(`images[${newIdx}][file]`, it.file);
          fd.append(`images[${newIdx}][alt_text]`, it.alt_text || it.file.name);
          fd.append(`images[${newIdx}][title]`, it.title || it.file.name);
          fd.append(`images[${newIdx}][sort_order]`, String(sortOrder));
          newIdx += 1;
        }
      });

      removedExistingIds.forEach((id, i) => {
        fd.append(`removed_image_ids[${i}]`, String(id));
      });

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
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-24 w-full rounded" />
            <Skeleton className="h-24 w-full rounded" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-40" />
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
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Content</Label>
            <RichTextEditor
              initialHtml={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
            />
          </div>

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

          {/* Multi-image gallery editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Project Images</Label>
              <span className="text-xs text-muted-foreground">
                {items.length} image{items.length === 1 ? "" : "s"} —{" "}
                {removedExistingIds.length > 0 &&
                  `${removedExistingIds.length} pending removal`}
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

            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground border rounded p-4 text-center">
                This project has no images. Add some using the picker above.
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((it, idx) => {
                  const src = it.kind === "existing" ? it.url : it.previewUrl;
                  return (
                    <li
                      key={it.uid}
                      className="flex gap-3 border rounded p-3 bg-muted/30"
                    >
                      <div className="relative shrink-0">
                        {it.isVideo ? (
                          <video
                            src={src}
                            className="h-24 w-24 rounded object-cover border bg-black"
                            muted
                            playsInline
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt={it.alt_text || ""}
                            className="h-24 w-24 rounded object-cover border"
                          />
                        )}
                        <span
                          className={`absolute -top-1 -left-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                            it.kind === "new"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          {it.kind === "new" ? "NEW" : "SAVED"}
                        </span>
                        {it.isVideo && (
                          <span className="absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/80 text-white">
                            VIDEO
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 min-w-0">
                        <Input
                          placeholder="Alt text"
                          value={it.alt_text}
                          onChange={(e) =>
                            updateMeta(it.uid, "alt_text", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Title"
                          value={it.title}
                          onChange={(e) =>
                            updateMeta(it.uid, "title", e.target.value)
                          }
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Order: {idx + 1}</span>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => moveItem(it.uid, -1)}
                              disabled={idx === 0}
                              aria-label="Move up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => moveItem(it.uid, 1)}
                              disabled={idx === items.length - 1}
                              aria-label="Move down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => removeItem(it.uid)}
                              aria-label="Remove"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
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
