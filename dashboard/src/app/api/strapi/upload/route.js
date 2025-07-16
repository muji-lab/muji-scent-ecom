import { NextResponse } from 'next/server';

const STRAPI_URL   = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  const form = await req.formData();           // récupère le fichier
  const res  = await fetch(`${STRAPI_URL}/api/upload`, {
    method : 'POST',
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    body   : form,                             // même FormData
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
