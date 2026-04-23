"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MoreHorizontal, Star, Image as ImageIcon, Video, Pencil, Trash2 } from "lucide-react";

import { ProjectsService } from "./projects.service";
import type { Project } from "./projects";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-center">Media</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No projects yet. Click <span className="font-medium">Create Project</span> to add one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="max-w-[260px]">Description</TableHead>
                  <TableHead className="max-w-[260px]">Content</TableHead>
                  <TableHead className="text-center">Media</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const firstMedia: any = project.images?.[0];
                  const firstUrl =
                    firstMedia?.url || firstMedia?.media?.url || "";
                  const firstIsVideo =
                    firstMedia?.type === "video" ||
                    (typeof firstMedia?.mime_type === "string" &&
                      firstMedia.mime_type.startsWith("video/")) ||
                    (typeof firstMedia?.media?.mime_type === "string" &&
                      firstMedia.media.mime_type.startsWith("video/"));
                  const totalMedia = project.images?.length ?? 0;
                  const videoCount = (project.images ?? []).filter(
                    (i: any) =>
                      i?.type === "video" ||
                      (typeof i?.mime_type === "string" &&
                        i.mime_type.startsWith("video/")),
                  ).length;
                  const imageCount = totalMedia - videoCount;

                  // Strip HTML for plain-text preview of content
                  const contentPlain = (project.content || "")
                    .replace(/<[^>]*>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();

                  return (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell>
                        {firstUrl ? (
                          firstIsVideo ? (
                            <div className="relative h-12 w-12">
                              <video
                                src={firstUrl}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-12 w-12 rounded border object-cover bg-black"
                              />
                              <Video className="absolute bottom-0 right-0 h-3 w-3 text-white drop-shadow" />
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={firstUrl}
                              alt={project.title}
                              className="h-12 w-12 rounded border object-cover"
                            />
                          )
                        ) : (
                          <div className="h-12 w-12 rounded border bg-muted flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{project.title}</span>
                          {project.slug && (
                            <span className="text-xs text-muted-foreground">
                              /{project.slug}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {project.category?.title ? (
                          <Badge variant="secondary">{project.category.title}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="max-w-[260px]">
                        <span className="line-clamp-2 text-sm text-muted-foreground">
                          {project.description || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="max-w-[260px]">
                        <span className="line-clamp-2 text-sm text-muted-foreground">
                          {contentPlain || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {imageCount}
                          </span>
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Video className="h-3.5 w-3.5" />
                            {videoCount}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {project.featured ? (
                          <Star className="inline h-4 w-4 fill-amber-400 text-amber-500" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Actions">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/projects/edit/${project.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => openDeleteDialog(project)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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