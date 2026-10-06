import api from '../../../lib/api'
import type { UserInformetion } from '../type/user.type'
import { randerHtml } from '../module/deshboard.module'
import Swal from 'sweetalert2'

const addContentButton =
    document.getElementById("add-content-block");

const contentTypeMenu =
    document.getElementById("content-type-menu");

const contentBlocks =
    document.getElementById("content-blocks");

const emptyState =
    document.getElementById("content-empty-state") as HTMLInputElement

let authorName = document.getElementById('authorName') as HTMLInputElement
let authorEmail = document.getElementById('authorEmail') as HTMLInputElement
let authorPhone = document.getElementById('authorPhone') as HTMLInputElement
let authorLocation = document.getElementById('authorLocation') as HTMLInputElement
let articleTitle = document.getElementById('articleTitle') as HTMLInputElement
let articleCategory = document.getElementById('articleCategory') as HTMLInputElement
let featuredImageInputs = document.querySelectorAll<HTMLInputElement>('input[name="featuredImage"]');
let articleExcerpt = document.getElementById('articleExcerpt') as HTMLInputElement
let articleTags = document.getElementById('articleTags') as HTMLInputElement
let pending_card_count = document.getElementById('pending-card-count') as HTMLInputElement

let submitArticle = document.getElementById("submitArticle") as HTMLButtonElement


addContentButton?.addEventListener("click", () => {
    contentTypeMenu?.classList.toggle("hidden");

});


