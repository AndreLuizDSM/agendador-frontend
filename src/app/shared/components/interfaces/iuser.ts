export interface UserRegisterPayload {
  nome: string
  email: string,
  senha: string,
  enderecos?: {  // ? -> Pode não existir e retornar nada
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }[],
  telefones?: {
    ddd: string,
    numero: string
  }[]

}

// Dto Response
export interface UserResponse {
  nome: string,
  email: string,
  enderecos: {
    id: number,
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }[] | null,
  telefones: {
    id: number,
    ddd: string,
    numero: string
  }[] | null
}

export interface UserLoginPayload {
  email: string,
  senha: string,
}

export interface CepResponse {
  bairro: string,
  cep: string,
  complemento: string,
  estado: string,
  localidade: string,
  logradouro: string,
  regiao?: string,
  uf: string
}

export interface TelefonePayload {
  numero: string,
  ddd: string
}

export interface TelefoneResponse {
  id: number
  numero: string,
  ddd: string
}

export interface EnderecoPayload {
  rua: string,
  complemento: string,
  cep: string,
  numero: number,
  cidade: string,
  estado: string
}

export interface EnderecoResponse {
  id: number,
  rua: string,
  complemento: string,
  cep: string,
  numero: number,
  cidade: string,
  estado: string
}

