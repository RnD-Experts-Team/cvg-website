"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ServiceService } from "./services.service";
import { ServiceCategory } from "./service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";

const CATEGORY_LABELS: Record<ServiceCategory["key"], string> = {
  general: "General Construction",
  design: "Design Services",
};

type Draft = {
  title: string;
  description: string;
  icon: File | null;
};

export default function ServiceCategoriesManager() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const service = new ServiceService();
      const res = await service.getServiceCategories();
      const list = Array.isArray(res.data) ? res.data : [];
      setCategories(list);
      setDrafts(
        Object.fromEntries(
          list.map((c) => [
            c.id,
            { title: c.title ?? "", description: c.description ?? "", icon: null },
          ]),
        ),
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to load service categories");
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(id: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function saveCategory(category: ServiceCategory) {
    const draft = drafts[category.id];
    if (!draft) return;
    try {
      setSavingId(category.id);
      const service = new ServiceService();
      const res = await service.updateServiceCategory({
        id: category.id,
        title: draft.title,
        description: draft.description,
        icon: draft.icon,
      });
      // Refresh the saved row with the server response (new icon url etc.)
      if (res?.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === category.id ? res.data : c)),
        );
        updateDraft(category.id, { icon: null });
      }
      toast.success(`${CATEGORY_LABELS[category.key]} card updated`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Category Cards</CardTitle>
        <p className="text-sm text-muted-foreground">
          The icon, title and description for the General and Design cards shown
          on the homepage and on the Services page for each category.
        </p>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-lg border p-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-1/3" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No service categories found.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => {
              const draft = drafts[category.id] ?? {
                title: "",
                description: "",
                icon: null,
              };
              const previewUrl = draft.icon
                ? URL.createObjectURL(draft.icon)
                : category.url || null;

              return (
                <div
                  key={category.id}
                  className="space-y-4 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {CATEGORY_LABELS[category.key] ?? category.key}
                    </h3>
                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                      {category.key}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label>Card Title</Label>
                    <Input
                      value={draft.title}
                      onChange={(e) =>
                        updateDraft(category.id, { title: e.target.value })
                      }
                      placeholder="Enter category card title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Card Description</Label>
                    <Textarea
                      rows={4}
                      value={draft.description}
                      onChange={(e) =>
                        updateDraft(category.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter category card description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Card Icon</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        updateDraft(category.id, {
                          icon: e.target.files ? e.target.files[0] : null,
                        })
                      }
                    />
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={`${category.key} icon`}
                        className="h-16 w-16 rounded border object-contain p-1"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No icon selected
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => saveCategory(category)}
                    disabled={savingId === category.id}
                  >
                    {savingId === category.id ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
