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
  GraduationCap
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

export const skills: { name: string; icon: LucideIcon }[] = [
  { name: 'C++', icon: Code },
  { name: 'Java', icon: Code },
  { name: 'JavaScript', icon: Code },
  { name: 'React', icon: FileCode },
  { name: 'Next.js', icon: FileCode },
  { name: 'Spring Boot', icon: Server },
  { name: 'Tailwind CSS', icon: Wind },
  { name: 'MySQL', icon: Database },
  { name: 'MongoDB', icon: Database },
  { name: 'Docker', icon: GitGraph },
  { name: 'Linux/Bash', icon: Cpu },
  { name: 'APIs', icon: Fingerprint },
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
    description: 'Debugged and refactored complex codebases in Unix-like environments, improving session proxy reliability for trading workflows for LiquidityBook. Designed automated scripts and command-line workflows to optimize session management, reducing swap loading time by 24%. Developed containerized workflows using Docker to ensure reproducibility across staging and production. Authored clear technical documentation for debugging steps, testing procedures, and version control practices.',
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
