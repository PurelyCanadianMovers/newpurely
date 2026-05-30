import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/Schema";
import { Star, Phone } from "lucide-react";

const reviews = [
  // Long
  { name: "Joyce", location: "Local Guide · 13 reviews", type: "5 Stars", text: "Recently, we had a wonderful experience with Purely Canadian Movers from planning to executing a downsizing job for my mom from Maple Ridge to a storage in Port Coquitlam. The process started with Ed answering my call. He was very personable and straight-forward. I appreciated his upfront transparent approach on pricing. Next, Iris visited my mom's for an in-person estimate. She was professional and kind. On the day of, Jason and Fred showed up with a huge truck on time in the morning. They were strong, efficient and professional. Jason suggested a smaller sized storage unit would be sufficient — saving us money on storage rental! They stacked boxes neatly and took care not to stack stuff on top of labeled boxes containing breakable items. The move took shorter time than expected. So happy we had Purely Canadian Movers for a smooth and stress-free move! Highly recommend!" },
  // Short
  { name: "Jen G", location: "Local Guide · 48 reviews", type: "5 Stars", text: "Codie was very helpful and efficient." },
  // Long
  { name: "Natasha Rana", location: "3 reviews", type: "5 Stars", text: "Can't say enough good things about Purely Canadian! Our team was Greg, Alan and Veronica - they saved us from a jam (a half-finished nightmare move) that another company put us in, and we realized instantly we should have hired Purely Canadian in the first place. Took excellent care with our belongings, super efficient, great communicators, and all with smiles on their faces and such positive energy - would highly recommend to anyone looking for professional moving services (they are TRUE professional movers), they will not disappoint!" },
  // Short
  { name: "dave wilkinson", location: "5 reviews", type: "5 Stars", text: "Great service, they go above and beyond to deliver your goods, safely. Very friendly too! Highly recommended." },
  // Long
  { name: "Andrew Hitchcock", location: "4 reviews · 2 photos", type: "5 Stars", text: "I would like to thank all the people who work at Purely Canadian Movers for helping us in our move from Langley to Chilliwack. From first contact they were great, very relaxed and easy to deal with. The sales rep Shawn came out to our house and gave us a very fair quote, and also provided some good tips for moving day. On moving day 4 great guys showed up, very friendly and helpful. They worked very hard and did not waste any time to get started and get the job done. We were very happy to find that the price quoted was exactly the same price charged in the end. All in all we would not hesitate in recommending them to our family and friends. Thanks guys for a great move!" },
  // Short
  { name: "Pindy Sumal", location: "Local Guide · 2 reviews", type: "5 Stars", text: "Detailed & Enthusiastic." },
  // Long
  { name: "Arman Mesri", location: "Local Guide · 70 reviews · 59 photos", type: "5 Stars", text: "Outstanding customer service. I would highly recommend them. They are honest, friendly, kind & trustworthy. They promise & they deliver. Iris was amazing. She explained the entire process in detail & provided us with fair price. There were no surprises. I like to thank Iris, Ed & Greg for their excellent customer service. You made our moving experience a pleasant one. Thanks a million guys, greatly appreciated." },
  // Short
  { name: "Joe", location: "Local Guide · 181 reviews", type: "5 Stars", text: "I highly recommend Purely Canadian Movers for any size project, big or small." },
  // Long
  { name: "K VH", location: "7 reviews · 4 photos", type: "5 Stars", text: "My experience with Purely Canadian Movers was that they were a friendly, local, down-to-earth moving company. I discovered them on the Better Business Bureau website and they lived up to their rating. The price was reasonable and the whole move was extremely efficiently done. They had all my possessions securely loaded into a truck in about 45 minutes and the move-in time once we reached the condo building was about the same. They came prepared with moving blankets and other equipment and, best of all, nothing was broken or damaged. I highly recommend this local honest-to-goodness company." },
  // Short
  { name: "Mark Dustin Briones", location: "2 reviews", type: "5 Stars", text: "If you're looking for a mover that guarantees the safety of your belongings and is on time, this is the company for you." },
  // Medium
  { name: "Jay Pants", location: "6 reviews", type: "5 Stars", text: "I had an amazing experience with Purely Canadian Movers Inc. From the very first phone call, everything felt organized." },
  // Medium
  { name: "Kimberly Ranger", location: "4 reviews", type: "Office Move", text: "We hired Purely Canadian Movers for a three building office move. From the first interaction they were professional." },
];

export default function TestimonialsPage() {
  return (
    <SiteLayout>
      <SEO
        title="Customer Reviews & Testimonials | Purely Canadian Movers"
        description="Read customer reviews for Purely Canadian Movers. 5-star rated moving company serving Metro Vancouver since 1991. See what our customers say about our service."
        canonical="/testimonials/"
      />
      <BreadcrumbSchema items={[{ name: "Customer Reviews", url: "/testimonials/" }]} />

      {/* Hero */}
      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">Reviews</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Customer Reviews</h1>
            <p className="font-body text-lg text-gray-300 mb-6 leading-relaxed">
              Don't just take our word for it. Here's what our customers across Metro Vancouver have to say about their experience with Purely Canadian Movers.
            </p>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#CC1A1A" className="text-[#CC1A1A]" />)}
              <span className="font-body text-white font-semibold ml-2">5.0 · Trusted by thousands of Metro Vancouver families</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <Card key={r.name} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F5A623" className="text-[#F5A623]" />)}
                  </div>
                  <p className="font-body text-sm text-gray-700 leading-relaxed mb-4 italic">"{r.text}"</p>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="font-body font-semibold text-gray-900 text-sm">{r.name}</div>
                    <div className="font-body text-xs text-gray-500">{r.location}</div>
                    <div className="flex gap-0.5 mt-2">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F5A623" className="text-[#F5A623]" />)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Ready to Experience the Difference?</h2>
            <p className="font-body text-gray-600 mb-8">Join thousands of satisfied customers across Metro Vancouver. Get your free estimate today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                <Link href="/contact/">Get a Free Estimate</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white font-body font-semibold">
                <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
