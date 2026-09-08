const STORAGE_KEY="forgeCampaign_v01";

const plans=[
 {day:"Sunday",title:"Recovery",meta:"Sleep • Mobility • Easy walk",exercises:[
   {name:"Easy walk",sets:1,reps:"20–40 min"},{name:"Mobility",sets:1,reps:"10–15 min"}]},
 {day:"Monday",title:"Lower A — Chassis",meta:"~70 min • Strength + Durability",exercises:[
   {name:"Back squat",sets:4,reps:"6"},{name:"Reverse sled",sets:5,reps:"1 trip"},{name:"Split squat",sets:3,reps:"8/side"},
   {name:"Hamstring curl",sets:3,reps:"10"},{name:"Calf raise",sets:4,reps:"12"},{name:"Mobility",sets:1,reps:"8 min"}]},
 {day:"Tuesday",title:"Upper A + SkiErg",meta:"~65 min • Physique + Ski Engine",exercises:[
   {name:"Incline press",sets:4,reps:"8"},{name:"Lat pulldown / pull-up",sets:4,reps:"8–10"},{name:"Lateral raise",sets:4,reps:"12–15"},
   {name:"Row",sets:3,reps:"10"},{name:"Triceps",sets:3,reps:"10–12"},{name:"SkiErg",sets:1,reps:"10–20 min easy"}]},
 {day:"Wednesday",title:"Zone 2 + Mobility",meta:"45–60 min • Engine + Recovery",exercises:[
   {name:"Zone 2 bike/run/elliptical",sets:1,reps:"45–60 min"},{name:"Mobility",sets:1,reps:"10 min"}]},
 {day:"Thursday",title:"Lower B — Posterior + Unilateral",meta:"~70 min • Strength + Durability",exercises:[
   {name:"Romanian deadlift",sets:4,reps:"6–8"},{name:"Step-up",sets:3,reps:"8/side"},{name:"Leg press",sets:3,reps:"10"},
   {name:"Controlled step-down",sets:3,reps:"8/side"},{name:"Hamstring curl",sets:3,reps:"10"},{name:"Calf raise",sets:4,reps:"12"}]},
 {day:"Friday",title:"Upper B + SkiErg",meta:"~65 min • Physique + Ski Engine",exercises:[
   {name:"Overhead press",sets:4,reps:"6–8"},{name:"Chest-supported row",sets:4,reps:"8–10"},{name:"Upper chest press",sets:3,reps:"10"},
   {name:"Rear delt fly",sets:4,reps:"12–15"},{name:"Biceps",sets:3,reps:"10–12"},{name:"SkiErg intervals",sets:6,reps:"2 min / 2 min easy"}]},
 {day:"Saturday",title:"Long Aerobic / Bike / Hills",meta:"60–120 min • Engine + Mountain",exercises:[
   {name:"Long aerobic session",sets:1,reps:"60–120 min"},{name:"Optional hill work",sets:1,reps:"controlled"}]}
];

const defaultState={
 totalXP:0,todayXP:0,habitDate:"",habits:{hydrate:false,fuel:false,sleep:false,recover:false,fiveam:false},
 questDate:"",questComplete:false,baseline:{weight:"",waist:"",knee:""},
 stats:{Strength:1,Durability:1,Engine:1,Mountain:1,Bike:1,Run:1,"Ski Engine":1,"Ski Skill":1,Snowshoe:1,Physique:1,Discipline:1},
 inventory:[
  {name:"Concept2 SkiErg",status:"Acquired"},{name:"Grandpa's NordicTrack",status:"Needed"},{name:"Race bike setup",status:"Needed"},
  {name:"Ski setup",status:"Needed"},{name:"Snowshoes",status:"Needed"}],
 workoutDrafts:{},workoutHistory:[]
};

