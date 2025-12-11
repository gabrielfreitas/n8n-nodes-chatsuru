import {
  IBinaryData,
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
    description: "Interage com a API Chatsuru",
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
        displayName: "Operação",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Enviar Mensagem",
            value: "sendMessage",
          },
          {
            name: "Enviar Arquivo",
            value: "sendFile",
          },
          {
            name: "Listar Canais",
            value: "listChannels",
          },
          {
            name: "Listar Etiquetas",
            value: "listTags",
          },
        ],
        default: "sendMessage",
      },
      // Parâmetros para Enviar Mensagem
      {
        displayName: "Mensagem",
        name: "message",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: "",
        required: true,
      },
      {
        displayName: "Telefone",
        name: "phone",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: "",
      },
      {
        displayName: "Status de atendimento",
        name: "status",
        type: "options",
        options: [
          { name: "Vazio", value: "" },
          { name: "bot", value: "bot" },
          { name: "closed", value: "closed" },
          { name: "waiting", value: "waiting" },
        ],
        required: false,
        displayOptions: {
          show: {
            operation: ["sendMessage", "sendFile"],
          },
        },
        default: "",
      },
      {
        displayName: "Help Desk ID",
        name: "help_desk_id",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: "",
      },
      {
        displayName: "Nome",
        name: "name",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: "",
      },
      {
        displayName: "Encerrar Sessão",
        name: "close_session",
        type: "boolean",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: false,
      },
      {
        displayName: "Channel ID",
        name: "channel_id",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: "",
      },
      {
        displayName: "Etiquetas (IDs separadas por vírgula)",
        name: "tags",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendMessage", "sendFile"],
          },
        },
        default: "",
        description:
          "IDs das etiquetas separadas por vírgula para associar à mensagem",
      },
      {
        displayName: "Botões (JSON Array)",
        name: "buttons",
        type: "json",
        displayOptions: {
          show: {
            operation: ["sendMessage"],
          },
        },
        default: "",
      },
      // Parâmetros para Enviar Arquivo
      {
        displayName: "Arquivo",
        name: "file",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendFile"],
          },
        },
        default: "",
        description: "Campo binário contendo o arquivo",
      },
      {
        displayName: "Mensagem",
        name: "file_message",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendFile"],
          },
        },
        default: "",
      },
      {
        displayName: "Telefone",
        name: "file_phone",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendFile"],
          },
        },
        default: "",
      },
      {
        displayName: "Nome",
        name: "file_name",
        type: "string",
        displayOptions: {
          show: {
            operation: ["sendFile"],
          },
        },
        default: "",
      },
      {
        displayName: "Encerrar Sessão",
        name: "file_close_session",
        type: "boolean",
        displayOptions: {
          show: {
            operation: ["sendFile"],
          },
        },
        default: false,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials("chatsuruApi");
    const token = credentials.token as string;

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string;

      if (operation === "sendMessage") {
        const body: any = {
          message: this.getNodeParameter("message", i),
        };
        const phone = this.getNodeParameter("phone", i, "");
        const help_desk_id = this.getNodeParameter("help_desk_id", i, "");
        const name = this.getNodeParameter("name", i, "");
        const close_session = this.getNodeParameter("close_session", i, false);
        const channel_id = this.getNodeParameter("channel_id", i, "");
        const status = this.getNodeParameter("status", i, "");
        const buttons = this.getNodeParameter("buttons", i, "");
        const tagsRaw = this.getNodeParameter("tags", i, "") as string | object;

        if (phone) body.phone = phone;
        if (help_desk_id) body.help_desk_id = help_desk_id;
        if (name) body.name = name;
        if (close_session) body.close_session = close_session;
        if (channel_id) body.channel_id = channel_id;
        if (status) body.status = status;
        if (buttons) {
          try {
            body.buttons = JSON.parse(buttons as string);
          } catch (e) {
            throw new Error("Botões devem ser um array JSON válido");
          }
        }
        if (tagsRaw) {
          const tagsArray = (tagsRaw as string)
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");
          body.tags = tagsArray;
        }

        const response = await this.helpers.httpRequest({
          method: "POST",
          url: "https://blubots.com/api/v1/send/message/",
          headers: {
            Authorization: `Token ${token}`,
          },
          body,
          json: true,
        });
        returnData.push({ json: response });
      }

      if (operation === "sendFile") {
        const item = this.getInputData()[i];

        const binaryPropertyName = this.getNodeParameter("file", i) as string;
        const file_message = this.getNodeParameter("file_message", i, "");
        const file_phone = this.getNodeParameter("file_phone", i, "");
        const file_name = this.getNodeParameter("file_name", i, "");
        const file_close_session = this.getNodeParameter(
          "file_close_session",
          i,
          false
        ) as boolean;
        const file_status = this.getNodeParameter("status", i, "");
        const tagsRaw = this.getNodeParameter("tags", i, "") as string | object;

        let tagsArray: string[] = [];
        if (tagsRaw) {
          tagsArray = (tagsRaw as string)
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");
        }

        if (tagsArray.length > 0) {
          // Adiciona as tags ao formData mais tarde
        } 

        const binaryData = await this.helpers.getBinaryDataBuffer(
          i,
          binaryPropertyName
        );
        const binaryDataInfo = item.binary?.[binaryPropertyName] as
          | IBinaryData
          | undefined;

        const formData = new FormData();

        if (binaryData && binaryDataInfo) {
          const fileBlob = new Blob([binaryData], {
            type: binaryDataInfo.mimeType,
          });
          formData.append("arquivo", fileBlob, binaryDataInfo.fileName);
        } else {
          throw new Error(
            'O campo "file" não contém dados binários ou é inválido.'
          );
        }

        if (file_message) formData.append("message", file_message);
        if (file_phone) formData.append("phone", file_phone);
        if (file_name) formData.append("name", file_name);

        if (file_close_session === true) {
          formData.append("close_session", "true");
        }
        if (file_status) formData.append("status", file_status);
        if (tagsArray.length > 0) {
          tagsArray.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
          });
        }

        const response = await this.helpers.httpRequest({
          method: "POST",
          url: "https://blubots.com/api/v1/send/file/",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        });

        returnData.push({ json: response });
      }

      if (operation === "listChannels") {
        const response = await this.helpers.httpRequest({
          method: "GET",
          url: "https://blubots.com/api/v1/channels/",
          headers: {
            Authorization: `Token ${token}`,
          },
          json: true,
        });
        returnData.push({ json: response });
      }

      if (operation === "listTags") {
        const response = await this.helpers.httpRequest({
          method: "GET",
          url: "https://blubots.com/api/v2/tags/",
          headers: {
            Authorization: `Token ${token}`,
          },
          json: true,
        });
        const tags = response.results.map((tag: any) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        }));
        returnData.push({ json: {tags} });
      }
    }

    return [returnData];
  }
}
