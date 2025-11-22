import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { planKey, userId, email, successUrl, cancelUrl } = req.body;
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/stripe/create-checkout`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        email,
        plan: planKey,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    }
  );
  const data = await response.json();
  res.status(response.status).json(data);
}