const clone=o=>JSON.parse(JSON.stringify(o));
const todayKey=()=>new Date().toLocaleDateString("en-CA");
const dateLabel=iso=>new Date(iso+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
const planForDate=(d=new Date())=>plans[d.getDay()];
const planByTitle=t=>plans.find(p=>p.title===t)||planForDate();

function deepMerge(base, incoming){
 const out=clone(base);
 for(const [k,v] of Object.entries(incoming||{})){
   if(v && typeof v==="object" && !Array.isArray(v) && out[k] && typeof out[k]==="object" && !Array.isArray(out[k])) out[k]=deepMerge(out[k],v);
   else out[k]=v;
 }
 return out;
}
let state=(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);return raw?deepMerge(defaultState,JSON.parse(raw)):clone(defaultState)}catch{return clone(defaultState)}})();

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function resetDailyIfNeeded(){
 const t=todayKey();
 if(state.habitDate!==t){state.habitDate=t;state.todayXP=0;state.habits=clone(defaultState.habits)}
 if(state.questDate!==t){state.questDate=t;state.questComplete=false}
}
function levelInfo(){
 const levels=[0,1000,2250,3750,5500,7500,9750,12250,15000,18000,21250,24750,28500,32500,36750];
 let lvl=1;for(let i=0;i<levels.length;i++)if(state.totalXP>=levels[i])lvl=i+1;
 const current=levels[lvl-1]??0,next=levels[lvl]??current+5000;return{lvl,current,next}
}
function addXP(amount){state.totalXP=Math.max(0,state.totalXP+amount);state.todayXP=Math.max(0,state.todayXP+amount);save();renderHeader()}
function renderHeader(){
 const li=levelInfo();levelValue.textContent=li.lvl;xpText.textContent=state.totalXP.toLocaleString()+" XP";
 levelProgressText.textContent=(state.totalXP-li.current).toLocaleString()+" / "+(li.next-li.current).toLocaleString();
 xpBar.style.width=Math.max(0,Math.min(100,((state.totalXP-li.current)/(li.next-li.current))*100))+"%";todayXpValue.textContent=state.todayXP
}
function renderCountdown(){const race=new Date("2027-02-13T08:00:00-07:00"),days=Math.max(0,Math.ceil((race-new Date())/86400000));daysLeft.textContent=days}
function renderQuest(){
 const p=planForDate();todayQuestName.textContent=p.title;todayQuestMeta.textContent=p.meta;
 todayExercises.innerHTML=p.exercises.map(x=>`<div class="exercise">${x.name} • ${x.sets}×${x.reps}</div>`).join("");
 completeQuestBtn.disabled=state.questComplete;completeQuestBtn.textContent=state.questComplete?"Quest Complete ✓":"Complete Quest +100 XP";
 questStatus.textContent=state.questComplete?"+100 XP earned • Quest logged.":""
}
function renderHabits(){document.querySelectorAll("[data-habit]").forEach(cb=>cb.checked=!!state.habits[cb.dataset.habit])}

