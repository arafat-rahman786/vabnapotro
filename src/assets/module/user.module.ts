import api from "../../../lib/api"
import type { UserInformetion } from "../type/user.type"
import { randerHtml } from "../module/deshboard.module"
import { getImageUrl } from "./image-url"


// ========================================
// CONTENT ELEMENTS
// ========================================

const addContentButton =
    document.getElementById("add-content-block")

const contentTypeMenu =
    document.getElementById("content-type-menu")

const contentBlocks =
    document.getElementById("content-blocks")

const emptyState =
    document.getElementById("content-empty-state") as HTMLDivElement


// ========================================
// AUTHOR INFORMATION
// ========================================

const authorName =
    document.getElementById("authorName") as HTMLInputElement

const authorEmail =
    document.getElementById("authorEmail") as HTMLInputElement

const authorPhone =
    document.getElementById("authorPhone") as HTMLInputElement

const authorLocation =
    document.getElementById("authorLocation") as HTMLInputElement


// ========================================
// ARTICLE INFORMATION
// ========================================

const articleTitle =
    document.getElementById("articleTitle") as HTMLInputElement

const articleCategory =
    document.getElementById("articleCategory") as HTMLSelectElement

const articleExcerpt =
    document.getElementById("articleExcerpt") as HTMLTextAreaElement

const articleTags =
    document.getElementById("articleTags") as HTMLInputElement


// ========================================
// IMAGE ELEMENTS
// ========================================

const featuredImageInputs =
    document.querySelectorAll<HTMLInputElement>(
        'input[name="featuredImage"]'
    )


// ========================================
// DASHBOARD ELEMENTS
// ========================================

const pendingCardCount =
    document.getElementById("pending-card-count") as HTMLSpanElement

const userSubmissionForm =
    document.getElementById("userSubmissionForm") as HTMLFormElement | null

const pendingSubmissionList =
    document.getElementById("pending-submission-list")


// ========================================
// ADD CONTENT BLOCK MENU
// ========================================

addContentButton?.addEventListener("click", () => {

    contentTypeMenu?.classList.toggle("hidden")

})


// ========================================
// CREATE CONTENT BLOCK
// ========================================

document
    .querySelectorAll("[data-block-type]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const type =
                button.getAttribute("data-block-type")

            if (!type || !contentBlocks) return


            // Hide empty state
            emptyState?.classList.add("hidden")


            // Create block
            const block =
                document.createElement("div")


            block.className =
                "rounded-2xl border border-gray-200 bg-gray-50 p-5"


            // Default values
            let label = "Paragraph"

            let placeholder =
                "আপনার লেখা এখানে লিখুন..."


            // Heading
            if (type === "heading") {

                label = "Heading"

                placeholder =
                    "উপশিরোনাম লিখুন..."
            }


            // Quote
            if (type === "quote") {

                label = "Quote"

                placeholder =
                    "উক্তিটি এখানে লিখুন..."
            }


            // Poem
            if (type === "poem") {

                label = "Poem"

                placeholder =
                    "কবিতার লাইনগুলো এখানে লিখুন..."
            }


            // Block HTML
            block.innerHTML = `
                <div class="mb-3 flex items-center justify-between">

                    <span class="text-sm font-bold text-[#064e4a]">
                        ${label}
                    </span>

                    <button
                        type="button"
                        class="remove-content-block text-sm text-red-500 transition hover:text-red-700"
                    >
                        <i class="fa-solid fa-trash"></i>
                        বাদ দিন
                    </button>

                </div>


                <textarea
                    data-content-type="${type}"
                    rows="${type === "poem" ? 7 : 5}"
                    placeholder="${placeholder}"
                    class="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#02a39b] focus:ring-2 focus:ring-[#02a39b]/10"
                ></textarea>
            `


            // Add block
            contentBlocks.appendChild(block)


            // Hide menu
            contentTypeMenu?.classList.add("hidden")


            // Remove block
            block
                .querySelector(".remove-content-block")
                ?.addEventListener("click", () => {

                    block.remove()


                    // Show empty state if no block
                    if (
                        contentBlocks.children.length === 0
                    ) {

                        emptyState?.classList.remove("hidden")

                    }

                })

        })

    })


