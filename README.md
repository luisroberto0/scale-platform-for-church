# Scale Platform for Churches (Plataforma de Escala para Igrejas)

Plataforma de gerenciamento de escalas para igrejas, desenvolvido com Angular 18.2.6.

## 🚀 Começando

Estas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

* Node.js (versão 16 ou superior)
* NPM (ou Yarn)
* Angular CLI

### 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/luisroberto0/scale-platform-for-church.git
```

2. Instale as dependências
```bash
npm install
```

3. Configure o Firebase
- Renomeie o arquivo `src/environments/environment.ts-example` para `environment.ts`
- Substitua as configurações do Firebase com suas próprias credenciais:
```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    projectId: 'seu-project-id',
    appId: 'seu-app-id',
    storageBucket: 'seu-bucket.appspot.com',
    apiKey: 'sua-api-key',
    authDomain: 'seu-auth-domain.firebaseapp.com',
    messagingSenderId: 'seu-messaging-sender-id',
  }
};
```

4. Inicie o servidor de desenvolvimento
```bash
ng serve
```

Acesse `http://localhost:4200/` no seu navegador. O aplicativo será recarregado automaticamente se você alterar qualquer um dos arquivos fonte.

## ⚙️ Comandos Úteis

* `ng serve` - Inicia o servidor de desenvolvimento
* `ng build` - Compila o projeto (os arquivos serão gerados no diretório `dist/`)
* `ng test` - Executa os testes unitários via [Karma](https://karma-runner.github.io)
* `ng e2e` - Executa os testes end-to-end
* `ng generate component nome-do-componente` - Gera um novo componente

## 🛠️ Construído com

* [Angular](https://angular.io/) - Framework web
* [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
* [Firebase](https://firebase.google.com/) - Backend e Autenticação
* [Angular Material](https://material.angular.io/) - Design System

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes

## ✒️ Autores

* **Luis Roberto Pinho da Silva Junior** - *Desenvolvimento* - [luisroberto0](https://github.com/luisroberto0)

## 📧 Contato

* Email: luisroberto0@gmail.com

## 💰 Apoie o Projeto

Se este projeto te ajudou de alguma forma, considere fazer uma doação:

* **PIX:** luisroberto0@gmail.com

---
⌨️ com ❤️ por [luisroberto0](https://github.com/luisroberto0)
