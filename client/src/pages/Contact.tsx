import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/Schema";
import { Phone, Mail, MapPin, Clock, CheckCircle, Star } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  moveType: string;
  movingFrom: string;
  movingTo: string;
  moveDate: string;
  homeSize: string;
  details: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<"sent" | "email-fallback" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [moveType, setMoveType] = useState("");
  const [homeSize, setHomeSize] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const openEmailFallback = (payload: FormData) => {
    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Move Type: ${payload.moveType}`,
      `Moving From: ${payload.movingFrom}`,
      `Moving To: ${payload.movingTo}`,
      `Move Date: ${payload.moveDate || "Not specified"}`,
      `Home/Office Size: ${payload.homeSize}`,
      `Additional Details: ${payload.details || "None"}`,
    ].join("\n");

    window.location.href = `mailto:esales@pcmovers.ca?subject=${encodeURIComponent("Moving Estimate Request")}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, moveType, homeSize, company: "" };
    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "/api/contact";
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Contact form endpoint returned an error");
      }

      setSubmitted("sent");
    } catch {
      openEmailFallback(payload);
      setSubmitted("email-fallback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <SEO
        title="Get a Free Moving Estimate | Contact Purely Canadian Movers"
        description="Request a free, no-obligation moving estimate from Purely Canadian Movers. Serving Metro Vancouver since 1991. Call 1-877-485-6683 or fill out our online form."
        canonical="/contact/"
      />
      <BreadcrumbSchema items={[{ name: "Contact Us", url: "/contact/" }]} />

      {/* Hero */}
      <section className="bg-gray-900 py-16">
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">Contact</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Get Your Free Moving Estimate</h1>
            <p className="font-body text-lg text-gray-300 leading-relaxed">
              Fill out the form below and we'll get back to you with a no-obligation estimate. Or call us directly — we're happy to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
                      <p className="font-body text-gray-600 mb-6 max-w-md mx-auto">
                        {submitted === "sent"
                          ? "We've received your estimate request and will be in touch within 1 business day."
                          : "Your email app should open with the estimate request filled in. Please send that email to complete your request."}{" "}
                        For immediate assistance, call us at <a href="tel:18774856683" className="text-[#CC1A1A] font-semibold">1-877-485-6683</a>.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                          <Link href="/">Back to Home</Link>
                        </Button>
                        <Button asChild variant="outline" className="font-body font-semibold border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                          <a href="https://share.google/8CPKIYw6TOJB1W8rX" target="_blank" rel="noopener noreferrer">
                            <Star size={15} className="mr-1.5 fill-yellow-400 text-yellow-400" />
                            Leave Us a Google Review
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <input
                        type="text"
                        {...register("company" as never)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Request a Free Estimate</h2>
                        <p className="font-body text-sm text-gray-500">All fields marked * are required.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="font-body font-semibold text-gray-700">Full Name *</Label>
                          <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Your full name"
                            className="mt-1 font-body"
                          />
                          {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="email" className="font-body font-semibold text-gray-700">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            placeholder="you@example.com"
                            className="mt-1 font-body"
                          />
                          {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone" className="font-body font-semibold text-gray-700">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...register("phone", { required: "Phone is required" })}
                            placeholder="604-555-0100"
                            className="mt-1 font-body"
                          />
                          {errors.phone && <p className="font-body text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
                        <div>
                          <Label className="font-body font-semibold text-gray-700">Type of Move *</Label>
                          <Select onValueChange={setMoveType}>
                            <SelectTrigger className="mt-1 font-body">
                              <SelectValue placeholder="Select move type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Local">Local Move</SelectItem>
                              <SelectItem value="Cross-Province">Cross-Province</SelectItem>
                              <SelectItem value="Cross-Country">Cross-Country</SelectItem>
                              <SelectItem value="Canada-USA">Canada–USA</SelectItem>
                              <SelectItem value="Overseas">Overseas</SelectItem>
                              <SelectItem value="Office">Office / Commercial</SelectItem>
                              <SelectItem value="Storage">Storage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="movingFrom" className="font-body font-semibold text-gray-700">Moving From *</Label>
                          <Input
                            id="movingFrom"
                            {...register("movingFrom", { required: "Origin is required" })}
                            placeholder="City or postal code"
                            className="mt-1 font-body"
                          />
                          {errors.movingFrom && <p className="font-body text-xs text-red-500 mt-1">{errors.movingFrom.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="movingTo" className="font-body font-semibold text-gray-700">Moving To *</Label>
                          <Input
                            id="movingTo"
                            {...register("movingTo", { required: "Destination is required" })}
                            placeholder="City or postal code"
                            className="mt-1 font-body"
                          />
                          {errors.movingTo && <p className="font-body text-xs text-red-500 mt-1">{errors.movingTo.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="moveDate" className="font-body font-semibold text-gray-700">Planned Move Date</Label>
                          <Input
                            id="moveDate"
                            type="date"
                            {...register("moveDate")}
                            className="mt-1 font-body"
                          />
                        </div>
                        <div>
                          <Label className="font-body font-semibold text-gray-700">Home / Office Size *</Label>
                          <Select onValueChange={setHomeSize}>
                            <SelectTrigger className="mt-1 font-body">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                              <SelectItem value="2 Bedrooms">2 Bedrooms</SelectItem>
                              <SelectItem value="3 Bedrooms">3 Bedrooms</SelectItem>
                              <SelectItem value="4 Bedrooms">4 Bedrooms</SelectItem>
                              <SelectItem value="5+ Bedrooms">5+ Bedrooms</SelectItem>
                              <SelectItem value="Small Office">Small Office</SelectItem>
                              <SelectItem value="Large Office">Large Office</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="details" className="font-body font-semibold text-gray-700">Additional Details</Label>
                        <Textarea
                          id="details"
                          {...register("details")}
                          placeholder="Any special items, access challenges, packing needs, or other details we should know..."
                          className="mt-1 font-body min-h-[100px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting || !moveType || !homeSize}
                        className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold text-base h-12"
                      >
                        {submitting ? "Sending..." : "Submit Estimate Request"}
                      </Button>

                      {submitError && (
                        <p className="font-body text-sm text-red-500 text-center">{submitError}</p>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <ul className="space-y-4">
                    <li>
                      <a href="tel:18774856683" className="flex items-start gap-3 group">
                        <Phone size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                        <div>
                          <div className="font-body font-semibold text-gray-900 group-hover:text-[#CC1A1A] transition-colors">1-877-485-6683</div>
                          <div className="font-body text-xs text-gray-500">Toll-Free</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="tel:6045227222" className="flex items-start gap-3 group">
                        <Phone size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                        <div>
                          <div className="font-body font-semibold text-gray-900 group-hover:text-[#CC1A1A] transition-colors">604-522-7222</div>
                          <div className="font-body text-xs text-gray-500">Local</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="mailto:esales@pcmovers.ca" className="flex items-start gap-3 group">
                        <Mail size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                        <div>
                          <div className="font-body text-sm text-gray-900 group-hover:text-[#CC1A1A] transition-colors break-all">esales@pcmovers.ca</div>
                        </div>
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                      <div className="font-body text-sm text-gray-700">
                        Unit 16–91 Golden Dr.<br />
                        Coquitlam, BC V3K 6R2
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                      <div className="font-body text-sm text-gray-700">
                        <strong>Office:</strong> Mon–Fri 9am–5pm<br />
                        <strong>Moving Services:</strong> 24/7
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-yellow-50">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Star size={18} className="fill-yellow-400 text-yellow-400" />
                    Happy with Our Service?
                  </h3>
                  <p className="font-body text-sm text-gray-600 mb-4">We'd love to hear from you. Leaving a Google review helps other families find trusted movers.</p>
                  <a
                    href="https://share.google/8CPKIYw6TOJB1W8rX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body text-sm font-semibold text-yellow-700 hover:text-yellow-800 underline underline-offset-2 transition-colors"
                  >
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    Write a Google Review
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-red-50 border-red-100">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Why Choose Us?</h3>
                  <ul className="space-y-2">
                    {["Family-owned since 1991", "No subcontractors — ever", "BBB Accredited", "Free estimates", "Moving services 24/7"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-[#CC1A1A] shrink-0" />
                        <span className="font-body text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
