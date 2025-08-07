import { NextResponse } from "next/server";
import { getCitation } from "@/lib/actions/get_citation";

export async function GET() {
  try {
    const citation = await getCitation();
    return NextResponse.json(citation);
  } catch {
    return NextResponse.json({ error: "Failed to fetch citation" }, { status: 500 });
  }
}