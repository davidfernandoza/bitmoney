'use strict'
class Response {

	// Errors:
	constructor (){
		this.NFU03 = {status: 400, msg:{errCode: 'NFU03', Observacion: 'El username no fue encontrado.'}}
		this.NVP04 = {status: 400, msg:{errCode: 'NVP04', Observacion: 'La contraseña es incorrecta.'}}
		this.NFI04 = {status: 400, msg:{errCode: 'NFI04', Observacion: 'El id no fue encontrado.'}}
		this.NFI03 = {status: 400, msg:{errCode: 'NFI03', Observacion: 'El id no fue encontrado.'}}
		this.NFE03 = {status: 400, msg:{errCode: 'NFE03', Observacion: 'El correo no fue encontrado.'}}
		this.NFC04 = {status: 400, msg:{errCode: 'NFC04', Observacion: 'La moneda no fue encontrada.'}}
		this.NVRP03 = {status: 400, msg:{errCode: 'NVRP03', Observacion: 'El pin de registro es incorrecto.'}}
		this.NCTV01 = {status: 403, msg:{errCode: 'NCTV01', Observacion: 'El cuerpor de la consulta es incorrecto.'}}/* TODO nuevo */
		this.NVTV02 = {status: 403, msg:{errCode: 'NVTV02', Observacion: 'El token de verificación es incorrecto.'}}
		this.NFP06 = {status: 403, msg:{errCode: 'NFP06', Observacion: 'Se requirió un cambio de contraseña.'}} /* TODO nuevo */
		this.NVTI03 = {status: 403, msg:{errCode: 'NVTI03', Observacion: 'El token de usuario es incorrecto.'}}
		this.NFSI01 = {status: 403, msg:{errCode: 'NFSI01', Observacion: 'El id de la ciudad es incorrecto.'}} /* TODO: nuevo */
		this.NFSI02 = {status: 403, msg:{errCode: 'NFSI02', Observacion: 'El id del pais es incorrecto o no tiene una divisa asociada.'}} /* TODO: nuevo */
		this.NFSI03 = {status: 403, msg:{errCode: 'NFSI03', Observacion: 'El id del banco es incorrecto.'}} /* TODO: nuevo */
		this.NFSI04 = {status: 403, msg:{errCode: 'NFSI04', Observacion: 'El id del tipo de cuenta bancaria es incorrecto.'}} /* TODO: nuevo */
		this.NEB01 = {status: 403, msg:{errCode: 'NEB01', Observacion: 'No existen billeteras para asignar.'}} /* TODO: nuevo */
		this.AEE04 = {status: 403, msg:{errCode: 'AEE04', Observacion: 'El correo ya existe.'}}
		this.AEE07 = {status: 403, msg:{errCode: 'AEE07', Observacion: 'El numero de cuenta bancaria es incorrecto.'}} /* TODO: nuevo */
		this.PEB01 = {status: 403, msg:{errCode: 'PEB01', Observacion: 'No existen ventas pendientes para asignarle a un pago.'}}/* TODO nuevo */
		this.PEB02 = {status: 403, msg:{errCode: 'PEB02', Observacion: 'El id del tipo de pago es incorrecto.'}}/* TODO nuevo */
		this.PEB03 = {status: 403, msg:{errCode: 'PEB03', Observacion: 'La ciudad donde se ubica la tienda no soporta pagos en efectivo.'}}/* TODO nuevo */
		this.SPI01 = {status: 403, msg:{errCode: 'SPI01', Observacion: 'Se requiere conpletar la información del perfil.'}}/* TODO nuevo */
		this.NVM01 = {status: 405, msg:{errCode: 'NVM01', Observacion: 'El método usado no es el correcto.'}}
		this.SEE01 = {status: 500, msg:{errCode: 'SEE01', Observacion: 'Error interno de servidor.'}}/* TODO nuevo */
	}
}

module.exports = Response
