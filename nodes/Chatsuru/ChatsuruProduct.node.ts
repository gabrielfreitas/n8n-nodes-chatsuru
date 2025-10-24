import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from "n8n-workflow";

export class ChatsuruProduct implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Chatsuru Product",
    name: "chatsuruProduct",
    icon: "file:chatsuru.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Interact with Chatsuru Product API",
    defaults: {
      name: "Chatsuru Product",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "chatsuruApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a product",
            action: "Create a product",
          },
          {
            name: "Get",
            value: "get",
            description: "Get a product by ID",
            action: "Get a product",
          },
          {
            name: "Get All",
            value: "getAll",
            description: "Get all products",
            action: "Get all products",
          },
        ],
        default: "create",
      },
      // Fields for Create operation
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Product name",
      },
      {
        displayName: "Code",
        name: "code",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Product code",
      },
      {
        displayName: "Category",
        name: "category",
        type: "options",
        typeOptions: {
          loadOptionsMethod: "getCategories",
        },
        default: "",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Product category",
      },
      {
        displayName: "Description",
        name: "description",
        type: "string",
        default: "",
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Product description",
      },
      {
        displayName: "Short Description",
        name: "short_description",
        type: "string",
        default: "",
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Product short description",
      },
      {
        displayName: "Status",
        name: "status",
        type: "boolean",
        default: true,
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Product status",
      },
      {
        displayName: "Organization",
        name: "organization",
        type: "number",
        default: 1,
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        description: "Organization ID",
      },
      // Field for Get operation
      {
        displayName: "Product ID",
        name: "productId",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            operation: ["get"],
          },
        },
        description: "ID of the product to retrieve",
      },
    ],
  };

  methods = {
    loadOptions: {
      async getCategories(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials("chatsuruApi");
        const token = credentials.token as string;

        const response = await this.helpers.request({
          method: "GET",
          url: "https://blubots.com/api/v2/ecommerce/categories/",
          headers: {
            Authorization: `Token ${token}`,
          },
          json: true,
        });

        const categories = response.results as Array<{
          id: number;
          name: string;
        }>;

        return categories.map((category) => ({
          name: category.name,
          value: category.id,
        }));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const operation = this.getNodeParameter("operation", 0) as string;

    // Get credentials
    const credentials = await this.getCredentials("chatsuruApi");
    const token = credentials.token as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (operation === "create") {
          // Create product
          const name = this.getNodeParameter("name", i) as string;
          const code = this.getNodeParameter("code", i) as string;
          const category = this.getNodeParameter("category", i) as number;
          const description = this.getNodeParameter("description", i) as string;
          const short_description = this.getNodeParameter(
            "short_description",
            i
          ) as string;
          const status = this.getNodeParameter("status", i) as boolean;
          const organization = this.getNodeParameter(
            "organization",
            i
          ) as number;

          const body = {
            name,
            code,
            category,
            description,
            short_description,
            status,
            organization,
          };

          const response = await this.helpers.request({
            method: "POST",
            url: "https://blubots.com/api/v2/ecommerce/products/",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body,
            json: true,
          });

          returnData.push(response as IDataObject);
        } else if (operation === "get") {
          // Get product by ID
          const productId = this.getNodeParameter("productId", i) as string;

          const response = await this.helpers.request({
            method: "GET",
            url: `https://blubots.com/api/v2/ecommerce/products/${productId}`,
            headers: {
              Authorization: `Token ${token}`,
            },
            json: true,
          });

          returnData.push(response as IDataObject);
        } else if (operation === "getAll") {
          // Get all products
          const response = await this.helpers.request({
            method: "GET",
            url: "https://blubots.com/api/v2/ecommerce/products/",
            headers: {
              Authorization: `Token ${token}`,
            },
            json: true,
          });

          // If response is an array, add each item
          if (Array.isArray(response)) {
            returnData.push(...(response as IDataObject[]));
          } else {
            returnData.push(response as IDataObject);
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ error: error.message });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error);
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
