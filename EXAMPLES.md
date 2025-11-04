# Exemplos de Uso - n8n-nodes-chatsuru

Este documento contém exemplos práticos e detalhados de como usar os nodes do Chatsuru em seus workflows do n8n.

## Índice

- [Exemplos Básicos](#exemplos-básicos)
- [Exemplos Avançados](#exemplos-avançados)
- [Casos de Uso Reais](#casos-de-uso-reais)
- [Integração com Outros Nodes](#integração-com-outros-nodes)

## Exemplos Básicos

### 1. Enviar Mensagem Simples

Workflow para enviar uma mensagem de boas-vindas quando um novo cliente se cadastra.

```
[Webhook] → [Chatsuru: Enviar Mensagem]
```

**Configuração do Chatsuru Node:**
- Operação: `Enviar Mensagem`
- Mensagem: `Olá! Bem-vindo(a) à nossa plataforma. Como posso ajudar você hoje?`
- Telefone: `{{$json["phone"]}}`
- Status: `bot`

---

### 2. Enviar Mensagem com Botões

Workflow para apresentar opções ao cliente.

```
[Schedule Trigger] → [Chatsuru: Enviar Mensagem]
```

**Configuração do Chatsuru Node:**
- Operação: `Enviar Mensagem`
- Mensagem: `Como você prefere ser atendido?`
- Telefone: `5511999999999`
- Botões:
```json
[
  {
    "title": "🤖 Atendimento Automático",
    "payload": "bot_service"
  },
  {
    "title": "👤 Falar com Humano",
    "payload": "human_service"
  },
  {
    "title": "📞 Agendar Ligação",
    "payload": "schedule_call"
  }
]
```

---

### 3. Listar Canais Disponíveis

Workflow para obter e armazenar informações sobre canais ativos.

```
[Cron] → [Chatsuru: Listar Canais] → [Google Sheets]
```

**Configuração do Chatsuru Node:**
- Operação: `Listar Canais`

**Configuração do Google Sheets:**
- Operação: `Append`
- Dados: `{{$json}}`

---

### 4. Enviar Arquivo

Workflow para enviar um PDF com informações do produto.

```
[HTTP Request] → [Chatsuru: Enviar Arquivo]
```

**Configuração do HTTP Request:**
- Method: `GET`
- URL: `https://example.com/catalogo.pdf`
- Response Format: `File`

**Configuração do Chatsuru Node:**
- Operação: `Enviar Arquivo`
- Arquivo: `data` (campo binário do node anterior)
- Mensagem: `Aqui está nosso catálogo de produtos 📄`
- Telefone: `{{$json["phone"]}}`

---

## Exemplos Avançados

### 5. Sistema de Atendimento com Status

Workflow completo que gerencia o status da conversa baseado na interação do usuário.

```
[Webhook] → [Switch] → [Chatsuru: Enviar Mensagem]
                     → [Chatsuru: Enviar Mensagem]
                     → [Chatsuru: Enviar Mensagem]
```

**Configuração do Switch:**
```javascript
// Switch baseado no tipo de mensagem recebida
if ($json.message_type === "greeting") {
  return 0; // Bot responde
} else if ($json.message_type === "complex_question") {
  return 1; // Transfere para humano
} else {
  return 2; // Fecha sessão
}
```

**Output 0 - Bot responde:**
- Mensagem: `Olá! Sou o assistente virtual. Como posso ajudar?`
- Status: `bot`

**Output 1 - Transfere para humano:**
- Mensagem: `Vou transferir você para um de nossos especialistas.`
- Status: `waiting`

**Output 2 - Encerra:**
- Mensagem: `Obrigado pelo contato! Até logo!`
- Close Session: `true`

---

### 6. Criar e Atualizar Produto Automaticamente

Workflow que cria produtos a partir de uma planilha e atualiza estoque periodicamente.

```
[Google Sheets] → [IF: Produto Existe?] → [Chatsuru Product: Create]
                                        → [Chatsuru Product: Update]
```

**Configuração do IF Node:**
```javascript
return $json.product_id !== null && $json.product_id !== "";
```

**True Branch - Update:**
- Operation: `Update`
- Product ID: `{{$json["product_id"]}}`
- Name: `{{$json["name"]}}`
- Code: `{{$json["code"]}}`
- Category: `{{$json["category_id"]}}`
- Store Details:
  - Store: `{{$json["store_id"]}}`
  - Price: `{{$json["price"]}}`
  - Stock: `{{$json["stock"]}}`
  - Is Active: `true`

**False Branch - Create:**
- Operation: `Create`
- Name: `{{$json["name"]}}`
- Code: `{{$json["code"]}}`
- Category: `{{$json["category_id"]}}`
- Description: `{{$json["description"]}}`
- Short Description: `{{$json["short_description"]}}`
- Store Details:
  - Store: `{{$json["store_id"]}}`
  - Price: `{{$json["price"]}}`
  - Stock: `100`
  - Is Active: `true`

---

### 7. Notificação de Estoque Baixo

Workflow que monitora estoque e notifica quando estiver baixo.

```
[Cron: A cada 6h] → [Chatsuru Product: Get All] → [Filter] → [Chatsuru: Enviar Mensagem]
```

**Configuração do Filter Node:**
```javascript
// Filtra produtos com estoque abaixo de 10 unidades
return $json.product_stores.some(store => store.stock < 10);
```

**Configuração do Chatsuru Node:**
```javascript
// Mensagem dinâmica com detalhes do produto
const product = $json;
const lowStockStores = product.product_stores.filter(s => s.stock < 10);

return {
  message: `⚠️ ALERTA DE ESTOQUE BAIXO

Produto: ${product.name}
Código: ${product.code}

Lojas com estoque baixo:
${lowStockStores.map(s => `- ${s.store_name}: ${s.stock} unidades`).join('\n')}

Por favor, providenciar reposição.`,
  phone: "5511999999999", // Telefone do gestor
  status: "bot"
};
```

---

## Casos de Uso Reais

### 8. Sistema de Pedidos via WhatsApp

Workflow completo para processar pedidos recebidos via WhatsApp.

```
[Webhook: Recebe mensagem]
    → [Code: Parse pedido]
    → [Chatsuru Product: Get] (para cada item)
    → [Code: Calcular total]
    → [HTTP: Salvar no sistema]
    → [Chatsuru: Confirmar pedido]
```

**Webhook Configuration:**
Recebe webhooks do Chatsuru quando cliente envia mensagem.

**Code Node - Parse Pedido:**
```javascript
// Exemplo: "Quero 2x PROD-001 e 1x PROD-002"
const message = $input.item.json.message;
const regex = /(\d+)x?\s*([A-Z0-9-]+)/gi;
const items = [];
let match;

while ((match = regex.exec(message)) !== null) {
  items.push({
    quantity: parseInt(match[1]),
    code: match[2]
  });
}

return items.map(item => ({ json: item }));
```

**Loop sobre cada item:**
Para cada item, busca o produto e calcula subtotal.

**Code Node - Calcular Total:**
```javascript
const items = $input.all();
const total = items.reduce((sum, item) => {
  return sum + (item.json.price * item.json.quantity);
}, 0);

return {
  json: {
    items: items.map(i => i.json),
    total: total,
    customer_phone: $node["Webhook"].json["phone"]
  }
};
```

**Chatsuru - Confirmar Pedido:**
```javascript
const order = $json;
const itemsList = order.items.map(item =>
  `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
).join('\n');

return {
  message: `✅ Pedido confirmado!

Itens:
${itemsList}

Total: R$ ${order.total.toFixed(2)}

Seu pedido será processado em breve.`,
  phone: order.customer_phone,
  buttons: [
    { title: "Rastrear Pedido", payload: "track_order" },
    { title: "Fazer Outro Pedido", payload: "new_order" },
    { title: "Cancelar", payload: "cancel_order" }
  ]
};
```

---

### 9. Bot de Atendimento com IA

Workflow que usa IA para responder perguntas e escalar para humano quando necessário.

```
[Webhook: Mensagem recebida]
    → [OpenAI: Analisar intenção]
    → [IF: Consegue responder?]
        → Yes: [OpenAI: Gerar resposta] → [Chatsuru: Enviar]
        → No: [Chatsuru: Transferir para humano]
```

**OpenAI - Analisar Intenção:**
```
Prompt: Analise a seguinte mensagem do cliente e classifique a intenção:
"{{$json["message"]}}"

Responda apenas com:
- "simple" se for uma pergunta simples que você pode responder
- "complex" se precisar de atendimento humano
- "sales" se for relacionado a vendas
```

**IF Node:**
```javascript
return $json.choices[0].message.content.trim() === "simple";
```

**OpenAI - Gerar Resposta (True):**
```
Prompt: Você é um assistente de atendimento ao cliente.
Responda a seguinte pergunta de forma clara e objetiva:
"{{$json["message"]}}"
```

**Chatsuru - Transferir (False):**
- Mensagem: `Vou transferir você para um de nossos especialistas que poderá ajudar melhor com sua solicitação.`
- Status: `waiting`

---

### 10. Campanha de Marketing Automatizada

Workflow para enviar campanhas segmentadas com tracking de resultados.

```
[Google Sheets: Lista de contatos]
    → [Filter: Clientes ativos]
    → [Chatsuru: Enviar mensagem personalizada]
    → [Wait]
    → [Google Sheets: Atualizar status]
```

**Filter - Clientes Ativos:**
```javascript
return $json.status === "active" && $json.opted_in === true;
```

**Chatsuru - Mensagem Personalizada:**
```javascript
const customer = $json;

return {
  message: `Olá ${customer.name}!

🎉 Temos uma oferta especial para você!

${customer.favorite_category === "electronics"
  ? "Eletrônicos com até 30% OFF"
  : "Confira nossas novidades"}

Clique no link para ver: https://loja.com/ofertas/${customer.id}`,
  phone: customer.phone,
  buttons: [
    { title: "Ver Ofertas", payload: `offers_${customer.id}` },
    { title: "Não Tenho Interesse", payload: "opt_out" }
  ]
};
```

**Wait Node:**
- Amount: `2`
- Unit: `seconds`

**Google Sheets - Atualizar:**
- Operação: `Update`
- Atualizar campo `campaign_sent` para `true`
- Atualizar campo `sent_date` para `{{$now.format("YYYY-MM-DD HH:mm:ss")}}`

---

## Integração com Outros Nodes

### 11. Integração com CRM (Exemplo com HubSpot)

```
[Chatsuru Webhook: Nova mensagem]
    → [HubSpot: Buscar contato]
    → [IF: Contato existe?]
        → Yes: [HubSpot: Atualizar contato]
        → No: [HubSpot: Criar contato]
    → [HubSpot: Criar ticket]
    → [Chatsuru: Responder]
```

---

### 12. Integração com Banco de Dados

```
[Chatsuru Product: Get All]
    → [Code: Formatar dados]
    → [MySQL: Insert/Update]
    → [Slack: Notificar equipe]
```

**Code - Formatar Dados:**
```javascript
return $input.all().map(item => {
  const product = item.json;
  return {
    json: {
      product_id: product.id,
      name: product.name,
      code: product.code,
      category: product.category,
      total_stock: product.product_stores.reduce((sum, s) => sum + s.stock, 0),
      updated_at: new Date().toISOString()
    }
  };
});
```

---

### 13. Integração com Sistema de Pagamento

```
[Webhook: Pagamento aprovado]
    → [Chatsuru: Notificar cliente]
    → [Chatsuru Product: Update] (atualizar estoque)
    → [Chatsuru: Enviar arquivo] (envio de nota fiscal)
```

---

## Dicas e Boas Práticas

### Tratamento de Erros

Sempre use o node **Error Trigger** para capturar e tratar erros:

```
[Workflow principal]
    ↓ (em caso de erro)
[Error Trigger]
    → [Code: Formatar erro]
    → [Chatsuru: Notificar admin]
    → [Google Sheets: Log de erros]
```

### Rate Limiting

Para evitar sobrecarga da API, use o node **Wait** entre requisições:

```
[Loop sobre contatos]
    → [Chatsuru: Enviar mensagem]
    → [Wait: 1 segundo]
    → [Próxima iteração]
```

### Validação de Dados

Sempre valide dados antes de enviar para a API:

```javascript
// Validar telefone
const phone = $json.phone;
if (!phone || !/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
  throw new Error(`Telefone inválido: ${phone}`);
}

// Validar mensagem não vazia
const message = $json.message;
if (!message || message.trim() === '') {
  throw new Error('Mensagem não pode estar vazia');
}

return { json: { phone, message } };
```

### Personalização de Mensagens

Use templates para mensagens mais dinâmicas:

```javascript
const templates = {
  welcome: (name) => `Olá ${name}! Bem-vindo(a) à nossa plataforma! 🎉`,
  order_confirmed: (orderNumber, total) =>
    `Pedido #${orderNumber} confirmado! Total: R$ ${total.toFixed(2)} ✅`,
  shipping: (trackingCode) =>
    `Seu pedido foi enviado! Código de rastreio: ${trackingCode} 📦`
};

return {
  json: {
    message: templates[$json.template_type](...$json.params),
    phone: $json.phone
  }
};
```

---

## Recursos Adicionais

- [Documentação n8n](https://docs.n8n.io)
- [Comunidade n8n](https://community.n8n.io)
- [Templates de Workflow](https://n8n.io/workflows)
- [API Chatsuru](https://docs.chatsuru.com)

---

Estes exemplos são pontos de partida. Sinta-se livre para adaptá-los às suas necessidades específicas!
