import api from "../../../lib/api";

let author_from = document.getElementById("author-form") as HTMLFormElement
let author_image = document.getElementById("author-image") as HTMLInputElement
let author_image_placeholder = document.getElementById("author-image-placeholder") as HTMLDivElement
let author_image_preview = document.getElementById("author-image-preview") as HTMLImageElement


author_image.addEventListener("change",()=>{
    const file = author_image.files?.[0]
    if(file){
        author_image_preview.src = URL.createObjectURL(file)
        author_image_preview.classList.remove("hidden")
        author_image_placeholder.classList.add("hidden")
    }else{
        author_image_preview.classList.add("hidden")
        author_image_placeholder.classList.remove("hidden")
    }
})



author_from?.addEventListener("submit",async(e)=>{
    e.preventDefault()
    let fromData = new FormData(author_from)
    let enteries = Object.fromEntries(fromData)
    const file = author_image.files?.[0]
    let reader = new FileReader()
    reader.onload = async () =>{
        let authorData = {
            ...enteries,
            image:reader.result
        }
    try {
        await api.post('/authorDitails',authorData)
        confirm("posted")
        author_from.reset()
        
    } catch (error) {
       alert("never posted") 
    }
    }
    if(file)
    await reader.readAsDataURL(file)
})