import { NextResponse } from 'next/server';
import { getAllInquiries, createInquiry, updateInquiryStatus, deleteInquiry } from '@/lib/db';

export async function GET() {
  try {
    const inquiries = getAllInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message, pageSource } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Name and Phone are required' }, { status: 400 });
    }

    const inquiry = createInquiry({
      name,
      email: email || '',
      phone,
      service: service || 'General Astrological Consultation',
      message: message || '',
      pageSource: pageSource || 'Website',
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create inquiry' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }
    const updated = updateInquiryStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const deleted = deleteInquiry(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete inquiry' }, { status: 500 });
  }
}

