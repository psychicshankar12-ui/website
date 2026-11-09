import { NextResponse } from 'next/server';
import { getAllPages, getPageById, createPage, updatePage, deletePage } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;

    if (id) {
      const page = getPageById(id);
      if (!page) {
        return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, page });
    }

    const pages = getAllPages(category, status);
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title and Slug are required' }, { status: 400 });
    }

    const newPage = createPage({
      title: body.title,
      slug: body.slug,
      category: body.category || 'custom',
      bannerTitle: body.bannerTitle || body.title,
      bannerSubtitle: body.bannerSubtitle || '',
      bannerImage: body.bannerImage || '/images/herobanner/ban01.png',
      featuredImage: body.featuredImage || '/images/our_service_img/pro_im_1.png',
      shortExcerpt: body.shortExcerpt || '',
      content: body.content || '',
      videoUrl: body.videoUrl || '',
      faqs: body.faqs || [],
      metaTitle: body.metaTitle || `${body.title} | Psychic Arjun Krishna`,
      metaDescription: body.metaDescription || body.shortExcerpt || '',
      metaKeywords: body.metaKeywords || '',
      canonicalUrl: body.canonicalUrl || `/${body.slug}`,
      ogImage: body.ogImage || '',
      noIndex: Boolean(body.noIndex),
      schemaType: body.schemaType || 'Service',
      customSchemaJson: body.customSchemaJson || '',
      status: body.status || 'published',
    });

    return NextResponse.json({ success: true, page: newPage }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Page ID is required' }, { status: 400 });
    }

    const updated = updatePage(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, page: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Page ID is required' }, { status: 400 });
    }

    const deleted = deletePage(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete page' }, { status: 500 });
  }
}

