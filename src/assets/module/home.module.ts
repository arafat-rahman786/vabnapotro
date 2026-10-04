import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
import api from '../../../lib/api'
import "swiper/css";

let title = document.getElementById("logo");
let dateElement = document.querySelectorAll(".date");
function dateShow() {
    let now = new Date();

    let options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    let banglaDate = now.toLocaleDateString("bn-BD", options);

    dateElement.forEach((element) => {
      element.textContent = banglaDate;
    });
}
dateShow();


if (title) {
    let split = SplitText.create(title, {
        type: "chars",
    });

   gsap.fromTo(
        split.chars,
        {
            y: 30,
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            repeat: -1,
            yoyo: true,
        }
    );
}



const adminLoginBtn =
    document.getElementById("adminLoginBtn") as HTMLButtonElement;

const adminLoginModal =
    document.getElementById("adminLoginModal") as HTMLDivElement;

const adminLoginBox =
    document.getElementById("adminLoginBox") as HTMLDivElement;

const closeAdminModal =
    document.getElementById("closeAdminModal") as HTMLButtonElement;
const adminLoginForm = document.getElementById('adminLoginForm') as HTMLFormElement
const adminUsername = document.getElementById('adminUsername') as HTMLFormElement


// Open Modal
adminLoginBtn?.addEventListener("click", () => {

    adminLoginModal.classList.remove("hidden");

    adminLoginModal.classList.add("flex");

    setTimeout(() => {
        adminLoginBox.classList.remove("scale-95", "opacity-0");
        adminLoginBox.classList.add("scale-100", "opacity-100");
    }, 10);
});


// Close Modal
function closeModal() {

    adminLoginBox.classList.remove("scale-100", "opacity-100");

    adminLoginBox.classList.add("scale-95", "opacity-0");

    setTimeout(() => {

        adminLoginModal.classList.remove("flex");
        adminLoginModal.classList.add("hidden");

    }, 300);
}

closeAdminModal?.addEventListener("click", closeModal);


// Click outside
adminLoginModal?.addEventListener("click", (event) => {

    if (event.target === adminLoginModal) {
        closeModal();
    }

});

const toggleAdminPassword =
    document.getElementById("toggleAdminPassword") as HTMLButtonElement;

const adminPassword =
    document.getElementById("adminPassword") as HTMLInputElement;

const adminPasswordIcon =
    document.getElementById("adminPasswordIcon") as HTMLElement;


toggleAdminPassword?.addEventListener("click", () => {

    if (adminPassword.type === "password") {

        adminPassword.type = "text";

        adminPasswordIcon.classList.remove("fa-eye");
        adminPasswordIcon.classList.add("fa-eye-slash");

    } else {

        adminPassword.type = "password";

        adminPasswordIcon.classList.remove("fa-eye-slash");
        adminPasswordIcon.classList.add("fa-eye");

    }

});


adminLoginForm?.addEventListener("submit",async(e)=>{
  e.preventDefault()
  let response = await api.get("/adminScurity")
  const getdata = response.data.find(
  (admin:any) =>
    admin.username === adminUsername.value
);

if (
  getdata &&
  getdata.password === adminPassword.value
) {
  window.location.href = "./deshboard.html";
} else {
  console.log("Username অথবা Password ভুল");
} 
})