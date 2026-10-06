import api from "../../../lib/api";
import type { author } from "../type/author.type";

const authorParent = document.getElementById("author_parent");

async function rander() {
    try {
        let res = await api.get('/authorDitails')
        let getData = res.data
        let push = getData.map((item:author) => {
            return `<div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div class="h-42 overflow-hidden"> 
                    <img src="${item.image}" alt="Yasin Arafat" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" > 
                    </div>
                     <div class="p-3"> 
                     <h3 class="font-serif text-2xl font-bold text-[#063f3c]"> ${item.name}</h3> 
                     <p class="mt-1 text-sm font-medium text-[#02a39b]"> ${item.profession} </p> 
                     <p class="mt-2 text-sm leading-7 text-gray-600"> 
                      ${item.bio}                    
                    </p> 
                    
                    <div class="mt-3 flex gap-3 border-t border-gray-100 pt-4"> 
                    <a href="${item.facebook}" target="_blank" class="flex h-7 w-7 items-center justify-center 
                    rounded-full bg-[#1877F2] text-sm font-bold text-white transition hover:scale-110" 
                    aria-label="Facebook" > f </a> 
                    <a href="${item.linkedin}" target="_blank" class="flex h-7 w-7 items-center justify-center 
                    rounded-full bg-[#0A66C2] text-sm font-bold text-white transition hover:scale-110" 
                    aria-label="LinkedIn" > in 
                    </a> 
                    </div> 
                    </div> 
                    </div>`

        })
        if (authorParent) authorParent.innerHTML = push.join("")
    } catch (error) {
        console.log("failed");

    }

}
rander()