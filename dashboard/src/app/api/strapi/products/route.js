import { NextResponse } from 'next/server';

const BASE  = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_API_TOKEN;
const H     = { 'Content-Type':'application/json', Authorization:`Bearer ${TOKEN}` };

// helpers ------------------------------------------------
const wrap = (b)=>(b && 'data' in b ? b : { data:b });
const toBlocks = (node) => {
  if (!node) return [];

  // racine TipTap
  if (node.type === 'doc')
    return (node.content || []).flatMap(toBlocks);

  // tableau de nœuds
  if (Array.isArray(node))
    return node.flatMap(toBlocks);

  // paragraphe
  if (node.type === 'paragraph') {
    const children = (node.content || [])
      // ne garde que les vraies feuilles de texte non vides
      .filter((leaf) => leaf.type === 'text' && (leaf.text || '').trim() !== '')
      .map((leaf) => {
        const out = { type: 'text', text: leaf.text };
        (leaf.marks || []).forEach((m) => {
          if (m.type === 'bold')   out.bold   = true;
          if (m.type === 'italic') out.italic = true;
        });
        return out;
      });

    // si aucun enfant → on ne retourne PAS ce paragraphe
    if (children.length === 0) return [];

    return [{ type:'paragraph', children }];
  }

  return [];
};


const fwd = async (r) => {
  // 204 = No Content → on renvoie un petit 200/JSON pour le front
  if (r.status === 204) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // autres cas : on relaie normalement
  const json = await r.json().catch(() => ({}));
  return NextResponse.json(json, { status: r.status });
};

const resolveId = async (code)=>{
  if(!code) return null;
  const q  = encodeURIComponent(code);
  const r  = await fetch(`${BASE}/api/products?filters[customProductId][$eq]=${q}&fields=documentId`,{headers:H});
  return r.ok ? (await r.json()).data?.[0]?.documentId : null;
};

// POST (create) -----------------------------------------
export async function POST(req){
  const body = wrap(await req.json());
  body.data.description = toBlocks(body.data.description);

  const r = await fetch(`${BASE}/api/products`,{
    method :'POST',
    headers:H,
    body   :JSON.stringify(body),
  });
  return fwd(r);
}

// PUT (update) ------------------------------------------
export async function PUT(req){
  const { documentId, customProductId, ...rest } = await req.json();
  const id = documentId || await resolveId(customProductId);
  if(!id) return NextResponse.json({ error:'documentId or customProductId required' },{status:400});

  const body = wrap(rest);
  body.data.description = toBlocks(body.data.description);

  const r = await fetch(`${BASE}/api/products/${id}`,{
    method :'PUT',
    headers:H,
    body   :JSON.stringify(body),
  });
  return fwd(r);
}

// DELETE -------------------------------------------------
export async function DELETE(req){
  const { documentId, customProductId } = await req.json();
  const id = documentId || await resolveId(customProductId);
  if(!id) return NextResponse.json({ error:'documentId or customProductId required' },{status:400});

  const r = await fetch(`${BASE}/api/products/${id}`,{
    method :'DELETE',
    headers:{ Authorization:`Bearer ${TOKEN}` },
  });
  return fwd(r);
}
