export interface TaskResponse {
  id: string,
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string,
  dataEvento: string,
  emailUsuario: string,
  dataAlteracao: string,
  statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}

export interface TaskPayLoad {
  nomeTarefa: string,
  descricao: string,
  dataEvento: string,
  dataAlteracao?: string
}