const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para processar JSON e habilitar CORS
app.use(express.json());
app.use(cors());

// Servir o arquivo index.html no diretório raiz
app.use(express.static(__dirname));

// Se não houver a variável no arquivo .env local, usa a chave direta
const API_KEY = process.env.SIGILOPAY_API_KEY || "a5yjm8a9dizg9aziqinqn8cdjq37jrnsdyihrhj0xc87d35k5gus6kv1rxfwtb02";

// Simulando a Rota do Vercel (/api/criar-pix)
app.post('/api/criar-pix', async (req, res) => {
    try {
        const valor = req.body?.valor;

        if (!valor || isNaN(valor) || valor <= 0) {
            return res.status(400).json({ error: "Valor inválido ou não enviado" });
        }

        console.log(`[LOCAL SERVER] Iniciando geração de PIX no valor de R$ ${valor}`);

        // Usando o fetch nativo do Node 18+ com rota e autenticação corretas para a v1
        const resposta = await fetch("https://app.sigilopay.com.br/api/v1/pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-public-key": "felipefcdearaujo_s6g6psz26aqsfpyf",
                "x-secret-key": API_KEY, // A chave lida das variáveis de ambiente
                "Accept": "application/json"
            },
            body: JSON.stringify({
                amount: valor,
                name: "Cliente PIX Local",
                document: "00000000000"
            })
        });

        // Tratamento bruto da resposta:
        const responseText = await resposta.text();
        console.log("[LOCAL SERVER] Resposta bruta da SigiloPay:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("[LOCAL SERVER] Falha ao tentar ler a resposta como JSON. A resposta foi:", responseText);
            return res.status(resposta.status || 500).json({
                error: "A integração com a SigiloPay não retornou um JSON válido.",
                detalhe_bruto: responseText
            });
        }

        if (!resposta.ok) {
            return res.status(resposta.status).json({
                error: "Erro configurado pela API de pagamento",
                detalhes: data
            });
        }

        return res.status(200).json(data);

    } catch (erro) {
        console.error("[LOCAL SERVER] Erro interno:", erro);
        return res.status(500).json({
            error: "Erro conectando com a API",
            mensagem: erro.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`\n========================================================`);
    console.log(`🚀 SERVIDOR LOCAL RODANDO COM SUCESSO!`);
    console.log(`👉 Acesse no seu navegador: http://localhost:${PORT}`);
    console.log(`========================================================\n`);
});
