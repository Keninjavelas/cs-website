export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

export const executiveCommittee: TeamMember[] = [
  {
    name: "Seema Sultana",
    role: "Chairperson",
    image: "/team/seema.jpeg",
    description: "Visionary leader driving innovation and excellence in the IEEE Computer Society. Dedicated to fostering a community of tech enthusiasts and building meaningful connections.",
    email: "hkbk.cs.ieee@gmail.com",
    linkedin: "https://www.linkedin.com/in/seema-sultana-857228398/",
    github: "#",
  },
  {
    name: "MD Yusuf Ali",
    role: "Vice Chair",
    image: "/team/yusuf.jpeg",
    description: "Supporting the chapter's mission with strategic initiatives and collaborative leadership. Passionate about mentoring members and organizing impactful technical events.",
    linkedin: "https://www.linkedin.com/in/md-yusuf-ali-/",
    github: "#",
  },
  {
    name: "Tuba Naaz",
    role: "Secretary",
    image: "/team/tuba.jpeg",
    description: "Ensuring smooth communication and organizational efficiency. Committed to maintaining records and coordinating between members and leadership for seamless operations.",
    linkedin: "https://www.linkedin.com/in/tubalisshious/",
    github: "#",
  },
  {
    name: "Aryan Kapoor",
    role: "Web Master",
    image: "/team/aryan_kapoor.jpeg",
    description: "Building the digital presence of IEEE CS. A full-stack developer passionate about creating intuitive web experiences and maintaining the chapter's online platforms.",
    linkedin: "https://www.linkedin.com/in/kapoor-aryan",
    github: "#",
  },
  {
    name: "Mohammad Zuhaib Wani",
    role: "Treasurer",
    image: "/team/zuhaib.jpeg",
    description: "Managing financial resources responsibly and ensuring sustainable growth. Dedicated to transparent budgeting and maximizing value for chapter activities and member benefits.",
    linkedin: "https://www.linkedin.com/in/mohammad-zuhaib-wani/",
    github: "#",
  },
  {
    name: "Shaikh Mohd Amaan",
    role: "Design Head",
    image: "/team/amaan.png",
    description: "Crafting the visual identity and design excellence for IEEE CS. Passionate about creating compelling graphics and innovative designs that elevate the chapter's brand and member experience.",
    linkedin: "https://www.linkedin.com/in/shaikh-mohd-amaan-7a9416343/",
    github: "#",
  },
];

export const facultyAdvisors: TeamMember[] = [
  {
    name: "Dr. Smitha Kurian",
    role: "Faculty Advisor",
    image: "/team/placeholder-advisor.png",
    description: "Guiding the chapter with expertise and mentorship. Dedicated to fostering student growth and academic excellence.",
    email: "hkbk.cs.ieee@gmail.com",
  },
  {
    name: "Prof. Subhatra",
    role: "Faculty Co-ordinator",
    image: "/team/placeholder-advisor.png",
    description: "Coordinating chapter activities and ensuring seamless collaboration. Committed to supporting student initiatives and chapter operations.",
    email: "hkbk.cs.ieee@gmail.com",
  },
  {
    name: "Dr. Abdul Azeez",
    role: "Branch Co-ordinator",
    image: "/team/placeholder-advisor.png",
    description: "Supporting the branch's strategic direction and initiatives. Focused on enhancing the IEEE Computer Society's impact and member engagement.",
    email: "hkbk.cs.ieee@gmail.com",
  },
];

export function getExecutiveCommittee(): TeamMember[] {
  return executiveCommittee;
}

export function getFacultyAdvisors(): TeamMember[] {
  return facultyAdvisors;
}
