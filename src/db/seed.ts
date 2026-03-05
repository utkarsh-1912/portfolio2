import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from './index';
import { hero, about, skills, projects, education, blogs } from './schema';

const projectsData = [
    {
        title: 'Fi-Xpert',
        description: 'A financial assistant app to analyze stocks, ETFs, and market trends with an AI-powered chatbot for insights.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'Genkit'],
        imageUrlId: 'project-fi-xpert',
        liveUrl: 'https://fi-xpert.vercel.app/',
        githubUrl: 'https://github.com/utkarsh-1912/FIXpert',
    },
    {
        title: 'Mine Seismic Analysis',
        description: 'A machine learning project to analyze seismic data for mines, predicting seismic events using various classification models.',
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
        description: 'Engineered a robust book management system for an NGO bookstore, streamlining inventory and operations using C++ and MySQL.',
        tags: ['C++', 'MySQL', 'OOPs', 'Linux', 'GitHub'],
        imageUrlId: 'project-book-manager',
        liveUrl: 'https://bit.ly/kartavya-book-manager',
        githubUrl: 'https://bit.ly/kartavya-book-manager',
    },
];

const categorizedSkillsData = [
    {
        category: 'Programming',
        icon: 'Code',
        skills: [
            { name: 'C++', icon: 'Code' },
            { name: 'Java', icon: 'Code' },
            { name: 'JavaScript', icon: 'Code' },
            { name: 'Python', icon: 'Code' },
        ],
    },
    {
        category: 'CS Fundamentals',
        icon: 'Book',
        skills: [
            { name: 'System Design', icon: 'Network' },
            { name: 'DBMS', icon: 'Database' },
            { name: 'OS', icon: 'Cpu' },
            { name: 'Computer Networks', icon: 'Network' },
        ],
    },
    {
        category: 'Web Development',
        icon: 'FileCode',
        skills: [
            { name: 'ReactJS', icon: 'FileCode' },
            { name: 'NextJS', icon: 'FileCode' },
            { name: 'NodeJS', icon: 'Server' },
            { name: 'ExpressJS', icon: 'Server' },
            { name: 'Tailwind CSS', icon: 'Wind' },
            { name: 'Bootstrap', icon: 'Wind' },
            { name: 'Spring Boot', icon: 'Server' },
        ],
    },
    {
        category: 'Database',
        icon: 'Database',
        skills: [
            { name: 'MongoDB', icon: 'Database' },
            { name: 'MySQL', icon: 'Database' },
            { name: 'AWS S3', icon: 'Cloud' },
        ],
    },
    {
        category: 'Other Tools & Technologies',
        icon: 'BriefcaseBusiness',
        skills: [
            { name: 'APIs', icon: 'Fingerprint' },
            { name: 'Electronic Trading', icon: 'GitGraph' },
            { name: 'Kibana', icon: 'Terminal' },
            { name: 'Grafana', icon: 'Terminal' },
            { name: 'Finance', icon: 'GitGraph' },
            { name: 'Linux', icon: 'Cpu' },
            { name: 'Network & Sockets', icon: 'Network' },
            { name: 'Bash', icon: 'Terminal' },
            { name: 'Docker & K8s', icon: 'GitGraph' },
            { name: 'GitHub Actions', icon: 'GitGraph' },
        ],
    },
];

const blogPostsData = [
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

const educationData = [
    {
        degree: 'Software Engineer',
        institution: 'Sosuv Consulting',
        duration: 'July 2024 - Present',
        description: 'Debugging and refactoring complex codebases in Unix-like environments, improving session proxy reliability for trading workflows. Designing automated scripts and containerized workflows with Docker and Kubernetes to optimize efficiency and ensure reproducibility.',
        icon: 'Briefcase',
    },
    {
        degree: 'Mitacs Globalink Intern',
        institution: 'York University',
        duration: 'May 2023 - Aug 2023',
        description: 'Performed numerical modeling on climate data of different regions of Canada using Excel and Machine Learning modeling for prediction and climate index calculation. Analyzed the data along with hypothesis testing over the Gamma and Pearson distributions.',
        icon: 'Briefcase',
    },
    {
        degree: 'B.Tech, Civil Engineering (Major)',
        institution: 'Indian Institute of Technology (ISM), Dhanbad',
        duration: '2020 - 2024',
        description: 'Graduated with a major in Civil Engineering and a minor in Computer Science. Coursework included Data Structures, Algorithms, OS, DBMS, and Computer Networks.',
        icon: 'GraduationCap',
    },
    {
        degree: 'High School Diploma',
        institution: 'St.Xavier’s High School, Fatehpur',
        duration: '2018 - 2020',
        description: 'Completed my high school with a focus on Physics, Chemistry, and Mathematics, achieving 95.6% in board examinations.',
        icon: 'GraduationCap',
    },
];


async function main() {
    console.log('Seeding initial data...');

    // Hero
    await db.insert(hero).values({
        title: 'Utkarsh Gupta',
        roles: ['Utkarsh Gupta', 'a Developer', 'a Problem Solver', 'a Tech Enthusiast'],
        description: 'A software engineer with a passion for debugging complex codebases and developing containerized workflows with Docker and Kubernetes. Experienced in both front-end and back-end technologies.',
        githubUrl: 'https://github.com/utkarsh-1912',
        linkedinUrl: 'https://www.linkedin.com/in/utkarsh-gupta-3a374119a/',
        twitterUrl: 'https://x.com/Utkarsh191201',
    });

    // About
    await db.insert(about).values({
        paragraphs: [
            'I am a Software Engineer at Sosuv Consulting, where I debug and refactor complex codebases, improving system reliability. I specialize in designing automated scripts and containerized workflows with Docker and Kubernetes to optimize efficiency.',
            'I hold a Bachelor of Technology from IIT (ISM) Dhanbad with a major in Civil Engineering and a minor in Computer Science. My technical interests lie in web development, database management, and cloud technologies.',
            "When I'm not coding, I enjoy solving problems on platforms like Leetcode and exploring my interests in badminton and Hindi poetry."
        ]
    });

    // Skills
    for (const skillCategory of categorizedSkillsData) {
        await db.insert(skills).values({
            category: skillCategory.category,
            categoryIcon: skillCategory.icon || 'Code', // Just storing a string representation
            items: skillCategory.skills.map(s => ({ name: s.name, icon: s.icon || 'Code' })),
        });
    }

    // Projects
    for (const proj of projectsData) {
        await db.insert(projects).values({
            title: proj.title,
            description: proj.description,
            tags: proj.tags,
            imageUrl: proj.imageUrlId, // temporary storing imageUrlId here for backwards compatibility
            liveUrl: proj.liveUrl,
            githubUrl: proj.githubUrl,
        });
    }

    // Education
    for (const edu of educationData) {
        await db.insert(education).values({
            degree: edu.degree,
            institution: edu.institution,
            duration: edu.duration,
            description: edu.description,
            icon: edu.icon || 'Briefcase',
        });
    }

    // Blogs
    for (const blog of blogPostsData) {
        await db.insert(blogs).values({
            title: blog.title,
            description: blog.description,
            url: blog.url,
            imageUrl: blog.imageUrl,
            imageHint: blog.imageHint,
        });
    }

    console.log('Seeding complete!');
    process.exit(0);
}

main().catch(console.error);
