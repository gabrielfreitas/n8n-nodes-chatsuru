import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  INodeProperties,
} from "n8n-workflow";

// URL base para os endpoints de produto.
const BASE_URL = "https://blubots.com/api/v2/ecommerce/products/";

export class ChatsuruProduct implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Chatsuru Product",
    name: "chatsuruProduct",
    icon: "file:chatsuru.svg", // Mantendo o mesmo ícone se aplicável
    group: ["transform"],
    version: 1,
    description: "Gerenciar produtos via Chatsuru/Blubots API",
    defaults: {
      name: "Chatsuru Product",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "chatsuruApi", // Reutilizando o nome da credencial
        required: true,
      },
    ],
    // As propriedades serão divididas em Resource, Operation e campos específicos
    properties: [
      // ----------------------------------
      //         RESOURCE
      // ----------------------------------
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Product",
            value: "product",
          },
        ],
        default: "product",
        description: "Recurso a ser acessado.",
      },
      // ----------------------------------
      //         OPERATION
      // ----------------------------------
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "List (Multiple Products)",
            value: "list",
            description: "Lista produtos da loja.",
          },
          {
            name: "Get (Single Product)",
            value: "get",
            description: "Obtém um produto específico pelo ID.",
          },
          {
            name: "Create",
            value: "create",
            description: "Cria um novo produto.",
          },
          {
            name: "Update",
            value: "update",
            description: "Atualiza um produto existente (PUT).",
          },
          {
            name: "Delete",
            value: "delete",
            description: "Exclui um produto.",
          },
        ],
        default: "list",
        description: "Operação a ser executada no recurso.",
      },

      // ----------------------------------
      //         PROPRIEDADES DA OPERAÇÃO LIST
      // ----------------------------------
      {
        displayName: "Store ID",
        name: "storeIdList",
        type: "string",
        default: "1",
        required: true,
        displayOptions: {
          show: {
            resource: ["product"],
            operation: ["list"],
          },
        },
        description: "ID da loja para listar os produtos.",
      },

      // ----------------------------------
      //         PROPRIEDADES DA OPERAÇÃO GET/UPDATE/DELETE
      // ----------------------------------
      {
        displayName: "Product ID (PK)",
        name: "productId",
        type: "string",
        default: "",
        required: true,
        placeholder: "123",
        displayOptions: {
          show: {
            resource: ["product"],
            operation: ["get", "update", "delete"],
          },
        },
        description: "ID (PK) do produto a ser buscado/atualizado/excluído.",
      },

      // ----------------------------------
      //         PROPRIEDADES DA OPERAÇÃO CREATE/UPDATE
      // ----------------------------------
      {
        displayName: "Product Fields",
        name: "productFields",
        type: "json",
        default: JSON.stringify(
          {
            name: "AIRPODS IPHONE",
            code: "32861",
            image: null,
            short_description: null,
            description: null,
            installments: null,
            installments_amount: null,
            url: null,
            status: true,
            organization: 1,
            user: 6,
            category: 899,
            product_stores: [
              {
                store: 1,
                price: "950.00",
                stock: 9,
                is_active: true,
              },
            ],
          },
          null,
          2,
        ),
        required: true,
        displayOptions: {
          show: {
            resource: ["product"],
            operation: ["create", "update"],
          },
        },
        description:
          "Objeto JSON com os dados do produto. Use o formato do payload de exemplo.",
      },
      // Necessário para a URL do Create
      {
        displayName: "Store ID (Create)",
        name: "storeIdCreate",
        type: "string",
        default: "1",
        required: true,
        displayOptions: {
          show: {
            resource: ["product"],
            operation: ["create"],
          },
        },
        description: "ID da loja para o endpoint de criação.",
      },
    ] as INodeProperties[],
  };

  // Método de execução
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Pega as credenciais UMA VEZ antes do loop
    const credentials = await this.getCredentials("chatsuruApi");

    // Verifica se pegou as credenciais e obtém o token
    if (!credentials) {
      throw new NodeOperationError(this.getNode(), "Credenciais não configuradas");
    }

    const token = credentials.token as string;

    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let url = BASE_URL;
        let method = "GET";
        let body: any = {};
        const headers: { [key: string]: string } = {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        };

        // Lógica para construir URL, Método e Body baseado na Operação
        if (operation === "list") {
          const storeIdList = this.getNodeParameter("storeIdList", i) as string;
          url = `${BASE_URL}?store_id=${storeIdList}`;
          method = "GET";
        } else if (operation === "get") {
          const productId = this.getNodeParameter("productId", i) as string;
          url = `${BASE_URL}${productId}/`;
          method = "GET";
        } else if (operation === "create") {
          const storeIdCreate = this.getNodeParameter("storeIdCreate", i) as string;
          const productFields = this.getNodeParameter("productFields", i);
          url = `${BASE_URL}?store_id=${storeIdCreate}`;
          method = "POST";
          body = JSON.parse(productFields as string);
        } else if (operation === "update") {
          const productId = this.getNodeParameter("productId", i) as string;
          const productFields = this.getNodeParameter("productFields", i);
          url = `${BASE_URL}${productId}/`;
          method = "PUT";
          body = JSON.parse(productFields as string);
        } else if (operation === "delete") {
          const productId = this.getNodeParameter("productId", i) as string;
          url = `${BASE_URL}${productId}/`;
          method = "DELETE";
        }

        // Executa a requisição HTTP
        const response = await this.helpers.httpRequest({
          method: method as any,
          url: url,
          headers: headers,
          body: body,
          json: true,
        });

        // Adiciona o resultado
        returnData.push({
          json: response,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          const errorData: any = { error: (error as Error).message };
          // Tenta incluir parâmetros para contexto
          try {
            errorData.productId = this.getNodeParameter("productId", i, null);
          } catch {}

          returnData.push({
            json: errorData,
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}