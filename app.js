const STORAGE_KEY = "forgeCampaign_v01";

const trainingWeek = [
  {day:"Monday", title:"Lower A — Quad + Knee Strength", meta:"Strength • Durability"},
  {day:"Tuesday", title:"Upper A + SkiErg", meta:"Physique • Ski Engine"},
  {day:"Wednesday", title:"Zone 2 + Mobility", meta:"Engine • Recovery"},
  {day:"Thursday", title:"Lower B — Posterior + Unilateral", meta:"Strength • Durability"},
  {day:"Friday", title:"Upper B + SkiErg", meta:"Physique • Ski Engine"},
  {day:"Saturday", title:"Long Aerobic / Bike / Hills", meta:"Engine • Mountain"},
  {day:"Sunday", title:"Recovery", meta:"Sleep • Mobility • Easy walk"}
];

const defaultState = {
  totalXP:0,
  todayXP:0,
  habitDate:"",
  habits:{hydrate:false,fuel:false,sleep:false,recover:false,fiveam:false},
  questDate:"",
  questComplete:false,
  baseline:{weight:"",waist:"",knee:""},
  stats:{
    Strength:1, Durability:1, Engine:1, Mountain:1, Bike:1, Run:1,
    "Ski Engine":1, "Ski Skill":1, Snowshoe:1, Physique:1, Discipline:1
  },
  inventory:[
    {name:"Concept2 SkiErg",status:"Acquired"},
    {name:"Grandpa's NordicTrack",status:"Needed"},
    {name:"Race bike setup",status:"Needed"},
    {name:"Ski setup",status:"Needed"},
    {name:"Snowshoes",status:"Needed"}
  ]
};

function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
function todayKey(){ return new Date().toISOString().slice(0,10); }

let state = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Object.assign(clone(defaultState), JSON.parse(raw)) : clone(defaultState);
  } catch { return clone(defaultState); }
})();

