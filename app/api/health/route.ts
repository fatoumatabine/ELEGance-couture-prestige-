import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store",
};

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "elegance-couture",
      checkedAt: new Date().toISOString(),
    },
    { headers }
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 204,
    headers,
  });
}
