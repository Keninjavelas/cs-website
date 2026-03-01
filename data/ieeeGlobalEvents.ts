/**
 * IEEE Global Events - Curated Dataset
 * 
 * Refresh Instructions:
 * - Update once per semester (January / July recommended)
 * - Replace past-year conferences with latest editions
 * - Keep total count between 12–15
 * - Verify official URLs before committing
 * - Maintain alphabetical or chronological order
 * 
 * Last Updated: February 2026
 */

export interface IEEEGlobalEvent {
  title: string;
  shortName?: string;
  category: "Conference" | "Workshop" | "Symposium" | "Congress";
  focusArea: string;
  location: string;
  date: string;
  link: string;
}

export const ieeeGlobalEvents: IEEEGlobalEvent[] = [
  {
    title: "International Conference on Software Engineering",
    shortName: "ICSE 2026",
    category: "Conference",
    focusArea: "Software Engineering",
    location: "Montreal, Canada",
    date: "May 23-29, 2026",
    link: "https://conf.researchr.org/home/icse-2026",
  },
  {
    title: "International Conference on Robotics and Automation",
    shortName: "ICRA 2026",
    category: "Conference",
    focusArea: "Robotics & Automation",
    location: "Philadelphia, USA",
    date: "May 18-22, 2026",
    link: "https://www.ieee-ras.org/conferences-workshops/fully-sponsored/icra",
  },
  {
    title: "International Conference on Data Engineering",
    shortName: "ICDE 2026",
    category: "Conference",
    focusArea: "Data Engineering",
    location: "Hong Kong",
    date: "April 20-24, 2026",
    link: "https://icde2026.github.io/",
  },
  {
    title: "Computer Software & Applications Conference",
    shortName: "COMPSAC 2026",
    category: "Conference",
    focusArea: "Software & Applications",
    location: "Osaka, Japan",
    date: "June 29 - July 3, 2026",
    link: "https://ieeecompsac.computer.org/",
  },
  {
    title: "International Symposium on Software Reliability Engineering",
    shortName: "ISSRE 2026",
    category: "Symposium",
    focusArea: "Software Reliability",
    location: "Tsukuba, Japan",
    date: "October 12-15, 2026",
    link: "https://issre.github.io/",
  },
  {
    title: "International Conference on Big Data",
    shortName: "IEEE BigData 2026",
    category: "Conference",
    focusArea: "Big Data Analytics",
    location: "Washington DC, USA",
    date: "December 14-17, 2026",
    link: "https://bigdataieee.org/BigData2026/",
  },
  {
    title: "International Conference on Cloud Computing",
    shortName: "IEEE CLOUD 2026",
    category: "Conference",
    focusArea: "Cloud Computing",
    location: "Chicago, USA",
    date: "July 6-11, 2026",
    link: "https://conferences.computer.org/cloud/",
  },
  {
    title: "International Conference on Data Mining",
    shortName: "ICDM 2026",
    category: "Conference",
    focusArea: "Data Mining",
    location: "Atlantic City, USA",
    date: "November 30 - December 3, 2026",
    link: "https://icdm2026.org/",
  },
  {
    title: "International Conference on Blockchain",
    shortName: "Blockchain 2026",
    category: "Conference",
    focusArea: "Blockchain Technology",
    location: "Copenhagen, Denmark",
    date: "August 17-20, 2026",
    link: "https://blockchain.ieee.org/",
  },
  {
    title: "IEEE Conference on Virtual Reality and 3D User Interfaces",
    shortName: "IEEE VR 2026",
    category: "Conference",
    focusArea: "Virtual Reality",
    location: "Christchurch, New Zealand",
    date: "March 14-18, 2026",
    link: "https://ieeevr.org/",
  },
  {
    title: "International Conference on Software Maintenance and Evolution",
    shortName: "ICSME 2026",
    category: "Conference",
    focusArea: "Software Maintenance",
    location: "Limassol, Cyprus",
    date: "October 5-9, 2026",
    link: "https://conf.researchr.org/home/icsme-2026",
  },
  {
    title: "IEEE International Conference on Artificial Intelligence",
    shortName: "IEEE AI 2026",
    category: "Conference",
    focusArea: "Artificial Intelligence",
    location: "Singapore",
    date: "June 14-19, 2026",
    link: "https://ieeexplore.ieee.org/xpl/conhome/1000639/all-proceedings",
  },
  {
    title: "IEEE International Conference on Smart Grid Communications",
    shortName: "SmartGridComm 2026",
    category: "Conference",
    focusArea: "Smart Grid & IoT",
    location: "Sydney, Australia",
    date: "October 27-30, 2026",
    link: "https://sgc2026.ieee-smartgridcomm.org/",
  },
  {
    title: "IEEE World Congress on Services",
    shortName: "IEEE SERVICES 2026",
    category: "Congress",
    focusArea: "Services Computing",
    location: "Honolulu, USA",
    date: "September 20-25, 2026",
    link: "https://conferences.computer.org/services/",
  },
  {
    title: "International Conference on Secure and Private Communication Networks",
    shortName: "SecureComm 2026",
    category: "Conference",
    focusArea: "Security & Privacy",
    location: "Orlando, USA",
    date: "September 1-4, 2026",
    link: "https://securecomm.eai-conferences.org/",
  },
];
