import translate from "@vitalets/google-translate-api";

export async function POST(req) {
  try {
    const { text } = await req.json();

    const result = await translate(text, { to: "id" });

    return Response.json({ translated: result.text });
  } catch (error) {
    return Response.json({ error: "Translation failed" }, { status: 500 });
  }
}
