// Configurações Privadas
const CONFIG = {
    API_KEY: "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",
    MODELO: "llama-3.3-70b-versatile",
    SYSTEM_PROMPT: "Você é uma IA de elite. Raciocínio lógico profundo e memória impecável."
};

// Memória do Chat
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
                temperature: 0.5
            })
        });

        const data = await response.json();
        const resposta = data.choices[0].message.content;

        historico.push({ role: "assistant", content: resposta });
        
        // Limita o histórico para não ficar pesado
        if (historico.length > 20) historico.splice(1, 2);
        localStorage.setItem('uone_chat_data', JSON.stringify(historico));

        return resposta;
    } catch (error) {
        return "Erro: " + error.message;
    }
}
