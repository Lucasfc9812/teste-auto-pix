export default async function handler(req, res) {
    // Apenas método POST é permitido
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido. Utilize POST." });
    }

    // Chave da API SigiloPay providenciada via variável de ambiente (Segurança)
    // Se não encontrar no ambiente, usa a chave fornecida (útil para testes locais se não configurar o .env)
    const API_KEY = process.env.SIGILOPAY_API_KEY || "a5yjm8a9dizg9aziqinqn8cdjq37jrnsdyihrhj0xc87d35k5gus6kv1rxfwtb02";

    try {
        const valor = req.body?.valor;

        if (!valor || isNaN(valor) || valor <= 0) {
            return res.status(400).json({ error: "Valor inválido ou não enviado" });
        }

        console.log(`Iniciando geração de PIX no valor de ${valor}`);

        // Requisição para a API da SigiloPay
        const resposta = await fetch("https://app.sigilopay.com.br/api/pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                amount: valor,
                // Alguns gateways exigem nome e documento preenchido, mandaremos dados base por precaução.
                // Se a SigiloPay precisar, eles não irão quebrar, se não precisar, vão ignorar.
                name: "Cliente PIX",
                document: "00000000000"
            })
        });

        // Pegar a resposta em JSON
        const data = await resposta.json();
        console.log("Resposta da SigiloPay API:", data);

        if (!resposta.ok) {
            // Se a API retornou erro (ex: 400 Bad Request, 401 Unauthorized, etc)
            return res.status(resposta.status).json({
                error: "Erro na API de pagamento",
                detalhes: data
            });
        }

        // Retornar os dados gerados (QR Code e Copia e Cola) para o frontend
        return res.status(200).json(data);

    } catch (erro) {
        console.error("Erro interno no servidor:", erro);

        return res.status(500).json({
            error: "Erro processando a requisição do PIX",
            mensagem: erro.message
        });
    }
}