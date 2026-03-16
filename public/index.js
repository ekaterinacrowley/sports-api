async function loadSports(){

 const res = await fetch("/api/sports")
 const data = await res.json()

 const list = document.getElementById("sports")
 list.innerHTML = ""

 const sports = data.items || []

 sports.forEach(sport=>{

  const li = document.createElement("li")
  li.textContent = sport.name

  li.onclick = ()=>loadMatches(sport.id)

  list.appendChild(li)

 })

 console.log("SPORTS:",data)

}



async function loadMatches(sportId){

 try{

 const res = await fetch(`/api/events?sportId=${sportId}`)
 const data = await res.json()

 const list = document.getElementById("matches")
 list.innerHTML = ""

 const matches = data.items || []

 if(matches.length === 0){
  list.innerHTML = "<li>No upcoming matches</li>"
  return
 }

 matches.forEach(match=>{

  const li = document.createElement("li")

  const date = new Date(match.startDate*1000)

  const team1Logo = match.imageOpponent1?.[0]
   ? `https://nimblecd.com/sfiles/logo_teams/${match.imageOpponent1[0]}`
   : ""

  const team2Logo = match.imageOpponent2?.[0]
   ? `https://nimblecd.com/sfiles/logo_teams/${match.imageOpponent2[0]}`
   : ""

  const leagueLogo = match.tournamentImage?.[0]
   ? `https://nimblecd.com/sfiles/logo-champ/${match.tournamentImage[0]}`
   : ""

  li.innerHTML = `
  
  <div style="margin-bottom:10px">

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
      ${leagueLogo ? `<img src="${leagueLogo}" width="20">` : ""}
      <b>${match.tournamentNameLocalization}</b>
    </div>

    <div style="display:flex;align-items:center;gap:10px">

      <img src="${team1Logo}" width="24">

      <span>${match.opponent1NameLocalization}</span>

      <b>vs</b>

      <img src="${team2Logo}" width="24">

      <span>${match.opponent2NameLocalization}</span>

    </div>

    <div style="font-size:12px;color:#777">
      ${date.toLocaleString()}
    </div>

  </div>

  `

  list.appendChild(li)

 })

 console.log("MATCHES:",data)

 }catch(e){

 console.error("LOAD MATCHES ERROR:",e)

 }

}



async function loadResultSports(){

 try{

 const res = await fetch("/api/results-sports")
 const data = await res.json()

 const list = document.getElementById("resultsSports")
 list.innerHTML=""

 const sports = data.items || data.data || []

 if(sports.length === 0){
  list.innerHTML="<li>No sports with results</li>"
  return
 }

 sports.forEach(sport=>{

  const li = document.createElement("li")

  li.textContent = sport.name || sport.nameLocalization

  li.onclick = ()=>loadResultEvents(sport.id)

  list.appendChild(li)

 })

 console.log("RESULT SPORTS:",data)

 }catch(e){

 console.error("LOAD RESULT SPORTS ERROR:",e)

 }

}



async function loadResultEvents(sportId){

 if(!sportId) return

 try{

 const res = await fetch(`/api/results-events?sportId=${sportId}`)
 const text = await res.text()

 if(!text){
  console.log("Empty response")
  return
 }

 let data

 try{
  data = JSON.parse(text)
 }catch(err){
  console.error("Invalid JSON:",text)
  return
 }

 const list = document.getElementById("resultsMatches")
 list.innerHTML=""

 const matches = data.items || data.data || []

 if(matches.length === 0){
  list.innerHTML="<li>No completed matches</li>"
  return
 }

 matches.forEach(match=>{

  const li = document.createElement("li")

  const date = new Date(match.startDate*1000)

  const team1Logo = match.imageOpponent1?.[0]
   ? `https://nimblecd.com/sfiles/logo_teams/${match.imageOpponent1[0]}`
   : ""

  const team2Logo = match.imageOpponent2?.[0]
   ? `https://nimblecd.com/sfiles/logo_teams/${match.imageOpponent2[0]}`
   : ""

  const leagueLogo = match.tournamentImage?.[0]
   ? `https://nimblecd.com/sfiles/logo-champ/${match.tournamentImage[0]}`
   : ""

const score = match.score || "-"

li.innerHTML = `

<div style="margin-bottom:12px">

  <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
    ${leagueLogo ? `<img src="${leagueLogo}" width="20">` : ""}
    <b>${match.tournamentNameLocalization}</b>
  </div>

  <div style="display:flex;align-items:center;gap:10px">

    <img src="${team1Logo}" width="24">
    <span>${match.opponent1NameLocalization}</span>

    <b style="margin:0 10px;font-size:16px">
      ${score}
    </b>

    <span>${match.opponent2NameLocalization}</span>
    <img src="${team2Logo}" width="24">

  </div>
  <div style="display:flex;align-items:center;gap:10px">
    <span style="font-size:12px;color:#777">
      ${date.toLocaleString()}
    </span>
  </div>

</div>
`

  list.appendChild(li)

 })

 console.log("RESULT EVENTS:",data)

 }catch(e){

 console.error("LOAD RESULT EVENTS ERROR:",e)

 }

}



loadSports()
loadResultSports()