
function showPanel(n){
  // Limpiar los paneles dinámicos exclusivos de Servicio cuando
  // el usuario cambia a otra etapa. Así Contenedor/Piezas y el botón
  // "Continuar" nunca aparecen en Especiales, Analizador o Cotización.
  const panelContenedor = $("panel2");
  const panelCarga = $("panel3");
  const serviceContinue = $("servicioContinue");

  if(n !== 1){
    panelContenedor?.classList.remove("active","inline-carga-suelta","service-side-active");
    panelCarga?.classList.remove("active","inline-carga-suelta","service-side-active");
    if(serviceContinue) serviceContinue.style.display = "none";
  }else{
    if(serviceContinue) serviceContinue.style.display = "flex";
  }

  if((n===2 || n===3) && $("tipoCarga")){
    showPanel(1);
    toggleContainer();
    const tipo = $("tipoCarga").value;
    setTimeout(()=>scrollToId(tipo === "Contenedor" ? "panel2" : "panel3"),80);
    return;
  }

  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const p=document.getElementById('panel'+n);
  if(p)p.classList.add('active');

  document.querySelectorAll('.app-tab').forEach(tab=>{
    tab.classList.toggle('active',Number(tab.dataset.panel)===n);
  });

  if(n===1) toggleContainer();
  updateDashboard();
  window.scrollTo({top:0,behavior:'smooth'});
}
function updateDashboard(){const t=typeof totals==='function'?totals():{weight:0,volume:0,refs:0};const a=typeof lastAnalysis!=='undefined'?lastAnalysis:null;const q=id=>document.getElementById(id);if(q('dashTon'))q('dashTon').textContent=(t.weight||0).toFixed(2)+' t';if(q('dashM3'))q('dashM3').textContent=(t.volume||0).toFixed(2)+' m³';if(q('dashRefs'))q('dashRefs').textContent=t.refs||0;updateQuoteButton();if(a&&typeof validation==='function'){const v=validation(a);q('dashStatus').textContent=v.level==='green'?'Aprobado':v.level==='yellow'?'Revisar':'No compatible';q('dashDot').className='status-dot '+v.level;}else{q('dashStatus').textContent='Pendiente';q('dashDot').className='status-dot';}}
function updateQuoteButton(){const button=$("quoteGenerateBtn");if(!button)return;const enabled=typeof hasCargo==='function'&&hasCargo();button.disabled=!enabled;button.setAttribute("aria-disabled",String(!enabled));}

const BASE_VEHICLES = [
 {name:"4 x 4",cap:1,vol:5.5,L:2.0,W:1.4,H:1.5,body:"Furgón - carpado platón",cargo:"Carga suelta / bultos / pallets",special:""},
 {name:"Turbo",cap:4.5,vol:18.5,L:4.5,W:2.0,H:2.1,body:"Furgón - carpado platón",cargo:"Carga suelta / bultos / pallets",special:""},
 {name:"600 sencillo",cap:8,vol:30.5,L:5.9,W:2.3,H:2.2,body:"Furgón - carpado / plancha",cargo:"Carga suelta / bultos / pallets / contenedor 20'",special:""},
 {name:"Doble troque",cap:17,vol:35.5,L:7.5,W:2.3,H:2.2,body:"Furgón - carpado / plancha",cargo:"Carga suelta / bultos / pallets / contenedor 20'",special:""},
 {name:"Minimula patineta",cap:18,vol:71.5,L:12,W:2.4,H:2.3,body:"Furgón - carpado plancha - grillo",cargo:"Carga suelta / bultos / contenedor 20' (combinados)",special:""},
 {name:"Mula",cap:35,vol:71.5,L:12,W:2.4,H:2.3,body:"Furgón - carpado plancha - grillo",cargo:"Carga suelta / bultos / contenedor 40' (combinados)",special:""},
 {name:"Carro tanque / niñera",cap:30,vol:null,L:12,W:2.4,H:2.4,body:"Tanque / tráiler hidráulico o de guaya",cargo:"Líquidos / vehículos",special:"Carga especializada"},
 {name:"Tolva",cap:35,vol:null,L:12,W:2.4,H:2.4,body:"Tolva",cargo:"Granel",special:"Carga especializada"},
 {name:"Cama baja / tolva",cap:35,vol:null,L:null,W:null,H:null,body:"Tráiler cama baja",cargo:"Cargas extra dimensionadas",special:"Según resolución / permiso"},
 {name:"Modular",cap:100,vol:null,L:null,W:null,H:null,body:"Tráiler modular",cargo:"Cargas extra dimensionadas",special:"Según resolución / permiso"},
 {name:"Van / furgón liviano",cap:1.2,vol:7,L:3.0,W:1.6,H:1.45,body:"Furgón cerrado",cargo:"Paquetería / urbana",special:"Configurable"},
 {name:"NHR",cap:2.5,vol:12,L:3.6,W:1.8,H:1.8,body:"Furgón / estacas",cargo:"Carga urbana liviana",special:"Configurable"},
 {name:"NPR",cap:4,vol:16,L:4.2,W:1.9,H:2.0,body:"Furgón / estacas",cargo:"Distribución urbana",special:"Configurable"},
 {name:"NQR",cap:6,vol:24,L:5.0,W:2.1,H:2.1,body:"Furgón / estacas",cargo:"Carga urbana mayor",special:"Configurable"},
 {name:"Furgón refrigerado",cap:8,vol:28,L:5.8,W:2.25,H:2.2,body:"Furgón refrigerado",cargo:"Carga con temperatura controlada",special:"Refrigeración"},
 {name:"Plataforma",cap:18,vol:null,L:8,W:2.5,H:2.5,body:"Plataforma",cargo:"Equipos / estructuras",special:"Carga especial"},
 {name:"Portacontenedor 20'",cap:30,vol:null,L:6.1,W:2.44,H:2.59,body:"Portacontenedor",cargo:"Contenedor 20'",special:"Validar peso bruto y ruta"},
 {name:"Portacontenedor 40'",cap:35,vol:null,L:12.2,W:2.44,H:2.9,body:"Portacontenedor",cargo:"Contenedor 40 / 40 HC",special:"Validar peso bruto y ruta"},
 {name:"Cama alta extensible",cap:35,vol:null,L:14,W:2.5,H:3,body:"Cama extensible",cargo:"Carga larga / especial",special:"Permiso según caso"}
];
let vehicles = JSON.parse(localStorage.getItem("lt_vehicles")||"null") || BASE_VEHICLES.map(v=>({...v}));
let pieces = [];
let lastAnalysis = null;
let editingIndex = null;

function $(id){return document.getElementById(id)}
function num(id){return parseFloat($(id).value)||0}
function scrollToId(id){$(id).scrollIntoView({behavior:"smooth"})}
function toggleContainer(){
  const tipo = $("tipoCarga").value;
  const serviceContinue = $("servicioContinue");
  if(serviceContinue) serviceContinue.style.display = tipo === "Carga suelta" ? "flex" : "none";
  const panelContenedor = $("panel2");
  const panelCarga = $("panel3");

  if(!panelContenedor || !panelCarga) return;

  // Al entrar por primera vez a Servicio no mostramos ningún formulario
  // secundario. Aparece únicamente después de que el usuario seleccione
  // explícitamente el tipo de carga.
  panelContenedor.classList.remove("active","inline-carga-suelta","service-side-active");
  panelCarga.classList.remove("active","inline-carga-suelta","service-side-active");

  if(!tipo) return;

  if(tipo === "Contenedor"){
    panelContenedor.classList.add("inline-carga-suelta","service-side-active");
  }else if(tipo === "Carga suelta"){
    panelCarga.classList.add("inline-carga-suelta","service-side-active");
  }
  updateLooseCargoContinue();
}
function updateLooseCargoContinue(){
  const button=$("looseCargoContinue");
  if(!button)return;
  const enabled=$("tipoCarga")?.value==="Carga suelta" && pieces.length>0;
  button.disabled=!enabled;
  button.setAttribute("aria-disabled",String(!enabled));
}
function continuarServicio(){
  const tipo = $("tipoCarga").value;

  if(!tipo){
    alert("Primero selecciona el tipo de carga.");
    $("tipoCarga").focus();
    return;
  }

  if(tipo === "Carga suelta" && (!pieces || pieces.length === 0)){
    alert("Agrega al menos una carga válida antes de continuar.");
    const p = $("panel3");
    if(p) p.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }

  if(tipo === "Contenedor"){
    if(num("contCant") < 1){
      alert("Indica una cantidad de contenedores válida.");
      $("contCant")?.focus();
      return;
    }
  }

  showPanel(4);
}

