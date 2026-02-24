"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MoreHorizontal } from "lucide-react";
import { ServiceService } from "./services.service";
import { Service, ServiceSectionData, ApiResponse } from "./service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";

export default function ServicesPage() {
  const router = useRouter();

  const [serviceSection, setServiceSection] = useState<ServiceSectionData | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceImage, setServiceImage] = useState<File | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
    fetchServiceSection();
  }, []);

  async function fetchServiceSection() {
    try {
      const serviceService = new ServiceService();
      const res = await serviceService.getServiceSection();
      setServiceSection(res.data);
      setServiceTitle(res.data.title || "");
      setServiceDescription(res.data.description || "");
    } catch (err: any) {
      toast.error(err?.message || "Failed to load service section");
    }
  }

  async function fetchServices() {
    try {
      setLoading(true);
      const serviceService = new ServiceService();
      const res = await serviceService.getAllServices() as ApiResponse<Service[]>;
      setServices(res.data ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  async function updateServiceSection() {
    try {
      setServiceSaving(true);
      const serviceService = new ServiceService();
      await serviceService.updateServiceSection({
        title: serviceTitle,
        description: serviceDescription,
        image: serviceImage,
      });
      toast.success("Service section updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update service section");
    } finally {
      setServiceSaving(false);
    }
  }

  function openDeleteDialog(service: Service) {
    setSelectedService(service);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!selectedService) return;

    try {
      setDeleting(true);
      const serviceService = new ServiceService();
      await serviceService.deleteService(selectedService.id);
      setServices(services.filter((service) => service.id !== selectedService.id));
      toast.success("Service deleted successfully");
      setDeleteOpen(false);
      setSelectedService(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Service Section Form */}
      <Card>
        <CardHeader>
          <CardTitle>Service Section</CardTitle>
        </CardHeader>

        <CardContent>
          {serviceSection ? (
            <div className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label>Service Title</Label>
                <Input
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="Enter Service Title"
                />
              </div>

              <div className="space-y-2">
                <Label>Service Description</Label>
                <Textarea
                  rows={4}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Enter Service Description"
                />
              </div>

              <div className="space-y-2">
                <Label>Service Image</Label>
                <Input
                  type="file"
                  onChange={(e) => setServiceImage(e.target.files ? e.target.files[0] : null)}
                />
                {serviceImage ? (
                  <img
                    src={URL.createObjectURL(serviceImage)}
                    alt="Preview"
                    className="h-24 w-24 rounded border object-cover"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">No image selected</div>
                )}
              </div>

              <Button onClick={updateServiceSection} disabled={serviceSaving}>
                {serviceSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <p>Loading service section...</p>
          )}
        </CardContent>
      </Card>

      {/* Service List Table */}
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Manage Services</CardTitle>
          <Button onClick={() => router.push("/dashboard/services/create")}>Create Service</Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Slug</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-2">{service.title}</td>
                      <td className="px-4 py-2">{service.description}</td>
                      <td className="px-4 py-2">
                        {service.image ? (
                          <img
                            src={service.image.url || "/placeholder.png"}
                            alt={service.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="px-4 py-2">{service.slug}</td>
                      <td className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/services/update/${service.id}`)}>
                              Update
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(service)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Service Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the service: <span className="font-semibold">{selectedService?.title}</span>..
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting} className="bg-red-600 text-white hover:bg-red-700">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}