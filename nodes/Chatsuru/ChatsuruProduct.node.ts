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
      {
        displayName: "Store Details",
        name: "storeDetails",
        type: "fixedCollection",
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        placeholder: "Add Store Details",
        displayOptions: {
          show: {
            operation: ["create"],
          },
        },
        options: [
          {
            name: "storeValues",
            displayName: "Store",
            values: [
              {
                displayName: "Store",
                name: "store",
                type: "options",
                typeOptions: {
                  loadOptionsMethod: "getStores",
                },
                default: "",
                description: "Store ID",
              },
              {
                displayName: "Price",
                name: "price",
                type: "number",
                default: 0,
                description: "Product price in this store",
              },
              {
                displayName: "Stock",
                name: "stock",
                type: "number",
                default: 0,
                description: "Product stock quantity",
              },
              {
                displayName: "Is Active",
                name: "is_active",
                type: "boolean",
                default: true,
                description: "Whether the product is active in this store",
              },
            ],
          },
        ],
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
      async getStores(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials("chatsuruApi");
        const token = credentials.token as string;

        const response = await this.helpers.request({
          method: "GET",
          url: "https://blubots.com/api/v2/ecommerce/store/",
          headers: {
            Authorization: `Token ${token}`,
          },
          json: true,
        });

        const stores = response as Array<{
          id: number;
          name: string;
          description: string;
        }>;

        return stores.map((store) => ({
          name: `${store.name} - ${store.description || "No description"}`,
          value: store.id,
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
          // O parâmetro 'status' é lido como booleano: true ou false.
          const status = this.getNodeParameter("status", i) as boolean;
          const organization = this.getNodeParameter(
            "organization",
            i
          ) as number;

          // Get store details
          const storeDetails = this.getNodeParameter(
            "storeDetails",
            i
          ) as IDataObject;
          const storeValues = (storeDetails.storeValues as IDataObject[]) || [];

          // Build form data
          const formData: IDataObject = {
            name,
            code,
            category,
            description,
            short_description,
            status: status.toString(),
            organization,
          };

          // Add product_stores data
          storeValues.forEach((storeValue, index) => {
            formData[`product_stores[${index}]store`] = storeValue.store;
            formData[`product_stores[${index}]price`] = storeValue.price;
            formData[`product_stores[${index}]stock`] = storeValue.stock;
            formData[`product_stores[${index}]is_active`] = (
              storeValue.is_active as boolean
            ).toString();
          });

          const response = await this.helpers.request({
            method: "POST",
            url: "https://blubots.com/api/v2/ecommerce/products/",
            headers: {
              Authorization: `Token ${token}`,
            },
            formData,
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
          returnData.push({ error: (error as Error).message });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, {
          itemIndex: i,
        });
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
