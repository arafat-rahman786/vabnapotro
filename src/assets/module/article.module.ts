import api from '../../../lib/api';

import type { upload_blog } from '../type/deshboard.type';
import { getImageUrl } from './image-url';

let elementCategory =
    document.querySelectorAll<HTMLElement>(".category");

let elementHeading =
    document.querySelectorAll<HTMLElement>(".heading");

let elementexcerpt =
    document.querySelector<HTMLElement>(".excerpt");

let author_name =
    document.getElementById("author_name");
let author_end =
    document.getElementById("author_end");
let author_box_name =
    document.getElementById("author_box_name");

let publish_date =
    document.getElementById("publish_date");

let hero_image =
    document.getElementById("hero_image") as HTMLImageElement | null;

let article_content =
    document.getElementById("article-content");

let article_tags =
    document.getElementById("article-tags");

let article_outline =
    document.getElementById("article-outline");
type ContentBlockType =
    | "paragraph"
    | "heading"
    | "quote"
    | "poem";


interface IContentBlock {

    id: string;

    type: ContentBlockType;

    text: string;

}

async function getArticles() {

    try {

        let articlesId =
            new URLSearchParams(window.location.search)
                .get("articleId");

        let getData = await api.get(`/adminBlog/${articlesId}`);

        if (!articlesId || articlesId === "null") {
            console.warn("No valid articleId found in URL search parameters.");
            return;
        }


        let articleData: upload_blog =
            getData.data;
        elementCategory.forEach((element) => {

            element.textContent =
                articleData.category;

        });

        elementHeading.forEach((element) => {

            element.textContent =
                articleData.name;

        });

        if (elementexcerpt) {

            elementexcerpt.textContent =
                articleData.excerpt;

        }

        if (author_name) {

            author_name.textContent =
                articleData.author;

        }

                if (author_end) {

            author_end.textContent =
                articleData.author;

        }


        if (author_box_name) {

            author_box_name.textContent =
                articleData.author;

        }
        if (publish_date) {

            publish_date.textContent =
                `প্রকাশিত: ${articleData.publishDate}`;

        }
        if (hero_image) {

            hero_image.src = getImageUrl(articleData.image);

            hero_image.alt =
                articleData.name;

        }

        renderArticleContent(
            articleData.content,
            [
                articleData.headline1,
                articleData.headline2,
                articleData.headline3,
            ]
        );
        renderTags(
            articleData.tags
        );

    }

    catch (error) {

        console.error(
            "Article load error:",
            error
        );

    }

}


getArticles();


function renderArticleContent(
    content: string,
    legacyHeadlines: string[]
) {

    if (!article_content) return;


    article_content.innerHTML = "";

    article_outline &&
        (article_outline.innerHTML = "");


    let contentBlocks: IContentBlock[] = [];
    let isBlockContent = false;
    try {

        let parsedContent: unknown =
            JSON.parse(content);

        if (
            Array.isArray(parsedContent) &&
            parsedContent.every(isContentBlock)
        ) {
            contentBlocks = parsedContent;
            isBlockContent = true;
        }

    }

    catch {
        isBlockContent = false;

    }

    if (!isBlockContent) {
        contentBlocks = legacyHeadlines
            .map((text, index) => ({
                id: `legacy-headline-${index + 1}`,
                type: index === 0 ? "quote" as const : "heading" as const,
                text: text?.trim() ?? "",
            }))
            .filter(block => block.text !== "");

        contentBlocks.push(
            ...content
                .split(/\n\s*\n/)
                .map((text, index) => ({
                    id: `legacy-paragraph-${index + 1}`,
                    type: "paragraph" as const,
                    text: text.trim(),
                }))
                .filter(block => block.text !== "")
        );
    }
    contentBlocks.forEach(
        (block) => {
            if (block.type === "paragraph") {

                let paragraph =
                    document.createElement("p");


                paragraph.className =
                    "mb-7";


                paragraph.textContent =
                    block.text;


                article_content.appendChild(
                    paragraph
                );

            }
            else if (block.type === "heading") {

                let heading =
                    document.createElement("h2");


                heading.className =
                    "mb-5 mt-12 text-2xl font-bold text-[#064d49] md:text-3xl";


                heading.textContent =
                    block.text;


                let headingId =
                    `heading-${block.id}`;


                heading.id =
                    headingId;


                article_content.appendChild(
                    heading
                );
                if (article_outline) {

                    let outlineLink =
                        document.createElement("a");


                    outlineLink.href =
                        `#${headingId}`;


                    outlineLink.className =
                        "block border-l-2 border-transparent pl-3 text-sm text-gray-500 transition hover:border-[#05aaa5] hover:text-[#064d49]";


                    outlineLink.textContent =
                        block.text;


                    article_outline.appendChild(
                        outlineLink
                    );

                }

            }
            else if (block.type === "quote") {

                let quote =
                    document.createElement("blockquote");


                quote.className =
                    "my-10 border-l-4 border-[#05aaa5] bg-[#05aaa5]/5 px-6 py-6 text-lg font-semibold leading-9 text-[#064d49] md:px-8";


                quote.textContent =
                    `“${block.text}”`;


                article_content.appendChild(
                    quote
                );

            }
            else if (block.type === "poem") {

                let poem =
                    document.createElement("div");


                poem.className =
                    "mb-8 rounded-xl bg-[#05aaa5]/5 px-6 py-5 font-serifBangla leading-10 text-[#064d49]";


                let lines =
                    block.text.split("\n");


                lines.forEach(
                    (line) => {

                        let poemLine =
                            document.createElement("div");


                        poemLine.textContent =
                            line || "\u00A0";


                        poem.appendChild(
                            poemLine
                        );

                    }
                );


                article_content.appendChild(
                    poem
                );

            }

        }
    );

}

function isContentBlock(value: unknown): value is IContentBlock {
    if (!value || typeof value !== "object") {
        return false;
    }

    let block = value as Partial<IContentBlock>;

    return typeof block.id === "string" &&
        typeof block.text === "string" &&
        (
            block.type === "paragraph" ||
            block.type === "heading" ||
            block.type === "quote" ||
            block.type === "poem"
        );
}

function renderTags(tags: string) {

    if (!article_tags) return;


    article_tags.innerHTML = "";


    let tagList =
        tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");


    tagList.forEach(
        (tag) => {

            let span =
                document.createElement("span");


            span.className =
                "rounded-full border border-[#05aaa5]/30 px-4 py-1.5 text-[18px] text-[#05aaa5]";


            span.textContent =
                `#${tag}`;


            article_tags.appendChild(
                span
            );

        }
    );

}