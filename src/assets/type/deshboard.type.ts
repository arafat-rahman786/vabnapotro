export type upload_blog= {
    id?: string | number;
    name: string;
    image:string;
    category: string;
    author: string;
    publishDate: string;
    excerpt: string;
    headline1: string;
    headline2: string;
    headline3: string;
    content: string;
    tags: string;
}

export type pending_submission = Omit<upload_blog, 'id'> & {
    id?: string | number;
    submittedAt: string;
};