import { NextResponse } from 'next/server';

async function serverInit(eventID: string): Promise<{
  serviceId: string;
  templateId: string;
  userId: string;
}> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const userId = process.env.EMAILJS_USER_ID;
  let templateId;

  if (
    eventID === process.env.NEXT_PUBLIC_EVENT_ID ||
    eventID ===
      'kjzl6kcym7w8y5gwrj9wce5j136caqorg36i6nitb74vwrvbpx69krygjdaduyv'
  ) {
    templateId = process.env.EMAILJS_TEMPLATE_ID_CypherHouse;
  } else {
    templateId = process.env.EMAILJS_TEMPLATE_ID_Default;
  }

  if (!templateId) throw new Error('templateId is undefined!');
  if (!serviceId) throw new Error('serviceId is undefined!');
  if (!userId) throw new Error('userId is undefined!');
  return { serviceId, templateId, userId };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const eventID = url.searchParams.get('eventID') || '';
    const config = await serverInit(eventID);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
