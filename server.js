import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();
const app=express(),port=process.env.PORT||3000;
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
app.use(express.json({limit:"20kb"}));
app.use(express.static(path.dirname(fileURLToPath(import.meta.url))));
app.post("/api/analyze",async(req,res)=>{
 try{
  const m=req.body?.match;
  if(!m||typeof m.story!=="string"||m.story.trim().length<15) return res.status(400).json({error:"Donne-moi plus de détails sur ton match pour que je puisse t'analyser"});
  const input={map:m.map,side:m.side,operator:m.operator,result:m.outcome,kills:m.kills,deaths:m.deaths,assists:m.assists,description:m.story};
  const response=await client.responses.create({
   model:process.env.OPENAI_MODEL||"gpt-4.1-mini",
   instructions:`Tu es Stratix, coach tactique de Rainbow Six Siege. Réponds exclusivement en français et uniquement à partir des données fournies par le joueur. Ne prétends jamais avoir vu le replay, la partie, les rounds, les timings, les calls ou des statistiques qui ne sont pas explicitement décrits. Les kills/morts/assists et résultat sont des données déclarées, pas des preuves de compétence. Si les éléments sont insuffisants, incohérents, vides ou hors sujet, réponds avec un objet JSON contenant uniquement {"error":"Donne-moi plus de détails sur ton match pour que je puisse t'analyser"}. Les notes sont des appréciations qualitatives de la seule description, pas des mesures objectives; reste prudent et évite la fausse précision. Pour les axes sans éléments suffisants, donne une note neutre prudente et explique l'incertitude dans le résumé. Ne déduis pas la communication de son absence de mention. Fournis exactement 2 points forts et 2 axes d'amélioration, formulés comme observations prudentes ou limites d'information, et un exercice concret pour le prochain match. Score global cohérent avec les quatre sous-notes. Sortie JSON stricte, sans markdown, sous la forme {"score":integer,"verdict":string,"summary":string,"metrics":{"positionnement":integer,"duels":integer,"communication":integer,"decisions":integer},"strengths":[string,string],"weaknesses":[string,string],"training":string}.`,
   input:JSON.stringify(input),
   text:{format:{type:"json_object"}}
  });
  const data=JSON.parse(response.output_text||"{}");
  if(data.error)return res.status(422).json({error:data.error});
  res.json(data);
 }catch(e){console.error("Stratix API error:",e.message);res.status(500).json({error:"Le moteur IA est momentanément indisponible. Vérifie la clé API et réessaie."})}
});
app.listen(port,()=>console.log(`Stratix disponible sur http://localhost:${port}`));
