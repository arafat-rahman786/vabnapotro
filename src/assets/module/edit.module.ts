import api from '../../../lib/api';
import type { upload_blog } from '../type/deshboard.type';
import type { UserInformetion } from '../type/user.type';

type ContentBlockType = 'paragraph' | 'heading' | 'quote' | 'poem';

interface ContentBlock {
    id: string;
    type: ContentBlockType;
    text: string;
    order?: number;
}

const editArticleForm =
    document.getElementById('editArticleForm') as HTMLFormElement | null;
const articleTitle =
    document.getElementById('articleTitle') as HTMLInputElement | null;
const author =
    document.getElementById('author') as HTMLInputElement | null;
const category =
    document.getElementById('category') as HTMLSelectElement | null;
const publishDate =
    document.getElementById('publishDate') as HTMLInputElement | null;
const intro =
    document.getElementById('intro') as HTMLTextAreaElement | null;
const content =
    document.getElementById('content') as HTMLDivElement | null;
const addContentBlockButton =
    document.getElementById('add-content-block') as HTMLButtonElement | null;
const featuredImageInputs =
    document.querySelectorAll<HTMLInputElement>('input[name="featuredImage"]');

const params = new URLSearchParams(window.location.search);
const editId = params.get('articleId');
const isPendingSubmission = params.get('source') === 'pending';
let contentBlocks: ContentBlock[] = [];

function getFeaturedImageValue(): string {
    return document.querySelector<HTMLInputElement>(
        'input[name="featuredImage"]:checked'
    )?.value ?? '';
}

function parseContentBlocks(rawContent: string): ContentBlock[] {
    try {
        const parsed: unknown = JSON.parse(rawContent);
        if (Array.isArray(parsed) && parsed.every(isContentBlock)) {
            return parsed;
        }
    } catch {
    }

    return rawContent
        .split(/\n\s*\n/)
        .map((text, index) => ({
            id: `paragraph-${index + 1}`,
            type: 'paragraph' as const,
            text: text.trim(),
        }))
        .filter(block => block.text !== '');
}

function isContentBlock(value: unknown): value is ContentBlock {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const block = value as Partial<ContentBlock>;
    return typeof block.id === 'string'
        && typeof block.text === 'string'
        && ['paragraph', 'heading', 'quote', 'poem'].includes(block.type ?? '');
}

function renderContentBlocks(): void {
    if (!content) {
        return;
    }

    content.replaceChildren();
    contentBlocks.forEach(block => {
        const wrapper = document.createElement('div');
        wrapper.className = 'rounded-xl border border-slate-200 bg-slate-50 p-4';

        const toolbar = document.createElement('div');
        toolbar.className = 'mb-3 flex items-center justify-between gap-3';

        const typeSelect = document.createElement('select');
        typeSelect.className =
            'rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#02a39b]';
        [
            ['paragraph', 'অনুচ্ছেদ'],
            ['heading', 'শিরোনাম'],
            ['quote', 'উদ্ধৃতি'],
            ['poem', 'কবিতা'],
        ].forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            typeSelect.append(option);
        });
        typeSelect.value = block.type;
        typeSelect.addEventListener('change', () => {
            block.type = typeSelect.value as ContentBlockType;
        });

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'text-xs font-semibold text-red-500 hover:text-red-700';
        removeButton.textContent = 'বাদ দিন';
        removeButton.addEventListener('click', () => {
            contentBlocks = contentBlocks.filter(item => item.id !== block.id);
            renderContentBlocks();
        });

        const textArea = document.createElement('textarea');
        textArea.rows = block.type === 'poem' ? 6 : 4;
        textArea.value = block.text;
        textArea.className =
            'w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-8 outline-none focus:border-[#02a39b]';
        textArea.addEventListener('input', () => {
            block.text = textArea.value;
        });

        toolbar.append(typeSelect, removeButton);
        wrapper.append(toolbar, textArea);
        content.append(wrapper);
    });
}

addContentBlockButton?.addEventListener('click', () => {
    contentBlocks.push({
        id: crypto.randomUUID(),
        type: 'paragraph',
        text: '',
    });
    renderContentBlocks();
});

function populateFields(data: {
    name: string;
    author: string;
    category: string;
    publishDate?: string;
    excerpt: string;
    image: string;
    content: string;
}): void {
    if (articleTitle) articleTitle.value = data.name;
    if (author) author.value = data.author;
    if (category) category.value = data.category;
    if (publishDate && data.publishDate) publishDate.value = data.publishDate;
    if (intro) intro.value = data.excerpt;

    featuredImageInputs.forEach(input => {
        input.checked = input.value === data.image;
    });

    contentBlocks = parseContentBlocks(data.content);
    if (contentBlocks.length === 0) {
        contentBlocks = [{
            id: crypto.randomUUID(),
            type: 'paragraph',
            text: '',
        }];
    }
    renderContentBlocks();
}

async function loadArticle(): Promise<void> {
    if (!editId) {
        alert('লেখাটির আইডি পাওয়া যায়নি।');
        return;
    }

    try {
        if (isPendingSubmission) {
            const response = await api.get<UserInformetion>(
                `/pendingSubmissions/${editId}`
            );
            const submission = response.data;
            populateFields({
                name: submission.contentname,
                author: submission.username,
                category: submission.contentcategory,
                excerpt: submission.contentexcerpt,
                image: submission.contentimage,
                content: submission.maincontent,
            });
            return;
        }

        const response = await api.get<upload_blog>(`/adminBlog/${editId}`);
        const article = response.data;
        populateFields({
            name: article.name,
            author: article.author,
            category: article.category,
            publishDate: article.publishDate,
            excerpt: article.excerpt,
            image: article.image,
            content: article.content,
        });
    } catch (error) {
        console.error('Article load failed:', error);
        alert('লেখাটি লোড করা যায়নি। আবার চেষ্টা করুন।');
    }
}

editArticleForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!editId || !articleTitle || !author || !category || !intro) {
        return;
    }

    const contentValue = JSON.stringify(contentBlocks);
    try {
        if (isPendingSubmission) {
            await api.patch(`/pendingSubmissions/${editId}`, {
                contentname: articleTitle.value,
                username: author.value,
                contentcategory: category.value,
                contentimage: getFeaturedImageValue(),
                contentexcerpt: intro.value,
                maincontent: contentValue,
            });
        } else {
            await api.patch(`/adminBlog/${editId}`, {
                name: articleTitle.value,
                author: author.value,
                category: category.value,
                publishDate: publishDate?.value,
                image: getFeaturedImageValue(),
                excerpt: intro.value,
                content: contentValue,
            });
        }

        window.location.href = '/deshboard.html';
    } catch (error) {
        console.error('Article update failed:', error);
        alert('পরিবর্তন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।');
    }
});

if(editArticleForm){
    loadArticle()
}
