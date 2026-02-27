// page.tsx

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ProcessSection, Step } from "./types";
import { getProcessSection, updateProcessSection } from "./process.service";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

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
        // support both ApiResponse<T> and raw T returns
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
      // Prepare the payload: do not send the `image` object (backend expects a file if image is provided)
      const payload: any = { ...processSection };

      // Attach transformed steps: omit `id` for new steps (id === 0)
      payload.steps = steps.map((s) => {
        const stepPayload: any = {
          process_section_id: s.process_section_id,
          sort_order: Number(s.sort_order),
          title: s.title,
          description: s.description
        };

        if (s.id > 0) stepPayload.id = s.id; // Include 'id' only for existing steps
        return stepPayload;
      });

      // If no new image is provided, remove the image object from the payload
      if (!imageFile) {
        delete payload.image;
      }

      try {
        setSaving(true);
        if (imageFile) {
          const form = new FormData();
          // append simple fields
          form.append('title', String(payload.title ?? ''));
          if (payload.image_media_id) form.append('image_media_id', String(payload.image_media_id));
          // append steps as indexed form fields: steps[0][title], steps[0][description], etc.
          const stepsArr = payload.steps || [];
          stepsArr.forEach((s: any, idx: number) => {
            form.append(`steps[${idx}][process_section_id]`, String(s.process_section_id ?? ''));
            form.append(`steps[${idx}][sort_order]`, String(s.sort_order ?? ''));
            form.append(`steps[${idx}][title]`, String(s.title ?? ''));
            form.append(`steps[${idx}][description]`, String(s.description ?? ''));
            if (s.id && Number(s.id) > 0) form.append(`steps[${idx}][id]`, String(s.id));
          });
          // append image file
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
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    const nextSortOrder = steps.length ? Math.max(...steps.map((s) => Number(s.sort_order))) + 1 : 1;

    const stepToAdd: Step = { ...newStep, id: 0, sort_order: nextSortOrder }; // Use 0 for new steps
    setSteps((prev) => [...prev, stepToAdd]);
    setNewStep({ ...newStep, title: '', description: '' });
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, key: keyof Step, value: string) => {
    const updatedSteps = [...steps];
    // Convert numeric fields where necessary
    if (key === 'sort_order') {
      // Assign as number
      (updatedSteps[index] as any)[key] = Number(value);
    } else {
      (updatedSteps[index] as any)[key] = value;
    }
    setSteps(updatedSteps);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4"> Process Section</h1>

      {loading && !processSection ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />

          <div className="mb-6">
            <Skeleton className="h-5 w-36 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>

          <div className="mb-6">
            <Skeleton className="h-5 w-36 mb-2" />
            <div className="flex items-start gap-4">
              <Skeleton className="h-32 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>

          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-3" />
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="border p-4 mb-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
            <div className="mt-2">
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          <Skeleton className="h-10 w-36" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm">Title</label>
            <Input
              id="title"
              value={processSection?.title || ""}
              onChange={(e) => setProcessSection((prev) => prev ? { ...prev, title: e.target.value } : prev)}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm">Image</label>
            <Input type="file" onChange={handleImageChange} className="w-full" />
            {processSection?.image && (
              <img src={processSection.image.url} alt={processSection.image.alt_text} className="w-32 mt-4" />
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl">Steps</h2>
            <div className="mt-4">
              {steps.map((step, index) => (
                <div key={index} className="border p-4 mb-4">
                  <div className="mb-2">
                    <label className="block text-sm">Step Title</label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Step Description</label>
                    <Input
                      value={step.description}
                      onChange={(e) => updateStep(index, 'description', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Sort Order</label>
                    <Input
                      type="number"
                      value={step.sort_order}
                      onChange={(e) => updateStep(index, 'sort_order', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="destructive" onClick={() => removeStep(index)}>Remove</Button>
                  </div>
                </div>
              ))}

              <Button onClick={addStep} className="mt-4">Add Step</Button>
            </div>
          </div>

          <Button onClick={handleSaveProcess} className="mt-6">
            {saving ? "Saving..." : "Save Process"}
          </Button>
        </>
      )}
    </div>
  );
}