document
    .querySelectorAll("[data-block-type]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const type =
                button.getAttribute("data-block-type");

            if (!type || !contentBlocks) return;


            emptyState?.classList.add("hidden");

            const block =
                document.createElement("div");

            block.className =
                "rounded-2xl border border-gray-200 bg-gray-50 p-5";


            let label = "Paragraph";
            let placeholder =
                "আপনার লেখা এখানে লিখুন...";

            if (type === "heading") {
                label = "Heading";
                placeholder =
                    "উপশিরোনাম লিখুন...";
            }

            if (type === "quote") {
                label = "Quote";
                placeholder =
                    "উক্তিটি এখানে লিখুন...";
            }

            if (type === "poem") {
                label = "Poem";
                placeholder =
                    "কবিতার লাইনগুলো এখানে লিখুন...";
            }


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

                    `;


            contentBlocks.appendChild(block);

            contentTypeMenu?.classList.add("hidden");


            block
                .querySelector(".remove-content-block")
                ?.addEventListener("click", () => {

                    block.remove();

                    if (
                        contentBlocks.children.length === 0
                    ) {
                        emptyState?.classList.remove("hidden");
                    }

                });

        });

    });



function validation() {
    if (
        authorName.value == "" ||
        authorEmail.value == "" ||
        articleTitle.value == "" ||
        articleCategory.value == "" ||
        articleExcerpt.value == "" ||
        contentBlocks?.children.length === 0 ||
        !Array.from(featuredImageInputs).some(input => input.checked)
    ) {
        alert('fill your content')
        return false
    } else {
        return true
    }
}

function getfeaturedImage() {
    return Array.from(featuredImageInputs)
        .find(input => input.checked)
        ?.value ?? ""
}

function getContentBlocks() {

    if (!contentBlocks) return []

    return Array.from(contentBlocks.children).map((block, index) => {

        const textarea =
            block.querySelector<HTMLTextAreaElement>("textarea")

        return {
            id: crypto.randomUUID(),
            type: textarea?.dataset.contentType ?? "paragraph",
            text: textarea?.value.trim() ?? "",
            order: index + 1
        }
    })
}


submitArticle?.addEventListener("click", async (e) => {
    e.preventDefault()
    if (!validation()) return
    let submision: UserInformetion = {
        id: crypto.randomUUID(),
        username: authorName.value,
        useremail: authorEmail.value,
        phone: Number(authorPhone.value),
        address: authorLocation.value,
        contentname: articleTitle.value,
        contentcategory: articleCategory.value,
        contentimage: getfeaturedImage(),
        contentexcerpt: articleExcerpt.value,
        maincontent: JSON.stringify(getContentBlocks()),
        contenttags: articleTags.value
    }

    try {

        const response = await api.post(
            "/pendingSubmissions",
            submision
        )

        console.log(response.data)

        alert("আপনার লেখা সফলভাবে জমা হয়েছে।")
        window.location.href = '/deshboard.html'

    } catch (error) {

        console.error(error)

        alert("লেখা জমা দেওয়া সম্ভব হয়নি।")

    }

})


let pending_submission_list = document.getElementById("pending-submission-list")

async function submissionRander() {
    let res = await api.get('/pendingSubmissions')
    let data = res.data
    if (pending_card_count) pending_card_count.textContent = String(data.length)
    let submissionHtml = data.map((item: UserInformetion) => {
        return` <div class="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#05aaa5]/30">

                        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


                            <!-- Info -->
                            <div class="flex gap-5">

                                <div
                                    class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#05aaa5]/10 text-xl font-bold text-[#05aaa5]">
                                    R
                                </div>

                                <div>

                                    <div class="flex flex-wrap items-center gap-3">

                                        <h3 class="text-[20px] font-bold text-[#064d49]">
                                            ${item.contentname}
                                        </h3>

                                        <span
                                            class="rounded-full bg-orange-50 px-3 py-1 text-[14px] font-semibold text-orange-500">
                                            অপেক্ষমাণ
                                        </span>

                                    </div>

                                    <p class="mt-2 text-[18px] text-gray-500">
                                        লেখক: ${item.username}
                                    </p>

                                    <p class="mt-1 text-[14px] text-gray-400">
                                        জমা দিয়েছেন: ২ অক্টোবর, ২০২৬
                                    </p>

                                </div>

                            </div>


                            <!-- Actions -->
                            <div class="flex flex-wrap gap-2">

                                <a href="edit.html?articleId=${item.id}&source=pending"
                                    class="rounded-xl border border-gray-200 px-5 py-3 text-[18px] font-semibold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                                    সম্পাদনা
                                </a>

                                <button data-approve-id="${item.id}"
                                    class="approve rounded-xl bg-[#05aaa5] px-5 py-3 text-[18px] font-semibold text-white transition hover:bg-[#048f8b]">
                                    Approve
                                </button>

                                <button data-delete-id="${item.id}"
                                    class="rounded-xl border border-red-100 px-5 py-3 text-[18px] font-semibold text-red-500 transition hover:bg-red-50">
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>`
    })

    if (pending_submission_list) {
        pending_submission_list.innerHTML = submissionHtml
    }

}
submissionRander()
pending_submission_list?.addEventListener("click", async (e: any) => {
    let approveBtn = e.target.closest(".approve")
    let findId = approveBtn.dataset.approveId
    let res = await api.get(`/pendingSubmissions/${findId}`)
    let data: UserInformetion = res.data

    let publish = {
        id: crypto.randomUUID(),
        name: data.contentname,
        image: data.contentimage,
        category: data.contentcategory,
        author: data.username,
        excerpt: data.contentexcerpt,
        content: data.maincontent,
        tags: data.contenttags,
        publishDate: new Date().toISOString()
    }
    await api.post('/adminBlog', publish)
    await api.delete(`/pendingSubmissions/${findId}`)
    submissionRander()
    randerHtml()
    window.location.reload()
})


// pending_submission_list?.addEventListener("click", async (e: any) => {
//     let approveBtn = e.target.closest(".approve")
//     let findId = approveBtn.dataset.approveId
//     const swalWithBootstrapButtons = Swal.mixin({
//   customClass: {
//     confirmButton: "btn btn-success",
//     cancelButton: "btn btn-danger"
//   },
//   buttonsStyling: false
// });
// swalWithBootstrapButtons.fire({
//   title: "Are you sure?",
//   text: "You won't be able to revert this!",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonText: "Yes, delete it!",
//   cancelButtonText: "No, cancel!",
//   reverseButtons: true
// }).then((result) => {
//   if (result.isConfirmed) swalWithBootstrapButtons.fire({
//     title: "Deleted!",
//     text: "Your file has been deleted.",
//     icon: "success"
//   });
//   else if (result.dismiss === Swal.DismissReason.cancel)
//  /* Read more about handling dismissals below */
//   swalWithBootstrapButtons.fire({
//     title: "Cancelled",
//     text: "Your imaginary file is safe :)",
//     icon: "error"
//   });
// });
//     await api.delete(`/pendingSubmissions/${findId}`)
//     submissionRander()
// })
