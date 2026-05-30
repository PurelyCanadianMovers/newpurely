import { describe, it, expect } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail SMTP credentials", () => {
  it("SMTP_USER and SMTP_PASS are set in the environment", () => {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    expect(user, "SMTP_USER must be set").toBeTruthy();
    expect(pass, "SMTP_PASS must be set").toBeTruthy();
    expect(user).toMatch(/@/); // must look like an email
  });

  it("can create a nodemailer transporter and verify SMTP connection", async () => {
    const user = process.env.SMTP_USER!;
    const pass = process.env.SMTP_PASS!;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    // verify() opens a connection and checks auth — throws on bad credentials
    await expect(transporter.verify()).resolves.toBe(true);
  }, 15000); // allow up to 15s for network round-trip
});