function resetDailyIfNeeded(){
  const t = todayKey();
  if(state.habitDate !== t){
    state.habitDate = t;
    state.todayXP = 0;
    state.habits = clone(defaultState.habits);
  }
  if(state.questDate !== t){
    state.questDate = t;
    state.questComplete = false;
  }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function levelInfo(){
  const levels=[0,1000,2250,3750,5500,7500,9750,12250,15000,18000,21250,24750,28500,32500,36750];
  let lvl=1;
  for(let i=0;i<levels.length;i++){ if(state.totalXP>=levels[i]) lvl=i+1; }
  const current=levels[lvl-1]??0;
  const next=levels[lvl]??(current+5000);
  return {lvl,current,next};
}
function addXP(amount){
  state.totalXP += amount;
  state.todayXP += amount;
  if(state.totalXP < 0) state.totalXP = 0;
  if(state.todayXP < 0) state.todayXP = 0;
  save(); renderHeader();
}
function renderHeader(){
  const li=levelInfo();
  document.querySelector("#levelValue").textContent=li.lvl;
  document.querySelector("#xpText").textContent=state.totalXP.toLocaleString()+" XP";
  document.querySelector("#levelProgressText").textContent=(state.totalXP-li.current).toLocaleString()+" / "+(li.next-li.current).toLocaleString();
  const pct=Math.max(0,Math.min(100,((state.totalXP-li.current)/(li.next-li.current))*100));
  document.querySelector("#xpBar").style.width=pct+"%";
  document.querySelector("#todayXpValue").textContent=state.todayXP;
}
function renderCountdown(){
  const race=new Date("2027-02-13T08:00:00-07:00");
  const now=new Date();
  const days=Math.max(0,Math.ceil((race-now)/86400000));
  document.querySelector("#daysLeft").textContent=days;
}
function renderQuest(){
  const exercises=["Back squat • 4×6","Reverse sled • 5 trips","Split squat • 3×8/side","Hamstring curl • 3×10","Calf raise • 4×12","Mobility • 8 min"];
  const holder=document.querySelector("#todayExercises");
  holder.innerHTML=exercises.map(x=>`<div class="exercise">${x}</div>`).join("");
  const btn=document.querySelector("#completeQuestBtn");
  const status=document.querySelector("#questStatus");
  btn.disabled=state.questComplete;
  btn.textContent=state.questComplete?"Quest Complete ✓":"Complete Quest +100 XP";
  status.textContent=state.questComplete?"+100 XP earned • Keep stacking the day.":"";
}
function renderHabits(){
  document.querySelectorAll("[data-habit]").forEach(cb=>{
    cb.checked=!!state.habits[cb.dataset.habit];
  });
}
function renderTraining(){
  document.querySelector("#weekPlan").innerHTML=trainingWeek.map(d=>`
    <div class="day-card">
      <small>${d.day}</small>
      <strong>${d.title}</strong>
      <small>${d.meta}</small>
    </div>`).join("");
}
function renderStats(){
  document.querySelector("#statList").innerHTML=Object.entries(state.stats).map(([k,v])=>`
    <div class="stat-card">
      <div class="stat-row"><strong>${k}</strong><span>Lv ${v}</span></div>
      <small>Progress through workouts and benchmarks.</small>
    </div>`).join("");
  document.querySelector("#weightInput").value=state.baseline.weight||"";
  document.querySelector("#waistInput").value=state.baseline.waist||"";
  document.querySelector("#kneeInput").value=state.baseline.knee||"";
}
function renderInventory(){
  const list=document.querySelector("#inventoryList");
  list.innerHTML=state.inventory.map((item,i)=>`
    <div class="gear-card">
      <div><strong>${item.name}</strong><small>${item.status}</small></div>
      <div class="gear-actions">
        <select data-gear-status="${i}">
          ${["Needed","Acquired","Tested","Race Ready"].map(s=>`<option ${s===item.status?"selected":""}>${s}</option>`).join("")}
        </select>
        <button type="button" aria-label="Delete gear" data-delete-gear="${i}">×</button>
      </div>
    </div>`).join("");
  list.querySelectorAll("[data-gear-status]").forEach(sel=>{
    sel.addEventListener("change",e=>{
      state.inventory[Number(e.currentTarget.dataset.gearStatus)].status=e.currentTarget.value;
      save(); renderInventory();
    });
  });
  list.querySelectorAll("[data-delete-gear]").forEach(btn=>{
    btn.addEventListener("click",e=>{
      state.inventory.splice(Number(e.currentTarget.dataset.deleteGear),1);
      save(); renderInventory();
    });
  });
}
function setupEvents(){
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector("#screen-"+btn.dataset.screen).classList.add("active");
      window.scrollTo({top:0,behavior:"smooth"});
    });
  });
  document.querySelector("#completeQuestBtn").addEventListener("click",()=>{
    if(state.questComplete) return;
    state.questComplete=true;
    addXP(100);
    state.stats.Strength += 1;
    state.stats.Durability += 1;
    save(); renderQuest(); renderStats();
  });
  document.querySelectorAll("[data-habit]").forEach(cb=>{
    cb.addEventListener("change",()=>{
      const key=cb.dataset.habit, xp=Number(cb.dataset.xp||0);
      const was=!!state.habits[key];
      state.habits[key]=cb.checked;
      if(cb.checked&&!was) addXP(xp);
      if(!cb.checked&&was) addXP(-xp);
      if(key==="fiveam" && cb.checked && !was) state.stats.Discipline += 1;
      save(); renderStats();
    });
  });
  document.querySelector("#saveBaselineBtn").addEventListener("click",()=>{
    state.baseline.weight=document.querySelector("#weightInput").value.trim();
    state.baseline.waist=document.querySelector("#waistInput").value.trim();
    state.baseline.knee=document.querySelector("#kneeInput").value.trim();
    save();
    const b=document.querySelector("#saveBaselineBtn");
    b.textContent="Saved ✓"; setTimeout(()=>b.textContent="Save Baseline",1200);
  });
  document.querySelector("#addGearForm").addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.querySelector("#gearNameInput").value.trim();
    const status=document.querySelector("#gearStatusInput").value;
    if(!name) return;
    state.inventory.push({name,status});
    document.querySelector("#gearNameInput").value="";
    save(); renderInventory();
  });
}
function init(){
  resetDailyIfNeeded();
  save();
  renderCountdown(); renderHeader(); renderQuest(); renderHabits(); renderTraining(); renderStats(); renderInventory(); setupEvents();
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  }
}
init();
