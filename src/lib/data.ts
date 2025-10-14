import {
  Code,
  Github,
  LayoutTemplate,
  Paintbrush,
  PenTool,
  Server,
  Smartphone,
  type LucideIcon,
  GraduationCap,
} from 'lucide-react';

export const projects = [
  {
    title: 'Portfolio Website',
    description:
      'My personal portfolio website built with Next.js, Tailwind CSS, and Shadcn UI. Fully responsive with a light/dark mode theme.',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Shadcn UI'],
    imageUrlId: 'project-portfolio',
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/portfolio',
  },
  {
    title: 'E-commerce Platform',
    description:
      'A full-stack e-commerce application with features like product catalog, shopping cart, and user authentication.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    imageUrlId: 'project-ecommerce',
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/e-commerce',
  },
  {
    title: 'Task Management App',
    description:
      'A Kanban-style task management app that helps users organize their tasks, set priorities, and track progress.',
    tags: ['Vue.js', 'Firebase', 'Vuex', 'SCSS'],
    imageUrlId: 'project-task-manager',
    liveUrl: '#',
    githubUrl: 'https://github.com/utkarsh-1912/task-manager',
  },
];

export const skills: { name: string; icon: LucideIcon }[] = [
  { name: 'HTML5', icon: Code },
  { name: 'CSS3', icon: Code },
  { name: 'JavaScript', icon: Code },
  { name: 'React', icon: Code },
  { name: 'Next.js', icon: Code },
  { name: 'Node.js', icon: Server },
  { name: 'UI/UX Design', icon: Paintbrush },
  { name: 'Figma', icon: PenTool },
  { name: 'Responsive Design', icon: Smartphone },
  { name: 'Git & GitHub', icon: Github },
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
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'Indian Institute of Technology, Kanpur',
    duration: '2021 - 2025',
    description:
      'Focused on core computer science subjects including Data Structures, Algorithms, AI, and Web Development. Maintained a CGPA of 8.5/10.',
  },
  {
    degree: 'High School Diploma',
    institution: 'Delhi Public School, R.K. Puram',
    duration: '2019 - 2021',
    description:
      'Completed my high school with a focus on Physics, Chemistry, and Mathematics, achieving 95% in board examinations.',
  },
];
