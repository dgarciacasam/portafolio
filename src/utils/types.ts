export type PostCardProps = {
    title: string
    description: string
    link:string
    tag: string[]
    date: string
}

export type ProjectCardProps = {
    title: string
    description: string
    link: string
    githubLink: string
    stack: string[]
    icon: string
}

export type ExperienceCardProps = {
    date: string
    projectName: string
    description: string
    name: string
    link: string
    stack: string[]
}

export type headings = {
    depth: number
    slug: string
    text: string
}