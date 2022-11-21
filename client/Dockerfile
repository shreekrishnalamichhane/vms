FROM node:16.15-alpine3.14
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# RUN npm run preview
EXPOSE 4173
CMD ["npm","run","preview"]