// ========================================
// FORM VALIDATION
// ========================================

function validation(): boolean {

    if (
        authorName.value.trim() === "" ||

        authorEmail.value.trim() === "" ||

        articleTitle.value.trim() === "" ||

        articleCategory.value === "" ||

        articleExcerpt.value.trim() === "" ||

        contentBlocks?.children.length === 0 ||

        !getFeaturedImageValue()
    ) {

        alert("সব প্রয়োজনীয় তথ্য পূরণ করুন।")

        return false
    }


    return true
}


function getFeaturedImageValue(): string {
    return Array
        .from(featuredImageInputs)
        .find(input => input.checked)
        ?.value ?? ""
}


// ========================================
// GET CONTENT BLOCKS
// ========================================

function getContentBlocks() {

    if (!contentBlocks) return []


    return Array
        .from(contentBlocks.children)
        .map((block, index) => {

            const textarea =
                block.querySelector<HTMLTextAreaElement>(
                    "textarea"
                )


            return {

                id: crypto.randomUUID(),

                type:
                    textarea?.dataset.contentType ??
                    "paragraph",

                text:
                    textarea?.value.trim() ??
                    "",

                order:
                    index + 1
            }

        })

}


// ========================================
// SUBMIT ARTICLE
// ========================================

userSubmissionForm?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault()


        // Validation
        if (!validation()) return


        try {

            // ====================================
            // CREATE SUBMISSION
            // ====================================

            const submission: UserInformetion = {

                id:
                    crypto.randomUUID(),

                username:
                    authorName.value.trim(),

                useremail:
                    authorEmail.value.trim(),

                phone:
                    authorPhone.value
                        ? Number(authorPhone.value)
                        : 0,

                address:
                    authorLocation.value.trim(),

                contentname:
                    articleTitle.value.trim(),

                contentcategory:
                    articleCategory.value,

                contentimage:
                    getFeaturedImageValue(),

                contentexcerpt:
                    articleExcerpt.value.trim(),

                maincontent:
                    JSON.stringify(
                        getContentBlocks()
                    ),

                contenttags:
                    articleTags.value.trim()

            }


            // ====================================
            // SEND TO API
            // ====================================

            const response =
                await api.post(
                    "/pendingSubmissions",
                    submission
                )


            console.log(
                response.data
            )


            // ====================================
            // SUCCESS
            // ====================================

            alert(
                "আপনার লেখা সফলভাবে জমা হয়েছে।"
            )


            // ====================================
            // RESET FORM
            // ====================================

            userSubmissionForm.reset()


            // Reset content blocks
            if (contentBlocks) {

                contentBlocks.innerHTML = ""

            }


            // Show empty state
            emptyState?.classList.remove(
                "hidden"
            )


        } catch (error) {

            console.error(error)

            alert(
                "লেখা জমা দেওয়া সম্ভব হয়নি।"
            )

        }

    }
)


// ========================================
// RENDER PENDING SUBMISSIONS
// ========================================

