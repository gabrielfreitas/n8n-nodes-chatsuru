import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

export class Chatsuru implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Chatsuru",
    name: "chatsuru",
    icon: "file:chatsuru.svg",
    group: ["transform"],
    version: 1,
    description: "Enviar mensagem via Chatsuru API",
    defaults: {
      name: "Chatsuru",
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
        displayName: "Phone",
        name: "phone",
        type: "string",
        default: "",
        required: true,
        placeholder: "5511999999999",
        description: "Número do telefone com código do país",
      },
      {
        displayName: "Message",
        name: "message",
        type: "string",
        typeOptions: {
          rows: 4,
        },
        default: "",
        required: true,
        placeholder: "Digite sua mensagem aqui...",
        description: "Mensagem a ser enviada",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Pega as credenciais UMA VEZ antes do loop
    const credentials = await this.getCredentials("chatsuruApi");

    // Verifica se pegou as credenciais
    if (!credentials) {
      throw new Error("Credenciais não configuradas");
    }

    const token = credentials.token as string;

    for (let i = 0; i < items.length; i++) {
      try {
        const phone = this.getNodeParameter("phone", i) as string;
        const message = this.getNodeParameter("message", i) as string;

        const response = await this.helpers.httpRequest({
          method: "POST",
          url: "https://blubots.com/api/v1/send/message/",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            phone: phone,
            message: message,
          },
          json: true,
        });

        returnData.push({
          json: response,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
              phone: this.getNodeParameter("phone", i),
            },
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
