"use client";

interface FacultyCardProps {
  name: string;
  role: string;
  email: string;
}

export function FacultyCard({ name, role, email }: FacultyCardProps) {
  return (
    <div className="faculty-card">
      <h3 className="name">{name}</h3>
      <p className="email">{email}</p>
      <p className="role">{role}</p>

      <style jsx>{`
        .faculty-card {
          height: 400px;
          border-radius: 16px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          text-align: center;
        }

        .name {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .email {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
          margin-bottom: 12px;
        }

        .role {
          color: rgba(255,255,255,0.75);
        }
      `}</style>
    </div>
  );
}
