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
    title: string
    description: string
}

export type headings = {
    depth: number
    slug: string
    text: string
}