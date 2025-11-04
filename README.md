# n8n-nodes-chatsuru

Node comunitário do n8n para integração com a API Chatsuru (Blubots).

[![npm version](https://badge.fury.io/js/n8n-nodes-chatsuru.svg)](https://www.npmjs.com/package/n8n-nodes-chatsuru)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Nodes Disponíveis](#nodes-disponíveis)
  - [Chatsuru](#chatsuru)
  - [Chatsuru Product](#chatsuru-product)
- [Operações](#operações)
- [Exemplos de Uso](#exemplos-de-uso)
- [Desenvolvimento](#desenvolvimento)
- [Suporte](#suporte)
- [Licença](#licença)

## Instalação

### Via n8n Community Nodes

1. Acesse sua instância do n8n
2. Vá em **Settings** > **Community Nodes**
3. Clique em **Install**
4. Digite `n8n-nodes-chatsuru`
5. Clique em **Install**

### Via npm

```bash
npm install n8n-nodes-chatsuru
```

### Instalação Manual

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/n8n-nodes-chatsuru.git
cd n8n-nodes-chatsuru
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

4. Link o pacote localmente:
```bash
npm link
```

5. Na pasta do n8n, execute:
```bash
npm link n8n-nodes-chatsuru
```

## Configuração

### Credenciais da API Chatsuru

Antes de usar os nodes, você precisa configurar as credenciais da API Chatsuru:

1. No n8n, vá em **Credentials** > **New**
2. Procure por **Chatsuru API**
3. Insira seu **Token** de autenticação
4. Clique em **Save**

> **Nota:** Para obter seu token de autenticação, acesse a plataforma Chatsuru/Blubots e vá nas configurações da sua conta.

## Nodes Disponíveis

### Chatsuru

Node principal para interagir com mensagens e canais da plataforma Chatsuru.

**Ícone:** ![Chatsuru Icon](nodes/Chatsuru/chatsuru.svg)

#### Operações Disponíveis:

1. **Enviar Mensagem** - Envia mensagens de texto para contatos
2. **Enviar Arquivo** - Envia arquivos para contatos
3. **Listar Canais** - Lista todos os canais disponíveis

### Chatsuru Product

Node especializado para gerenciar produtos do e-commerce integrado ao Chatsuru.

**Ícone:** ![Chatsuru Icon](nodes/Chatsuru/chatsuru.svg)

#### Operações Disponíveis:

1. **Create** - Cria um novo produto
2. **Get** - Busca um produto específico por ID
3. **Get All** - Lista todos os produtos
4. **Update** - Atualiza um produto existente

## Operações

### Node: Chatsuru

#### 1. Enviar Mensagem

Envia uma mensagem de texto para um contato.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `message` | string | Sim | Texto da mensagem a ser enviada |
| `phone` | string | Não | Número de telefone do destinatário |
| `help_desk_id` | string | Não | ID do ticket no help desk |
| `name` | string | Não | Nome do contato |
| `close_session` | boolean | Não | Encerra a sessão após enviar a mensagem |
| `channel_id` | string | Não | ID do canal para envio |
| `status` | options | Não | Status da conversa: `bot`, `closed` ou `waiting` |
| `buttons` | json | Não | Array JSON com botões interativos |

**Exemplo de Botões:**
```json
[
  {
    "title": "Opção 1",
    "payload": "opcao_1"
  },
  {
    "title": "Opção 2",
    "payload": "opcao_2"
  }
]
```

**Endpoint:** `POST https://blubots.com/api/v1/send/message/`

---

#### 2. Enviar Arquivo

Envia um arquivo para um contato.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `file` | string | Sim | Nome do campo binário contendo o arquivo |
| `file_message` | string | Não | Mensagem de texto que acompanha o arquivo |
| `file_phone` | string | Não | Número de telefone do destinatário |
| `file_name` | string | Não | Nome do contato |
| `file_close_session` | boolean | Não | Encerra a sessão após enviar o arquivo |

**Endpoint:** `POST https://blubots.com/api/v1/send/file/`

---

#### 3. Listar Canais

Lista todos os canais disponíveis na conta.

**Parâmetros:** Nenhum

**Endpoint:** `GET https://blubots.com/api/v1/channels/`

---

### Node: Chatsuru Product

#### 1. Create (Criar Produto)

Cria um novo produto no catálogo.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `name` | string | Sim | Nome do produto |
| `code` | string | Sim | Código único do produto |
| `category` | options | Sim | Categoria do produto (carregada dinamicamente) |
| `description` | string | Não | Descrição completa do produto |
| `short_description` | string | Não | Descrição curta do produto |
| `status` | boolean | Não | Status do produto (ativo/inativo) |
| `organization` | number | Não | ID da organização |
| `storeDetails` | collection | Não | Detalhes do produto por loja |

**Store Details:**

Cada entrada de loja pode conter:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `store` | options | ID da loja (carregada dinamicamente) |
| `price` | number | Preço do produto nesta loja |
| `stock` | number | Quantidade em estoque |
| `is_active` | boolean | Se o produto está ativo nesta loja |

**Endpoint:** `POST https://blubots.com/api/v2/ecommerce/products/`

---

#### 2. Get (Buscar Produto)

Busca um produto específico por ID.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `productId` | string | Sim | ID do produto |

**Endpoint:** `GET https://blubots.com/api/v2/ecommerce/products/{productId}`

---

#### 3. Get All (Listar Produtos)

Lista todos os produtos do catálogo.

**Parâmetros:** Nenhum

**Endpoint:** `GET https://blubots.com/api/v2/ecommerce/products/`

---

#### 4. Update (Atualizar Produto)

Atualiza um produto existente.

**Parâmetros:**

Mesmos parâmetros do **Create**, com adição de:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `productId` | string | Sim | ID do produto a ser atualizado |

**Endpoint:** `PUT https://blubots.com/api/v2/ecommerce/products/{productId}/`

---

## Exemplos de Uso

### Exemplo 1: Enviar mensagem simples

```
1. Adicione o node "Chatsuru"
2. Selecione a operação "Enviar Mensagem"
3. Configure:
   - Mensagem: "Olá! Como posso ajudar?"
   - Telefone: "5511999999999"
   - Status: "bot"
4. Execute o workflow
```

### Exemplo 2: Enviar mensagem com botões

```
1. Adicione o node "Chatsuru"
2. Selecione a operação "Enviar Mensagem"
3. Configure:
   - Mensagem: "Escolha uma opção:"
   - Telefone: "5511999999999"
   - Botões:
     [
       {"title": "Suporte", "payload": "suporte"},
       {"title": "Vendas", "payload": "vendas"}
     ]
4. Execute o workflow
```

### Exemplo 3: Criar produto com detalhes de loja

```
1. Adicione o node "Chatsuru Product"
2. Selecione a operação "Create"
3. Configure:
   - Name: "Produto Exemplo"
   - Code: "PROD-001"
   - Category: Selecione da lista
   - Description: "Descrição do produto"
   - Store Details:
     - Store: Selecione da lista
     - Price: 99.90
     - Stock: 100
     - Is Active: true
4. Execute o workflow
```

### Exemplo 4: Workflow completo - Atualizar estoque de produtos

```
1. HTTP Request Node: Recebe webhook de atualização de estoque
2. Chatsuru Product Node (Get): Busca produto pelo ID
3. Chatsuru Product Node (Update): Atualiza quantidade em estoque
4. Chatsuru Node: Envia notificação de confirmação
```

## Desenvolvimento

### Estrutura do Projeto

```
n8n-nodes-chatsuru/
├── credentials/
│   └── ChatsuruApi.credentials.ts    # Configuração de credenciais
├── nodes/
│   └── Chatsuru/
│       ├── Chatsuru.node.ts          # Node principal
│       ├── ChatsuruProduct.node.ts   # Node de produtos
│       └── chatsuru.svg              # Ícone dos nodes
├── gulpfile.js                       # Build configuration
├── package.json                      # Package metadata
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Este arquivo
```

### Scripts Disponíveis

```bash
# Limpar diretório de build
npm run clean

# Copiar assets (ícones, imagens)
npm run copy:assets

# Compilar TypeScript e copiar assets
npm run build

# Executado automaticamente antes de publicar
npm run prepublish
```

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Testando Localmente

1. Clone o repositório
2. Execute `npm install`
3. Execute `npm run build`
4. Link o pacote: `npm link`
5. No diretório do n8n: `npm link n8n-nodes-chatsuru`
6. Reinicie o n8n

## API Reference

### Base URLs

- **Mensagens e Canais:** `https://blubots.com/api/v1/`
- **Produtos:** `https://blubots.com/api/v2/ecommerce/`

### Autenticação

Todas as requisições requerem autenticação via Token:

```
Authorization: Token YOUR_TOKEN_HERE
```

### Documentação Oficial

Para mais informações sobre a API Chatsuru, consulte: [https://docs.chatsuru.com](https://docs.chatsuru.com)

## Troubleshooting

### Erro: "Token inválido"
- Verifique se o token foi inserido corretamente nas credenciais
- Confirme se o token ainda está ativo na plataforma Chatsuru

### Erro: "O campo 'file' não contém dados binários"
- Certifique-se de que há um node anterior fornecendo dados binários
- Verifique se o nome do campo binário está correto

### Erro ao enviar botões
- Verifique se o JSON dos botões está válido
- Use um validador JSON online para confirmar a sintaxe

### Categorias/Lojas não carregam
- Verifique sua conexão com a internet
- Confirme se o token tem permissões adequadas
- Tente recarregar as credenciais

## Changelog

### v1.2.9
- Correção no envio de arquivos com FormData
- Melhorias na documentação

### v1.2.x
- Adição de suporte a envio de arquivos
- Implementação do node de produtos
- Suporte a operações CRUD de produtos

### v1.0.0
- Versão inicial
- Suporte a envio de mensagens
- Suporte a listagem de canais

## Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/n8n-nodes-chatsuru/issues)
- **Documentação n8n:** [https://docs.n8n.io](https://docs.n8n.io)
- **Documentação Chatsuru:** [https://docs.chatsuru.com](https://docs.chatsuru.com)

## Autor

**Jean Jr Dev**

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Keywords:** n8n, chatsuru, tsuru, blubots, whatsapp, chatbot, automation, workflow, ecommerce

## Links Relacionados

- [n8n.io](https://n8n.io)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Chatsuru](https://chatsuru.com)
