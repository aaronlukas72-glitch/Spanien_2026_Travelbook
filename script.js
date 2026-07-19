const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const maps=q=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);
const directions=(a,b)=>"https://www.google.com/maps/dir/?api=1&origin="+encodeURIComponent(a)+"&destination="+encodeURIComponent(b);
const toast=()=>{const t=$("#toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1100)};
fetch("data/travel-data.json").then(r=>r.json()).then(data=>{
 $("#routeList").innerHTML=data.route.map(x=>`<article class="card stop"><div class="stop-date">${esc(x.date)}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${x.origin?`<div class="chips"><a class="chip" target="_blank" rel="noopener" href="${directions(x.origin,x.destination)}">Navigation öffnen</a></div>`:""}</article>`).join("");
 $("#stayList").innerHTML=data.stays.map(x=>`<article class="card"><small>${esc(x.date)}</small><h3>${esc(x.title)}</h3><p>${esc(x.address)}</p><p>${esc(x.info)}</p><a class="chip" target="_blank" rel="noopener" href="${maps(x.address)}">In Maps öffnen</a></article>`).join("");
 $("#tripList").innerHTML=data.trips.map(x=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><a class="chip" target="_blank" rel="noopener" href="${maps(x.title)}">Karte öffnen</a></article>`).join("");
 $("#checklists").innerHTML=Object.entries(data.checklists).map(([title,items])=>`<article class="card"><h3>${esc(title)}</h3>${items.map((v,i)=>{let id=title+"-"+i,done=localStorage.getItem("check:"+id)==="1";return `<label class="check ${done?"done":""}"><input type="checkbox" data-id="${esc(id)}" ${done?"checked":""}><span>${esc(v)}</span></label>`}).join("")}</article>`).join("");
 $$("#checklists input").forEach(el=>el.addEventListener("change",e=>{localStorage.setItem("check:"+e.target.dataset.id,e.target.checked?"1":"0");e.target.closest(".check").classList.toggle("done",e.target.checked);toast()}));
});
$("#resetChecks").onclick=()=>{$$("#checklists input").forEach(x=>{x.checked=false;x.closest(".check").classList.remove("done");localStorage.removeItem("check:"+x.dataset.id)});toast()};
const trip=new Date("2026-07-22T00:00:00+02:00"), now=new Date(), diff=trip-now;
$("#countdown").textContent=diff>0?`${Math.floor(diff/86400000)} Tage, ${Math.floor(diff%86400000/3600000)} Std.`:"Reisezeit";
let theme=localStorage.getItem("theme")||"light";document.documentElement.dataset.theme=theme;
$("#themeButton").onclick=()=>{theme=theme==="dark"?"light":"dark";document.documentElement.dataset.theme=theme;localStorage.setItem("theme",theme)};
let budget=JSON.parse(localStorage.getItem("budget")||"[]");
function drawBudget(){const el=$("#budgetList");el.innerHTML=budget.map((x,i)=>`<div class="budget-row"><span>${esc(x.text)}</span><strong>${Number(x.amount).toLocaleString("de-DE",{style:"currency",currency:"EUR"})}</strong><button data-i="${i}">×</button></div>`).join("");$("#budgetTotal").textContent=budget.reduce((s,x)=>s+Number(x.amount),0).toLocaleString("de-DE",{style:"currency",currency:"EUR"});el.querySelectorAll("button").forEach(b=>b.onclick=()=>{budget.splice(+b.dataset.i,1);saveBudget()})}
function saveBudget(){localStorage.setItem("budget",JSON.stringify(budget));drawBudget();toast()}
$("#budgetForm").onsubmit=e=>{e.preventDefault();budget.push({text:$("#budgetText").value,amount:+$("#budgetAmount").value});e.target.reset();saveBudget()};drawBudget();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js"));