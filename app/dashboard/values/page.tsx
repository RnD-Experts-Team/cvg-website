"use client";

import { useEffect, useState } from "react";
import { ValuesSection, ValuesService } from "./values.service";
import { Card } from "../components/ui/card";
import Image from "next/image";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify"; // For notifications
import { Input } from "../components/ui/input"; // If you want to use a custom input component

const ValuesPage = () => {
  const [valuesSection, setValuesSection] = useState<ValuesSection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      const response = await ValuesService.updateValuesSection({
        title: valuesSection.title,
        values: valuesSection.values,
      });
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{valuesSection?.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {valuesSection?.values.map((value, index) => (
          <Card key={value.id} className="p-4 shadow-md rounded-lg border border-gray-200">
            <div className="flex flex-col items-center">
              {/* Image preview */}
              <div className="mb-4">
                <img
                  src={
                    imageFiles[index]
                      ? URL.createObjectURL(imageFiles[index]) // Preview the selected file
                      : value.media.url || "/placeholder.png" // Default to existing image or placeholder
                  }
                  alt={value.media.alt_text || "Value Image"}
                  className="rounded-lg mb-4 w-[100px] h-[100px] object-cover"
                />
                {/* File input for changing image */}
                <Input
                  type="file"
                  accept="image/*,.ico"
                  onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>

              {/* Title and Description Inputs */}
              <Input
                type="text"
                value={value.title}
                onChange={(e) => handleChangeValue(index, "title", e.target.value)}
                placeholder="Title"
                className="mb-4 w-full text-center"
              />
              <Textarea
                value={value.description}
                onChange={(e) => handleChangeValue(index, "description", e.target.value)}
                placeholder="Description"
                className="mb-4 w-full"
                rows={4}
              />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={handleUpdate} disabled={isUpdating} className="px-6 py-3 text-white rounded-lg ">
          {isUpdating ? "Updating..." : "Update Values"}
        </Button>
      </div>
    </div>
  );
};

export default ValuesPage;