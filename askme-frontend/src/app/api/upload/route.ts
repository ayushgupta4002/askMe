import { NextRequest, NextResponse } from 'next/server';
import { saveImageLocally } from '@/helpers/images';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  const filename = formData.get('filename');

  if (!file || !filename || typeof filename !== 'string') {
    return NextResponse.json({ error: 'Missing file or filename' }, { status: 400 });
  }

  // file is a Blob
  const arrayBuffer = await (file as Blob).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await saveImageLocally(buffer, filename);

  return NextResponse.json({ success: true, filename });
}
