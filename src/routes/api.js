'use strict'

// Requiere package:
const path = require('path')
const express = require('express')
const controllers = require(path.join(__dirname, '../controllers'))
const middlewares = require(path.join(__dirname, '../middlewares'))
const routes = express.Router()

/*---------------------------------------------------------*/
/* Unprotected Routes                                      */
/*---------------------------------------------------------*/

// Register:
routes.post('/register/',
	middlewares.RequestValidator.regiter,
	middlewares.StaticToken,
	controllers.RegisterController)

//Email Confirm:
routes.post('/store/mail/confirm/',
	middlewares.RequestValidator.EmailConfirm,
	middlewares.StaticToken,
	controllers.EmailConfirmController)

// Login:
routes.post('/login/',
	middlewares.RequestValidator.login,
	middlewares.StaticToken,
	controllers.LoginController)

// Forgot Password Admin:
routes.post('/store/forgot/password/',
	middlewares.RequestValidator.forgotPassword,
	middlewares.StaticToken,
	controllers.ForgotPasswordController)

// Restore Password Admin:
routes.post('/store/new/password/',
	middlewares.RequestValidator.storeNewPassword,
	middlewares.StaticToken,
	controllers.NewPasswordController)

// New Password Seller:
routes.post('/seller/new/password/',
	middlewares.RequestValidator.sellerNewPassword,
	middlewares.StaticToken,
	controllers.NewPasswordSellerController)

/*----------------------------------------------------------*/
/* Protected Routes                                         */
/*----------------------------------------------------------*/

// Restore Password Seller:
routes.post('/seller/change/password/',
	middlewares.RequestValidator.changePassword,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.ChangePasswordController)

// Info of Administrators:
routes.get('/store/edit/profile/info/',
	middlewares.RequestValidator.infoProfile,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.InfoProfileController)

// Edit Profile Shop and Administrator:
routes.post('/store/edit/profile/',
	middlewares.RequestValidator.editProfile,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.EditProfileController)

// Sellers list:
routes.get('/store/sellers/',
	middlewares.RequestValidator.sellers,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.SellersController)

// States list:
routes.post('/store/edit/profile/department/',
	middlewares.RequestValidator.department,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.DepartmentController)

// Cities list:
routes.post('/store/edit/profile/city/',
	middlewares.RequestValidator.cities,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.CitiesController)

// New Sellers:
routes.post('/store/new/seller/',
	middlewares.RequestValidator.seller,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.NewSellerController)

// Sales History
routes.get('/store/sales/history/',
	middlewares.RequestValidator.historySales,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.HistorySalesController)

// Sales History
routes.post('/seller/sales/',
	middlewares.RequestValidator.sellerSales,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.SellerSalesController)

// Delete Seller
routes.post('/seller/delete/',
	middlewares.RequestValidator.deleteSeller,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.DeleteSellerController)

// Policies:
routes.get('/store/policies/',
	middlewares.RequestValidator.policies,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.PoliciesController)

// Schedule Payments:
routes.get('/store/schedule/payments/',
	middlewares.RequestValidator.schedulePayments,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.SchedulePaymentsController)

// Update Program Payment:
routes.post('/store/update/payment/',
	middlewares.RequestValidator.updatePayment,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.UpdatePaymentController)

// History Payment:
routes.get('/store/history/payments/',
	middlewares.RequestValidator.historyPayments,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.HistoryPaymentsController)

// Request Payment Info:
routes.get('/store/request/payment/info/',
	middlewares.RequestValidator.paymentsInfo,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.PaymentsInfoController)

// Request Payment:
routes.post('/store/request/payment/',
	middlewares.RequestValidator.requestPayments,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.RequestPaymentsController)

// Collection Info:
routes.get('/store/process/collection/info/',
	middlewares.RequestValidator.collectionInfo,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.CollectionInfoController)

// Process Collection:
routes.post('/store/process/collection/',
	middlewares.RequestValidator.processCollection,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.ProcessCollectionController)

// Cancel Collection:
routes.post('/store/cancel/transaction/',
	middlewares.RequestValidator.cancelCollection,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.CancelCollectionController)

// Update Firebase:
routes.post('/store/update/firebase/',
	middlewares.RequestValidator.updateFirebase,
	middlewares.StaticToken,
	middlewares.Auth,
	controllers.UpdateFirebaseController)

module.exports = routes
