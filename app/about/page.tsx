import { Info, Target, Users2, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About IEEE Computer Society</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn about our mission, vision, and what makes us the premier community for computer science enthusiasts
        </p>
      </div>

      {/* What is IEEE Computer Society */}
      <section className="mb-16">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">What is IEEE Computer Society?</h2>
            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                The IEEE Computer Society is the world&apos;s premier organization for computing professionals, bringing together
                technologists, researchers, educators, and students from around the globe.
              </p>
              <p>
                Our Student Chapter brings the benefits of this global network to our campus, providing opportunities for
                learning, networking, and professional development in computer science and related fields.
              </p>
              <p>
                This is the official website of the IEEE Computer Society Student Chapter, operating under IEEE governance
                and standards to advance technology for humanity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                To foster technical excellence and innovation through collaborative learning, hands-on workshops, and
                exposure to cutting-edge technologies. We aim to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide platforms for students to explore emerging technologies</li>
                <li>Facilitate knowledge sharing through technical workshops and seminars</li>
                <li>Connect students with industry professionals and mentors</li>
                <li>Organize hackathons and competitions to showcase skills</li>
                <li>Build a supportive community of tech enthusiasts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="mb-16">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                To be the leading student organization that empowers the next generation of technology leaders through
                excellence in education, innovation, and community engagement.
              </p>
              <p>
                We envision a campus where every student interested in computer science has access to resources, mentorship,
                and opportunities to grow both technically and professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section>
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Technical Workshops</h3>
                <p className="text-muted-foreground">
                  Hands-on sessions covering latest technologies, programming languages, frameworks, and industry best practices.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Hackathons</h3>
                <p className="text-muted-foreground">
                  Organize and participate in coding competitions that challenge creativity and problem-solving skills.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Guest Lectures</h3>
                <p className="text-muted-foreground">
                  Invite industry experts and researchers to share insights on trending topics and career paths.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Networking Events</h3>
                <p className="text-muted-foreground">
                  Connect students with peers, alumni, and professionals for mentorship and career opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
