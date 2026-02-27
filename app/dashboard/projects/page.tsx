"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MoreHorizontal } from "lucide-react";

import { ProjectsService } from "./projects.service";
import type { Project } from "./projects";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function ProjectsPage() {
  const router = useRouter();

  // =========================
  // Projects State
  // =========================
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Section State
  // =========================
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionSaving, setSectionSaving] = useState(false);

  // =========================
  // Delete Dialog State
  // =========================
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchSection();
  }, []);

  // =========================
  // Fetch Projects
  // =========================
  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await ProjectsService.getProjects();
      setProjects(res.data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Fetch Section
  // =========================
  async function fetchSection() {
    try {
      setSectionLoading(true);
      const res = await ProjectsService.getSection();
      setSectionTitle(res.data.title || "");
      setSectionDescription(res.data.description || "");
    } catch (err: any) {
      toast.error(err?.message || "Failed to load project section");
    } finally {
      setSectionLoading(false);
    }
  }

  // =========================
  // Update Section
  // =========================
  async function updateSection() {
    try {
      setSectionSaving(true);

      await ProjectsService.updateSection({
        title: sectionTitle,
        description: sectionDescription,
      });

      toast.success("Project section updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update section");
    } finally {
      setSectionSaving(false);
    }
  }

  // =========================
  // Delete Project
  // =========================
  function openDeleteDialog(project: Project) {
    setSelectedProject(project);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!selectedProject) return;

    try {
      setDeleting(true);
      await ProjectsService.deleteProject(selectedProject.id);

      toast.success("Project deleted successfully");
      setDeleteOpen(false);
      setSelectedProject(null);

      fetchProjects();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* ===================================== */}
      {/* Project Section Form */}
      {/* ===================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Project Section</CardTitle>
        </CardHeader>

        <CardContent>
          {sectionLoading ? (
              <div className="space-y-4 max-w-xl">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-1/3" />
              </div>
          ) : (
            <div className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                />
              </div>

              <Button
                onClick={updateSection}
                disabled={sectionSaving}
              >
                {sectionSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* Projects List */}
      {/* ===================================== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/dashboard/projects/create")}>
              Create Project
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    router.push("/dashboard/projects/categories")
                }
                >
                Categories
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Title</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Content</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Image</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3 font-medium"><Skeleton className="h-4 w-40" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-48" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-56" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-3"><Skeleton className="h-12 w-12 rounded" /></td>
                      <td className="p-3 text-right"><Skeleton className="h-8 w-20 mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Title</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Content</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Image</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-3 font-medium">
                        {project.title}
                      </td>

                      <td className="p-3">
                        {project.description}
                      </td>

                      <td className="p-3">
                        {project.content}
                      </td>

                      <td className="p-3">
                        {project.category?.title || "—"}
                      </td>

                      <td className="p-3">
                        {project.images?.length ? (
                          <img
                            src={
                              (project.images[0] as any)?.url ||
                              (project.images[0] as any)?.media?.url ||
                              ""
                            }
                            alt="project"
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/projects/edit/${project.id}`
                                )
                              }
                            >
                              Update
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                openDeleteDialog(project)
                              }
                            >
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

      {/* ===================================== */}
      {/* Delete Dialog */}
      {/* ===================================== */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">
                {selectedProject?.title}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}