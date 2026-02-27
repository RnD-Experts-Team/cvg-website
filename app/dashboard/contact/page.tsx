// contact.tsx
"use client";

import { useState, useEffect } from "react";
import { ContactSection, ContactSubmission } from "./types";
import { toast } from "react-toastify";
import { getContactSection, getContactSubmissionById, getContactSubmissions, updateContactSection } from "./contact.service";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Table } from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

export default function ContactPage() {
  const [contactSection, setContactSection] = useState<ContactSection | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newSubmissionId, setNewSubmissionId] = useState<number | null>(null); // ID of the selected contact submission for viewing

  // Fetch the contact section data and submissions
  useEffect(() => {
    const fetchContactSection = async () => {
      try {
        const res = await getContactSection();
        const payload = res && typeof res === 'object' && 'data' in res ? (res as any).data : res;
        setContactSection(payload ?? null);
      } catch (err) {
        toast.error("Failed to fetch contact section data.");
      }
    };

    const fetchContactSubmissions = async () => {
      try {
        const res = await getContactSubmissions();
        // support both ApiResponse<{data: T[]}> and raw array returns
        const list: any[] = Array.isArray(res)
          ? res
          : res && typeof res === 'object' && 'data' in res
          ? (res as any).data
          : [];
        setSubmissions(list || []);
      } catch (err) {
        toast.error("Failed to fetch contact submissions.");
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchContactSection(), fetchContactSubmissions()]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleSave = async () => {
    if (!contactSection) return;
    setLoading(true);

    try {
      const res = await updateContactSection(contactSection as any);
      const updatedSection = res && typeof res === 'object' && 'data' in res ? (res as any).data : res;
      setContactSection(updatedSection ?? contactSection);
      toast.success("Contact section updated successfully!");
    } catch (error) {
      toast.error("Error updating contact section.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionClick = async (id: number) => {
    try {
      const submission = await getContactSubmissionById(id);
      setNewSubmissionId(submission.id);
      // Handle submission details as needed
      toast.success(`Viewing submission from: ${submission.full_name}`);
    } catch (error) {
      toast.error("Error retrieving submission details.");
    }
  };

  return (
    <div className="p-8 max-w-full">
      <h1 className="text-3xl font-bold mb-6">Edit Contact Section</h1>

      {contactSection ? (
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Edit Contact Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter section title"
                  value={contactSection.title ?? ''}
                  onChange={(e) => setContactSection({ ...contactSection, title: e.target.value })}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  placeholder="Enter subtitle or description"
                  value={contactSection.subtitle ?? ''}
                  onChange={(e) => setContactSection({ ...contactSection, subtitle: e.target.value })}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="mt-2 inline-flex items-center"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        loading ? (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>

                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-24 w-full mt-2" />
                </div>

                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>

                <div className="mt-2">
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p>Loading...</p>
        )
      )}

      <h2 className="text-2xl font-bold mt-10 mb-4">Contact Submissions</h2>

      <div className="mt-8">
        {loading ? (
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Phone</th>
                      <th className="py-3">Project Details</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 text-center"><Skeleton className="h-4 w-32 mx-auto" /></td>
                        <td className="py-3 text-center"><Skeleton className="h-4 w-40 mx-auto" /></td>
                        <td className="py-3 text-center"><Skeleton className="h-4 w-28 mx-auto" /></td>
                        <td className="py-3 text-center"><Skeleton className="h-4 w-48 mx-auto" /></td>
                        <td className="py-3 text-center"><Skeleton className="h-8 w-20 mx-auto" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : submissions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Phone</th>
                      <th className="py-3">Project Details</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="py-3 text-center">{submission.full_name}</td>
                        <td className="py-3 text-center">{submission.email}</td>
                        <td className="py-3 text-center">{submission.phone_number}</td>
                        <td className="py-3 text-center">{submission.project_details}</td>
                        <td className="py-3 text-center">
                          <Button onClick={() => handleSubmissionClick(submission.id)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted">No submissions found.</p>
        )}
      </div>
    </div>
  );
}