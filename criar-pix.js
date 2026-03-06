export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Método não permitido" })
}

const API_KEY = "a5yjm8a9dizg9aziqinqn8cdjq37jrnsdyihrhj0xc87d35k5gus6kv1rxfwtb02"

try {

const valor = req.body?.valor

if(!valor){
return res.status(400).json({ error:"valor não enviado"})
}

const resposta = await fetch("https://app.sigilopay.com.br/api/pix", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${API_KEY}`
},

body: JSON.stringify({
amount: valor
})

})

const data = await resposta.json()

console.log("Resposta da API:", data)

return res.status(200).json(data)

} catch (erro) {

console.error("Erro interno:", erro)

return res.status(500).json({
erro:"Erro ao gerar pix",
detalhe: erro.message
})

}

}