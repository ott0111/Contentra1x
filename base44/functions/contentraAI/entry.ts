import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

// Contentra AI — integration-ready backend function.
// Forwards a bounded prompt to the Core LLM integration with optional structured output.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, response_json_schema, model, feature } = body || {};
    if (!prompt || typeof prompt !== "string")
      return Response.json({ error: "prompt is required" }, { status: 400 });
    if (prompt.length > 12000)
      return Response.json({ error: "prompt too long" }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      ...(response_json_schema ? { response_json_schema } : {}),
      ...(model ? { model } : {}),
    });

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
