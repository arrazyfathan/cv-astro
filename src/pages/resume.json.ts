import { RESUME_DATA } from "@/data/resume";

export function GET() {
  return new Response(JSON.stringify(RESUME_DATA, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
