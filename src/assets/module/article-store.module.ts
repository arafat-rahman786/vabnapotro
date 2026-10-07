import api from "../../../lib/api";
import { getImageUrl } from "./image-url";

const params = new URLSearchParams(window.location.search)
const category = params.get("category")
let article_body = document.getElementById("article_body") as HTMLDivElement

async function handeler() {
    let res = await api.get("/adminBlog")
    let data = res.data
    const filtered = data.filter((item: any) => {
        return category === item.category
    })
    let randerCategory = filtered.map((item: any) => {
        return `<article data-id="${item.id}"
                 class="article group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#02a39b]/40 hover:shadow-xl"
                  >          
                      <!-- Image -->
                      <a href="article.html?articleId=${item.id}">
                        <div class="overflow-hidden">
                          <img
                            src="${getImageUrl(item.image)}"
                            alt="প্রবন্ধের ছবি"
                            class="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      </a>
          
                      <!-- Content -->
                      <div class="flex flex-1 flex-col p-6">
          
                        <span
                          class="inline-block w-fit rounded-full bg-[#02a39b]/10 px-4 py-1.5 text-sm font-semibold text-[#02a39b]"
                        >
                          ${item.category}
                        </span>
          
                        <a href="article.html">
                          <h3
                            class="mt-5 text-2xl font-bold leading-9 transition group-hover:text-[#02a39b]"
                          >
                            ${item.name}
                          </h3>
                        </a>
          
                        <!-- Author -->
                        <div
                          class="mt-auto flex items-center gap-3 border-t border-gray-100 pt-5"
                        >
          
                          <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#02a39b]/10 text-[#02a39b]"
                          >
                            👤
                          </div>
          
                          <div>
                            <p class="text-sm font-semibold">
                              ${item.author}
                            </p>
          
                            <p class="mt-1 text-xs text-gray-500">
                              ${item.publishDate}
                            </p>
                          </div>
          
                        </div>
          
                      </div>
          
                      </article>`
                        })


    if(article_body){
        article_body.innerHTML = randerCategory.join("")
    }
          
}

handeler()

article_body?.addEventListener("click",(e)=>{
  if (!(e.target instanceof Element)) return
    let find = e.target.closest("article")
   console.log(find);
  
})