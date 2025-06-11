import { getUserById } from '@/lib/db/queries';
import type { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  const user = await getUserById({ userId });

  return Response.json(user, { status: 200 });
}
