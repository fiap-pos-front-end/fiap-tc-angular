# FIAP Tech Challenge - Microfrontend de Transferências

**Este projeto é um microfrontend desenvolvido em Angular v19, responsável pelo domínio de Transações do FIAP Tech Challenge 2. Ele faz parte de uma arquitetura de microfrontends, focando especificamente na gestão e visualização de transações financeiras.**

---

## 🚀 Primeiros passos

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM (versão 9 ou superior)
- Angular CLI v19

### Tecnologias Utilizadas

- Angular v19
- TypeScript
- PrimeNG (biblioteca de componentes UI)
- RxJS
- Webpack (para Module Federation)

### Instalação

1. Clone o repositório:

```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:4200`.

> [!WARNING]
> Vale ressaltar que a ideia e foco desse Microfrontend é ser utilizado em conjunto com os demais + shell. Para mais detalhes, leia a [seção de introdução do projeto aqui](https://github.com/fiap-pos-front-end).

## 🧱 Estrutura do Projeto

```
src/app/
├── domain/
│   ├── entities/
│   │   └── Transaction.ts                      ← Entidades ricas com validação
│   ├── enums/
│   │   └── TransactionType.ts                  ← RECEITA/DESPESA
│   ├── repositories/                           ← Interfaces apenas!
│   │   ├── TransactionRepository.ts
│   ├── services/                               ← Interfaces apenas!
│   │   └── IdGeneratorService.ts
│   └── usecases/
│       ├── CreateTransactionUseCase.ts
│       ├── DeleteTransactionUseCase.ts
│       ├── GetAllTransactionsUseCase.ts
│       └── UpdateTransactionUseCase.ts
│
├── data/                                        ← DTOs e mappers
│   ├── dtos/
│   │   └── TransactionDTO.ts                    ← DTOs que recebem do backend
│   └── mappers/
│       └── TransactionMapper.ts                 ← DTO → Entity conversion
│
├── infra/                                       ← Implementações concretas de terceiros
│   ├── repositories/
│   │   ├── HttpTransactionRepository.ts         
│   └── services/
│       └── UuidIdGeneratorService.ts            
│
└── presentation/                                ← Apresentação
|   ├── components/                              
|   └── pages/                                   
├── environments/                                ← Configurações de ambiente
└── assets/                                      ← Recursos estáticos
```


### Onde Adicionar Novos Componentes

- **Componentes de Apresentação**: Adicione em `src/app/components/presentational/` se o componente for puramente visual e reutilizável
- **Componentes Inteligentes**: Adicione em `src/app/components/smart/` se o componente contiver lógica de negócio ou regras de UI
- **Páginas**: Adicione em `src/app/pages/` se for uma nova rota/página
- **Regras "core" ou relativas ao domínio**: Adicione em `src/app/core/domain/` para novas regras de negócio
- **Serviços**: Adicione em `src/app/infrastructure/services/` para novos serviços de infraestrutura

#### Exemplo real de uso dos componentes

1. Usuário preenche form → Componente captura data
2. Componente chama UseCase.execute(data)
3. UseCase valida → Business rules
4. UseCase gera ID → const id = await idGenerator.generate()
5. UseCase cria entity → Transaction.create(id, data)
6. UseCase chama repository → repository.create(transaction)
7. Repository retorna → Observable<Transaction>
8. UseCase retorna → Observable<Transaction>
9. Componente se inscreve → transaction$.subscribe()

## 📝 Extra

### Comandos Úteis

```bash
# Executar testes unitários
npm test

# Gerar build de produção
npm run build

# Executar linting
npm run lint

# Gerar documentação
npm run docs
```

### Conceitos Utilizados

1. **Clean Architecture**
   - Separação clara entre camadas de domínio, aplicação e infraestrutura
   - Independência de frameworks e bibliotecas externas no domínio
   - Inversão de dependências para maior flexibilidade

2. **Module Federation**
   - Integração com outros microfrontends
   - Carregamento dinâmico de módulos remotos
   - Compartilhamento de dependências

3. **Padrões de Projeto**
   - Repository Pattern para abstração de dados
   - Factory Method para criação de objetos
   - Dependency Injection para inversão de controle

> _Infelizmente, alguns padrões de projeto precisaram ser removidos pois não foi possível fazer a injeção de dependências funcionar perfeitamente (especialmente quando o token precisava ser injetado no bootstrap da aplicação)._

### Boas Práticas

- Utilize TypeScript com tipos estritos
- Siga o guia de estilo do Angular
- Mantenha componentes pequenos e focados
- Documente alterações significativas

### Observações

Este projeto é parte de uma arquitetura maior de microfrontends. Certifique-se de seguir as convenções estabelecidas e manter a coesão com outros módulos do sistema.
