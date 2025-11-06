# Documentação N8N e Chatsuru

**Sumário**

[**Introdução	1**](#introdução)

[N8N em Foco: Automação Low-Code Descentralizada	1](#n8n-em-foco:-automação-low-code-descentralizada)

[Por que N8N?	1](#por-que-n8n?)

[Chatsuru: O Motor de Engajamento Inteligente	1](#chatsuru:-o-motor-de-engajamento-inteligente)

[O Node: n8n-nodes-chatsuru	2](#o-node:-n8n-nodes-chatsuru)

[**Instalação e Configuração do Node n8n-nodes-chatsuru	2**](#instalação-e-configuração-do-node-n8n-nodes-chatsuru)

[1\. Instalação via Interface Gráfica (Nodes da Comunidade)	2](#1.-instalação-via-interface-gráfica-\(nodes-da-comunidade\))

[Processo de Instalação:	2](#processo-de-instalação:)

[2\. Configuração de Credenciais (Autenticação)	3](#2.-configuração-de-credenciais-\(autenticação\))

[Passos para Obter o Token na Chatsuru:	3](#passos-para-obter-o-token-na-chatsuru:)

[Passos para Configurar a Credencial no n8n:	3](#passos-para-configurar-a-credencial-no-n8n:)

## Introdução {#introdução}

Apresentamos o **n8n-nodes-chatsuru**, o módulo customizado que integra a sua plataforma de automação com o motor de comunicação inteligente da Chatsuru. Desenvolvemos esta ferramenta para que você possa ir além da simples conectividade e **transformar a maneira como seus fluxos de trabalho se comunicam com seus clientes.**

### N8N em Foco: Automação Low-Code Descentralizada {#n8n-em-foco:-automação-low-code-descentralizada}

[**N8N**](https://n8n.io/) é a sua solução **low-code e open-source** para automação de fluxos de trabalho. Ao invés de depender de código complexo ou de plataformas proprietárias caras, o N8N permite que você construa rotinas de integração avançadas através de uma interface visual de **Nós (Nodes)**.

#### Por que N8N? {#por-que-n8n?}

* **Flexibilidade Total:** Como plataforma de código aberto, você decide onde e como hospedá-lo, garantindo controle e privacidade de dados.  
* **Agilidade Low-Code:** Crie, itere e implemente automações complexas em minutos, não em semanas.  
* **Extensibilidade Ilimitada:** Se existe uma API, o n8n se conecta. É aqui que entra nosso node customizado.

### Chatsuru: O Motor de Engajamento Inteligente {#chatsuru:-o-motor-de-engajamento-inteligente}

**Chatsuru** é a plataforma desenhada para transformar conversas em vendas, utilizando **Inteligência Artificial de ponta** para criar e gerenciar **funcionários digitais** (agentes de IA) que atuam como parte real da sua equipe, tudo sem sair do WhatsApp.

Seus principais recursos incluem:

* **Funcionários Digitais:** Agentes de IA pré-configurados (Recepção, Comercial, Financeiro, Suporte, etc.) que se comunicam e se integram, operando 24 horas por dia, 7 dias por semana.  
* **Conversas Inteligentes:** Processamento avançado de linguagem natural, com capacidade para qualificar leads, agendar compromissos e coletar dados.  
* **Recursos Multimídia:** Processamento de mensagens de voz e reconhecimento de imagem, permitindo que os agentes de IA respondam naturalmente a áudios e analisem fotos.  
* **Chat Unificado & Campanhas:** Gestão eficiente de todos os atendimentos em um chat unificado e automação de campanhas para segmentação e envio em massa.

### O Node: n8n-nodes-chatsuru {#o-node:-n8n-nodes-chatsuru}

Este Node customizado é a **integração nativa e otimizada** que faltava. O **n8n-nodes-chatsuru** abstrai a complexidade da API da Chatsuru, fornecendo ações específicas diretamente no seu fluxo de trabalho do n8n.

Com ele, você pode:

* **Acionar Comunicações:** Iniciar o envio de mensagens transacionais ou promocionais via Chatsuru, a partir de qualquer gatilho no n8n (ex: uma compra em um e-commerce, um lead em uma planilha).  
* **Orquestrar Agentes:** Integrar logicamente seus fluxos do n8n para interagir ou acionar os funcionários de IA da Chatsuru.  
* **Sincronizar Dados:** Utilizar o n8n como ponte para enviar e receber dados entre a plataforma Chatsuru e outros sistemas essenciais (CRMs, ERPs, bancos de dados).

O resultado é um fluxo de trabalho mais limpo, mais rápido e incrivelmente poderoso.

## **Instalação e Configuração do Node `n8n-nodes-chatsuru`** {#instalação-e-configuração-do-node-n8n-nodes-chatsuru}

Esta seção guiará você pelo processo de instalação do nosso Node customizado diretamente pela interface do n8n, um método simples e rápido.

### 1\. Instalação via Interface Gráfica (Nodes da Comunidade) {#1.-instalação-via-interface-gráfica-(nodes-da-comunidade)}

O Node `n8n-nodes-chatsuru` está disponível como um Node da Comunidade (Community Node) e pode ser instalado em poucos cliques, sem a necessidade de comandos via terminal.

#### Processo de Instalação: {#processo-de-instalação:}

1. **Acesse Configurações:** Na interface do n8n, clique no ícone **"Settings"** (Configurações) no canto inferior esquerdo.  
2. **Selecione Nodes:** No menu lateral das Configurações, clique em **"Community Nodes"** (Nodes da Comunidade).  
3. **Procure o Node:** Na barra de pesquisa, digite o nome completo do Node: `n8n-nodes-chatsuru`.  
4. **Instale:** Quando o Node for exibido na lista, clique no botão **"Install"** (Instalar) ao lado dele.  
5. **Confirmação:** O n8n fará o download e a instalação do pacote. Após a conclusão, o Node `Chatsuru` estará imediatamente disponível para uso na paleta de Nodes de seus workflows.

### **2\. Configuração de Credenciais (Autenticação)** {#2.-configuração-de-credenciais-(autenticação)}

O Node `Chatsuru` utiliza um **Token de Acesso (API Key)** para se autenticar. Este token deve ser gerado no painel da Chatsuru e inserido na credencial do n8n.

#### Passos para Obter o Token na Chatsuru: {#passos-para-obter-o-token-na-chatsuru:}

1. Acesse o **Painel do Gestor** da Chatsuru.  
2. No menu lateral, navegue até **"Configurações"**.  
3. Acesse a aba **"Integrações"**.  
4. Gere o Token de Acesso (API Key) e copie o valor.

#### Passos para Configurar a Credencial no n8n: {#passos-para-configurar-a-credencial-no-n8n:}

1. **Adicione o Node:** Crie um novo workflow e adicione o Node **Chatsuru**.  
2. **Crie a Credencial:** Clique no campo **"Credentials"** (Credenciais) e selecione **"Create New"** (Criar Novo).  
3. **Preencha os Campos:** O formulário de credencial solicitará o campo para o Token. Cole o valor copiado da Chatsuru neste campo.  
4. **Salve:** Dê um nome à sua credencial (Ex: `Chatsuru - Produção`) e salve. O Node estará autenticado e pronto para ser configurado e testado em seu fluxo de trabalho.

