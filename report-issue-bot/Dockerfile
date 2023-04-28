#sudo docker build -t report-issue-bot .
#sudo docker run -i -t report-issue-bot

#aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 191518685251.dkr.ecr.us-west-1.amazonaws.com
#docker tag report-issue-bot:latest 191518685251.dkr.ecr.us-west-1.amazonaws.com/report-issue-bot:latest
#docker push 191518685251.dkr.ecr.us-west-1.amazonaws.com/report-issue-bot:latest

#This only has to be done 1 time (per project).
#aws ecr create-repository --repository-name report-issue-bot

#kubectl apply -f report-issue-bot-deployment.yaml

#This only has to be done 1 time (per workstation).
#aws eks --region us-west-1 update-kubeconfig --name bdm-cluster
#kubectl cluster-info


FROM node:16.15.1

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

COPY prod.env .env

CMD [ "npm", "start" ]
