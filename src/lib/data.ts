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
import { Post } from './types';

export const projects = [
  {
    title: 'Fi-Xpert',
    description:
      'A financial assistant app to analyze stocks, ETFs, and market trends with an AI-powered chatbot for insights.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'Genkit'],
    imageUrlId: 'project-fi-xpert',
    liveUrl: 'https://fi-xpert.vercel.app/',
    githubUrl: 'https://github.com/utkarsh-1912/FIXpert',
  },
  {
    title: 'Mine Seismic Analysis',
    description:
      'A machine learning project to analyze seismic data for mines, predicting seismic events using various classification models.',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'Google Colab'],
    imageUrlId: 'project-seismic-analysis',
    liveUrl: 'https://colab.research.google.com/github/utkarsh-1912/ML_Works/blob/main/Seismic_Analysis_for_Mine.ipynb',
    githubUrl: 'https://github.com/utkarsh-1912/ML_Works/blob/main/Seismic_Analysis_for_Mine.ipynb',
  },
  {
    title: 'Code Editor',
    description: 'A real-time multiplayer code editor with syntax highlighting and collaboration features.',
    tags: ['React', 'Node.js', 'Socket.io', 'CodeMirror'],
    imageUrlId: 'project-code-editor',
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/rtm-code-editor',
  },
  {
    title: 'Notes Manager',
    description: 'A full-stack application for creating, managing, and organizing personal notes with a clean, modern interface.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    imageUrlId: 'project-notes-manager',
    liveUrl: 'https://notes-manager-frontend.vercel.app/',
    githubUrl: 'https://github.com/utkarsh-1912/notes-manager-frontend',
  },
  {
    title: 'Formify-JSON',
    description: 'A utility to effortlessly create dynamic forms from JSON schemas, streamlining form creation in web apps.',
    tags: ['React', 'JSON-Schema', 'Form-Generator'],
    imageUrlId: 'project-formify-json',
    liveUrl: 'https://formify-json.vercel.app/',
    githubUrl: 'https://github.com/utkarsh-1912/formify-json',
  },
  {
    title: 'Kartavya Bookshop Manager',
    description:
      'Engineered a robust book management system for an NGO bookstore, streamlining inventory and operations using C++ and MySQL.',
    tags: ['C++', 'MySQL', 'OOPs', 'Linux', 'GitHub'],
    imageUrlId: 'project-book-manager',
    liveUrl: 'https://bit.ly/kartavya-book-manager',
    githubUrl: 'https://bit.ly/kartavya-book-manager',
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
      { name: 'System Design', icon: Network },
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
      { name: 'Docker & K8s', icon: GitGraph },
      { name: 'GitHub Actions', icon: GitGraph },
    ],
  },
];

export const blogPosts: Post[] = [
  {
    title: 'Understanding React Hooks',
    description: 'A deep dive into useState, useEffect, and other fundamental React hooks.',
    url: 'https://utkristi-blog-ui.vercel.app/',
    imageUrl: '', // This will be populated by getBlogPosts
    imageHint: 'react code',
  },
  {
    title: 'The Art of UI/UX Design',
    description: 'Principles and best practices for creating intuitive and engaging user interfaces.',
    url: 'https://utkristi-blog-ui.vercel.app/',
    imageUrl: '', // This will be populated by getBlogPosts
    imageHint: 'design process',
  },
];

export const education = [
  {
    degree: 'Software Engineer',
    institution: 'Sosuv Consulting',
    duration: 'July 2024 - Present',
    description: 'Debugging and refactoring complex codebases in Unix-like environments, improving session proxy reliability for trading workflows. Designing automated scripts and containerized workflows with Docker and Kubernetes to optimize efficiency and ensure reproducibility.',
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
