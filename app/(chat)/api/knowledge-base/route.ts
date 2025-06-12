import { auth } from '@/app/(auth)/auth';
import { getAllKnowledgeUnits, saveKnowledgeUnit } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(_: Request) {
  const knowledgeUnitLabels = await getAllKnowledgeUnits();

  return Response.json(knowledgeUnitLabels, { status: 200 });
}

export async function POST(request: Request) {
  const { label, text } = await request.json();

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  try {
    const knowledgeUnit = await saveKnowledgeUnit({
      label,
      text,
      userId: session.user.id,
    });

    return Response.json(knowledgeUnit, { status: 200 });
  } catch (error) {
    console.error('Error saving knowledge unit:', error);
    return new ChatSDKError('bad_request:database').toResponse();
  }
}
