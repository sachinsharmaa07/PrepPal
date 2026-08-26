#!/bin/bash
# setup-judge0-ec2.sh
# Run this script on a fresh Ubuntu EC2 instance (t2.micro / t2.medium)

set -e

echo "Updating system packages..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

echo "Installing Docker..."
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "Adding current user to docker group..."
sudo usermod -aG docker $USER

echo "Downloading Judge0 Docker Compose config..."
mkdir -p judge0
cd judge0
wget https://github.com/judge0/judge0/releases/download/v1.13.0/judge0-v1.13.0.zip
unzip judge0-v1.13.0.zip
cd judge0-v1.13.0

echo "Starting Judge0 services..."
# Using docker compose (v2)
docker compose up -d db redis
sleep 10
docker compose up -d

echo "Judge0 is now running on port 2358!"
echo "Make sure to open port 2358 in your AWS EC2 Security Group."
