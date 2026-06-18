// page.tsx

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ProcessSection, Step } from "./types";
import { getProcessSection, updateProcessSection } from "./process.service";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function ProcessPage() {
  const [processSection, setProcessSection] = useState<ProcessSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newStep, setNewStep] = useState<Step>({ id: 0, process_section_id: 1, sort_order: 1, title: '', description: '', created_at: '', updated_at: '' });
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const fetchProcessSection = async () => {
      setLoading(true);
      try {
        const res = await getProcessSection();
        const payload = res && typeof res === "object" && "data" in res ? (res as any).data : res;
        setProcessSection(payload ?? null);
        setSteps((payload && payload.steps) || []);
      } catch (err) {
        console.error("Failed to fetch process section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessSection();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload an image of type: jpg, jpeg, png, or webp.");
        return;
      }
      setImageFile(file);
      setProcessSection((prev) => prev ? { ...prev, image: { ...prev.image, url: URL.createObjectURL(file) } } : prev);
    }
  };

  const handleSaveProcess = async () => {
    if (processSection) {
      const payload: any = { ...processSection };

      payload.steps = steps.map((s) => {
        const stepPayload: any = {
          process_section_id: s.process_section_id,
          sort_order: Number(s.sort_order),
          title: s.title,
          description: s.description
        };

        if (s.id > 0) stepPayload.id = s.id;
        return stepPayload;
      });

      if (!imageFile) {
        delete payload.image;
      }

      try {
        setSaving(true);
        if (imageFile) {
          const form = new FormData();
          form.append('title', String(payload.title ?? ''));
          if (payload.image_media_id) form.append('image_media_id', String(payload.image_media_id));
          const stepsArr = payload.steps || [];
          stepsArr.forEach((s: any, idx: number) => {
            form.append(`steps[${idx}][process_section_id]`, String(s.process_section_id ?? ''));
            form.append(`steps[${idx}][sort_order]`, String(s.sort_order ?? ''));
            form.append(`steps[${idx}][title]`, String(s.title ?? ''));
            form.append(`steps[${idx}][description]`, String(s.description ?? ''));
            if (s.id && Number(s.id) > 0) form.append(`steps[${idx}][id]`, String(s.id));
          });
          form.append('image', imageFile);

          await updateProcessSection(form as unknown as any);
        } else {
          await updateProcessSection(payload);
        }
        toast.success("Process updated");
      } catch (error: any) {
        console.error("Error updating process:", error);
        const details = error?.details ?? error?.response?.data ?? null;
        if (details) {
          try {
            toast.error(String((details && typeof details === 'object') ? JSON.stringify(details) : details));
          } catch {
            toast.error("Failed to save process");
          }
        } else {
          toast.error("Failed to save process");
        }
      } finally {
        setSaving(false);
      }
    }
  };

  const addStep = () => {
    const nextSortOrder = steps.length ? Math.max(...steps.map((s) => Number(s.sort_order))) + 1 : 1;
    const stepToAdd: Step = { ...newStep, id: 0, sort_order: nextSortOrder };
    setSteps((prev) => [...prev, stepToAdd]);
    setNewStep({ ...newStep, title: '', description: '' });
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, key: keyof Step, value: string) => {
    const updatedSteps = [...steps];
    if (key === 'sort_order') {
      (updatedSteps[index] as any)[key] = Number(value);
    } else {
      (updatedSteps[index] as any)[key] = value;
    }
    setSteps(updatedSteps);
  };

  if (loading && !processSection) {
    return (
      <div className="p-6 max-w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-6 w-20 mb-3" />
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="border rounded p-4 mb-4 space-y-2">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-36" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Process Section</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={processSection?.title || ""}
              onChange={(e) => setProcessSection((prev) => prev ? { ...prev, title: e.target.value } : prev)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" onChange={handleImageChange} />
            {processSection?.image && (
              <img src={processSection.image.url} alt={processSection.image.alt_text} className="w-32 mt-2 rounded border" />
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Steps</h3>
              <Button variant="outline" onClick={addStep}>Add Step</Button>
            </div>

            {steps.map((step, index) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label>Step Title</Label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Step Description</Label>
                    <Input
                      value={step.description}
                      onChange={(e) => updateStep(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={step.sort_order}
                      onChange={(e) => updateStep(index, 'sort_order', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="destructive" onClick={() => removeStep(index)}>Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={handleSaveProcess} disabled={saving}>
            {saving ? "Saving..." : "Save Process"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
