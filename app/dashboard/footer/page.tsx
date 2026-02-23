"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FooterData, SocialLink } from "./footer";
import { FooterService } from "./footer.service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";


export default function FooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<FooterData | null>(null);

  useEffect(() => {
    fetchFooter();
  }, []);

  async function fetchFooter() {
    try {
      setLoading(true);
      const res = await FooterService.get();
      setData(res.data);
    } catch (err: any) {
      toast.error("Unauthorized or failed to load footer");
    } finally {
      setLoading(false);
    }
  }

  function updateContact(field: string, value: string) {
    if (!data) return;
    setData({
      ...data,
      contact: { ...data.contact, [field]: value },
    });
  }

  function updateSocial(
    index: number,
    field: keyof SocialLink,
    value: any
  ) {
    if (!data) return;

    const updated = [...data.social_links];
    updated[index] = { ...updated[index], [field]: value };

    setData({ ...data, social_links: updated });
  }

  function addSocial() {
    if (!data) return;

    setData({
      ...data,
      social_links: [
        ...data.social_links,
        {
          platform: "",
          url: "",
          sort_order: data.social_links.length + 1,
          is_active: 1,
        },
      ],
    });
  }

  function removeSocial(index: number) {
    if (!data) return;

    setData({
      ...data,
      social_links: data.social_links.filter((_, i) => i !== index),
    });
  }

  async function handleSave() {
    if (!data) return;

    try {
      setSaving(true);
      const res = await FooterService.update(data);
      toast.success(res.message || "Footer updated");
      fetchFooter();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data)
    return <div className="p-6">Loading footer...</div>;

  return (
    <div className="p-6 max-w-full space-y-6 " style={{ padding: 12 }}>
      <Card>
        <CardHeader>
          <CardTitle>Footer CMS</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={data.contact.phone}
                  onChange={(e) =>
                    updateContact("phone", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>WhatsApp</Label>
                <Input
                  value={data.contact.whatsapp}
                  onChange={(e) =>
                    updateContact("whatsapp", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={data.contact.email}
                  onChange={(e) =>
                    updateContact("email", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={data.contact.address}
                  onChange={(e) =>
                    updateContact("address", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Social Links
              </h3>
              <Button variant="outline" onClick={addSocial}>
                Add
              </Button>
            </div>

            {data.social_links.map((link, index) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Platform"
                    value={link.platform}
                    onChange={(e) =>
                      updateSocial(index, "platform", e.target.value)
                    }
                  />

                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      updateSocial(index, "url", e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    value={link.sort_order}
                    onChange={(e) =>
                      updateSocial(
                        index,
                        "sort_order",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.is_active === 1}
                      onCheckedChange={(checked) =>
                        updateSocial(
                          index,
                          "is_active",
                          checked ? 1 : 0
                        )
                      }
                    />
                    <span className="text-sm">Active</span>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => removeSocial(index)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Separator />

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save Footer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}