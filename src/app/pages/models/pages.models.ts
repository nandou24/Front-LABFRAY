export interface IPaciente {
    tipoDoc: string,
    nroDoc: string,
    nombreCliente: string,
    apePatCliente: string,
    apeMatCliente:string,
    fechaNacimiento: Date,
    sexoCliente: string,
    departamentoCliente: string,
    provinciaCliente: string,
    distritoCliente: string,
    direcCliente: string,
    mailCliente: string,
    //phoneNumber: string,
    //descriptionPhone: string,
    phones: Array<any>[]
}

export interface IPacientePostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
  }