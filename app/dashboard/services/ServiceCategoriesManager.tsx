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

/**
 * Pull the ServiceCategory array out of the API response. The backend wraps
 * the list in `data` ({ success, data: [...], message }); a few extra
 * fallbacks keep this resilient to minor shape changes.
 */
function extractCategoryList(raw: any): ServiceCategory[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  const candidates: any[] = [
    raw.data,
    raw.data?.data,
    raw.data?.service_categories,
    raw.service_categories,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }

  return [];
}

export default function ServiceCategoriesManager() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      setFetchError(null);
      const service = new ServiceService();
      const raw = await service.getServiceCategories();
      const list = extractCategoryList(raw);
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
      const msg = err?.message || "Failed to load service categories";
      setFetchError(msg);
      toast.error(msg);
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

      const saved: ServiceCategory | null =
        res && typeof res === "object"
          ? (res as any).data ?? (res as any)
          : null;

      if (saved && saved.id) {
        setCategories((prev) =>
          prev.map((c) => (c.id === category.id ? saved : c)),
        );
        updateDraft(category.id, { icon: null });
      }
      toast.success(`${CATEGORY_LABELS[category.key] ?? category.key} card updated`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category");
    } finally {
      setSavingId(null);
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────── */
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
        {/* Loading */}
        {loading && (
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
        )}

        {/* Error state */}
        {!loading && fetchError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive space-y-2">
            <p className="font-medium">Failed to load categories</p>
            <p className="text-muted-foreground">{fetchError}</p>
            <Button variant="outline" size="sm" onClick={fetchCategories}>
              Retry
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && categories.length === 0 && (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground space-y-3 text-center">
            <p className="font-medium text-foreground">No service category cards yet</p>
            <p>
              They&apos;ll appear here automatically once the server has them.
              Try refreshing in a moment.
            </p>
            <div className="flex justify-center pt-1">
              <Button variant="outline" size="sm" onClick={fetchCategories}>
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Editors */}
        {!loading && !fetchError && categories.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => {
              const draft = drafts[category.id] ?? {
                title: "",
                description: "",
                icon: null,
              };
              const previewUrl = draft.icon
                ? URL.createObjectURL(draft.icon)
                : category.url
                ? category.url.replace("http://", "https://")
                : null;

              return (
                <div key={category.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {CATEGORY_LABELS[category.key] ?? category.key}
                    </h3>
                    <span className="inline-block rounded-full bg-[#F68620]/15 text-[#c96f10] px-2 py-0.5 text-xs font-medium capitalize">
                      {category.key}
                    </span>
                  </div>

                  {previewUrl && (
                    <div className="flex items-center gap-3 rounded-lg bg-[#F68620] p-3 w-fit">
                      <img
                        src={previewUrl}
                        alt={`${category.key} icon preview`}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  )}

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
                      rows={3}
                      value={draft.description}
                      onChange={(e) =>
                        updateDraft(category.id, { description: e.target.value })
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
                    {!previewUrl && (
                      <p className="text-xs text-muted-foreground">
                        No icon uploaded — the built-in icon will be used on the website.
                      </p>
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
