export interface IPaciente {
    hc: string,
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
    phones: Array<any>[]
}

export interface IPacientePostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
}

export interface IGetLastPatients {
    ok: boolean;
    search: String;
    pacientes: IPaciente[];
}

export interface IPruebaLab {
    codPruebaLab: string,
    areaLab: string,
    nombrePruebaLab: string,
    condPreAnalitPaciente: string,
    condPreAnalitRefer: string,
    tipoMuestra: string[];
    tipoTuboEnvase: string[],
    tiempoEntrega: string,
    precioPrueba: string,
    observPruebas: string,
    estadoPrueba: string,
    itemsCompenentes: Array<any>[]
}

export interface IPruebaLabPostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
}

export interface IGetLastPruebasLab {
    ok: boolean;
    search: String;
    pruebasLab: IPruebaLab[];
}

export interface IItemLab {
    codItemLab: string,
    nombreItemLab: string,
    metodoItemLab: string,
    plantillaValores: string,
    unidadesRef: string,
    observItem: string,
    poseeValidacion: string,
    paramValidacion: Array<any>[]
}

export interface IItemLabPostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
}

export interface IGetLastItemsLab {
    ok: boolean;
    search: String;
    itemsLab: IItemLab[];
}

export interface IExamenCotizado {
    codPruebaLab: string,
    nombrePruebaLab: string,
    cantidad: number,
    precioUnitario: number,
    totalUnitario: number,
    tipoDescuento: string,
    descuento: number,
    
}