function irDesdeServicio(){
  const tipo = $("tipoCarga").value;

  if(tipo === "Contenedor" || tipo === "Carga suelta"){
    toggleContainer();
    setTimeout(()=>scrollToId(tipo === "Contenedor" ? "panel2" : "panel3"),80);
    return;
  }

  showPanel(4);
}
function volverACarga(){
  showPanel(1);
  toggleContainer();
  const tipo = $("tipoCarga").value;
  setTimeout(()=>scrollToId(tipo === "Contenedor" ? "panel2" : "panel3"),80);
}
function unitToM(v,u){return u==="Centímetros"?v/100:v}
function weightToT(v,u){return u==="kg"?v/1000:v}

function calcPiecePreview(){
 const q=Math.max(1,num("pCant")), L=unitToM(num("pL"),$("pUnidad").value), W=unitToM(num("pA"),$("pUnidad").value), H=unitToM(num("pH"),$("pUnidad").value);
 const wt=weightToT(num("pPeso"),$("pPesoUnidad").value);
 $("previewPiece").innerHTML=(L&&W&&H?`Volumen unitario: <b>${(L*W*H).toFixed(2)} m³</b> · volumen total: <b>${(L*W*H*q).toFixed(2)} m³</b>`:"Ingresa medidas")+" · "+(wt?`peso total: <b>${(wt*q).toFixed(3)} t</b>`:"ingresa peso");
}
["pCant","pL","pA","pH","pPeso","pUnidad","pPesoUnidad"].forEach(id=>$(id).addEventListener("input",calcPiecePreview));

function addPieceObject(){
 const q=Math.max(1,num("pCant")), L=unitToM(num("pL"),$("pUnidad").value), W=unitToM(num("pA"),$("pUnidad").value), H=unitToM(num("pH"),$("pUnidad").value), wt=weightToT(num("pPeso"),$("pPesoUnidad").value);
 if(!L||!W||!H||!wt){alert("Completa cantidad, largo, ancho, alto y peso de la pieza.");return null}
 return {desc:$("pDesc").value.trim()||`Referencia ${pieces.length+1}`,q,L,W,H,wt,apilable:$("pApilable").checked,acostarse:$("pAcostarse").checked,sobresalir:$("pSobresalir").checked,fragil:$("pFragil").checked,peligrosa:$("pPeligrosa").checked};
}
function resetPieceForm(){
 ["pDesc","pL","pA","pH","pPeso"].forEach(id=>$(id).value="");
 $("pCant").value=1;$("pUnidad").value="Centímetros";$("pPesoUnidad").value="kg";
 ["pApilable","pAcostarse","pSobresalir","pFragil","pPeligrosa"].forEach(id=>$(id).checked=false);
 editingIndex=null; calcPiecePreview();
}
function agregarPieza(){
 const p=addPieceObject(); if(!p)return;
 if(editingIndex!==null){pieces[editingIndex]=p}else pieces.push(p);
 renderPieces(); resetPieceForm(); scrollToId("pieceForm");
}
function editarPieza(i){
 const p=pieces[i]; editingIndex=i;
 $("pDesc").value=p.desc;$("pCant").value=p.q;$("pL").value=p.L;$("pA").value=p.W;$("pH").value=p.H;$("pUnidad").value="Metros";$("pPeso").value=p.wt;$("pPesoUnidad").value="toneladas";
 $("pApilable").checked=p.apilable;$("pAcostarse").checked=p.acostarse;$("pSobresalir").checked=p.sobresalir;$("pFragil").checked=p.fragil;$("pPeligrosa").checked=p.peligrosa;
 calcPiecePreview();scrollToId("pieceForm");
}
function eliminarPieza(i){if(confirm("¿Eliminar esta referencia?")){pieces.splice(i,1);renderPieces()}}
function renderPieces(){
 let el=$("pieceList");
 if(!pieces.length){el.innerHTML='<div class="empty">No hay referencias guardadas. Agrega la primera pieza o grupo, o impórtalas desde Excel.</div>'}
 else el.innerHTML=pieces.map((p,i)=>`<div class="piece"><div class="piece-grid">
 <div><b>${esc(p.desc)}</b><small>${p.q} und · ${p.L.toFixed(2)} × ${p.W.toFixed(2)} × ${p.H.toFixed(2)} m</small></div>
 <div><small>Peso</small><b>${(p.wt*p.q).toFixed(3)} t</b></div>
 <div><small>Volumen</small><b>${(p.L*p.W*p.H*p.q).toFixed(2)} m³</b></div>
 <div><small>Área piso</small><b>${(p.L*p.W*p.q).toFixed(2)} m²</b></div>
 <div><small>Apilable</small><b>${p.apilable?"Sí":"No"}</b></div>
 <div><small>Estado</small><b>${p.peligrosa?"Peligrosa":p.fragil?"Frágil":"Normal"}</b></div>
 <div style="display:flex;gap:5px"><button class="iconbtn" onclick="editarPieza(${i})" title="Editar">✎</button><button class="iconbtn" onclick="eliminarPieza(${i})" title="Eliminar">×</button></div>
 </div></div>`).join("");
 const t=totals();$("totalTon").textContent=t.weight.toFixed(3)+" t";$("totalM3").textContent=t.volume.toFixed(2)+" m³";$("totalArea").textContent=t.area.toFixed(2)+" m²";$("totalRefs").textContent=pieces.length;
 renderMeasuresTable();
 updateLooseCargoContinue();
 updateQuoteButton();
}
function renderMeasuresTable(){
 const tbl=$("measuresTable"); if(!tbl)return;
 if(isContainer()){
  const count=Math.max(1,num("contCant"));
  tbl.innerHTML=`<tr><td>Contenedor ${esc($("contTam").value)}</td><td>${count}</td><td class="muted-cell">Dimensiones según equipo</td><td>${((num("contMerc")+num("contTara"))/1000).toFixed(3)}</td><td>N/D</td></tr>`;
  return;
 }
 if(!pieces.length){tbl.innerHTML='<tr><td colspan="5" class="muted-cell" style="text-align:center;padding:16px">Sin referencias registradas.</td></tr>';return}
 tbl.innerHTML=pieces.map(p=>`<tr><td>${esc(p.desc)}</td><td>${p.q}</td><td class="muted-cell">${p.L.toFixed(2)}×${p.W.toFixed(2)}×${p.H.toFixed(2)}</td><td>${p.wt.toFixed(3)}</td><td>${(p.L*p.W*p.H*p.q).toFixed(2)}</td></tr>`).join("");
}
function isContainer(){return $("tipoCarga")?.value==="Contenedor"}
function hasCargo(){return isContainer() ? num("contMerc")>0 && num("contCant")>=1 : pieces.length>0}
function totals(){
 if(isContainer()){
  const count=Math.max(1,num("contCant"));
  return {weight:(num("contMerc")+num("contTara"))*count/1000,volume:0,area:0,refs:count,maxL:0,maxW:0,maxH:0};
 }
 return pieces.reduce((a,p)=>{a.weight+=p.wt*p.q;a.volume+=p.L*p.W*p.H*p.q;a.area+=p.L*p.W*p.q; a.maxL=Math.max(a.maxL,p.L);a.maxW=Math.max(a.maxW,p.W);a.maxH=Math.max(a.maxH,p.H);return a},{weight:0,volume:0,area:0,refs:pieces.length,maxL:0,maxW:0,maxH:0});
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}

