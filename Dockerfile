FROM node:12-alpine
WORKDIR ./dashboard
COPY . .
RUN npm install
EXPOSE 8080
CMD npm start