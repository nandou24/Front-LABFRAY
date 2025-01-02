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
    metodoPruebaLab: string,
    tipoMuestra: string[];
    tipoTuboEnvase: string[],
    tiempoEntrega: string,
    precioPrueba: string,
    observPruebas: string,
    estadoPrueba: string,
    compuestaPrueba: string,
    tipoResultado: string,
    valorRefCuali: string,
    valorRefCuantiLimInf: string,
    valorRefCuantiLimSup: string,
    unidadesRef: string,
    otrosValoresRef: string 
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