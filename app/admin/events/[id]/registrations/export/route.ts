import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-ssr";

interface RouteProps {
  params: Promise<{ id: string }>;
}

function escapeCsv(value: string | null) {
  if (value === null) {
    return "";
  }
  const normalized = String(value);
  if (
    normalized.includes(",") ||
    normalized.includes("\"") ||
    normalized.includes("\n")
  ) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  // SECURE: Use getUser() for authentication validation (server-side only)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("title")
    .eq("id", id)
    .single();

  if (eventError || !eventData) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { data: registrations, error: registrationsError } = await supabase
    .from("registrations")
    .select("name, email, usn, branch, created_at")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  if (registrationsError) {
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }

  const headers = ["Name", "Email", "USN", "Branch", "Registered At"];
  const rows = registrations.map((registration) => {
    const registeredAt = new Date(registration.created_at).toLocaleString("en-IN");
    return [
      escapeCsv(registration.name),
      escapeCsv(registration.email),
      escapeCsv(registration.usn),
      escapeCsv(registration.branch),
      escapeCsv(registeredAt),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const safeTitle = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const filename = `${safeTitle || "event"}-registrations-${timestamp}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
