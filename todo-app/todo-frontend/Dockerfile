# Stage 1: Testing stage
#FROM node:16 AS test-stage
#WORKDIR /usr/src/app

#COPY . .

#ENV CI=true
#RUN npm test

# Stage 2: Build-stage
FROM node:16 AS build-stage
WORKDIR /usr/src/app

#COPY --from=test-stage /usr/src/app /usr/src/app
COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine
# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html