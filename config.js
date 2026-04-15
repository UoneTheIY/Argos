// Configurações Privadas
const CONFIG = {
    API_KEY: "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",
    MODELO: "llama-3.3-70b-versatile",
    SYSTEM_PROMPT: "Você é uma IA de elite. Responda de forma lógica, clara e compacta. Mantenha o contexto das instruções anteriores."
};

// Memória do Chat (Carrega do celular ou inicia nova)
let historico = JSON.parse(localStorage.getItem('uone_chat_data')) || [
    { role: "system", content: CONFIG.SYSTEM_PROMPT }
];

async function chamarIA(pergunta) {
    historico.push({ role: "user", content: pergunta });

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CONFIG.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: CONFIG.MODELO,
                messages: historico,
                temperature: 0.5,
                max_tokens: 2048
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const resposta = data.choices[0].message.content;
        historico.push({ role: "assistant", content: resposta });
        
        // Mantém as últimas 15 mensagens para não pesar o processamento
        if (historico.length > 15) historico.splice(1, 2);
        localStorage.setItem('uone_chat_data', JSON.stringify(historico));

        return resposta;
    } catch (error) {
        return "Erro: " + error.message;
    }
}
