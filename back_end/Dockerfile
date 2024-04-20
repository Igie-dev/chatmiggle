FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm install -g nodemon

# Install ntcat to exec the sh command file
RUN apt update && apt install netcat-traditional

# Add user privilege to execute the init.sh file
RUN chmod +x init.bash

EXPOSE 3000

CMD ["bash", "init.bash"]