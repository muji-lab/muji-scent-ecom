// src/app/api/strapi/delete-orphan-images/route.js
import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const HEADERS = {
  Authorization: `Bearer ${STRAPI_TOKEN}`,
  'Content-Type': 'application/json',
};

export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid input: "ids" must be a non-empty array.' }, { status: 400 });
    }

    let deletedCount = 0;
    const errors = [];

    // Use Promise.allSettled to attempt all deletions
    const results = await Promise.allSettled(
      ids.map(id => {
        const deleteUrl = `${STRAPI_URL}/api/upload/files/${id}`;
        return fetch(deleteUrl, {
          method: 'DELETE',
          headers: HEADERS,
        });
      })
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.ok) {
        deletedCount++;
      } else {
        const id = ids[index];
        let errorMessage = `Failed to delete image with ID ${id}.`;
        if (result.status === 'rejected') {
            errorMessage += ` Reason: ${result.reason.message}`;
        } else if (result.value && !result.value.ok) {
            errorMessage += ` Status: ${result.value.status}`;
        }
        errors.push(errorMessage);
        console.warn(`[DELETE-ORPHAN-WARNING] ${errorMessage}`);
      }
    });

    if (errors.length > 0) {
        // Partial success
        return NextResponse.json({
            message: `Completed with ${errors.length} error(s).`,
            deletedCount,
            errors,
        }, { status: 207 }); // 207 Multi-Status
    }

    return NextResponse.json({
      message: 'All images deleted successfully.',
      deletedCount,
    });

  } catch (error) {
    console.error('[DELETE-ORPHANS-ERROR]', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
