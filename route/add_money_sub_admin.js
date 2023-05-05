
const express = require('express');
const route = express.Router();
const show_request = require('../controller/add_money_sub_admin').add_money;


route.get('/login', show_request.login)
route.post('/get_all_request', show_request.show_add_money_request)
route.post('/accept-add-money', show_request.add_money_accepted)
route.post('/reject-add-money', show_request.add_money_rejected)


exports.route = route