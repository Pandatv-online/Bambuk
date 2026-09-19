import { createInquiryPostHandler } from "@/lib/inquiries";

export const runtime = "nodejs";

const handlePost = createInquiryPostHandler();

export async function POST(request: Request): Promise<Response> {
  return handlePost(request);
}