let selectedPlanTitle=planForDate().title;
function blankDraft(plan,date=todayKey()){
 return{date,planTitle:plan.title,kneeBefore:"",kneeAfter:"",notes:"",exercises:plan.exercises.map(e=>({
   name:e.name,targetSets:e.sets,targetReps:e.reps,sets:Array.from({length:e.sets},()=>({weight:"",reps:""}))
 }))}
}
function currentDraft(){
 const key=todayKey()+"|"+selectedPlanTitle;
 if(!state.workoutDrafts[key])state.workoutDrafts[key]=blankDraft(planByTitle(selectedPlanTitle));
 return state.workoutDrafts[key]
}
function renderLogger(){
 const p=planByTitle(selectedPlanTitle),d=currentDraft();loggerTitle.textContent=p.title;loggerDate.textContent=dateLabel(d.date);
 kneeBefore.value=d.kneeBefore||"";kneeAfter.value=d.kneeAfter||"";workoutNotes.value=d.notes||"";
 loggerExercises.innerHTML=d.exercises.map((e,ei)=>`
   <div class="exercise-log">
     <h4>${e.name} <span class="muted">• target ${e.targetSets}×${e.targetReps}</span></h4>
     ${e.sets.map((s,si)=>`<div class="set-grid">
       <span class="set-label">Set ${si+1}</span>
       <input inputmode="decimal" placeholder="Weight" value="${escapeHtml(s.weight)}" data-ei="${ei}" data-si="${si}" data-field="weight">
       <input inputmode="decimal" placeholder="Reps/time" value="${escapeHtml(s.reps)}" data-ei="${ei}" data-si="${si}" data-field="reps">
     </div>`).join("")}
   </div>`).join("");
 loggerExercises.querySelectorAll("input[data-ei]").forEach(inp=>inp.addEventListener("input",e=>{
   const d=currentDraft(),el=e.currentTarget;d.exercises[+el.dataset.ei].sets[+el.dataset.si][el.dataset.field]=el.value;save()
 }));
}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function renderTraining(){
 weekPlan.innerHTML=plans.slice(1).concat(plans[0]).map(p=>`
   <div class="day-card ${p.title===planForDate().title?"active-day":""}">
     <small>${p.day}</small><strong>${p.title}</strong><small>${p.meta}</small>
     <button class="secondary" data-load-plan="${escapeHtml(p.title)}">Log / Review</button>
   </div>`).join("");
 weekPlan.querySelectorAll("[data-load-plan]").forEach(btn=>btn.addEventListener("click",()=>{
   selectedPlanTitle=btn.dataset.loadPlan;renderLogger();window.scrollTo({top:0,behavior:"smooth"})
 }));
 renderHistory()
}
function renderHistory(){
 if(!state.workoutHistory.length){historyList.innerHTML=`<div class="history-card"><span class="muted">No saved workouts yet. Your first real entry will appear here.</span></div>`;return}
 historyList.innerHTML=state.workoutHistory.slice().reverse().map(h=>`
   <div class="history-card">
    <div class="history-top"><div><div class="history-title">${escapeHtml(h.planTitle)}</div><small>${dateLabel(h.date)}</small></div><small>${h.completed?"QUEST COMPLETE":"LOG SAVED"}</small></div>
    <div class="history-meta">Knee ${escapeHtml(h.kneeBefore||"—")} → ${escapeHtml(h.kneeAfter||"—")}${h.notes?` • ${escapeHtml(h.notes)}`:""}</div>
    <details><summary>View sets</summary><div class="history-sets">${h.exercises.map(e=>`<strong>${escapeHtml(e.name)}</strong>: ${e.sets.map((s,i)=>`S${i+1} ${escapeHtml(s.weight||"—")} × ${escapeHtml(s.reps||"—")}`).join(" · ")}`).join("<br>")}</div></details>
   </div>`).join("")
}
function renderStats(){
 statList.innerHTML=Object.entries(state.stats).map(([k,v])=>`<div class="stat-card"><div class="stat-row"><strong>${k}</strong><span>Lv ${v}</span></div><small>Progress through workouts and benchmarks.</small></div>`).join("");
 weightInput.value=state.baseline.weight||"";waistInput.value=state.baseline.waist||"";kneeInput.value=state.baseline.knee||""
}
function renderInventory(){
 inventoryList.innerHTML=state.inventory.map((item,i)=>`<div class="gear-card"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.status)}</small></div><div class="gear-actions"><select data-gear-status="${i}">${["Needed","Acquired","Tested","Race Ready"].map(s=>`<option ${s===item.status?"selected":""}>${s}</option>`).join("")}</select><button type="button" data-delete-gear="${i}">×</button></div></div>`).join("");
 inventoryList.querySelectorAll("[data-gear-status]").forEach(sel=>sel.addEventListener("change",e=>{state.inventory[+e.currentTarget.dataset.gearStatus].status=e.currentTarget.value;save();renderInventory()}));
 inventoryList.querySelectorAll("[data-delete-gear]").forEach(btn=>btn.addEventListener("click",e=>{state.inventory.splice(+e.currentTarget.dataset.deleteGear,1);save();renderInventory()}))
}
function showScreen(name){
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.screen===name));
 document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id==="screen-"+name));
 window.scrollTo({top:0,behavior:"smooth"})
}
function saveWorkoutLog(){
 const d=currentDraft();d.kneeBefore=kneeBefore.value.trim();d.kneeAfter=kneeAfter.value.trim();d.notes=workoutNotes.value.trim();
 const existing=state.workoutHistory.findIndex(h=>h.date===d.date && h.planTitle===d.planTitle);
 const record=clone(d);record.savedAt=new Date().toISOString();record.completed=(d.date===todayKey()&&d.planTitle===planForDate().title&&state.questComplete);
 if(existing>=0)state.workoutHistory[existing]=record;else state.workoutHistory.push(record);
 save();renderHistory();saveWorkoutStatus.textContent="Workout log saved ✓";setTimeout(()=>saveWorkoutStatus.textContent="",1500)
}
function setupEvents(){
 document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>showScreen(btn.dataset.screen)));
 openWorkoutBtn.addEventListener("click",()=>{selectedPlanTitle=planForDate().title;renderLogger();showScreen("training")});
 completeQuestBtn.addEventListener("click",()=>{
   if(state.questComplete)return;state.questComplete=true;addXP(100);
   const p=planForDate();
   if(p.title.includes("Lower")){state.stats.Strength++;state.stats.Durability++}
   else if(p.title.includes("Upper")){state.stats.Physique++;state.stats["Ski Engine"]++}
   else if(p.title.includes("Zone"))state.stats.Engine++;
   else if(p.title.includes("Long")){state.stats.Engine++;state.stats.Mountain++}
   state.stats.Discipline++;save();renderQuest();renderStats();saveWorkoutLog()
 });
 document.querySelectorAll("[data-habit]").forEach(cb=>cb.addEventListener("change",()=>{
   const k=cb.dataset.habit,xp=+cb.dataset.xp,was=!!state.habits[k];state.habits[k]=cb.checked;
   if(cb.checked&&!was)addXP(xp);if(!cb.checked&&was)addXP(-xp);
   if(k==="fiveam"&&cb.checked&&!was)state.stats.Discipline++;save();renderStats()
 }));
 [kneeBefore,kneeAfter,workoutNotes].forEach(el=>el.addEventListener("input",()=>{
   const d=currentDraft();d.kneeBefore=kneeBefore.value;d.kneeAfter=kneeAfter.value;d.notes=workoutNotes.value;save()
 }));
 saveWorkoutBtn.addEventListener("click",saveWorkoutLog);
 saveBaselineBtn.addEventListener("click",()=>{state.baseline.weight=weightInput.value.trim();state.baseline.waist=waistInput.value.trim();state.baseline.knee=kneeInput.value.trim();save();saveBaselineBtn.textContent="Saved ✓";setTimeout(()=>saveBaselineBtn.textContent="Save Baseline",1200)});
 addGearForm.addEventListener("submit",e=>{e.preventDefault();const name=gearNameInput.value.trim();if(!name)return;state.inventory.push({name,status:gearStatusInput.value});gearNameInput.value="";save();renderInventory()})
}
async function registerForgeServiceWorker(){
 if(!("serviceWorker" in navigator)) return;
 const hadController=!!navigator.serviceWorker.controller;
 try{
   const reg=await navigator.serviceWorker.register("./service-worker.js",{updateViaCache:"none"});
   reg.update().catch(()=>{});

   let reloading=false;
   navigator.serviceWorker.addEventListener("controllerchange",()=>{
     if(!hadController || reloading) return;
     reloading=true;
     const toast=document.createElement("div");
     toast.className="update-toast";
     toast.textContent="Forge updated — loading newest build…";
     document.body.appendChild(toast);
     setTimeout(()=>location.reload(),350);
   });

   // Re-check when the app returns to the foreground.
   document.addEventListener("visibilitychange",()=>{
     if(document.visibilityState==="visible") reg.update().catch(()=>{});
   });
 }catch(e){
   console.warn("Forge service worker registration failed",e);
 }
}
function init(){
 resetDailyIfNeeded();save();renderCountdown();renderHeader();renderQuest();renderHabits();renderTraining();renderLogger();renderStats();renderInventory();setupEvents();
 registerForgeServiceWorker();
}
init();
