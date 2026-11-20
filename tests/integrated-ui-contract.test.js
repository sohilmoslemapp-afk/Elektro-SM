'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('prototypes/ElektroPlan-SM-integriert.html','utf8');
const ids=['drawing','symbols','wires','projectName','wireMode','deleteSelected','checkDiagram','checkPlan','savePlan','exportSvg','exportPng','exportBom','exportWireList','undoEdit','redoEdit','addPart','partList','searchParts','partResults','takePhoto','choosePhoto','preview','exportJson','importJson'];
for(const id of ids)assert.match(html,new RegExp('\\bid="'+id+'"'), 'Missing required UI element '+id);
for(const path of ['../src/schematic-validation.js','../src/project-import-validation.js','../src/terminal-graph.js']){
 assert.ok(html.includes('src="'+path+'"'),'Missing dependency '+path);
 assert.ok(fs.existsSync('prototypes/'+path),'Dependency does not exist '+path);
}
const scripts=html.split('<script>').slice(1).map(block=>block.split('</script>')[0]);
assert.equal(scripts.length,1,'Exactly one inline application script expected');
new vm.Script(scripts[0],{filename:'ElektroPlan-SM-integriert.html'});
for(const id of ids.filter(x=>!['drawing','symbols','wires','projectName','preview','partList','partResults'].includes(x))){
 assert.ok(scripts[0].includes("'"+id+"'"),'UI action not referenced in application '+id);
}
assert.match(scripts[0],/projectName'\)\.addEventListener\('change'/,'Project rename must be tracked');
assert.match(scripts[0],/undoStack\.length=0;redoStack\.length=0;lastSnapshot=JSON\.stringify\(data\)/,'Import must reset undo history');
assert.match(scripts[0],/wireStart=null;wireMode=false;drag=null/,'Import must reset connection and drag state');
assert.match(scripts[0],/const check=window\.ElektroPlanImport\?\.validateImport\(payload\)/,'Export must validate the actual payload');
assert.match(scripts[0],/Export abgebrochen:/,'Invalid exports must be blocked');
assert.match(html,/Keine automatische Bilderkennung/,'Do not falsely advertise image recognition');
assert.match(html,/Hersteller \(manuell\)/,'BOM must label manufacturer as manually entered');
assert.match(scripts[0],/const cleaned=\/\^\[\\s\\u0000-\\u001f\]\*\[=\+@-\]/,'CSV cells must neutralize formula prefixes');
assert.match(html,/Modell \(manuell\)/,'BOM must label model as manually entered');
assert.match(html,/Von Hersteller \(manuell\)/,'Wiring CSV must label source manufacturer as manual');
assert.match(html,/Nach Modell \(manuell\)/,'Wiring CSV must label destination model as manual');
assert.match(html,/Von Klemme \(manuell\)/,'Wiring CSV must label source terminal as manual');
assert.match(html,/Nach Klemme \(manuell\)/,'Wiring CSV must label destination terminal as manual');
assert.match(html,/Manuell zugeordnet – NICHT herstellerverifiziert/,'Wiring CSV must not imply manufacturer verification');
assert.match(html,/Ungültige Klemmenreferenz/,'Wiring CSV must flag invalid terminal references');
assert.match(scripts[0],/save\.disabled=!fromSelect\.options\.length\|\|!toSelect\.options\.length/,'Terminal picker must prevent saving missing terminal selections');
assert.match(html,/keine Herstellerprüfung, keine elektrische Freigabe/,'Manual terminal safety disclaimer required');
assert.match(html,/manuelle Klemmen enthalten, keine Herstellerprüfung/,'CSV export must clearly disclaim manufacturer verification');
console.log('Integrated UI contract: element/dependency/action/safety checks passed (static; not a browser run).');

assert.match(html,/data-tab="features"/,'Capabilities navigation must be visible');
assert.match(html,/<section id="features" hidden>/,'Capabilities page must exist');
assert.match(html,/Automatische Erkennung elektrischer Bauteile aus Fotos/,'Photo recognition must be marked as planned');
assert.match(html,/Firmenkonten, Lizenzen und zeitlich begrenzte Testzugänge/,'Company licensing must be marked as planned');
assert.match(html,/\['plan','parts','camera','project','features'\]/,'Navigation must support capabilities page');

assert.match(html,/Dokumenttitel \(manuell\): /,'Saved parts must display manually entered document title');
assert.match(html,/Manuell erfasst – NICHT herstellerverifiziert/,'Saved parts must disclose unverified provenance');
assert.match(html,/Dokument öffnen \(ungeprüft\)/,'External document links must be labelled unverified');

assert.match(html,/Bibliothekseintrag löschen/,'Library deletion control required');
assert.match(html,/data\.parts\.splice\(index,1\)/,'Deletion must remove only the selected library record');
assert.match(html,/Bereits vorhandene Plansymbole bleiben unverändert/,'Deletion must disclose that schematic symbols are retained');

assert.match(html,/const invalid=!!\(edge\.fromTerminal/,'Invalid terminal references must be detected for schematic warnings');
assert.ok(html.includes("invalid?' ✖':missing?' ⚠':''"),'Invalid and missing terminal references must have different schematic markers');

assert.ok(html.includes('Leitungen mit ungültiger Klemmenreferenz:'),'Plan check must report invalid terminal reference count');
assert.ok(html.includes('Strukturprüfung: Fehlerhafte Klemmenreferenzen'),'Plan check must show an explicit invalid-terminal summary');

assert.ok(html.includes('terminalResult.reviewRequired'),'Plan check must consume terminal graph review-required state');
assert.ok(html.includes('Fachliche Nachprüfung erforderlich'),'Plan check must visibly require specialist review');
assert.ok(html.includes('Strukturell vollständig – weiterhin keine elektrische Freigabe'),'Even complete structural graphs must not imply electrical approval');

assert.ok(html.includes('Ungültige gespeicherte Klemmenreferenz – bitte neu zuordnen.'),'Terminal picker must explain invalid saved references');
assert.ok(html.includes('Leitungsenden noch nicht vollständig zugeordnet.'),'Terminal picker must distinguish incomplete assignments');
assert.ok(html.includes('Manuelle Leitungsenden vorhanden – nicht herstellerverifiziert.'),'Terminal picker must not imply manufacturer verification');

assert.ok(html.includes('if(!w)return msg(\'Leitung nicht mehr vorhanden – Auswahl neu öffnen\')'),'Terminal picker must refuse saving a deleted wire');

assert.ok(html.includes('const pickerWires=data.wires.map(w=>({ref:w,a:w.a,b:w.b}))'),'Terminal picker must snapshot wire identities and component endpoints');
assert.ok(html.includes('w.a!==pickerWires[index].a||w.b!==pickerWires[index].b'),'Terminal picker must reject changed wire endpoints');
assert.ok(html.includes('Leitung geändert – Auswahl neu öffnen'),'Terminal picker must explain stale selection');

assert.ok(html.includes('const structureErrors=result.errors.length,terminalErrors=terminalResult.errors.length'),'Plan check must separate structural and terminal error categories');
assert.ok(html.includes('const structureWarnings=result.warnings.length,terminalWarnings=terminalResult.warnings.length'),'Plan check must separate review warning categories');
assert.ok(html.includes("invalidWires+' ungültige Leitungszuordnungen, '+pendingWires+' offene Leitungszuordnungen"),'Plan check must display invalid and missing wire assignments separately');
assert.ok(html.includes("summary.setAttribute('role','status')"),'Plan check summary must be accessible');
assert.ok(html.includes('Hinweise – keine elektrische Freigabe.'),'Plan check summary must explicitly deny electrical approval');

assert.ok(html.includes('src="V134-source-records.js"'),'Integrated UI must load provenance validation');
for(const id of ['docRevision','sourceReviewer','sourceDate'])assert.ok(html.includes('id="'+id+'"'),'Source dossier input missing: '+id);
assert.ok(html.includes('ElektroPlanV134?.createReference(dossierInput)'),'Source dossiers must be validated before saving');
assert.ok(html.includes('NICHT fachlich verifiziert'),'Source dossier must never imply manufacturer approval');

assert.ok(html.includes('src="V133-safe-matching.js"'),'Integrated photo workflow must load conservative matching');
assert.ok(html.includes('id="photoMatchLibrary"'),'Camera must offer library matching');
assert.ok(html.includes('id="photoMatches"'),'Camera must display matching results');
assert.ok(html.includes('ElektroPlanV133.search({brand,model},data.parts)'),'Camera must use safe manufacturer/model matching');
assert.ok(html.includes("result.category==='exact-text-match'"),'Only exact text matches may offer library navigation');
assert.ok(html.includes('KEINE Anschlussfreigabe'),'Photo matching must not imply wiring approval');

assert.ok(html.includes('function insertLibraryPart(p)'),'Library and camera must share a schematic insertion workflow');
assert.ok(html.includes('sourceRecord:sourceSnapshot(p)'),'Inserted schematic symbols must retain source evidence');
assert.ok(html.includes('current.sourceRecord=sourceSnapshot(p)'),'Applying library details must update provenance');
assert.ok(html.includes('Passendes Symbol in Schaltplan einfügen (ungeprüft)'),'Exact camera match must offer unverified schematic insertion');
assert.ok(html.includes(".category!=='exact-text-match'"),'Camera match must be rechecked before schematic insertion');

assert.ok(html.includes('src="../src/image-text-recognition.js"'),'Integrated camera must load optional OCR module');
assert.ok(fs.existsSync('src/image-text-recognition.js'),'OCR module must exist');
assert.ok(html.includes('id="photoReadText"'),'Camera must offer image-text extraction');
assert.ok(html.includes("ElektroPlanImageText.readImageText(preview,window)"),'OCR must use the guarded recognition module');
assert.ok(html.includes("preview.src!==original"),'OCR must discard stale image results');
assert.ok(html.includes('Keine Anschlussfreigabe.'),'OCR output must not authorize terminal assignments');

assert.ok(html.includes('Hersteller aus erkanntem Text auswählen'),'OCR must let the user explicitly choose manufacturer text');
assert.ok(html.includes('Modell / Artikelnummer aus erkanntem Text auswählen'),'OCR must let the user explicitly choose model text');
assert.ok(html.includes('Auswahl übernehmen (manuell bestätigen)'),'OCR suggestions require user action');
assert.ok(html.includes("if(preview.src!==original)return msg("),'OCR selections must reject a changed photo');
assert.ok(html.includes("if(brandChoice.value===''||modelChoice.value==='')"),'OCR must not auto-fill unspecified manufacturer/model');

assert.ok(html.includes('function appendSourceDetails(container,part)'),'Camera and library must share source dossier display');
assert.ok(html.includes('appendSourceDetails(box,result.item)'),'Photo matches must expose their source dossier');
assert.ok(html.includes('appendSourceDetails(li,p)'),'Library records must expose their source dossier');
assert.ok(html.includes('Quellenstatus: manuell eingetragen, NICHT herstellerverifiziert'),'Source must not be labelled manufacturer verified');
assert.ok(html.includes("ElektroPlanV134?.validHttps(part.docUrl)"),'Document links in source dossier must pass HTTPS validation');

assert.ok(html.includes('id="partNumber"'),'Component library must capture article number separately from model');
assert.ok(html.includes("partNumber:safe($('partNumber').value)"),'Article number must be saved in library records');

assert.ok(html.includes('id="photoPartNumber"'),'Camera must capture article number separately');
assert.ok(html.includes("if(!result.item.partNumber||!safe($('photoPartNumber').value))"),'Camera insertion must reject missing article numbers');
assert.ok(html.includes("if(safe($('photoPartNumber').value)!==result.item.partNumber)"),'Camera insertion must reject article-number mismatch');
assert.ok(html.includes("$('partNumber').value=safe($('photoPartNumber').value)"),'Camera must transfer article number to library form');

assert.ok(html.includes('id="findManufacturerDocument"'),'Library must offer datasheet discovery');
assert.ok(html.includes("encodeURIComponent(query)"),'Manufacturer datasheet search must URL-encode exact identity');
assert.ok(html.includes('Ergebnisse sind nicht automatisch als Herstellerquellen bestätigt'),'Search results must not imply verified manufacturer source');
