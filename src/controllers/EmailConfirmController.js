"use strict";

// Requiere package:
const path = require("path");
const Sequelize = require("sequelize");
const Response = require(path.join(__dirname, "../services/Response"));
const db = require(path.join(__dirname, "../models/"));
const login = require(path.join(__dirname, "./auth"));
const response = new Response();
const Op = Sequelize.Op;

const index = (req, res) => {
	const idShop = req.body.id;
	const firebaseToken = req.body.tokenFirebase;

	// Shops Validation:
	db.Shops.find({
		where: { [Op.and]: [{ idshop: idShop }] },
		include: [
			{
				model: db.Administrators,
				as: "Administrators"
			}
		]
	}).then(async dataShop => {
		if (dataShop == null) {
			res.status(response.NFI03.status).json(response.NFI03.msg);
		}

		// Login Admin:
		else {
			const loginAdmin = await login.Admin(
				dataShop.Administrators.email,
				firebaseToken,
				dataShop.Administrators,
				true
			);

			if (loginAdmin == 500) {
				res.status(response.SEE01.status).json(response.SEE01.msg);
			} else {
				res.status(200).json(loginAdmin);
			}
		}
	});
};

module.exports = index;
