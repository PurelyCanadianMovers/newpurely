import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import nodemailer from "nodemailer";
import { ENV } from "./_core/env";
import {
  getAllBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  getAllUsers,
  setUserRole,
} from "./db";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ── Blog Router ────────────────────────────────────────────────────────────
const blogRouter = router({
  listPublished: publicProcedure.query(async () => {
    return getPublishedBlogPosts();
  }),

  listAll: adminProcedure.query(async () => {
    return getAllBlogPosts();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post || post.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog post not found" });
      }
      return post;
    }),

  getBySlugAdmin: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  publish: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return publishBlogPost(input.id);
    }),

  unpublish: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return unpublishBlogPost(input.id);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeywords: z.string().optional(),
      coverImageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return updateBlogPost(id, updates);
    }),

  generate: adminProcedure
    .input(z.object({ idea: z.string().min(3) }))
    .mutation(async ({ input }) => {
      // Generate blog post content via LLM
      const contentResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert SEO content writer for Purely Canadian Movers, a family-owned moving company based in Coquitlam, BC, Canada, serving Metro Vancouver since 1991. 
Write professional, helpful blog posts that build trust and rank well on Google.
Always respond with valid JSON matching the exact schema provided.`,
          },
          {
            role: "user",
            content: `Write a complete SEO-optimised blog post about: "${input.idea}"

Return ONLY a JSON object with these exact fields:
{
  "title": "SEO-optimised H1 title (50-60 chars)",
  "metaDescription": "Meta description under 160 characters",
  "slug": "url-friendly-slug-with-hyphens",
  "content": "Full blog post in Markdown (800-1500 words). Use ## for H2 headings, ### for H3. Include an intro, 4-6 sections, and a conclusion with a CTA to contact Purely Canadian Movers.",
  "focusKeywords": "comma, separated, keywords",
  "readTimeMinutes": 5
}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "blog_post",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                metaDescription: { type: "string" },
                slug: { type: "string" },
                content: { type: "string" },
                focusKeywords: { type: "string" },
                readTimeMinutes: { type: "integer" },
              },
              required: ["title", "metaDescription", "slug", "content", "focusKeywords", "readTimeMinutes"],
              additionalProperties: false,
            },
          },
        },
      });

      let postData: {
        title: string;
        metaDescription: string;
        slug: string;
        content: string;
        focusKeywords: string;
        readTimeMinutes: number;
      };

      try {
        const rawContent = contentResponse.choices[0]?.message?.content;
        const raw = typeof rawContent === 'string' ? rawContent : "{}";
        postData = JSON.parse(raw);
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse AI response" });
      }

      // Ensure slug is unique
      let slug = postData.slug.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const existing = await getBlogPostBySlug(slug);
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      // Generate cover image
      let coverImageUrl: string | null | undefined = null;
      try {
        const imageResult = await generateImage({
          prompt: `Professional, high-quality photograph for a moving company blog post about: ${postData.title}. Clean, modern, photorealistic. No text overlay.`,
        });
        coverImageUrl = imageResult.url;
      } catch (e) {
        console.warn("Cover image generation failed:", e);
      }

      // Save as draft
      const saved = await createBlogPost({
        idea: input.idea,
        title: postData.title,
        slug,
        metaDescription: postData.metaDescription,
        content: postData.content,
        focusKeywords: postData.focusKeywords,
        readTimeMinutes: postData.readTimeMinutes,
        coverImageUrl: coverImageUrl ?? undefined,
        status: "draft",
        authorName: "Purely Canadian Movers",
      });

      return saved;
    }),
});

