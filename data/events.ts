export interface Event {
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  capacity?: number;
  category?: string;
}

export const events: Event[] = [
  {
    slug: "web-development-workshop-2026",
    title: "Modern Web Development Workshop",
    description: "Learn the latest web technologies including React, Next.js, and TailwindCSS. This hands-on workshop will guide you through building a production-ready web application from scratch. Perfect for beginners and intermediate developers looking to enhance their skills.",
    date: "2026-03-15T14:00:00",
    location: "Computer Lab, Block A",
    image: "/events/web-dev.jpg",
    capacity: 50,
    category: "Workshop"
  },
  {
    slug: "ai-ml-symposium-2026",
    title: "AI & Machine Learning Symposium",
    description: "Join us for an exciting symposium featuring industry experts discussing the latest trends in Artificial Intelligence and Machine Learning. Topics include deep learning, neural networks, computer vision, and real-world AI applications.",
    date: "2026-03-22T10:00:00",
    location: "Auditorium, Main Building",
    image: "/events/ai-ml.jpg",
    capacity: 200,
    category: "Symposium"
  },
  {
    slug: "hackathon-spring-2026",
    title: "IEEE CS Spring Hackathon 2026",
    description: "48-hour coding marathon where teams compete to build innovative solutions. Categories include Web Development, Mobile Apps, AI/ML, and IoT. Amazing prizes and internship opportunities await the winners!",
    date: "2026-04-05T09:00:00",
    location: "Innovation Center",
    image: "/events/hackathon.jpg",
    capacity: 100,
    category: "Hackathon"
  },
  {
    slug: "cybersecurity-essentials",
    title: "Cybersecurity Essentials Workshop",
    description: "Understand the fundamentals of cybersecurity, ethical hacking, and network security. Learn about common vulnerabilities, penetration testing basics, and how to secure your applications and infrastructure.",
    date: "2026-04-12T15:00:00",
    location: "Lab 301, IT Block",
    image: "/events/cybersecurity.jpg",
    capacity: 40,
    category: "Workshop"
  },
  {
    slug: "cloud-computing-aws",
    title: "Cloud Computing with AWS",
    description: "Get started with Amazon Web Services (AWS). Learn about EC2, S3, Lambda, and other essential AWS services. Deploy your first serverless application and understand cloud architecture best practices.",
    date: "2026-04-20T14:00:00",
    location: "Seminar Hall 2",
    image: "/events/cloud-aws.jpg",
    capacity: 60,
    category: "Technical Session"
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native. Learn navigation, state management, API integration, and deployment to both iOS and Android app stores.",
    date: "2026-05-03T13:00:00",
    location: "Computer Lab, Block B",
    image: "/events/mobile-dev.jpg",
    capacity: 45,
    category: "Workshop"
  },
  {
    slug: "guest-lecture-google-engineer",
    title: "Guest Lecture: Life at Google",
    description: "An inspiring session with a senior software engineer from Google. Learn about interview preparation, day-to-day work at tech giants, career growth, and tips for landing your dream job.",
    date: "2026-05-10T16:00:00",
    location: "Main Auditorium",
    image: "/events/google-lecture.jpg",
    capacity: 300,
    category: "Guest Lecture"
  },
  {
    slug: "data-science-python",
    title: "Data Science with Python",
    description: "Master data analysis, visualization, and basic machine learning using Python. Work with pandas, NumPy, matplotlib, and scikit-learn. Real-world datasets and hands-on projects included.",
    date: "2026-05-18T14:00:00",
    location: "Data Lab, Block C",
    image: "/events/data-science.jpg",
    capacity: 50,
    category: "Workshop"
  }
];

// Helper function to get upcoming events
export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper function to get past events
export function getPastEvents(): Event[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.date) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Helper function to get event by slug
export function getEventBySlug(slug: string): Event | undefined {
  return events.find(event => event.slug === slug);
}

// Helper function to get featured events (next 3 upcoming)
export function getFeaturedEvents(): Event[] {
  return getUpcomingEvents().slice(0, 3);
}
