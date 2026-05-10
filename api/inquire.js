export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, item, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "inquiries@mikes-militaria.com",
        to: "mhynes2016@gmail.com",
        reply_to: email,
        subject: `New Inquiry from ${name}${item ? ` — ${item}` : ""}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c2318;">
            <div style="background: #1a1008; padding: 24px 32px; margin-bottom: 0;">
              <h1 style="font-family: Georgia, serif; color: #c9a96e; font-size: 22px; font-weight: 400; margin: 0;">
                The Collector's Archive
              </h1>
              <p style="color: rgba(240,236,228,0.5); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 0;">
                New Inquiry
              </p>
            </div>
            <div style="background: #f0ece4; padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(44,35,24,0.1); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #8b7355; width: 140px;">From</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(44,35,24,0.1); font-size: 15px; color: #2c2318;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(44,35,24,0.1); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #8b7355;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(44,35,24,0.1); font-size: 15px; color: #2c2318;"><a href="mailto:${email}" style="color: #8b7355;">${email}</a></td>
                </tr>
                ${item ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(44,35,24,0.1); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #8b7355;">Item of Interest</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(44,35,24,0.1); font-size: 15px; color: #2c2318;">${item}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 10px 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #8b7355; vertical-align: top;">Message</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #2c2318; line-height: 1.7;">${message.replace(/\n/g, "<br>")}</td>
                </tr>
              </table>
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(44,35,24,0.1);">
                <a href="mailto:${email}" style="display: inline-block; background: #8b7355; color: #fff; text-decoration: none; padding: 10px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                  Reply to ${name}
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Resend error");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: err.message });
  }
}
