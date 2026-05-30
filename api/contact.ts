import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  moveType?: string;
  movingFrom?: string;
  movingTo?: string;
  moveDate?: string;
  homeSize?: string;
  details?: string;
  company?: string;
};

const requiredEnv = ["SMTP_USER", "SMTP_PASS"] as const;

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const clean = (value: unknown) =>
  String(value ?? "")
    .trim()
    .slice(0, 2000);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sendJson = (res: any, status: number, body: object) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
};

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    sendJson(res, 503, { ok: false, message: "Email delivery is not configured" });
    return;
  }

  const payload = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}) as ContactPayload;

  if (payload.company) {
    sendJson(res, 200, { ok: true });
    return;
  }

  const submission = {
    name: clean(payload.name),
    email: clean(payload.email),
    phone: clean(payload.phone),
    moveType: clean(payload.moveType),
    movingFrom: clean(payload.movingFrom),
    movingTo: clean(payload.movingTo),
    moveDate: clean(payload.moveDate) || "Not specified",
    homeSize: clean(payload.homeSize),
    details: clean(payload.details) || "None",
  };

  if (
    !submission.name ||
    !isEmail(submission.email) ||
    submission.phone.length < 7 ||
    !submission.moveType ||
    !submission.movingFrom ||
    !submission.movingTo ||
    !submission.homeSize
  ) {
    sendJson(res, 400, { ok: false, message: "Missing or invalid required fields" });
    return;
  }

  const rows = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Phone", submission.phone],
    ["Move Type", submission.moveType],
    ["Moving From", submission.movingFrom],
    ["Moving To", submission.movingTo],
    ["Move Date", submission.moveDate],
    ["Home/Office Size", submission.homeSize],
    ["Additional Details", submission.details],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(([label, value]) => {
      const safeLabel = escapeHtml(label);
      const safeValue = escapeHtml(value);
      return `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top">${safeLabel}</td><td style="padding:6px 0">${safeValue}</td></tr>`;
    })
    .join("");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Purely Canadian Movers Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || "esales@pcmovers.ca",
      replyTo: submission.email,
      subject: `New Moving Estimate Request from ${submission.name}`,
      text: `${text}\n\nSent from purelycanadianmovers.com/contact/`,
      html: `
        <h2 style="color:#CC1A1A;font-family:Arial,sans-serif">New Moving Estimate Request</h2>
        <table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">${htmlRows}</table>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#666;margin-top:24px">Sent from purelycanadianmovers.com/contact/.</p>
      `,
    });

    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Contact form email failed", error);
    sendJson(res, 500, { ok: false, message: "Email delivery failed" });
  }
}