async function submissionRender() {

    try {

        const res =
            await api.get(
                "/pendingSubmissions"
            )


        const data =
            res.data


        // Pending count
        if (pendingCardCount) {

            pendingCardCount.textContent =
                String(data.length)

        }


        // Create HTML
        const submissionHtml =
            data.map(
                (item: UserInformetion) => {

                    return `
                        <div
                            class="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#05aaa5]/30"
                        >

                            <div
                                class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
                            >

                                <!-- Info -->

                                <div class="flex items-center gap-5">

                                    <img
                                        src="${getImageUrl(item.contentimage)}"
                                        alt="${item.contentname}"
                                        class="h-20 w-28 shrink-0 rounded-xl object-cover"
                                    />

                                    <div
                                        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#05aaa5]/10 text-xl font-bold text-[#05aaa5]"
                                    >
                                        ${item.username
                                            ?.charAt(0)
                                            ?.toUpperCase() ?? "U"}
                                    </div>


                                    <div>

                                        <div
                                            class="flex flex-wrap items-center gap-3"
                                        >

                                            <h3
                                                class="text-[20px] font-bold text-[#064d49]"
                                            >
                                                ${item.contentname}
                                            </h3>


                                            <span
                                                class="rounded-full bg-orange-50 px-3 py-1 text-[14px] font-semibold text-orange-500"
                                            >
                                                অপেক্ষমাণ
                                            </span>

                                        </div>


                                        <p
                                            class="mt-2 text-[18px] text-gray-500"
                                        >
                                            লেখক:
                                            ${item.username}
                                        </p>


                                        <p
                                            class="mt-1 text-[14px] text-gray-400"
                                        >
                                            ${item.useremail}
                                        </p>

                                    </div>

                                </div>


                                <!-- Actions -->

                                <div
                                    class="flex flex-wrap gap-2"
                                >

                                    <a
                                        href="edit.html?articleId=${item.id}&source=pending"
                                        class="rounded-xl border border-gray-200 px-5 py-3 text-[18px] font-semibold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        সম্পাদনা
                                    </a>


                                    <button
                                        type="button"
                                        data-approve-id="${item.id}"
                                        class="approve rounded-xl bg-[#05aaa5] px-5 py-3 text-[18px] font-semibold text-white transition hover:bg-[#048f8b]"
                                    >
                                        Approve
                                    </button>


                                    <button
                                        type="button"
                                        data-delete-id="${item.id}"
                                        class="delete-submission rounded-xl border border-red-100 px-5 py-3 text-[18px] font-semibold text-red-500 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>
                    `
                }
            )
            .join("")


        if (pendingSubmissionList) {

            pendingSubmissionList.innerHTML =
                submissionHtml

        }

    } catch (error) {

        console.error(
            "Pending submission render error:",
            error
        )

    }

}


// ========================================
// INITIAL RENDER
// ========================================

submissionRender()


// ========================================
// APPROVE / DELETE
// ========================================

pendingSubmissionList?.addEventListener(
    "click",
    async (e) => {

        const target =
            e.target as HTMLElement


        // ====================================
        // APPROVE
        // ====================================

        const approveButton =
            target.closest(
                ".approve"
            ) as HTMLButtonElement | null


        if (approveButton) {

            try {

                const findId =
                    approveButton.dataset.approveId


                if (!findId) return


                // Get pending article
                const res =
                    await api.get(
                        `/pendingSubmissions/${findId}`
                    )


                const data:
                    UserInformetion =
                    res.data


                // Create published article
                const publish = {

                    id:
                        crypto.randomUUID(),

                    name:
                        data.contentname,

                    image:
                        data.contentimage,

                    category:
                        data.contentcategory,

                    author:
                        data.username,

                    excerpt:
                        data.contentexcerpt,

                    content:
                        data.maincontent,

                    tags:
                        data.contenttags,

                    publishDate:
                        new Date()
                            .toISOString()
                            .split("T")[0]
                }


                // Publish
                await api.post(
                    "/adminBlog",
                    publish
                )


                // Remove from pending
                await api.delete(
                    `/pendingSubmissions/${findId}`
                )


                // Refresh
                await submissionRender()

                randerHtml()

                window.location.reload()


            } catch (error) {

                console.error(
                    "Approve error:",
                    error
                )

                alert(
                    "লেখাটি approve করা সম্ভব হয়নি।"
                )

            }

        }


        // ====================================
        // DELETE
        // ====================================

        const deleteButton =
            target.closest(
                ".delete-submission"
            ) as HTMLButtonElement | null


        if (deleteButton) {

            try {

                const findId =
                    deleteButton.dataset.deleteId


                if (!findId) return


                const confirmDelete =
                    confirm(
                        "আপনি কি এই submission টি delete করতে চান?"
                    )


                if (!confirmDelete) return


                await api.delete(
                    `/pendingSubmissions/${findId}`
                )


                await submissionRender()


                randerHtml()


            } catch (error) {

                console.error(
                    "Delete error:",
                    error
                )

                alert(
                    "Submission delete করা সম্ভব হয়নি।"
                )

            }

        }

    }
)
