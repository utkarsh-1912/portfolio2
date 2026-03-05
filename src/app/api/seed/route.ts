import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { hero, about, skills, projects, education, blogs } from '../../../db/schema';
import { categorizedSkills, projects as staticProjects, education as staticEducation, blogPosts as staticBlogs } from '../../../lib/data';

export async function GET() {
    try {
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
        for (const skillCategory of categorizedSkills) {
            await db.insert(skills).values({
                category: skillCategory.category,
                categoryIcon: skillCategory.icon.name || 'Code',
                items: skillCategory.skills.map(s => ({ name: s.name, icon: s.icon.name || 'Code' })),
            });
        }

        // Projects
        for (const proj of staticProjects) {
            await db.insert(projects).values({
                title: proj.title,
                description: proj.description,
                tags: proj.tags,
                imageUrl: proj.imageUrlId,
                liveUrl: proj.liveUrl,
                githubUrl: proj.githubUrl,
            });
        }

        // Education
        for (const edu of staticEducation) {
            await db.insert(education).values({
                degree: edu.degree,
                institution: edu.institution,
                duration: edu.duration,
                description: edu.description,
                icon: edu.icon.name || 'Briefcase',
            });
        }

        // Blogs
        for (const blog of staticBlogs) {
            await db.insert(blogs).values({
                title: blog.title,
                description: blog.description,
                url: blog.url,
                imageUrl: blog.imageUrl || '',
                imageHint: blog.imageHint,
            });
        }

        return NextResponse.json({ success: true, message: 'Seeded successfully' });
    } catch (err: any) {
        console.error('Seed error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
