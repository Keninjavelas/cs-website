/**
 * PERMANENTLY STATIC SECTION
 * 
 * This page is NOT connected to Supabase.
 * It uses hardcoded data from @/data/team.ts
 * It is NOT editable from the admin dashboard.
 * It will render even if the database is offline.
 */

import { FlipCard } from "@/components/team/FlipCard";
import { FacultyCard } from "@/components/team/FacultyCard";
import { executiveCommittee, facultyAdvisors } from "@/data/team";

export default function TeamPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Meet Our Team</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Dedicated leaders and contributors driving IEEE CS initiatives.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Executive Committee</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {executiveCommittee.map((member) => {
            let imagePosition: string | undefined;
            if (member.name === "Tuba Naaz" || member.name === "MD Yusuf Ali") {
              imagePosition = "center 10%";
            } else if (member.name === "Aryan Kapoor") {
              imagePosition = "center 15%";
            }
            return (
              <FlipCard
                key={`${member.name}-${member.role}`}
                image={member.image}
                name={member.name}
                role={member.role}
                description={member.description}
                imagePosition={imagePosition}
                linkedin={member.linkedin}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-8 text-center">Faculty Advisors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {facultyAdvisors.map((member) => (
            <FacultyCard
              key={`${member.name}-${member.role}`}
              name={member.name}
              role={member.role}
              email={member.email || "faculty@example.com"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
