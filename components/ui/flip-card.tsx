"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Github } from "lucide-react";

interface FlipCardProps {
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

export function FlipCard({
  name,
  role,
  description,
  image,
  email,
  linkedin,
  github,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine vertical scaling based on name
  const getObjectPosition = () => {
    if (name === "Tuba Naaz") {
      return "center 2%";
    } else if (name === "MD Yusuf Ali") {
      return "center 10%";
    } else if (name === "Seema Sultana") {
      return "center 35%";
    }
    return "center 17%"; // default
  };

  return (
    <div
      className="h-96 cursor-pointer perspective"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <div
          style={{
            backfaceVisibility: "hidden",
          }}
          className="w-full h-full"
        >
          <Card className="w-full h-full text-center hover:shadow-xl transition-shadow border-primary/20 flex flex-col items-center justify-center p-6">
            <CardContent className="pt-0 pb-6 flex flex-col items-center justify-center h-full">
              {/* Profile Photo - Circular Frame */}
              <div className="relative w-44 h-44 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/20 bg-gray-100">
                  {imageError ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-5xl font-bold text-primary">
                        {name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={image}
                      alt={`${name} - ${role}`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getObjectPosition() }}
                      sizes="176px"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-1 px-2">{name}</h3>
              <p className="text-primary font-medium mb-4 text-sm uppercase tracking-wide">
                {role}
              </p>

              {/* Social Links */}
              {email && (
                <div className="flex justify-center space-x-2">
                  <a
                    href={`mailto:${email}`}
                    className="w-9 h-9 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors"
                    aria-label={`Email ${name}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  {linkedin && linkedin !== "#" && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors"
                      aria-label={`${name}'s LinkedIn`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {github && github !== "#" && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors"
                      aria-label={`${name}'s GitHub`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Click hint */}
              <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
            </CardContent>
          </Card>
        </div>

        {/* Back Side */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="w-full h-full absolute top-0 left-0"
        >
          <Card className="w-full h-full hover:shadow-xl transition-shadow border-primary/20 flex flex-col items-center justify-center p-6">
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
              <p className="text-sm text-center leading-relaxed mb-4 text-muted-foreground">
                {description}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Click to flip back
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
