//PACIENTE

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

//RECURSO HUMANO

export interface IRecHumano {
    codRecHumano: string,
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

export interface IRecHumanoPostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
}

export interface IGetLastRecHumano {
    ok: boolean;
    search: String;
    recHumanos: IRecHumano[];
}


//PRUEBA LAB

export interface IPruebaLab {
    codPruebaLab: string,
    areaLab: string,
    nombrePruebaLab: string,
    condPreAnalitPaciente: string,
    condPreAnalitRefer: string,
    tipoMuestra: string[];
    tipoTuboEnvase: string[],
    tiempoEntrega: string,
    //precioPrueba: string,
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

//ITEM LAB

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

//COTIZACIÓN

export interface ICotizacion {
    codCotizacion: string,
    estadoRegistroPaciente: boolean,
    codCliente: string,
    nomCliente: string,
    tipoDoc: string,
    nroDoc: string,
    estadoRegistroMedico: boolean,
    codMedico: string,
    nomMedico: string,
    colegiatura: string,
    nroRne: string,
    aplicarPrecioGlobal: boolean,
    aplicarDescuentoPorcentGlobal: boolean,
    sumaTotalesPrecioLista: number,
    listaMenosDescuento: number,
    precioConDescGlobal: number,
    descuentoPorcentaje: number,
    subTotal: number,
    igv: number,
    total: number,
    serviciosCotizacion: Array<any>[] 
}

export interface ICotizacionPostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
}

export interface IGetLastCotizacion {
    ok: boolean;
    search: String;
    cotizaciones: ICotizacion[];
}

//SERVICIO

export interface IServicio {
    codServicio: string,
    tipoServicio: string,
    nombreServicio: string,
    descripcionServicio: string,
    precioServicio: string,
    estadoServicio: string,
    examenesServicio: Array<any>[] 
}

export interface IServicioPostDTO {
    ok: boolean;
    msg?: string;
    errors?: string;
}

export interface IGetLastServicio {
    ok: boolean;
    search: String;
    servicios: IServicio[];
}

export interface IGetLastExamenes {
    ok: boolean;
    search: String;
    examenes: Array<any>[]
}
