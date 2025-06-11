import { getKnowledgeUnitByLabel } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const label = searchParams.get('label');

  if (!label) {
    return new ChatSDKError(
      'bad_request:api',
      'Label is required',
    ).toResponse();
  }

  const knowledgeUnit = await getKnowledgeUnitByLabel({ label });

  return Response.json(knowledgeUnit, { status: 200 });
}
