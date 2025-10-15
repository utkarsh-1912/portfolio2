import {
  Code,
  Database,
  Server,
  type LucideIcon,
  Wind,
  Briefcase,
  GitGraph,
  Cpu,
  Fingerprint,
  FileCode,
  GraduationCap,
  Network,
  Book,
  Terminal,
  Cloud,
  BriefcaseBusiness,
} from 'lucide-react';

export const projects = [
  {
    title: 'Kartavya Bookshop Manager',
    description:
      'Engineered a robust book management system for an NGO bookstore, streamlining inventory and operations using C++ and MySQL.',
    tags: ['C++', 'MySQL', 'OOPs', 'Linux', 'GitHub'],
    imageUrlId: 'project-book-manager',
    liveUrl: 'https://bit.ly/kartavya-book-manager',
    githubUrl: 'https://bit.ly/kartavya-book-manager',
  },
  {
    title: 'Utkristi-Blogs',
    description: 'A full-stack blogging application where multiple users can read and comment in real-time, with authentication and rich text editing.',
    tags: ['NextJS', 'Tailwind CSS', 'Firebase', 'Strapi', 'Socket.IO'],
    imageUrlId: 'project-blog',
    liveUrl: 'https://utkristi-blog-ui.vercel.app/',
    githubUrl: '#',
  },
  {
    title: 'Dev-Detective',
    description: 'A tool for developers to quickly search for GitHub user profiles and view their stats and repositories.',
    tags: ['JavaScript', 'HTML', 'CSS', 'GitHub API'],
    imageUrlId: 'project-dev-detective',
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/Dev-Detective',
  },
];

export const categorizedSkills = [
  {
    category: 'Programming',
    icon: Code,
    skills: [
      { name: 'C++', icon: Code },
      { name: 'Java', icon: Code },
      { name: 'JavaScript', icon: Code },
      { name: 'Python', icon: Code },
    ],
  },
  {
    category: 'CS Fundamentals',
    icon: Book,
    skills: [
      { name: 'OOPs', icon: Code },
      { name: 'DBMS', icon: Database },
      { name: 'OS', icon: Cpu },
      { name: 'Computer Networks', icon: Network },
    ],
  },
  {
    category: 'Web Development',
    icon: FileCode,
    skills: [
      { name: 'ReactJS', icon: FileCode },
      { name: 'NextJS', icon: FileCode },
      { name: 'NodeJS', icon: Server },
      { name: 'ExpressJS', icon: Server },
      { name: 'Tailwind CSS', icon: Wind },
      { name: 'Bootstrap', icon: Wind },
      { name: 'Spring Boot', icon: Server },
    ],
  },
  {
    category: 'Database',
    icon: Database,
    skills: [
      { name: 'MongoDB', icon: Database },
      { name: 'MySQL', icon: Database },
      { name: 'AWS S3', icon: Cloud },
    ],
  },
  {
    category: 'Other Tools & Technologies',
    icon: BriefcaseBusiness,
    skills: [
      { name: 'APIs', icon: Fingerprint },
      { name: 'Electronic Trading', icon: GitGraph },
      { name: 'Kibana', icon: Terminal },
      { name: 'Grafana', icon: Terminal },
      { name: 'Finance', icon: GitGraph },
      { name: 'Linux', icon: Cpu },
      { name: 'Network & Sockets', icon: Network },
      { name: 'Bash', icon: Terminal },
      { name: 'Docker', icon: GitGraph },
      { name: 'GitHub Actions', icon: GitGraph },
    ],
  },
];

export const blogPosts = [
  {
    title: 'Understanding React Hooks',
    description: 'A deep dive into useState, useEffect, and other fundamental React hooks.',
    url: '#',
    imageUrlId: 'blog-react-hooks',
  },
  {
    title: 'The Art of UI/UX Design',
    description: 'Principles and best practices for creating intuitive and engaging user interfaces.',
    url: '#',
    imageUrlId: 'blog-ui-ux',
  },
];

export const education = [
  {
    degree: 'Software Engineer',
    institution: 'Sosuv Consulting',
    duration: 'July 2024 - Present',
    description: 'Debugging and refactoring complex codebases in Unix-like environments, improving session proxy reliability for trading workflows. Designing automated scripts and containerized workflows with Docker to optimize efficiency and ensure reproducibility.',
    icon: Briefcase,
  },
  {
    degree: 'Mitacs Globalink Intern',
    institution: 'York University',
    duration: 'May 2023 - Aug 2023',
    description: 'Performed numerical modeling on climate data of different regions of Canada using Excel and Machine Learning modeling for prediction and climate index calculation. Analyzed the data along with hypothesis testing over the Gamma and Pearson distributions.',
    icon: Briefcase,
  },
  {
    degree: 'B.Tech, Civil Engineering (Major)',
    institution: 'Indian Institute of Technology (ISM), Dhanbad',
    duration: '2020 - 2024',
    description: 'Graduated with a major in Civil Engineering and a minor in Computer Science. Coursework included Data Structures, Algorithms, OS, DBMS, and Computer Networks.',
    icon: GraduationCap,
  },
  {
    degree: 'High School Diploma',
    institution: 'St.Xavier’s High School, Fatehpur',
    duration: '2018 - 2020',
    description:
      'Completed my high school with a focus on Physics, Chemistry, and Mathematics, achieving 95.6% in board examinations.',
    icon: GraduationCap,
  },
];
