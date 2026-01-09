

const current=window.location.pathname;

// ACTIVE LINKS
document.querySelectorAll(".item").forEach(i=>{if(i.getAttribute("href")===current)i.classList.add("active");});
document.querySelectorAll(".bottom-item").forEach(i=>{if(i.getAttribute("href")===current)i.classList.add("active");});

// DARK MODE
const toggleBtn=document.getElementById("themeToggle");
toggleBtn.onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",document.body.classList.contains("dark")?"dark":"light");
}
if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark");}

// COLLAPSE SIDEBAR & SYNC MOBILE NAV
const collapseBtn=document.getElementById("collapseBtn");
const sidebar=document.getElementById("sidebar");
const bottomNav=document.getElementById("bottomNav");
collapseBtn.onclick=()=>{
  sidebar.classList.toggle("collapsed");
  bottomNav.classList.toggle("hide");
}

// MOBILE ITEM CLICK FEEDBACK (BLUE BACKGROUND)
document.querySelectorAll(".bottom-item").forEach(item=>{
  item.addEventListener("click",()=>{
    document.querySelectorAll(".bottom-item").forEach(i=>i.classList.remove("active"));
    item.classList.add("active");
  });
});


const logoutBtn = document.getElementById('logoutBtn')

if(logoutBtn){
  logoutBtn.addEventListener('click', e=>{
    e.preventDefault()

    if(logoutBtn.classList.contains('loading')) return

    logoutBtn.classList.add('loading')
    logoutBtn.querySelector('.text').innerText = 'Are you sure?'

    setTimeout(()=>{
      window.location.href = '/logout'
    },3000)
  })
}


