import { getKnowledgeUnitLabels } from '@/lib/db/queries';

export async function GET(request: Request) {
  const knowledgeUnitLabels = await getKnowledgeUnitLabels();

  return Response.json(knowledgeUnitLabels, { status: 200 });
}
