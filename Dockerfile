FROM n8nio/n8n:latest

USER root

WORKDIR /tmp/custom

# Copia arquivos do projeto
COPY package*.json ./
COPY tsconfig.json ./
COPY gulpfile.js ./
COPY nodes/ ./nodes/
COPY credentials/ ./credentials/

# Instala TODAS as dependências (incluindo devDependencies)
RUN npm install --include=dev && npm run build

# Copia nodes para o n8n
RUN mkdir -p /home/node/.n8n/custom && \
    cp -r dist/* /home/node/.n8n/custom/ && \
    cp package.json /home/node/.n8n/custom/ && \
    chown -R node:node /home/node/.n8n

# Limpa
WORKDIR /
RUN rm -rf /tmp/custom

USER node

EXPOSE 5678

# Usa o comando padrão da imagem base n8n
CMD ["tini", "--", "/docker-entrypoint.sh"]