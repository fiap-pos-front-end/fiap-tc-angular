# FiapTcAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Padrões de Projeto & Arquitetura

Este projeto segue os princípios de Clean Architecture e Domain-Driven Design (DDD), implementando diversos padrões de projeto e princípios SOLID:

### Padrões de Projeto

1. **Padrão Repository**
   - Abstrai a persistência de dados através da interface `ITransactionRepository`
   - Múltiplas implementações (InMemory, LocalStorage) sem afetar a lógica de domínio
   - Permite trocar facilmente entre mecanismos de armazenamento

2. **Injeção de Dependência**
   - Utiliza o sistema de DI do Angular com tokens de injeção
   - Implementações do Repository são fornecidas através de tokens
   - Promove baixo acoplamento e facilita testes

3. **Factory Method**
   - Usado nos modelos de domínio (ex: `Transaction.create()`)
   - Encapsula a lógica de criação de objetos
   - Garante invariantes do domínio através de validação

4. **Objetos de Valor**
   - Classe `Money` para manipulação de valores monetários
   - Objetos imutáveis representando conceitos do domínio
   - Encapsula validação e regras de negócio

### Princípios SOLID

1. **Princípio da Responsabilidade Única (SRP)**
   - Cada classe tem apenas um motivo para mudar
   - Repository lida com persistência
   - Services lidam com lógica de negócio
   - Components lidam com preocupações de UI

2. **Princípio Aberto/Fechado (OCP)**
   - Novas implementações de repository podem ser adicionadas sem modificar código existente
   - Tipos de transação podem ser estendidos através de enums
   - Casos de uso podem ser adicionados sem alterar modelos de domínio

3. **Princípio da Substituição de Liskov (LSP)**
   - Implementações de repository são intercambiáveis
   - Todas as implementações seguem o mesmo contrato
   - Sem comportamentos inesperados ao trocar implementações

4. **Princípio da Segregação de Interface (ISP)**
   - Interface do repository define apenas métodos necessários
   - Componentes expõem API pública mínima
   - Clara separação entre componentes presentational e smart

5. **Princípio da Inversão de Dependência (DIP)**
   - Camada de domínio define interfaces
   - Infraestrutura implementa interfaces
   - Módulos de alto nível não dependem de módulos de baixo nível

### Prós e Contras

#### Vantagens

1. **Manutenibilidade**
   - Clara separação de responsabilidades
   - Fácil de entender e modificar componentes
   - Mudanças isoladas com efeitos colaterais mínimos

2. **Testabilidade**
   - Componentes podem ser testados isoladamente
   - Fácil de mockar dependências
   - Limites claros para testes unitários

3. **Flexibilidade**
   - Fácil adicionar novos recursos
   - Simples trocar implementações
   - Caminhos claros para atualizações

4. **Foco no Domínio**
   - Regras de negócio claramente expressas
   - Lógica de domínio protegida de mudanças externas
   - Fácil entender requisitos de negócio

#### Desafios

1. **Complexidade Inicial**
   - Mais código boilerplate
   - Curva de aprendizado mais íngreme
   - Pode parecer super-engenharia para recursos pequenos

2. **Velocidade de Desenvolvimento**
   - Criar novos recursos requer mais planejamento
   - Necessidade de manter limites arquiteturais
   - Mais arquivos e interfaces para gerenciar

3. **Adoção pela Equipe**
   - Requer entendimento dos padrões pela equipe
   - Necessidade de implementação consistente
   - Pode desacelerar novos membros da equipe inicialmente

### Quando Usar Esta Arquitetura

Esta arquitetura é particularmente adequada para:

- Aplicações com manutenção de longo prazo
- Regras de negócio complexas
- Colaboração em equipe
- Aplicações com expectativa de crescimento
- Sistemas que requerem alta testabilidade

Para aplicações mais simples ou protótipos, considere uma arquitetura mais leve que priorize velocidade de desenvolvimento sobre manutenibilidade.
