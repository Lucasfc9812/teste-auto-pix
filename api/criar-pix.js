export default async function handler(req, res) {

const API_KEY = "a5yjm8a9dizg9aziqinqn8cdjq37jrnsdyihrhj0xc87d35k5gus6kv1rxfwtb02"

try{

const response = await fetch("https://app.sigilopay.com.br/api/pix",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + API_KEY
},

body: JSON.stringify({
amount: req.body.valor
})

})

const data = await response.json()

res.status(200).json(data)

}catch(error){

res.status(500).json({erro:"erro ao gerar pix"})

}

}