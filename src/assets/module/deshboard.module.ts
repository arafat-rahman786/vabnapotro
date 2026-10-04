import api from '../../../lib/api';

import type { upload_blog } from '../type/deshboard.type';
import { getImageUrl } from './image-url';

let upload_blog_form =
    document.getElementById('upload_blog_form') as HTMLFormElement | null;

let article_cards =
    document.getElementById('article_cards') as HTMLDivElement | null;

let story_section =
    document.getElementById('story_section') as HTMLDivElement | null;

let poetry_section =
    document.getElementById('poetry_section') as HTMLDivElement | null;

let feature_section =
    document.getElementById('feature_section') as HTMLDivElement | null;

let interview_section =
    document.getElementById('interview_section') as HTMLDivElement | null;

let table_body =
    document.getElementById('table_body') as HTMLDivElement | null;

let published_count =
    document.getElementById('published-count') as HTMLHeadingElement | null;

let author_count =
    document.getElementById('author-count') as HTMLHeadingElement | null;


  
// =====================================================
// UPLOAD BLOG
// =====================================================

upload_blog_form?.addEventListener('submit', async (e) => {

    e.preventDefault();

    let formData = new FormData(upload_blog_form);

    let entries = Object.fromEntries(formData);

    let validatedData = validetion(entries as upload_blog);

    if (!validatedData) {
        return;
    }

    await api.post('/adminBlog', validatedData);

    await randerHtml();

    contentBlocks = [];
    renderContentBlocks();

    upload_blog_form.reset();

});


// =====================================================
// VALIDATION
// =====================================================

function validetion(formData: upload_blog) {

    let hasArticleContent =
        formData.content !== "" &&
        getContentBlocks(formData.content).some(
            block => block.text.trim() !== ""
        );

    let condition =
        formData.name === "" ||
        formData.category === "" ||
        formData.author === "" ||
        formData.publishDate === "" ||
        formData.excerpt === "" ||
        !hasArticleContent ||
        formData.tags === "";

    if (condition) {

        alert("সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন");

        return null;

    } else {

        return formData;

    }
}


// =====================================================
// CONTENT HELPER
// =====================================================

interface IContentBlock {
    id: string;
    type: "paragraph" | "heading" | "quote" | "poem";
    text: string;
}

let addContentBlockButton =
    document.getElementById('add-content-block') as HTMLButtonElement | null;

let contentBlocksContainer =
    document.getElementById('content-blocks') as HTMLDivElement | null;

let contentEmptyState =
    document.getElementById('content-empty-state') as HTMLDivElement | null;

let articleContentInput =
    document.getElementById('article-content-data') as HTMLInputElement | null;

let contentBlocks: IContentBlock[] = [];

function renderContentBlocks() {

    if (!contentBlocksContainer || !articleContentInput) {
        return;
    }

    contentBlocksContainer.replaceChildren();

    contentBlocks.forEach((block) => {

        let card = document.createElement('div');
        card.className =
            'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm';

        let toolbar = document.createElement('div');
        toolbar.className =
            'mb-3 flex items-center justify-between gap-3';

        let typeSelect = document.createElement('select');
        typeSelect.className =
            'rounded-lg border border-gray-200 bg-[#f8faf9] px-3 py-2 text-sm text-[#064d49] outline-none focus:border-[#05aaa5]';

        let blockTypes: Array<[IContentBlock['type'], string]> = [
            ['paragraph', 'অনুচ্ছেদ'],
            ['heading', 'শিরোনাম'],
            ['quote', 'উদ্ধৃতি'],
            ['poem', 'কবিতা'],
        ];

        blockTypes.forEach(([value, label]) => {
            let option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            typeSelect.append(option);
        });

        typeSelect.value = block.type;
        typeSelect.addEventListener('change', () => {
            block.type = typeSelect.value as IContentBlock['type'];
            updateContentInput();
        });

        let removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className =
            'rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50';
        removeButton.textContent = 'মুছুন';
        removeButton.addEventListener('click', () => {
            contentBlocks = contentBlocks.filter(item => item.id !== block.id);
            renderContentBlocks();
        });

        toolbar.append(typeSelect, removeButton);

        let textInput = document.createElement('textarea');
        textInput.rows = block.type === 'poem' ? 6 : 4;
        textInput.value = block.text;
        textInput.placeholder = 'এখানে লেখা লিখুন...';
        textInput.className =
            'w-full resize-y rounded-xl border border-gray-200 bg-[#f8faf9] px-4 py-3 text-[16px] leading-8 outline-none transition placeholder:text-gray-400 focus:border-[#05aaa5] focus:ring-2 focus:ring-[#05aaa5]/10';
        textInput.addEventListener('input', () => {
            block.text = textInput.value;
            updateContentInput();
        });

        card.append(toolbar, textInput);
        contentBlocksContainer?.append(card);
    });

    contentEmptyState?.classList.toggle('hidden', contentBlocks.length > 0);
    updateContentInput();
}

