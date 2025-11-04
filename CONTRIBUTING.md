# Guia de Contribuição

Obrigado por considerar contribuir para o n8n-nodes-chatsuru! Este documento fornece diretrizes para contribuir com o projeto.

## Código de Conduta

Este projeto adere aos princípios de respeito mútuo e colaboração. Esperamos que todos os contribuidores:

- Sejam respeitosos e profissionais
- Aceitem críticas construtivas
- Foquem no que é melhor para a comunidade
- Demonstrem empatia com outros membros da comunidade

## Como Posso Contribuir?

### Reportando Bugs

Antes de criar um bug report, verifique se o problema já não foi reportado. Ao criar um bug report, inclua o máximo de detalhes possível:

**Template de Bug Report:**

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do bug.

**Como Reproduzir**
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara do que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar o problema.

**Ambiente:**
 - Versão do n8n: [ex: 1.0.0]
 - Versão do Node.js: [ex: 18.0.0]
 - Sistema Operacional: [ex: Ubuntu 22.04]
 - Versão do n8n-nodes-chatsuru: [ex: 1.2.9]

**Informações Adicionais**
Qualquer outra informação sobre o problema.
```

### Sugerindo Melhorias

Sugestões de melhorias são sempre bem-vindas! Ao sugerir uma melhoria:

1. Use um título claro e descritivo
2. Forneça uma descrição detalhada da melhoria sugerida
3. Explique por que esta melhoria seria útil
4. Liste exemplos de como a funcionalidade seria usada

### Pull Requests

#### Processo de Pull Request

1. **Fork o repositório** e crie sua branch a partir da `main`
2. **Faça suas alterações** seguindo o guia de estilo
3. **Teste suas alterações** localmente
4. **Atualize a documentação** se necessário
5. **Commit suas mudanças** com mensagens claras
6. **Push para sua branch**
7. **Abra um Pull Request**

#### Checklist de Pull Request

Antes de submeter um PR, certifique-se de que:

- [ ] O código segue o estilo do projeto
- [ ] Você fez as alterações necessárias na documentação
- [ ] Suas mudanças não geram novos warnings
- [ ] Você adicionou testes que provam que seu fix é efetivo ou que sua feature funciona
- [ ] Testes novos e existentes passam localmente
- [ ] Commits seguem o padrão de mensagens do projeto

#### Padrão de Mensagens de Commit

Usamos mensagens de commit semânticas. Exemplos:

```
feat: adiciona suporte para envio de vídeos
fix: corrige erro ao enviar arquivos grandes
docs: atualiza README com novos exemplos
style: formata código segundo padrão
refactor: reorganiza estrutura de operações
test: adiciona testes para operação de update
chore: atualiza dependências
```

Tipos de commit:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto e vírgula faltando, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Atualizações de build, dependências, etc

## Guia de Estilo

### TypeScript

- Use TypeScript para todo o código
- Siga as convenções do n8n para nodes
- Use tipos explícitos sempre que possível
- Prefira `const` ao invés de `let` quando a variável não será reatribuída

### Nomenclatura

- **Variáveis e funções:** camelCase
  ```typescript
  const userName = "João";
  function sendMessage() {}
  ```

- **Classes e interfaces:** PascalCase
  ```typescript
  class ChatsuruApi {}
  interface INodeData {}
  ```

- **Constantes:** UPPER_SNAKE_CASE
  ```typescript
  const API_BASE_URL = "https://blubots.com/api/v1/";
  ```

### Formatação

- Indentação: 2 espaços
- Aspas: Duplas para strings
- Ponto e vírgula: Obrigatório
- Quebra de linha: Unix (LF)

### Comentários

- Use comentários para explicar "por quê", não "o quê"
- Mantenha comentários atualizados com o código
- Use JSDoc para documentar funções públicas

```typescript
/**
 * Envia uma mensagem via API Chatsuru
 * @param message - Texto da mensagem
 * @param phone - Número de telefone do destinatário
 * @returns Promise com a resposta da API
 */
async function sendMessage(message: string, phone: string): Promise<ApiResponse> {
  // Implementação
}
```

## Estrutura de Desenvolvimento

### Configurando o Ambiente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/n8n-nodes-chatsuru.git
   cd n8n-nodes-chatsuru
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o TypeScript:**
   O projeto já vem com `tsconfig.json` configurado

### Desenvolvendo um Node

#### Estrutura Básica de um Node

```typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class MeuNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Meu Node',
    name: 'meuNode',
    group: ['transform'],
    version: 1,
    description: 'Descrição do node',
    defaults: {
      name: 'Meu Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'chatsuruApi',
        required: true,
      },
    ],
    properties: [
      // Propriedades do node
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Implementação
    return [[]];
  }
}
```

#### Adicionando uma Nova Operação

1. Adicione a operação no array de `options`:
```typescript
{
  displayName: 'Operação',
  name: 'operation',
  type: 'options',
  options: [
    {
      name: 'Minha Nova Operação',
      value: 'minhaOperacao',
    },
  ],
}
```

2. Adicione os parâmetros da operação:
```typescript
{
  displayName: 'Meu Parâmetro',
  name: 'meuParametro',
  type: 'string',
  displayOptions: {
    show: {
      operation: ['minhaOperacao'],
    },
  },
  default: '',
}
```

3. Implemente a lógica no método `execute`:
```typescript
if (operation === 'minhaOperacao') {
  const meuParametro = this.getNodeParameter('meuParametro', i);
  // Lógica da operação
}
```

### Testando

#### Teste Manual

1. **Build o projeto:**
   ```bash
   npm run build
   ```

2. **Link localmente:**
   ```bash
   npm link
   ```

3. **No diretório do n8n:**
   ```bash
   npm link n8n-nodes-chatsuru
   ```

4. **Reinicie o n8n e teste**

#### Teste de API

Use ferramentas como Postman ou curl para testar endpoints:

```bash
curl -X POST https://blubots.com/api/v1/send/message/ \
  -H "Authorization: Token SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Teste", "phone": "5511999999999"}'
```

### Build e Deploy

1. **Build:**
   ```bash
   npm run build
   ```

2. **Verificar arquivos gerados:**
   ```bash
   ls -la dist/
   ```

3. **Publicar (apenas mantenedores):**
   ```bash
   npm version patch  # ou minor, major
   npm publish
   ```

## Recursos Adicionais

### Documentação Útil

- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Chatsuru API Docs](https://docs.chatsuru.com)

### Exemplos de Nodes

Estude outros nodes comunitários para referência:
- [n8n-nodes-telegram](https://www.npmjs.com/package/n8n-nodes-telegram)
- [n8n-nodes-discord](https://www.npmjs.com/package/n8n-nodes-discord)

### Comunidade

- [n8n Community Forum](https://community.n8n.io/)
- [n8n Discord](https://discord.gg/n8n)

## Perguntas?

Se você tiver alguma dúvida sobre como contribuir, sinta-se à vontade para:

1. Abrir uma issue no GitHub
2. Entrar em contato com os mantenedores
3. Perguntar na comunidade n8n

## Agradecimentos

Obrigado por dedicar seu tempo para contribuir! Sua ajuda é fundamental para tornar este projeto melhor para todos.

---

**Happy Coding!**
