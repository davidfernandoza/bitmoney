'use strict'

// Require package:
const path = require('path')
const { body, header, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const Response = require(path.join(__dirname, '../services/Response'))
const response = new Response()

// Regiter
exports.regiter =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Name:
	body('name').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),

	// Email:
	body('email').exists().not().isEmpty().isLength({min: 5, max:100 }).isEmail().trim().rtrim().escape().normalizeEmail(),

	// Password:
	body('password').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),

	// Registration Pin:
	body('registrationPin').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),
	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// EmailConfirm
exports.EmailConfirm =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Id:
	body('id').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// TokenFirebase:
	body('tokenFirebase').exists().not().isEmpty().isLength({ min: 5, max:350 }).trim().rtrim(),
	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Login:
exports.login =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Username:
	body('username').exists().not().isEmpty().isLength({max:50 }).trim().rtrim().escape(),

	// TokenFirebase:
	body('tokenFirebase').exists().not().isEmpty().isLength({ min: 5, max:350 }).trim().rtrim().escape(),

	// Password:
	body('password').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),
	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// ForgotPassword:
exports.forgotPassword =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// email:
	body('email').exists().not().isEmpty().isLength({min: 5, max:100}).isEmail().trim().rtrim().escape().normalizeEmail(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// StoreNewPassword:
exports.storeNewPassword =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// idStore:
	body('idStore').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// Password:
	body('password').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// SellerNewPassword
exports.sellerNewPassword =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// idSeller:
	body('idSeller').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// Password:
	body('password').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]


/*----------------------------------------------------------*/
/* Protected Routes                                         */
/*----------------------------------------------------------*/

// ChangePassword
exports.changePassword =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// idSeller:
	body('idSeller').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]


// InfoProfile
exports.infoProfile =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// EditProfile
exports.editProfile =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// Bank:
	body('bank').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// AccountType
	body('accountType').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// AccountNumber
	body('accountNumber').exists().not().isEmpty().isLength({max:50}).trim().rtrim().escape(),

	// AccountHolder
	body('accountHolder').exists().not().isEmpty().isLength({max:50}).trim().rtrim().escape(),

	// DocumentNumber
	body('documentNumber').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// Cellphone
	body('cellphone').exists().not().isEmpty().isLength({max:50}).isNumeric().trim().rtrim().escape(),

	// City
	body('city').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// Country
	body('country').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// Address
	body('address').exists().not().isEmpty().isLength({max:100 }).trim().rtrim().escape(),

	// Name
	body('name').exists().not().isEmpty().isLength({max:50 }).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Sellers
exports.sellers =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Department
exports.department =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// Country
	body('idCountry').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Cities
exports.cities =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// Departament
	body('idDepartment').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Seller
exports.seller =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// Name:
	body('name').exists().not().isEmpty().isLength({ min: 5, max:50 }).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]


// HistorySales
exports.historySales =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// SellerSales
exports.sellerSales =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// idSeller:
	body('idSeller').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// DeleteSeller
exports.deleteSeller =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// idSeller:
	body('idSeller').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Policies
exports.policies =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// SchedulePayments
exports.schedulePayments =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// UpdatePayment
exports.updatePayment =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// idPayment:
	body('idPayment').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// HistoryPayments
exports.historyPayments =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// PaymentsInfo
exports.paymentsInfo =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// RequestPayments
exports.requestPayments =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// idtypepayment:
	body('idtypepayment').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// CollectionInfo
exports.collectionInfo =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Process Collection
exports.processCollection =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// Coin:
	body('coin').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	// Value:
	body('value').exists().not().isEmpty().isLength({max:50}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Cancel Collection
exports.cancelCollection =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// idTransaction:
	body('idTransaction').exists().not().isEmpty().isLength({max:11}).isNumeric().trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]

// Update Firebase
exports.updateFirebase =  [

	// Heater token
	header('http_wlv_token').exists().not().isEmpty().trim().rtrim().escape().isLength({min:50, max:50}),

	// Heater identifier
	header('http_wlv_identifier').exists().not().isEmpty().isLength({max:500}).trim().rtrim().escape(),

	// tokenFirebase:
	body('tokenFirebase').exists().not().isEmpty().isLength({max:350}).trim().rtrim().escape(),

	sanitizeBody('notifyOnReply').toBoolean(),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) res.status(response.NCTV01.status).json(response.NCTV01.msg)
		else next()
	}
]
