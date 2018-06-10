# Runtime set up
FROM node:boron

# Create app directory
WORKDIR /root/docker/code-capsule

# Copy dependency file
COPY package.json .

RUN npm install

# Copy other resources
COPY . .

# Expose port
EXPOSE 8809

CMD ["npm","start"] 
