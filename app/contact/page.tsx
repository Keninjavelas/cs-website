"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Clock,
  Linkedin,
  Instagram,
  Navigation,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // Honeypot field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous status
    setSubmitStatus({ type: null, message: "" });

    // Validate fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    // Validate message length
    if (formData.message.trim().length < 10) {
      setSubmitStatus({
        type: "error",
        message: "Message must be at least 10 characters long.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Thank you! We'll get back to you soon.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          company: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        type: "error",
        message:
          "An error occurred while sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Mail className="h-4 w-4" />
          <span>GET IN TOUCH</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about our chapter, events, or membership? We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Info Section */}
        <div className="space-y-6">
          {/* Address Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-muted-foreground">
                <p className="font-semibold text-foreground">HKBK College of Engineering</p>
                <p>22/1, Opposite Manyata Tech Park Road</p>
                <p>Vyalikaval Society, Govindapura</p>
                <p>Nagawara, Bengaluru</p>
                <p>Karnataka 560045</p>
                <p>India</p>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="mailto:hkbk.cs.ieee@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors font-medium block"
              >
                hkbk.cs.ieee@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground pt-2 border-t">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>We aim to respond within 24–48 hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
            </CardHeader>
            <CardContent>
              {/* Status Messages */}
              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    * Required fields
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    className="gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Map Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Find Us on the Map</h2>
        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-0">
            <div className="relative w-full h-[450px] bg-muted">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=HKBK+College+of+Engineering+Bengaluru&zoom=16&maptype=roadmap"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="HKBK College of Engineering Location"
              />
            </div>
          </CardContent>

          {/* Map Action Buttons */}
          <CardContent className="p-6 bg-card/50 backdrop-blur border-t border-primary/20">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="gap-2 min-h-[48px] flex-1 sm:flex-initial"
              >
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=HKBK+College+of+Engineering+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Navigate to HKBK College of Engineering"
                >
                  <Navigation className="h-5 w-5" />
                  Navigate to HKBK College
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="gap-2 min-h-[48px] flex-1 sm:flex-initial border-primary/30 hover:bg-primary/10"
              >
                <a
                  href="https://www.google.com/maps/place/HKBK+College+of+Engineering/@13.0466311,77.6336241,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open HKBK College of Engineering in Google Maps"
                >
                  <ExternalLink className="h-5 w-5" />
                  Open in Google Maps
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-4">
              Opposite Manyata Tech Park Road, Nagawara, Bengaluru
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