function updateContentInput() {
    if (articleContentInput) {
        articleContentInput.value = JSON.stringify(contentBlocks);
    }
}

addContentBlockButton?.addEventListener('click', () => {
    contentBlocks.push({
        id: `${Date.now()}-${contentBlocks.length}`,
        type: 'paragraph',
        text: '',
    });

    renderContentBlocks();
});


function getContentBlocks(content: string): IContentBlock[] {

    try {

        let parsedContent = JSON.parse(content);

        if (Array.isArray(parsedContent)) {
            return parsedContent;
        }

        return [];

    } catch (error) {

        console.error("Content parse error:", error);

        return [];

    }

}
export async function randerHtml() {

    let BigStoryhtml = "";
    let smallStoryhtml = "";
    let poetryhtml = "";
    let featurehtml = "";
    let interviewhtml = "";
    let Deshboard_table_body_html = "";

    let getData = await api.get('/adminBlog');

    let data: upload_blog[] = getData.data;

    if (published_count) {

        published_count.innerText =
            data.length.toString();

    }
    if (author_count) {

        author_count.innerText =
            data.length.toString();

    }

    data.forEach((item: upload_blog) => {
        let imagePath = getImageUrl(item.image);
        if (item.category === "প্রবন্ধ") {

            BigStoryhtml += `

                

                    <article
                        class="group w-full overflow-hidden rounded-2xl border-2 border-[#02a39b] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                         <a href="article.html?articleId=${item.id}">
                        <div class="overflow-hidden rounded-xl">

                            <img
                                src="${imagePath}"
                                alt="${item.name}"
                                class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                        </div>
                        </a>
                        <div class="pt-2">

                            <span
                                class="mb-1 inline-block text-xs font-semibold text-[#02a39b]">

                                ${item.category}

                            </span>

                            <h2
                                class="font-bangla text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#02a39b]">

                                ${item.name}

                            </h2>

                            <div
                                class="my-3.5 border-t border-gray-200">
                            </div>

                            <div class="flex items-center gap-2">

                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#02a39b]/10 text-[#02a39b]">

                                    <i class="fa-solid fa-user text-sm"></i>

                                </div>

                                <div>

                                    <p
                                        class="font-bangla text-sm font-medium text-gray-800">

                                        ${item.author}

                                    </p>

                                    <p class="text-xs text-gray-500">

                                        লেখক

                                    </p>

                                </div>

                            </div>

                        </div>

                    </article>

               

            `;

        }
        else if (item.category === "গল্প") {

            smallStoryhtml += `

                <article
                    class="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">

                    <a href="article.html?articleId=${item.id}">

                        <img
                            src="${imagePath}"
                            alt="${item.name}"
                            class="h-40 w-full object-cover">

                        <div class="p-4">

                            <span
                                class="text-[14px] font-bold text-[#02a39b]">

                                ${item.category}

                            </span>

                            <h3
                                class="mt-1 font-serifBangla text-base font-bold">

                                ${item.name}

                            </h3>

                            <p
                                class="mt-2 text-[11px] text-gray-500">

                                ${item.excerpt}

                            </p>

                        </div>

                    </a>

                </article>

            `;

        }
        else if (item.category === "কবিতা") {

            poetryhtml += `

                <article
                    class="rounded-md border border-white/10 bg-white/5 p-6">

                    <a href="article.html?articleId=${item.id}">

                        <span
                            class="font-serif text-5xl text-[#02a39b]">

                            “

                        </span>

                        <p
                            class="mt-2 font-serifBangla text-base leading-8 text-white/90">

                            ${item.excerpt}

                        </p>

                        <p
                            class="mt-5 text-[14px] text-white/40">

                            — ${item.author}

                        </p>

                    </a>

                </article>

            `;

        }
        else if (item.category === "সাক্ষাৎকার") {

            interviewhtml += `

                <article
                    class="group relative h-[360px] overflow-hidden rounded-md">

                    <a href="article.html?articleId=${item.id}">

                        <img
                            src="${imagePath}"
                            alt="${item.name}"
                            class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105">

                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                        </div>

                        <div
                            class="absolute bottom-0 p-6">

                            <span
                                class="text-[14px] font-bold text-[#62ded7]">

                                ${item.tags}

                            </span>

                            <h3
                                class="mt-2 font-serifBangla text-2xl font-bold leading-9 text-white">

                                “${item.author}”

                            </h3>

                        </div>

                    </a>

                </article>


                <article
                    class="flex min-h-[360px] flex-col justify-center rounded-md border border-gray-200 bg-[#f7f8f6] p-7">

                    <span
                        class="text-[14px] font-bold text-[#02a39b]">

                        ${item.category}

                    </span>

                    <h3
                        class="mt-2 font-serifBangla text-2xl font-bold leading-9 text-[#073c39]">

                        ${item.name}

                    </h3>

                    <p
                        class="mt-4 text-xs leading-7 text-gray-500">

                        ${item.excerpt}

                    </p>

                    <a
                        href="article.html?articleId=${item.id}"
                        class="mt-5 w-fit rounded-full bg-[#02a39b] px-5 py-2 text-[11px] font-semibold text-white transition hover:bg-[#073c39]">

                        সাক্ষাৎকার পড়ুন →

                    </a>

                </article>

            `;

        }
        else {

            featurehtml += `

                <article
                    class="group overflow-hidden rounded-md border border-gray-200 bg-white">

                    <a href="article.html?articleId=${item.id}">

                        <div class="h-56 overflow-hidden">

                            <img
                                src="${imagePath}"
                                alt="${item.name}"
                                class="h-full w-full object-cover transition duration-700 group-hover:scale-105">

                        </div>

                        <div class="p-5">

                            <span
                                class="text-[14px] font-bold text-[#02a39b]">

                                ${item.tags}

                            </span>

                            <h3
                                class="mt-1 font-serifBangla text-xl font-bold leading-8">

                                ${item.name}

                            </h3>

                            <p
                                class="mt-2 text-xs leading-6 text-gray-500">

                                ${item.excerpt}

                            </p>

                            <span
                                class="mt-4 inline-block text-[11px] font-bold text-[#02a39b]">

                                বিস্তারিত পড়ুন →

                            </span>

                        </div>

                    </a>

                </article>

            `;

        }
        Deshboard_table_body_html += `

            <div
                class="grid grid-cols-1 gap-5 border-b border-gray-100 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center">

                <div class="flex items-center gap-4">

                    <img
                        src="${imagePath}"
                        class="h-16 w-20 rounded-lg object-cover"
                        alt="${item.name}">

                    <div>

                        <h3
                            class="text-[18px] font-bold text-[#064d49]">

                            ${item.name}

                        </h3>

                        <p
                            class="mt-1 text-[14px] text-gray-400">

                            ${item.author}

                        </p>

                    </div>

                </div>


                <div>

                    <span
                        class="rounded-full bg-[#05aaa5]/10 px-3 py-1.5 text-[14px] font-semibold text-[#05aaa5]">

                        ${item.category}

                    </span>

                </div>


                <p class="text-[14px] text-gray-500">

                    ${item.publishDate}

                </p>


                <div class="flex gap-2">

                    <a
                        href="edit.html?articleId=${item.id}"
                        class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-500 transition hover:bg-blue-100"
                        title="Edit">

                        ✎

                    </a>

                    <button
                        type="button"
                        data-delete-id="${item.id}"
                        class="delete-blog flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-lg text-red-500 transition hover:bg-red-100"
                        title="Delete">

                        ×

                    </button>

                </div>

            </div>

        `;

    });


    if (article_cards) {

        article_cards.innerHTML = BigStoryhtml;

    }

    if (story_section) {

        story_section.innerHTML = smallStoryhtml;

    }

    if (poetry_section) {

        poetry_section.innerHTML = poetryhtml;

    }

    if (feature_section) {

        feature_section.innerHTML = featurehtml;

    }

    if (interview_section) {

        interview_section.innerHTML = interviewhtml;

    }

    if (table_body) {

        table_body.innerHTML =
            Deshboard_table_body_html;

    }

}


table_body?.addEventListener(
    'click',
    async (e) => {

        let target =
            e.target as HTMLElement;

        let deleteButton =
            target.closest('.delete-blog') as HTMLButtonElement | null;

        if (!deleteButton) return;

        let id =
            deleteButton.dataset.deleteId;

        if (!id) return;

        await api.delete(`/adminBlog/${id}`);

        await randerHtml();

    }
);
randerHtml();