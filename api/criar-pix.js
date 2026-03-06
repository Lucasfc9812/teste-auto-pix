export default async function handler(req, res) {

if(req.method !== "POST"){
return res.status(405).json({erro:"Método não permitido"})
}

const API_KEY = "a5yjm8a9dizg9aziqinqn8cdjq37jrnsdyihrhj0xc87d35k5gus6kv1rxfwtb02"

try{

const { valor } = req.body

const response = await fetch("https://app.sigilopay.com.br/api/pix",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + API_KEY
},

body: JSON.stringify({
amount: valor
})

})

const data = await response.json()

console.log("RESPOSTA SIGILOPAY:",data)

return res.status(200).json(data)

}catch(error){

console.error("ERRO:",error)

return res.status(500).json({
erro:"Erro ao gerar pix",
detalhe:error.message
})

}

}