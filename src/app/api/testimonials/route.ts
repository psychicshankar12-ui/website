import { NextResponse } from 'next/server';
import { getAllTestimonials, createTestimonial, deleteTestimonial } from '@/lib/db';

export async function GET() {
  try {
    const testimonials = getAllTestimonials();
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, rating, review, featured } = body;
    if (!name || !review) {
      return NextResponse.json({ success: false, error: 'Name and review are required' }, { status: 400 });
    }
    const item = createTestimonial({
      name,
      location: location || 'USA',
      rating: Number(rating) || 5,
      review,
      featured: Boolean(featured),
    });
    return NextResponse.json({ success: true, testimonial: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const deleted = deleteTestimonial(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
  }
}

