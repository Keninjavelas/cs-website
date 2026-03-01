"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import Link from "next/link";

interface Registration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  usn: string | null;
  branch: string | null;
  created_at: string;
  updated_at: string;
}

interface RegistrationsTableProps {
  registrations: Registration[];
  exportHref: string;
}

export function RegistrationsTable({
  registrations,
  exportHref,
}: RegistrationsTableProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registered Participants</CardTitle>
        <Button asChild className="gap-2">
          <Link href={exportHref}>
            <Download className="h-4 w-4" />
            Export CSV
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  USN
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Branch
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Registered On
                </th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr
                  key={registration.id}
                  className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-foreground">
                    {registration.name}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {registration.email}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {registration.usn ? (
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                        {registration.usn}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {registration.branch ? (
                      <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                        {registration.branch}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(registration.created_at).toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