function normHeader(h){return String(h||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"")}
function parseNumber(value){
 const raw=String(value??"").trim().replace(/\s/g,"");
 if(!raw)return NaN;
 const numeric=(raw.match(/[+-]?[0-9][0-9.,]*/) || [""])[0];
 if(!numeric)return NaN;
 const normalized=numeric.includes(",")&&numeric.includes(".")
  ? (numeric.lastIndexOf(",")>numeric.lastIndexOf(".")?numeric.replace(/\./g,"").replace(",","."):numeric.replace(/,/g,""))
  : numeric.replace(",",".");
 return Number(normalized);
}
function importValue(keys,names){
 for(const name of names){
  const exact=keys[normHeader(name)];
  if(exact!==undefined&&String(exact).trim()!=="")return exact;
 }
 const key=Object.keys(keys).find(candidate=>names.some(name=>normHeader(name).length>1&&candidate.includes(normHeader(name))));
 return key?keys[key]:undefined;
}
function normalizePdfText(value){return String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim()}
function findPdfMeasurement(text,names){
 const aliases=names.map(name=>normalizePdfText(name).replace(/\s+/g,"\\s*"));
 const match=new RegExp(`(?:${aliases.join("|")})[\\s.:=\\/-]*([0-9][0-9.,]*)\\s*(mm|cm|m|kg|lb|lbs|t|ton(?:eladas?)?)?`,"i").exec(text);
 return match?{value:parseNumber(match[1]),unit:(match[2]||"").toLowerCase()}:null;
}
function findPdfNumber(text,names){
 const measurement=findPdfMeasurement(text,names);
 return measurement?measurement.value:NaN;
}
function findPdfDimensions(text){
 const match=/([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*(mm|cm|m)?/i.exec(text);
 if(match)return {L:parseNumber(match[1]),W:parseNumber(match[2]),H:parseNumber(match[3]),unit:(match[4]||"").toLowerCase(),index:match.index,end:match.index+match[0].length};
 const labelled=/\b(?:largo|length|l)\s*:\s*([0-9][0-9.,]*)\s+(?:ancho|width|w|a)\s*:\s*([0-9][0-9.,]*)\s+(?:alto|height|h)\s*:\s*([0-9][0-9.,]*)\s*(mm|cm|m)?/i.exec(text);
 return labelled?{L:parseNumber(labelled[1]),W:parseNumber(labelled[2]),H:parseNumber(labelled[3]),unit:(labelled[4]||"").toLowerCase(),index:labelled.index,end:labelled.index+labelled[0].length}:null;
}
function convertPdfMeasurement(measurement,defaultUnit){
 if(!measurement||!Number.isFinite(measurement.value))return NaN;
 const unit=measurement.unit||defaultUnit;
 if(["mm"].includes(unit))return measurement.value/1000;
 if(["cm"].includes(unit))return measurement.value/100;
 if(["kg"].includes(unit))return measurement.value/1000;
 if(["lb","lbs"].includes(unit))return measurement.value*0.00045359237;
 return measurement.value;
}
function pdfLines(items){
 const groups=[];
 items.forEach(item=>{
  const group=groups.find(candidate=>Math.abs(candidate.y-item.transform[5])<3);
  if(group)group.items.push(item);else groups.push({y:item.transform[5],items:[item]});
 });
 return groups.sort((a,b)=>b.y-a.y).map(group=>group.items.sort((a,b)=>a.transform[4]-b.transform[4]).map(item=>item.str).join(" ").trim()).filter(Boolean);
}
function pdfRecord(text,index){
 const normalized=normalizePdfText(text);
 const dimensions=findPdfDimensions(normalized);
 const record={
  desc:`Ítem ${index}`,
  q:findPdfMeasurement(normalized,["cantidad","cant","unidades","units","quantity","qty"]),
  L:findPdfMeasurement(normalized,["largo","longitud","length","long"]),
  W:findPdfMeasurement(normalized,["ancho","width","wide"]),
  H:findPdfMeasurement(normalized,["alto","altura","height"]),
  wt:findPdfMeasurement(normalized,["peso","weight","gross weight","gross"])
 };
 if(dimensions){record.L=record.L||{value:dimensions.L,unit:dimensions.unit};record.W=record.W||{value:dimensions.W,unit:dimensions.unit};record.H=record.H||{value:dimensions.H,unit:dimensions.unit}}
 if(!record.wt){const weightMatch=/([0-9][0-9.,]*)\s*(kg|lb|lbs|t|ton(?:eladas?)?)(?:\b|$)/i.exec(normalized);if(weightMatch)record.wt={value:parseNumber(weightMatch[1]),unit:weightMatch[2].toLowerCase()}}
 if(dimensions){
  const beforeDimensions=normalized.slice(0,dimensions.index).trim();
  const quantityMatches=[...beforeDimensions.matchAll(/\b(\d+(?:[.,]\d+)?)\b/g)];
  const quantityMatch=quantityMatches.length?quantityMatches[quantityMatches.length-1]:null;
  const rowNumber=/^\d+\s+/.test(beforeDimensions);
  if(quantityMatch && !(quantityMatches.length===1 && rowNumber))record.q={value:parseNumber(quantityMatch[1]),unit:""};
  const withoutQuantity=quantityMatch?beforeDimensions.slice(0,quantityMatch.index).trim():beforeDimensions;
  const description=withoutQuantity.replace(rowNumber?/^\d+\s+/:/^\s+/,"").trim();
  if(description)record.desc=description;
  const afterDimensions=normalized.slice(dimensions.end);
  const weights=[...afterDimensions.matchAll(/([0-9][0-9.,]*)\s*(kg|lb|lbs|t|ton(?:eladas?)?)/gi)];
  if(weights.length)record.wt={value:parseNumber(weights[0][1]),unit:weights[0][2].toLowerCase()};
 }
 const dimensionsUnit=/\b(m|metro|metros)\b/i.test(normalized)?"m":"cm";
 const weightUnit=/\b(t|ton|tons|tonelada|toneladas)\b/i.test(normalized)?"t":"kg";
 const missing=[!Number.isFinite(record.L?.value)&&"largo",!Number.isFinite(record.W?.value)&&"ancho",!Number.isFinite(record.H?.value)&&"alto",!Number.isFinite(record.wt?.value)&&"peso"].filter(Boolean);
 const quantityAssumed=!Number.isFinite(record.q?.value);if(quantityAssumed)record.q={value:1,unit:""};
 return {record:{...record,L:convertPdfMeasurement(record.L,dimensions?.unit||dimensionsUnit),W:convertPdfMeasurement(record.W,dimensions?.unit||dimensionsUnit),H:convertPdfMeasurement(record.H,dimensions?.unit||dimensionsUnit),wt:convertPdfMeasurement(record.wt,weightUnit),q:record.q.value},missing,warnings:quantityAssumed?["cantidad asumida: 1"]:[]};
}
function prepareIncompleteImport(result){
 const record=result.record;
 $("pDesc").value=record.desc;
 $("pCant").value=Number.isFinite(record.q)?record.q:"";
 $("pL").value=Number.isFinite(record.L)?record.L:"";
 $("pA").value=Number.isFinite(record.W)?record.W:"";
 $("pH").value=Number.isFinite(record.H)?record.H:"";
 $("pPeso").value=Number.isFinite(record.wt)?record.wt:"";
 $("pUnidad").value="Metros";$("pPesoUnidad").value="toneladas";calcPiecePreview();
 $("excelHelp").textContent=`PDF leído parcialmente. Completa: ${result.missing.join(", ")}. Los valores encontrados quedaron en el formulario y no se agregó una referencia incompleta.`;
}
async function ocrPdfPages(documentPdf){
 if(typeof Tesseract==="undefined")return [];
 const lines=[];
 for(let pageNumber=1;pageNumber<=documentPdf.numPages;pageNumber++){
  const page=await documentPdf.getPage(pageNumber);
  const viewport=page.getViewport({scale:1.6});
  const canvas=document.createElement("canvas");
  canvas.width=viewport.width;canvas.height=viewport.height;
  await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
  const result=await Tesseract.recognize(canvas,"spa+eng");
  lines.push(...String(result.data.text||"").split(/\r?\n/).filter(Boolean));
 }
 return lines;
}
async function importarPDF(file){
 if(typeof pdfjsLib==="undefined")throw new Error("El lector PDF todavía no está disponible.");
 pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
 const documentPdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
 const lines=[];
 for(let pageNumber=1;pageNumber<=documentPdf.numPages;pageNumber++){
  const page=await documentPdf.getPage(pageNumber);
  const content=await page.getTextContent();
  lines.push(...pdfLines(content.items));
 }
 let text=normalizePdfText(lines.join(" "));
 const textRecord=pdfRecord(text,1);
 if(text.length<30||!textRecord||textRecord.missing.length>2){
  $("excelHelp").textContent="PDF escaneado detectado. Intentando reconocer el texto, esto puede tardar unos segundos...";
  lines.push(...await ocrPdfPages(documentPdf));
  text=normalizePdfText(lines.join(" "));
 }
 let records=lines.map((line,index)=>pdfRecord(line,index+1)).filter(result=>result&&result.missing.length===0).map(result=>result.record);
 let partial=pdfRecord(lines.join(" "),1);
 if(!records.length&&partial&&partial.missing.length===0)records=[partial.record];
 let importadas=0;
 records.forEach(record=>{pieces.push({...record,apilable:false,acostarse:false,sobresalir:false,fragil:false,peligrosa:false});importadas++});
 renderPieces();
 if(!importadas&&partial){prepareIncompleteImport(partial)}
 const missing=partial?.missing||["largo","ancho","alto","peso"];
 const noReadableText=!text.trim()&&!lines.length;
 alert(importadas?`PDF procesado: ${importadas} referencia(s) agregada(s)${partial?.warnings?.length?`. Advertencias: ${partial.warnings.join(", ")}.`:""}`:noReadableText?"El PDF es escaneado o no contiene texto reconocible. Ingresa los datos manualmente o conviértelo a un PDF con texto seleccionable.":`PDF leído parcialmente. Falta: ${missing.join(", ")}. Completa los datos en el formulario.`);
}
function importarArchivo(evt){
 const file=evt.target.files[0]; if(!file)return;
 if(file.name.toLowerCase().endsWith(".pdf")){importarPDF(file).catch(()=>alert("No pudimos leer el PDF. Verifica que contenga texto seleccionable y datos de dimensiones, peso y cantidad."));evt.target.value="";return}
 importarExcel(evt);
}
function importarExcel(evt){
 const file=evt.target.files[0]; if(!file)return;
 const reader=new FileReader();
 reader.onload=function(e){
  try{
    const data=new Uint8Array(e.target.result);
    const wb=XLSX.read(data,{type:"array"});
    const sheet=wb.Sheets[wb.SheetNames[0]];
    const matrix=XLSX.utils.sheet_to_json(sheet,{header:1,defval:""});
    const aliases=["largo","long","length","longitud","ancho","width","wide","alto","height","altura","peso","weight","kg","cantidad","qty","quantity","unidades","cant"];
    const headerIndex=matrix.slice(0,5).reduce((best,row,index)=>{const score=row.filter(cell=>aliases.some(alias=>normHeader(cell).includes(normHeader(alias)))).length;return score>best.score?{index,score}:best},{index:0,score:0}).index;
    const headers=matrix[headerIndex]||[];
    const headerText=headers.map(String).join(" ");
    const rows=matrix.slice(headerIndex+1).filter(row=>row.some(value=>String(value).trim()!=="")).map(row=>Object.fromEntries(headers.map((header,index)=>[header,row[index]??""])));
    if(!rows.length){alert("El archivo no tiene filas de datos.");return}
    let importadas=0, omitidas=0, faltantes={largo:0,ancho:0,alto:0,peso:0,cantidad:0};
    rows.forEach(row=>{
      const keys={}; Object.keys(row).forEach(k=>keys[normHeader(k)]=row[k]);
      const get=(...names)=>importValue(keys,names);
      const desc=get("descripcion","referencia","item","producto","description")||`Ítem ${pieces.length+importadas+1}`;
      const cantValue=parseNumber(get("cantidad","cant","und","unidades","units","quantity","qty"));
      const cant=Number.isFinite(cantValue)?cantValue:1;
      let L=parseNumber(get("largo","long","longitud","length","l"));
      let W=parseNumber(get("ancho","width","wide","a"));
      let H=parseNumber(get("alto","altura","height","h"));
      let peso=parseNumber(get("peso","weight","kg","peso unitario","peso por unidad","peso u"));
      const unidad=String(get("unidad","unidad medida","unidad de medida","dimension unit")||(/\bmm\b/i.test(headerText)?"mm":/\bmetros?\b|\(m\)/i.test(headerText)?"m":"cm")).toLowerCase();
      const unidadPeso=String(get("unidad peso","unidad de peso","und peso","weight unit")||(/\blb?s\b/i.test(headerText)?"lb":/\bton(?:eladas?)?\b/i.test(headerText)?"t":"kg")).toLowerCase();
      const missing=[!L&&"largo",!W&&"ancho",!H&&"alto",!peso&&"peso"].filter(Boolean);
      if(missing.length){missing.forEach(field=>faltantes[field]++);omitidas++;return}
      if(unidad.startsWith("mm")){L/=1000;W/=1000;H/=1000}else if(!unidad.startsWith("m")){L/=100;W/=100;H/=100}
      if(unidadPeso.startsWith("lb")){peso*=0.00045359237}else if(!unidadPeso.startsWith("t")){peso/=1000}
      pieces.push({desc:String(desc),q:Math.max(1,cant),L,W,H,wt:peso,apilable:false,acostarse:false,sobresalir:false,fragil:false,peligrosa:false});
      importadas++;
    });
    renderPieces();
    const missingSummary=Object.entries(faltantes).filter(([,count])=>count).map(([field,count])=>`${field}: ${count}`).join(", ");
    const warning=matrix[headerIndex].some(cell=>/cm|mm|kg/i.test(String(cell)))?"":" Unidades asumidas: cm y kg.";
    alert(`Importación completa: ${importadas} referencia(s) agregada(s).${warning}${omitidas?` ${omitidas} fila(s) omitida(s) por datos incompletos${missingSummary?` (${missingSummary})`:""}.`:""}`);
  }catch(err){
    alert("No pudimos leer el archivo. Verifica que sea un Excel o CSV válido y que incluya largo, ancho, alto y peso.");
  }
  evt.target.value="";
 };
 reader.readAsArrayBuffer(file);
}

function specialCompatibility(v,t){
 const reqClosed=$("cerrado").value==="Sí", reqTemp=$("temp").value==="Sí", reqDanger=$("peligrosa").value==="Sí"||pieces.some(p=>p.peligrosa), reqProject=$("tipoCarga").value==="Proyecto"||$("equipo").value!=="No", over=$("sobredim").value==="Sí";
 if(reqTemp && !/refrigerado/i.test(v.body) && v.name!=="Furgón refrigerado") return false;
 if(reqClosed && !/Furgón|furgón|carpado/i.test(v.body)) return false;
 if(reqDanger && /4 x 4|Van|NHR|NPR/i.test(v.name)) return false;
 if(over && !/cama|modular|plataforma|extensible|mula|Minimula/i.test(v.name)) return false;
 if(reqProject && !/plataforma|cama|modular|Mula|Minimula|Doble troque/i.test(v.name)) return false;
 return true;
}
function containerCompatibility(v){
 if($("tipoCarga").value!=="Contenedor") return true;
 const tam=$("contTam").value;
 if(tam==="20'" && !/20|Minimula|Mula|Doble|600/i.test(v.cargo+" "+v.name)) return false;
 if((tam==="40'"||tam==="40 HC") && !/40|Mula|portacontenedor/i.test(v.cargo+" "+v.name)) return false;
 return /Portacontenedor|Minimula|Mula|Doble troque|600 sencillo/i.test(v.name+" "+v.body);
}
function analyzeVehicle(v,t,margin=0.10){
 if(v.cap===null||v.cap<=0)return null;
 const needWeight=t.weight*(1+margin);
 const needVol=t.volume*(1+margin);
 const dimsOk=v.L===null|| (t.maxL<=v.L && t.maxW<=v.W && t.maxH<=v.H);
 const weightOk=needWeight<=v.cap;
 const volOk=v.vol===null || needVol<=v.vol;
 const special=specialCompatibility(v,t)&&containerCompatibility(v);
 const areaApprox=v.L&&v.W ? t.area*(1+margin)<=v.L*v.W : true;
 const compatible=weightOk&&volOk&&dimsOk&&special&&areaApprox;
 const wOcc=v.cap? t.weight/v.cap*100:0;
 const vOcc=v.vol? t.volume/v.vol*100:0;
 const score=compatible ? (v.cap*0.45+(v.vol||999)*0.25+(v.L||99)*(v.W||99)*0.15+vOcc*0.1+wOcc*0.05) : Infinity;
 return {v,compatible,wOcc,vOcc,dimsOk,weightOk,volOk,special,areaApprox,score};
}
function analyzeSet(){
 const t=totals(); if(!hasCargo())return {t,options:[],best:null};
 const normal=vehicles.map(v=>analyzeVehicle(v,t)).filter(Boolean);
 normal.sort((a,b)=>a.score-b.score);
 const compatible=normal.filter(x=>x.compatible);
 if(compatible.length)return {t,options:normal,best:compatible[0]};
 // If no single vehicle, find minimum combination using repeated vehicles for scalable standard vehicles.
 const candidates=vehicles.filter(v=>v.cap>0 && v.name!=="Cama baja / tolva" && v.name!=="Modular").map(v=>{
   const byWeight=Math.ceil(t.weight/(v.cap*0.9));
   const byVol=v.vol?Math.ceil(t.volume/(v.vol*0.9)):1;
   const count=Math.max(1,byWeight,byVol);
   const dims=v.L===null || (t.maxL<=v.L&&t.maxW<=v.W&&t.maxH<=v.H);
   const special=specialCompatibility(v,t)&&containerCompatibility(v);
   return {v,count,dims,special,wOcc:(t.weight/(v.cap*count))*100,vOcc:v.vol?(t.volume/(v.vol*count))*100:0,score:count*100+v.cap+(v.vol||0)/10};
 }).filter(x=>x.dims&&x.special).sort((a,b)=>a.score-b.score);
 return {t,options:normal,best:candidates.length?{...candidates[0],multi:true}:null};
}
function validation(a){
 const errs=[], warns=[];
 if(!a.best){errs.push("No existe un vehículo compatible con los datos registrados. Revisa peso, dimensiones, volumen y condiciones especiales.");return {level:"red",errs,warns}}
 if(a.best.multi) warns.push(`Se requieren aproximadamente ${a.best.count} unidades de ${a.best.v.name}. La combinación debe confirmarse con el transportador.`);
 const t=a.t, v=a.best.v;
 const wo=a.best.wOcc, vo=a.best.vOcc;
 if(wo>90||vo>90)warns.push("Ocupación superior al 90 %: se recomienda confirmar distribución y disponibilidad.");
 if(wo>100||vo>100)errs.push("La carga supera la capacidad estimada de la combinación.");
 if(!a.best.dimsOk)errs.push("Una o más piezas exceden las dimensiones internas disponibles.");
 if(t.area>0 && v.L&&v.W && t.area/(v.L*v.W)>0.9)warns.push("El área de piso está cercana al límite. El cubicaje por sí solo no garantiza que los pallets/piezas quepan.");
 if(pieces.some(p=>!p.apilable))warns.push("Hay carga no apilable. La distribución real del piso debe validarse.");
 if($("sobredim").value==="Sí")warns.push("Carga sobredimensionada: puede requerir permisos, escolta o revisión especializada.");
 if($("peligrosa").value==="Sí"||pieces.some(p=>p.peligrosa))warns.push("Mercancía peligrosa: validar ONU, clase, documentación y vehículo autorizado.");
 if($("temp").value==="Sí")warns.push("Se requiere control de temperatura. Confirmar rango y equipo refrigerado.");
 return {level:errs.length?"red":warns.length?"yellow":"green",errs,warns}
}
function analizar(){
 const a=analyzeSet(); lastAnalysis=a; const val=a.best?validation(a):{level:"blue",errs:["Agrega al menos una pieza."],warns:[]};
 $("alerts").innerHTML=[...val.errs.map(x=>`<div class="alert red">⚠ ${esc(x)}</div>`),...val.warns.map(x=>`<div class="alert yellow">⚠ ${esc(x)}</div>`),(!val.errs.length&&!val.warns.length?`<div class="alert green">✓ La combinación cumple peso, volumen, dimensiones y condiciones registradas.</div>`:"")].join("");
 renderMeasuresTable();
 if(!a.best){$("recommendation").innerHTML="";return}
 const b=a.best,v=b.v, badge=val.level;
 $("recommendation").innerHTML=`<div class="recommend">
 <div class="rec-top"><div><div class="eyebrow">RECOMENDACIÓN ${b.multi?"DE COMBINACIÓN":"PRINCIPAL"}</div><div class="rec-name">${esc(v.name)} ${b.multi?`× ${b.count}`:"× 1"}</div><div style="color:#9ba8b9;font-size:12px;margin-top:4px">${esc(v.body)} · ${esc(v.cargo)}</div></div><span class="badge ${badge}">${badge==="green"?"VERDE":badge==="yellow"?"AMARILLO":"ROJO"}</span></div>
 <div class="bars"><div class="barline"><span>Ocupación peso</span><div class="bar"><div class="fill" style="width:${Math.min(100,b.wOcc)}%"></div></div><b>${b.wOcc.toFixed(1)}%</b></div><div class="barline"><span>Ocupación volumen</span><div class="bar"><div class="fill" style="width:${Math.min(100,b.vOcc||0)}%"></div></div><b>${(b.vOcc||0).toFixed(1)}%</b></div></div>
 <div class="rec-grid"><div class="rec-stat"><span>Peso total</span><b>${a.t.weight.toFixed(3)} t</b></div><div class="rec-stat"><span>Volumen total</span><b>${a.t.volume.toFixed(2)} m³</b></div><div class="rec-stat"><span>Área de piso</span><b>${a.t.area.toFixed(2)} m²</b></div><div class="rec-stat"><span>Dimensión máx.</span><b>${a.t.maxL.toFixed(2)} × ${a.t.maxW.toFixed(2)} × ${a.t.maxH.toFixed(2)} m</b></div></div>
 <div class="alt-list"><b style="font-size:12px;color:#b9c3d1">Alternativas</b>${a.options.filter(x=>x.compatible&&x.v.name!==v.name).slice(0,3).map(x=>`<div class="alt"><strong>${esc(x.v.name)}</strong><span>1 vehículo</span><span>${x.wOcc.toFixed(1)}% peso</span><span>${x.v.vol?x.vOcc.toFixed(1)+"% volumen":"Vol. ND"}</span></div>`).join("")||'<div class="alert blue">No hay otra alternativa individual que cumpla todos los criterios.</div>'}</div>
 </div>`;
 generarCotizacion();
}
function money(v){ if(isNaN(v))v=0; return "$ "+Number(v).toLocaleString("es-CO",{minimumFractionDigits:0,maximumFractionDigits:0}); }
function exportarExcel(){
 if(typeof XLSX==="undefined"){alert("No está disponible el exportador Excel.");return}
 const rows=isContainer()?[{
  Descripción:`Contenedor ${$("contTam").value}`,
  Cantidad:Math.max(1,num("contCant")),
  Largo:"",Ancho:"",Alto:"",
  Unidad:"m",
  Peso:num("contMerc")+num("contTara"),
  "Unidad de peso":"kg"
 }]:pieces.map(piece=>({
  Descripción:piece.desc,Cantidad:piece.q,Largo:piece.L,Ancho:piece.W,Alto:piece.H,
  Unidad:"m",Peso:piece.wt*1000,"Unidad de peso":"kg"
 }));
 if(!rows.length){alert("No hay datos de carga para exportar.");return}
 const sheet=XLSX.utils.json_to_sheet(rows);
 const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,sheet,"Carga");
 XLSX.writeFile(workbook,"logitrading-carga.xlsx");
}
function generarCotizacion(guardar=false){
  console.log("🔵 generarCotizacion() llamada con guardar="+guardar);
  // Siempre recalculamos para que la cotización use los últimos datos ingresados.
  if(!hasCargo()){
    console.log("❌ No hay carga registrada");
    $("quote").innerHTML='<div class="empty">⚠ Completa los datos básicos de la carga antes de generar la cotización.</div>';
    return;
  }
  const a=analyzeSet();
  lastAnalysis=a;
  if(!a.best){
    console.log("❌ No se encontró vehículo compatible");
    $("quote").innerHTML='<div class="alert red">⚠ No se encontró un vehículo compatible. Revisa peso, volumen, dimensiones y condiciones especiales.</div>';
    return;
  }
  console.log("✅ Vehículo encontrado:", a.best.v.name);
  const op=$("operacion").value, mod=$("modalidad").value, serv=$("servicio").value;
  const val=validation(a);
  const fecha=$("fecha").value ? new Date($("fecha").value).toLocaleString("es-CO") : "Pendiente";

  const venta=num("vVenta"), costo=num("vCosto"), sello=num("vSello"), devol=num("vDevolucion"), otros=num("vOtros");
  let utilidad=$("vUtilidad").value!==""?num("vUtilidad"):(venta-costo-sello-devol-otros);
  const totalCotizado = venta || (costo+sello+devol+otros+Math.max(0,utilidad));
  const margenPct = venta ? (utilidad/venta*100) : 0;

  $("quote").innerHTML=`<div class="quote-head executive-head"><div class="quote-brand"><img src="assets/logitrading-logo.png" alt="Logitrading" class="quote-logo"><div><div class="eyebrow">RESUMEN EJECUTIVO</div><h2>Cotización de transporte</h2><div class="quote-meta">${esc(op)} · ${esc(mod)} · ${esc(serv)} · ${esc(fecha)}</div></div></div><span class="badge ${val.level}">${val.level.toUpperCase()}</span></div>
  <div class="final-recommendation">
    <div class="final-rec-title"><span>VEHÍCULO RECOMENDADO</span><b>${val.level==="green"?"✓ MEJOR AJUSTE":val.level==="yellow"?"⚠ REVISAR ANTES DE COTIZAR":"✕ REVISIÓN NECESARIA"}</b></div>
    <div class="final-rec-body">
      <div class="final-rec-image">${vehicleSvg(a.best.v)}</div>
      <div class="final-rec-main">
        <div class="final-rec-name">${esc(a.best.v.name)} <small>× ${a.best.multi?a.best.count:1}</small></div>
        <div class="final-rec-meta">${esc(a.best.v.body)} · ${esc(a.best.v.cargo)}</div>
        <div class="final-rec-grid">
          <div><span>Capacidad útil</span><strong>${a.best.v.cap===null?"N/D":a.best.v.cap+" t"}</strong></div>
          <div><span>Volumen útil</span><strong>${a.best.v.vol===null?"N/D":a.best.v.vol+" m³"}</strong></div>
          <div><span>Ocupación peso</span><strong>${a.best.wOcc.toFixed(1)}%</strong></div>
          <div><span>Ocupación volumen</span><strong>${(a.best.vOcc||0).toFixed(1)}%</strong></div>
        </div>
      </div>
    </div>
  </div>
  <div class="quote-section"><div class="quote-section-title">Detalles del servicio</div><table class="service-details"><tr><th>Ruta</th><td>${esc($("origen").value||"Pendiente")} → ${esc($("destino").value||"Pendiente")}</td></tr><tr><th>Recogida</th><td>${esc($("recogida").value||"Pendiente")}</td></tr><tr><th>Destino</th><td>${esc($("destino").value||"Pendiente")}</td></tr><tr><th>Fecha requerida</th><td>${esc(fecha)}</td></tr><tr><th>Tipo de carga</th><td>${esc($("tipoCarga").value||"Pendiente")}</td></tr><tr><th>Carga</th><td>${a.t.weight.toFixed(3)} t · ${a.t.volume.toFixed(2)} m³ · ${a.t.area.toFixed(2)} m² · ${pieces.length} referencias</td></tr><tr><th>Dimensión máxima</th><td>${a.t.maxL.toFixed(2)} × ${a.t.maxW.toFixed(2)} × ${a.t.maxH.toFixed(2)} m</td></tr><tr><th>Requerimientos</th><td>${requirements()}</td></tr></table></div>

  <div class="final-recommendation quote-values" style="margin-top:18px">
    <div class="final-rec-title"><span>VALORES DE LA COTIZACIÓN</span><b>${esc($("vObs").value||"")}</b></div>
    <table style="margin-top:0">
      <tr><th>Valor de venta (flete cliente)</th><td>${money(venta)}</td></tr>
      <tr><th>Costo transportador</th><td>${money(costo)}</td></tr>
      <tr><th>Sello satelital / seguridad</th><td>${money(sello)}</td></tr>
      <tr><th>Devolución de vacío</th><td>${money(devol)}</td></tr>
      <tr><th>Otros cargos</th><td>${money(otros)}</td></tr>
      <tr><th>Utilidad neta</th><td>${money(utilidad)} ${venta?`(${margenPct.toFixed(1)}% sobre venta)`:""}</td></tr>
      <tr class="quote-total"><th><b>TOTAL COTIZADO AL CLIENTE</b></th><td><b>${money(totalCotizado)}</b></td></tr>
    </table>
  </div>

  <div style="margin-top:13px;color:#8f9bad;font-size:11px">Nota comercial: recomendación preliminar. Confirmar vehículo real, disponibilidad, ruta, restricciones, distribución física, permisos y tarifa antes de emitir la oferta definitiva.</div>`;
  if(guardar){
    console.log("💾 Guardando cotización...");
    guardarCotizacion(a,totalCotizado);
  }
}
function imprimirCotizacion(){
  showPanel(7);
  generarCotizacion();
  setTimeout(()=>window.print(),150);
}
function requirements(){
 const r=[]; if($("cerrado").value==="Sí")r.push("carrocería cerrada"); if($("satelital").value==="Sí")r.push("sello satelital"); if($("escolta").value==="Sí")r.push("escolta"); if($("equipo").value!=="No")r.push($("equipo").value); if($("temp").value==="Sí")r.push("temperatura controlada"); if($("peligrosa").value==="Sí"||pieces.some(p=>p.peligrosa))r.push("mercancía peligrosa"); if($("sobredim").value==="Sí")r.push("sobredimensión"); return r.join(", ")||"Sin requerimientos especiales registrados";
}

function vehicleSvg(v){
  const n = (v.name||"").toLowerCase();
  let type = "truck";
  if(n.includes("4 x 4") || n.includes("van") || n.includes("nhr") || n.includes("npr") || n.includes("nqr")) type="light";
  else if(n.includes("turbo") || n.includes("600")) type="box";
  else if(n.includes("doble") || n.includes("sencillo")) type="medium";
  else if(n.includes("minimula") || n==="mula") type="semi";
  else if(n.includes("portacontenedor")) type="container";
  else if(n.includes("tanque") || n.includes("niñera")) type="tank";
  else if(n.includes("tolva")) type="hopper";
  else if(n.includes("cama baja") || n.includes("cama alta") || n.includes("plataforma") || n.includes("modular")) type="flat";
  else if(n.includes("refrigerado")) type="reefer";

  const id = ('veh'+Math.random().toString(36).slice(2,8));
  const colors = {
    light:['#f7fafc','#dbe7f3','#f59a2f'], box:['#eef3f8','#9eb2c8','#f59a2f'],
    medium:['#edf3f8','#7890aa','#f59a2f'], semi:['#f4f7fa','#647d97','#ff9d2e'],
    container:['#eaf2f8','#315b7a','#f59a2f'], tank:['#f2f5f8','#8a98a8','#f59a2f'],
    hopper:['#f1f5f8','#667b90','#f59a2f'], flat:['#f4f6f8','#60768c','#f59a2f'],
    reefer:['#ffffff','#c9d8e6','#37a7e8'], truck:['#f1f5f8','#71869a','#f59a2f']
  }[type];
  const [light, dark, accent] = colors;
  const bg = `url(#${id}bg)`;
  const wheel = (x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r+2}" fill="#18212c" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="#111820" stroke="#e7edf3" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="2" fill="#8795a3"/>`;
  const cab = `<path d="M12 49h9l5-18q1-4 5-4h16v22h-4" fill="${dark}" stroke="#e7edf3" stroke-width="1.4"/>
    <path d="M27 31h14l4 14H25z" fill="url(#${id}glass)" stroke="#f6b35b" stroke-width="1.2"/>
    <path d="M29 33h10l2 9H27z" fill="#bfe4f5" opacity=".92"/>
    <path d="M16 48h6M47 48h7" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    ${wheel(32,51,5)}${wheel(66,51,5)}`;
  let body='';
  if(type==='light') body=`<rect x="49" y="32" width="30" height="17" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.4"/><path d="M53 35h22v11H53z" fill="#f7fbff" opacity=".22"/><path d="M52 48h25" stroke="${accent}" stroke-width="2"/>`;
  else if(type==='box') body=`<rect x="48" y="24" width="47" height="25" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M53 28h37v17H53z" fill="#ffffff" opacity=".08"/><path d="M58 25v23M85 25v23" stroke="#ffffff" opacity=".16"/><path d="M52 47h38" stroke="${accent}" stroke-width="2"/>${wheel(57,51,5)}${wheel(86,51,5)}`;
  else if(type==='medium') body=`<rect x="48" y="28" width="52" height="21" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M53 32h42v12H53z" fill="#ffffff" opacity=".08"/><path d="M61 29v19M88 29v19" stroke="#ffffff" opacity=".13"/><path d="M51 47h46" stroke="${accent}" stroke-width="2"/>${wheel(58,51,5)}${wheel(86,51,5)}${wheel(99,51,5)}`;
  else if(type==='semi') body=`<rect x="48" y="27" width="43" height="22" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M92 32h13v17H92z" fill="${dark}" stroke="#e7edf3" stroke-width="1.3"/><path d="M53 31h33v14H53z" fill="#fff" opacity=".08"/><path d="M51 47h50" stroke="${accent}" stroke-width="2"/>${wheel(57,51,5)}${wheel(75,51,5)}${wheel(96,51,5)}${wheel(105,51,5)}`;
  else if(type==='container') body=`<rect x="48" y="25" width="56" height="24" rx="2" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M54 27v20M61 27v20M68 27v20M75 27v20M82 27v20M89 27v20M96 27v20" stroke="#ffffff" opacity=".18"/><rect x="78" y="30" width="19" height="9" rx="1" fill="#dbe8f1" opacity=".16"/><text x="87.5" y="37" text-anchor="middle" font-size="5" fill="#fff" opacity=".8" font-weight="700">20 / 40</text>${wheel(59,51,5)}${wheel(88,51,5)}${wheel(102,51,5)}`;
  else if(type==='tank') body=`<path d="M49 31Q72 21 98 31v10q-24 10-49 0z" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M55 33q18-6 37 0" fill="none" stroke="#fff" opacity=".22"/><path d="M51 47h46" stroke="${accent}" stroke-width="2"/>${wheel(58,51,5)}${wheel(87,51,5)}${wheel(101,51,5)}`;
  else if(type==='hopper') body=`<path d="M49 28h51l-8 21H57z" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M54 31h41" stroke="#fff" opacity=".18"/><path d="M58 47h38" stroke="${accent}" stroke-width="2"/>${wheel(60,51,5)}${wheel(89,51,5)}${wheel(101,51,5)}`;
  else if(type==='flat') body=`<rect x="48" y="41" width="57" height="8" rx="2" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M53 40v-10h12v10M69 40V26h13v14M86 40v-7h12v7" fill="none" stroke="${accent}" stroke-width="2.2"/><path d="M52 44h50" stroke="#fff" opacity=".15"/>${wheel(58,51,5)}${wheel(88,51,5)}${wheel(101,51,5)}`;
  else if(type==='reefer') body=`<rect x="48" y="25" width="49" height="24" rx="3" fill="url(#${id}body)" stroke="#dbe5ee" stroke-width="1.5"/><rect x="52" y="29" width="40" height="15" rx="2" fill="#dff2fb"/><path d="M56 32h16M56 36h12" stroke="#70b9d8" stroke-width="1.2"/><text x="81" y="39" text-anchor="middle" font-size="5.2" fill="#25749c" font-weight="800">REEFER</text>${wheel(58,51,5)}${wheel(88,51,5)}${wheel(101,51,5)}`;
  return `<svg viewBox="0 0 118 62" role="img" aria-label="${esc(v.name)}">
    <defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#182332"/><stop offset="1" stop-color="#0c121a"/></linearGradient>
      <linearGradient id="${id}body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
      <linearGradient id="${id}glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9f5ff"/><stop offset="1" stop-color="#68a9c7"/></linearGradient>
      <filter id="${id}shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".45"/></filter>
    </defs>
    <rect width="118" height="62" rx="9" fill="${bg}"/>
    <path d="M8 54h103" stroke="#344454" stroke-width="1"/>
    <ellipse cx="64" cy="53" rx="48" ry="4" fill="#000" opacity=".28"/>
    <g filter="url(#${id}shadow)">${cab}${body}</g>
    <path d="M12 48h4" stroke="#ffd36b" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function renderVehicles(){
 $("vehicleTable").innerHTML=vehicles.map((v,i)=>`<tr onclick="verFicha(${i})">
   <td><div class="vehicle-name"><div><b>${esc(v.name)}</b><div class="vehicle-badge">${esc(v.special||"Estándar")}</div></div></div></td>
   <td><div class="vehicle-photo">${vehicleSvg(v)}</div></td>
   <td>${v.cap? v.cap.toFixed(1):"ND"}</td>
   <td>${v.vol?v.vol.toFixed(1):"ND"}</td>
   <td class="muted-cell">${v.L?`${v.L} × ${v.W} × ${v.H}`:"Según resolución"}</td>
   <td>${esc(v.body)}</td>
   <td>${esc(v.cargo)}</td>
   <td class="muted-cell">${esc(v.special||"—")}</td>
 </tr>`).join("");
 localStorage.setItem("lt_vehicles",JSON.stringify(vehicles));
}
function verFicha(i){
 const v=vehicles[i];
 const box=$("vehicleModalBox");
 box.innerHTML=`
  <div class="modal-head">
    <div><div class="eyebrow">FICHA TÉCNICA</div><h2 style="margin:4px 0 0">${esc(v.name)}</h2></div>
    <button class="iconbtn" onclick="cerrarFicha()">×</button>
  </div>
  <div class="modal-image">${vehicleSvg(v)}</div>
  <div class="final-rec-grid" style="margin-top:16px">
    <div><span>Capacidad útil</span><strong>${v.cap!==null?v.cap+" t":"N/D"}</strong></div>
    <div><span>Volumen útil</span><strong>${v.vol!==null?v.vol+" m³":"N/D"}</strong></div>
    <div><span>Largo interno</span><strong>${v.L!==null?v.L+" m":"Según resolución"}</strong></div>
    <div><span>Ancho interno</span><strong>${v.W!==null?v.W+" m":"Según resolución"}</strong></div>
    <div><span>Alto interno</span><strong>${v.H!==null?v.H+" m":"Según resolución"}</strong></div>
    <div><span>Carrocería</span><strong>${esc(v.body)}</strong></div>
    <div><span>Uso / carga</span><strong>${esc(v.cargo)}</strong></div>
    <div><span>Condición especial</span><strong>${esc(v.special||"Estándar")}</strong></div>
  </div>
  <div class="footer-note" style="margin-top:16px;text-align:left">Ficha generada a partir de la tabla maestra editable. Ajusta los valores en la pestaña "Tabla maestra" si difieren de la cotización real del transportador.</div>
  <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn primary" onclick="cerrarFicha()">Cerrar</button></div>
 `;
 $("vehicleModalOverlay").classList.add("open");
}
function cerrarFicha(){$("vehicleModalOverlay").classList.remove("open");}
function restaurarVehiculos(){if(confirm("¿Restaurar la tabla maestra a los valores base?")){vehicles=BASE_VEHICLES.map(v=>({...v}));renderVehicles();}}
function reiniciarTodo(){if(!confirm("Esto borrará la solicitud, las piezas y el análisis. ¿Continuar?"))return;pieces=[];lastAnalysis=null;document.querySelectorAll("input").forEach(i=>{if(i.type!=="checkbox")i.value=""});document.querySelectorAll("select").forEach(s=>s.selectedIndex=0);$("pCant").value=1;$("contCant").value=1;renderPieces();$("alerts").innerHTML='<div class="alert blue">Solicitud reiniciada. Puedes empezar una nueva.</div>';$("recommendation").innerHTML="";$("quote").innerHTML='<div class="empty">Aún no hay cotización.</div>';toggleContainer();window.scrollTo({top:0,behavior:"smooth"})}
function guardarCotizacion(a,totalCotizado){
  if(!lastAnalysis){alert("No hay análisis para guardar.");return}
  const id=Math.random().toString(36).slice(2,8).toUpperCase();
  const record={
    id,
    fecha:new Date().toLocaleString("es-CO"),
    operacionId:$("operationId").value||"—",
    cliente:$("clientName").value||"—",
    tipoCarga:$("tipoCarga").value||"—",
    peso:a.t.weight.toFixed(3),
    volumen:a.t.volume.toFixed(2),
    vehiculo:a.best.v.name+(a.best.multi?` × ${a.best.count}`:""),
    total:money(totalCotizado)
  };
  let history=JSON.parse(localStorage.getItem("lt_history")||"[]");
  history.unshift(record);
  if(history.length>500)history=history.slice(0,500);
  localStorage.setItem("lt_history",JSON.stringify(history));
  alert(`Cotización guardada: ${id}`);
  renderHistory();
}
function renderHistory(){
  const tbody=$("historyTableBody");
  const search=($("historySearch")?.value||"").toLowerCase();
  if(!tbody)return;
  let history=JSON.parse(localStorage.getItem("lt_history")||"[]");
  if(search){
    history=history.filter(r=>(r.operacionId.toLowerCase().includes(search)||r.cliente.toLowerCase().includes(search)));
  }
  const count=$("historyCount");
  if(count)count.textContent=`${history.length} ${history.length===1?"registro":"registros"}`;
  if(!history.length){
    tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:20px;color:#8f9bad">No hay registros en el historial.</td></tr>';
    return;
  }
  tbody.innerHTML=history.map(r=>`<tr>
    <td>${esc(r.fecha)}</td>
    <td><strong>${esc(r.operacionId)}</strong></td>
    <td>${esc(r.cliente)}</td>
    <td>${esc(r.tipoCarga)}</td>
    <td>${r.peso} t</td>
    <td>${r.volumen} m³</td>
    <td>${esc(r.vehiculo)}</td>
    <td><strong>${r.total}</strong></td>
    <td><button class="iconbtn" onclick="if(confirm('¿Eliminar este registro?')){let h=JSON.parse(localStorage.getItem('lt_history')||'[]');h=h.filter(x=>x.id!=='${r.id}');localStorage.setItem('lt_history',JSON.stringify(h));renderHistory();}" title="Eliminar">×</button></td>
  </tr>`).join("");
}
function exportarHistorial(){
  if(typeof XLSX==="undefined"){alert("No está disponible el exportador Excel.");return}
  let history=JSON.parse(localStorage.getItem("lt_history")||"[]");
  if(!history.length){alert("El historial está vacío.");return}
  const rows=history.map(r=>({
    "Fecha":r.fecha,
    "ID Operación":r.operacionId,
    "Cliente":r.cliente,
    "Tipo Carga":r.tipoCarga,
    "Peso (t)":r.peso,
    "Volumen (m³)":r.volumen,
    "Vehículo":r.vehiculo,
    "Total":r.total
  }));
  const sheet=XLSX.utils.json_to_sheet(rows);
  const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,sheet,"Historial");
  XLSX.writeFile(workbook,"logitrading-historial.xlsx");
}
function vaciarHistorial(){
  if(confirm("¿Borrar todo el historial de cotizaciones? Esta acción no se puede deshacer.")){
    localStorage.removeItem("lt_history");
    renderHistory();
    alert("Historial borrado.");
  }
}
renderVehicles();renderPieces();calcPiecePreview();renderHistory();
document.addEventListener("input",updateDashboard);document.addEventListener("change",updateDashboard);