// ── Contact Router ─────────────────────────────────────────────────────────
const contactRouter = router({
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(7),
      moveType: z.string(),
      movingFrom: z.string(),
      movingTo: z.string(),
      moveDate: z.string().optional(),
      homeSize: z.string(),
      details: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const subject = `New Moving Estimate Request from ${input.name}`;
      const bodyText = [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone}`,
        `Move Type: ${input.moveType}`,
        `Moving From: ${input.movingFrom}`,
        `Moving To: ${input.movingTo}`,
        `Move Date: ${input.moveDate ?? "Not specified"}`,
        `Home/Office Size: ${input.homeSize}`,
        `Additional Details: ${input.details ?? "None"}`,
      ].join("\n");
      const bodyHtml = `
        <h2 style="color:#CC1A1A;font-family:sans-serif">New Moving Estimate Request</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Name</td><td style="padding:6px 0">${input.name}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Email</td><td style="padding:6px 0"><a href="mailto:${input.email}">${input.email}</a></td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Phone</td><td style="padding:6px 0">${input.phone}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Move Type</td><td style="padding:6px 0">${input.moveType}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Moving From</td><td style="padding:6px 0">${input.movingFrom}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Moving To</td><td style="padding:6px 0">${input.movingTo}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Move Date</td><td style="padding:6px 0">${input.moveDate ?? "Not specified"}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Home/Office Size</td><td style="padding:6px 0">${input.homeSize}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold">Additional Details</td><td style="padding:6px 0">${input.details ?? "None"}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#666;margin-top:24px">Sent from the Purely Canadian Movers website contact form.</p>
      `;

      // Send email via Gmail SMTP
      if (ENV.smtpUser && ENV.smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: ENV.smtpUser, pass: ENV.smtpPass },
          });
          await transporter.sendMail({
            from: `"Purely Canadian Movers" <${ENV.smtpUser}>`,
            to: "Esales@pcmovers.ca",
            replyTo: input.email,
            subject,
            html: bodyHtml,
            text: bodyText,
          });
        } catch (e) {
          console.warn("Gmail SMTP email error:", e);
        }
      } else {
        console.warn("SMTP_USER/SMTP_PASS not set — skipping email delivery");
      }

      return { success: true };
    }),
});

// ── AI Chat Router ─────────────────────────────────────────────────────────
const chatRouter = router({
  message: publicProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })),
    }))
      .mutation(async ({ input }) => {
      // Count how many full user+assistant exchanges have happened
      const exchangeCount = input.messages.filter(m => m.role === "assistant").length;
      const ctaReminder = exchangeCount >= 2
        ? "\n\nIMPORTANT: You have now answered 2 or more questions for this visitor. At the END of your next response, naturally add a friendly call-to-action encouraging them to get a free estimate — for example: \"Ready to get started? Call us at 1-877-485-6683 or [get a free estimate online](/contact/) — we'd love to help with your move!\""
        : "";
      const systemPrompt = `You are a friendly, knowledgeable virtual assistant for Purely Canadian Movers — a family-owned moving company based in Coquitlam, BC, Canada, serving Metro Vancouver and the Lower Mainland since 1991. Your role is to help website visitors by answering questions about our services, service areas, pricing, process, and how to book a move. Be warm, helpful, and professional. Keep responses concise (2-4 short paragraphs max) and conversational.
Services: Local Moving, Long-Distance Moving, Cross-Country Moves, Canada–USA Moves, Overseas Moving, Storage Solutions, Office & Corporate Moves, Packing & Unpacking.
Service Areas: Vancouver, Coquitlam, Surrey, Burnaby, North Vancouver, Langley, Richmond, New Westminster, Port Moody, Port Coquitlam, Maple Ridge, Abbotsford, and all Metro Vancouver communities.
Contact: Phone 1-877-485-6683 or 604-522-7222 (Mon–Fri 9am–5pm; Moving Services 24/7). Email: esales@pcmovers.ca. Address: Unit 16–91 Golden Dr., Coquitlam, BC V3K 6R2.
Pricing: Free no-obligation estimates. Local moves typically billed hourly. Long-distance quoted by weight/volume and distance. Direct visitors to /contact/ or the phone number for quotes.
Do NOT make up specific prices, dates, or availability. If asked something you don't know, offer to connect them with the team via the contact form or phone.${ctaReminder}`;
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          ...input.messages,
        ],
      });

      const reply = response.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that. Please call us at 1-877-485-6683 for immediate assistance.";

      // Send real-time email notification to esales@pcmovers.ca
      const lastUserMessage = [...input.messages].reverse().find(m => m.role === "user")?.content ?? "(no message)";
      if (ENV.smtpUser && ENV.smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: { user: ENV.smtpUser, pass: ENV.smtpPass },
          });
          await transporter.sendMail({
            from: `"PCM Website Chatbot" <${ENV.smtpUser}>`,
            to: "esales@pcmovers.ca",
            subject: "New Chatbot Question — Purely Canadian Movers",
            text: `A visitor just asked the website chatbot a question.\n\nVisitor question:\n${lastUserMessage}\n\nChatbot reply:\n${reply}\n\n---\nThis is an automated notification from purelycanadianmovers.com`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px">
  <h2 style="color:#c41e3a">New Chatbot Question</h2>
  <p>A visitor just asked the website chatbot a question.</p>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 12px 8px 0;font-weight:bold;vertical-align:top">Visitor Question</td><td style="padding:8px 0;background:#f9f9f9;padding:8px">${lastUserMessage}</td></tr>
    <tr><td style="padding:8px 12px 8px 0;font-weight:bold;vertical-align:top">Chatbot Reply</td><td style="padding:8px 0">${String(reply).replace(/\n/g, "<br>")}</td></tr>
  </table>
  <p style="color:#888;font-size:12px;margin-top:24px">Automated notification from purelycanadianmovers.com — <a href="https://purelycanadianmovers.com/contact/">View Contact Page</a></p>
</div>`,
          });
        } catch (e) {
          console.warn("Chatbot notification email error:", e);
        }
      }

      return { reply };
    }),
});

// ── Users Router (admin-only user management) ─────────────────────────────────
const usersRouter = router({
  list: adminProcedure.query(async () => {
    return getAllUsers();
  }),

  setRole: adminProcedure
    .input(z.object({
      id: z.number(),
      role: z.enum(["user", "admin"]),
    }))
    .mutation(async ({ input, ctx }) => {
      // Prevent an admin from demoting themselves
      if (input.id === ctx.user.id && input.role !== "admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot remove your own admin role." });
      }
      return setUserRole(input.id, input.role);
    }),
});

// ── App Router ──────────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  blog: blogRouter,
  contact: contactRouter,
  chat: chatRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
