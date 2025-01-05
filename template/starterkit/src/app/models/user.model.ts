export interface User {
    id: string;
    email: string;
    newsletter: boolean;
    username: string;
    password: string;
    primeiroNome?: string;
    apelido?: string;
    morada?: string;
    empresa?: string;
    nif?: string;
    telefone?: string;
    imagem?: string;
    codigoPostal?: string;
  }
