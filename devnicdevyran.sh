#!/bin/bash

# Definindo cores para formatação
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
NC="\033[0m" # No Color

# Função para exibir um banner estilizado
function print_banner {
  clear
  echo -e "${GREEN}"
  echo "========================================================"
  echo "               NIC FRONTEND YRAN BACKEND"
  echo "========================================================"
  echo -e "${NC}"
}

# Função para criar o sufixo incrementado caso exista um diretório com o mesmo nome
function get_incremented_folder_name {
  base_name="$1-old"
  increment=1
  new_folder_name="$base_name"

  while [ -d "$new_folder_name" ]; do
    new_folder_name="${base_name}-${increment}"
    increment=$((increment + 1))
  done

  echo "$new_folder_name"
}

# Exibe o banner inicial
print_banner

# Exibe aviso importante sobre o backup e snapshot
echo -e "${YELLOW}AVISO IMPORTANTE: Antes de prosseguir, faça um backup e snapshot da sua VPS.${NC}"
read -p "Deseja continuar? [Y/N]: " choice

if [[ "$choice" != "Y" && "$choice" != "y" ]]; then
  echo -e "${RED}Operação cancelada. Por favor, faça um backup antes de continuar.${NC}"
  exit 1
fi

# Exibe o banner novamente após confirmação
print_banner

# Parando todos os processos do PM2
echo -e "${GREEN}Parando todos os processos do PM2...${NC}"
sudo su deploy -c "pm2 stop all"

# Solicitando o diretório de deploy
echo -e "${GREEN}Digite o caminho do diretório de deploy (ex: /home/deploy):${NC}"
read deploy_path

if [ ! -d "$deploy_path" ]; then
  echo -e "${RED}Caminho $deploy_path não existe. Operação cancelada.${NC}"
  exit 1
fi

cd "$deploy_path" || { echo -e "${RED}Falha ao acessar o caminho $deploy_path. Operação cancelada.${NC}"; exit 1; }

# Solicitando o nome da pasta a ser renomeada
echo -e "${GREEN}Digite o nome da pasta que deseja renomear:${NC}"
read old_folder_name

if [ ! -d "$old_folder_name" ]; then
  echo -e "${RED}A pasta $old_folder_name não existe. Operação cancelada.${NC}"
  exit 1
fi

# Renomeando a pasta antiga
new_old_folder_name=$(get_incremented_folder_name "$old_folder_name")
mv "$old_folder_name" "$new_old_folder_name"
echo -e "${GREEN}Pasta renomeada para: $new_old_folder_name${NC}"

# Solicitando o novo nome da pasta
echo -e "${GREEN}Digite o novo nome para a pasta:${NC}"
read new_folder_name

# Solicitando a URL do repositório Git
echo -e "${GREEN}Digite a URL do repositório Git que deseja clonar:${NC}"
read git_repo_url

# Clonando o repositório
git clone "$git_repo_url" "$new_folder_name"

# Verificando se a clonagem foi bem-sucedida
if [ $? -ne 0 ]; then
  echo -e "${RED}Falha ao clonar o repositório. Operação cancelada.${NC}"
  exit 1
fi

# Exibe o banner
print_banner

# Copiando arquivos .env e server.js para o novo diretório
echo -e "${GREEN}Copiando arquivos de configuração .env e server.js...${NC}"
cp "$new_old_folder_name/backend/.env" "$new_folder_name/backend/.env"
cp "$new_old_folder_name/frontend/.env" "$new_folder_name/frontend/.env"
cp "$new_old_folder_name/frontend/server.js" "$new_folder_name/frontend/server.js"

# Executando comandos no backend
echo -e "${GREEN}Executando instalação no backend...${NC}"
cd "$deploy_path/$new_folder_name/backend" || { echo -e "${RED}Falha ao acessar o diretório do backend. Operação cancelada.${NC}"; exit 1; }
npm install
npm run build
npx sequelize db:migrate

# Exibe o banner
print_banner

# Executando comandos no frontend
echo -e "${GREEN}Executando instalação no frontend...${NC}"
cd "$deploy_path/$new_folder_name/frontend" || { echo -e "${RED}Falha ao acessar o diretório do frontend. Operação cancelada.${NC}"; exit 1; }
npm install
npm run build

# Exibe o banner
print_banner

# Editando package.json no frontend
echo -e "${GREEN}Abrindo package.json no frontend para edição...${NC}"
nano "$deploy_path/$new_folder_name/frontend/package.json"

# Editando index.html no frontend
echo -e "${GREEN}Abrindo index.html no frontend/public para edição...${NC}"
nano "$deploy_path/$new_folder_name/frontend/public/index.html"

# Exibe o banner
print_banner

# Executando npm install e npm run build novamente
echo -e "${GREEN}Rodando npm install e npm run build novamente no frontend...${NC}"
npm install
npm run build

# Reiniciando PM2
echo -e "${GREEN}Reiniciando PM2...${NC}"
sudo su deploy -c "pm2 restart all"

# Instrução para mover a pasta 'public' se necessário
echo -e "${YELLOW}Lembre-se de mover a pasta 'public' para o novo diretório, se necessário.${NC}"

# Finalizando o script
echo -e "${GREEN}Script finalizado. Se houver algum erro, entre em contato com o suporte!${NC}"
echo -e "${GREEN}
npm install (No backend)
npm run build (No backend)
npx sequelize db:migrate (No backend)

npm install (No frontend)
npm run build (No frontend)

sudo su deploy
pm2 restart all
${NC}"
