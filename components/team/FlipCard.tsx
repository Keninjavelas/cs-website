"use client";

import { useState } from "react";
import Image from "next/image";

interface FlipCardProps {
  image: string;
  name: string;
  role: string;
  description: string;
  imagePosition?: string;
  linkedin?: string;
}

export function FlipCard({ image, name, role, description, imagePosition = "center", linkedin }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);
  const hasLinkedIn = linkedin && linkedin !== "#";

  return (
    <button
      type="button"
      onClick={toggleFlip}
      className="card block w-full text-left"
      aria-pressed={flipped}
      aria-label={`Flip card for ${name}`}
    >
      <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
        <div className="card-face card-front">
          <div className="avatar">
            <Image src={image} alt={name} fill sizes="160px" className="object-cover" style={{ objectPosition: imagePosition }} />
          </div>
          <h3 className="name">{name}</h3>
          <p className="role">{role}</p>
          {hasLinkedIn && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="linkedin-button"
            >
              View LinkedIn
            </a>
          )}
          <p className="hint">Click to view details</p>
        </div>

        <div className="card-face card-back">
          <div className="description">{description}</div>
        </div>
      </div>

      <style jsx>{`
        .card {
          perspective: 1200px;
          height: 400px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(.4,.2,.2,1);
          transform-style: preserve-3d;
        }

        .card-inner.is-flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .card-back {
          transform: rotateY(180deg);
        }

        .avatar {
          width: 160px;
          height: 160px;
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          border: 4px solid rgba(255,255,255,0.2);
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .name {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;
          text-align: center;
        }

        .role {
          margin-top: 4px;
          color: rgba(255,255,255,0.75);
          text-align: center;
        }

        .linkedin-button {
          display: inline-block;
          margin-top: 12px;
          padding: 8px 16px;
          background-color: #2563eb;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
          text-decoration: none;
          z-index: 10;
          position: relative;
        }

        .linkedin-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }

        .linkedin-button:active {
          transform: translateY(0);
        }

        .hint {
          margin-top: 14px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          text-align: center;
        }

        .description {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          text-align: center;
          color: rgba(255,255,255,0.9);
          line-height: 1.7;
          padding-right: 4px;
        }
      `}</style>
    </button>
  );
}
