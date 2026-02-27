"use client";

import { useEffect, useState } from "react";
import { ValuesSection, ValuesService } from "./values.service";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import Image from "next/image";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify"; // For notifications
import { Input } from "../components/ui/input"; // If you want to use a custom input component

const ValuesPage = () => {
  const [valuesSection, setValuesSection] = useState<ValuesSection | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // For storing the selected image files for preview
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);

  // Fetch values section when component mounts
  useEffect(() => {
    const fetchValues = async () => {
      setIsLoading(true);
      try {
        const response = await ValuesService.getValuesSection();
        setValuesSection(response.data);
        // initialize imageFiles slots to keep indexes aligned with values
        setImageFiles((response.data?.values ?? []).map(() => null));
      } catch (error) {
        toast.error("Error fetching values section");
      } finally {
        setIsLoading(false);
      }
    };

    fetchValues();
  }, []);

  const handleUpdate = async () => {
    if (!valuesSection) return;
    setIsUpdating(true);
    try {
      // If any image files are present, send multipart FormData so files are uploaded
      const hasFiles = imageFiles.some((f) => f instanceof File);

      let response: any;
      if (hasFiles) {
        const form = new FormData();
        if (valuesSection.title) form.append('title', String(valuesSection.title));

        const vals = valuesSection.values || [];
        vals.forEach((v: any, idx: number) => {
          form.append(`values[${idx}][title]`, String(v.title ?? ''));
          form.append(`values[${idx}][description]`, String(v.description ?? ''));
          if (v.id && Number(v.id) > 0) form.append(`values[${idx}][id]`, String(v.id));
          if (v.sort_order !== undefined) form.append(`values[${idx}][sort_order]`, String(v.sort_order));

          const file = imageFiles[idx];
          if (file instanceof File) {
            // attach file for this particular value
            form.append(`values[${idx}][image]`, file);
          }
        });

        response = await ValuesService.updateValuesSection(form as unknown as any);
      } else {
        response = await ValuesService.updateValuesSection({
          title: valuesSection.title,
          values: valuesSection.values,
        });
      }
      toast.success("Values updated successfully");
      setValuesSection(response.data); // Update the state with the new data
    } catch (error) {
      toast.error("Error updating values section");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeValue = (index: number, field: string, value: string) => {
    const updatedValues = [...(valuesSection?.values || [])];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: value,
    };
    setValuesSection({
      ...valuesSection!,
      values: updatedValues,
    });
  };

  // Handle file input changes and store the selected files
  const handleFileChange = (index: number, file: File | null) => {
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[index] = file;
    setImageFiles(updatedImageFiles);
  };

  // Add a new value item
  const addValue = () => {
    if (!valuesSection) return;
    const nextSort = (valuesSection.values?.length ?? 0) + 1;
    const newValue: any = {
      id: 0,
      title: "",
      description: "",
      sort_order: nextSort,
      media: { url: "", alt_text: "" },
    };

    setValuesSection({ ...valuesSection, values: [...(valuesSection.values || []), newValue] });
    setImageFiles((prev) => {
      const copy = [...prev];
      copy.push(null);
      return copy;
    });
  };

  // Remove a value by index
  const removeValue = (index: number) => {
    if (!valuesSection) return;
    const updated = (valuesSection.values || []).filter((_, i) => i !== index);
    setValuesSection({ ...valuesSection, values: updated });
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading)
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="p-4 shadow-md rounded-lg border border-gray-200"
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 flex flex-col items-center">
                  <Skeleton className="h-[100px] w-[100px] rounded-lg mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>

                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4"> Values Section</h1>
      <div className="mb-6">
        <label htmlFor="image" className="block text-lg font-bold mb-2  ">
          Section Title
        </label>
        <Input
          value={valuesSection?.title || ""}
          onChange={(e) => {
            if (!valuesSection) return;
            setValuesSection({ ...valuesSection, title: e.target.value });
          }}
          placeholder="Section title"
          className="text-3xl  mb-6"
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Values</h2>
        <Button variant="outline" onClick={addValue}>Add</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {valuesSection?.values.map((value, index) => (
          <Card
            key={`${value.id}-${index}`}
            className="p-4 shadow-md rounded-lg border border-gray-200"
          >
            <div className="flex flex-col items-center">
              {/* Image preview */}
              <div className="mb-4">
                <img
                  src={
                    imageFiles[index]
                      ? URL.createObjectURL(imageFiles[index]) // Preview the selected file
                      : (value.media?.url || "/placeholder.png") // Default to existing image or placeholder
                  }
                  alt={value.media?.alt_text || "Value Image"}
                  className="rounded-lg mb-4 w-[100px] h-[100px] object-cover"
                />
                {/* File input for changing image */}
                <Input
                  type="file"
                  accept="image/*,.ico"
                  onChange={(e) =>
                    handleFileChange(index, e.target.files?.[0] || null)
                  }
                  className="w-full"
                />
              </div>

              {/* Title and Description Inputs */}
              <Input
                type="text"
                value={value.title}
                onChange={(e) =>
                  handleChangeValue(index, "title", e.target.value)
                }
                placeholder="Title"
                className="mb-4 w-full text-center"
              />
              <Textarea
                value={value.description}
                onChange={(e) =>
                  handleChangeValue(index, "description", e.target.value)
                }
                placeholder="Description"
                className="mb-4 w-full"
                rows={4}
              />
              <div className="flex justify-end mt-2">
                <Button variant="destructive" onClick={() => removeValue(index)}>Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="px-6 py-3 text-white rounded-lg "
        >
          {isUpdating ? "Updating..." : "Update Values"}
        </Button>
      </div>
    </div>
  );
};

export default ValuesPage;
