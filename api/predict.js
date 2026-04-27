export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await fetch(
      "https://huggingfacedev12-spam-detector.hf.space/run/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [message] }),
      }
    );

    const json = await response.json();
    const raw = json.data?.[0] ?? "No result";
    return res.status(200).json({ result: raw });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach model: " + err.message });
  }
}
