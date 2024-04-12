# balance-app
Accounting management application


Tecnologias utilizadas na API:
- Node.JS
- TypeScript
- Nest.JS
- PostgreSQL
- TypeOrm
- Docker
  
### Passos para utilizar a API/Back-end

1. Navegue até a pasta do servidor
```
cd /api/
```
1.2 Instale as depedências com seu gerenciador de pacotes JavaScript
```
pnpm install
```

2. Suba o banco, a API e o pgadmin4
```yml
version: '3.5'

services:
  db:
    image: postgres
    restart: always
    environment:
      - POSTGRES_PASSWORD=postgres
    container_name: postgres
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nest-typeorm-postgres
    environment:
      - PORT=${PORT}
    ports:
      - '3000:3000'
    depends_on:
      - db
    volumes:
      - ./src:/app/src

  pgadmin:
    image: dpage/pgadmin4
    restart: always
    container_name: nest-pgadmin4
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=pgadmin4
    ports:
      - '5050:80'
    depends_on:
      - db

volumes:
  postgres:
```
2.1 Será necessário que você configure ou insira alguns valores no seu pgadmin rodando em `http://localhost:5050`.
2.2. Logue os valores presentes em (ver `docker-compose.yml`):
   ```yml
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=pgadmin4
   ```
2.3. Depois disso precisamos de um servidor para o nosso banco.
```
Host name/address: db
Port: 5432
Maintenance database: postgres
Username: postgres
Password: postgres
```
3. Com tudo configurado é possível subir o backend com:
```
docker compose up
ou
docker compose up --buold
```
## Front-end/Visualização 
Tecnologias utilizadas no front-end:
- TypeScript
- React.JS
- Vite
- React Router
- Yup 
- Material UI components

### Passos para utilizar o front-end/visualização

#### Passo ZERO: Esteja com o back-end rodando. 

1. Navegue até a pasta do front-end.
```
in root: cd /front-end
```
2. Instale as dependências do projeto com o seu gerenciador de pacotes, algo como:

```
pnpm install
```

3. Inicie o projeto.

```
pnpm run dev

VITE v5.0.12  ready in 1506 ms
➜  Local:   http://localhost:5173/
```
4. Acesse `http://localhost:5173/`.
