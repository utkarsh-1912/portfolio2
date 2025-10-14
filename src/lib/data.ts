import {
  Code,
  Database,
  Github,
  Paintbrush,
  Server,
  Smartphone,
  type LucideIcon,
  Wind,
} from 'lucide-react';

export const projects = [
  {
    title: 'Intelli-Cart',
    description:
      'An intelligent e-commerce platform that personalizes the shopping experience using AI-powered recommendations.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'JWT'],
    imageUrlId: 'project-ecommerce',
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/e-commerce',
  },
  {
    title: 'Full Stack Blog',
    description: 'A feature-rich blogging platform with a modern UI, allowing users to create, edit, and share posts.',
    tags: ['React', 'Appwrite', 'Tailwind CSS', 'TypeScript', 'Zod'],
    imageUrlId: 'project-task-manager', // Reusing image for now
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/full-stack-blog',
  },
  {
    title: 'Dev-Detective',
    description: 'A tool for developers to quickly search for GitHub user profiles and view their stats and repositories.',
    tags: ['JavaScript', 'HTML', 'CSS', 'GitHub API'],
    imageUrlId: 'project-portfolio', // Reusing image for now
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/Dev-Detective',
  },
];

export const skills: { name: string; icon: LucideIcon }[] = [
  { name: 'C++', icon: Code },
  { name: 'JavaScript', icon: Code },
  { name: 'TypeScript', icon: Code },
  { name: 'React', icon: Code },
  { name: 'Next.js', icon: Code },
  { name: 'Node.js', icon: Server },
  { name: 'Tailwind CSS', icon: Wind },
  { name: 'MongoDB', icon: Database },
  { name: 'UI/UX Design', icon: Paintbrush },
  { name: 'Git & GitHub', icon: Github },
  { name: 'Responsive Design', icon: Smartphone },
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
    degree: 'B.Tech & M.Tech, Dual Degree',
    institution: 'Indian Institute of Technology, Kanpur',
    duration: '2021 - 2026',
    description:
      'Pursuing a dual degree in Computer Science and Engineering. Coursework includes Data Structures, Algorithms, AI, and Full-Stack Development.',
  },
  {
    degree: 'Software Developer Intern',
    institution: 'Celebal Technologies',
    duration: 'June 2024 - July 2024',
    description: 'Contributed to the development of web applications using modern technologies.',
  },
  {
    degree: 'High School Diploma',
    institution: 'Delhi Public School, R.K. Puram',
    duration: '2019 - 2021',
    description:
      'Completed my high school with a focus on Physics, Chemistry, and Mathematics, achieving 95% in board examinations.',
  },
];
