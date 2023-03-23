## Frete Rápido

Simples integração com a API do frete-rapido.

## Arquitetura do Projeto

```
└── src
    ├── app
    │   └── quote
    │       ├── controllers
    │       ├── dto
    │       ├── models
    │       ├── repositories
    │       │   └── interfaces`
    │       ├── services
    │       │   └── interfaces
    │       └── tests
    ├── configs
    ├── database
    │   └── migrations
    ├── exceptions
    ├── utils
    │   └── parsers
    └── wrappers
        ├── frete-rapido
        │   └── interfaces
        └── logger
            └── interfaces

```

## Clonando projeto

```
git clone https://github.com/luiseduardosilva/frete-rapido.git
```

## Copiar .env

```
cp .env.example .env
```

## Instalando dependencias

```
npm i
```

## Iniciando aplicação em Docker

- postgresql: 5432
- api: 3000

```
docker compose -f dev.docker-compose.yml up -d
```

## Rodando migrations

```
npm run docker:run-migrations
```

## Swagger

<a href="http://localhost:3002/docs" target="blank">http://localhost:3000/docs</a>
