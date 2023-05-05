const qs = require('querystring');
const dotenv = require('dotenv');
const h = require('../helper').h;
const connection = require('../connections').connection;
dotenv.config();

var add_money ={}

add_money.login = function(req, res){
      h.process_post_input(req, res, function(req, res, body){
          try{
              let input = qs.parse(body)
              connection.db.Admin.findOne({
                  where:{
                      metadata:{
                          user_name:'Robi123'
                      }
                  }
              }).then(admin =>{
                  if(admin){
                      console.log('find user_name')
                      if(input.auth_code && input.password){
                      if(admin.metadata && admin.metadata.password){
                          h.verify(input.password, admin.metadata.password).then(check => {
                              if (check == true) {
                                  console.log('match_pass')
                                  const token = h.jwt.sign({
                                      name: admin.metadata.user_name,
                                      auth_key: input.auth_code,
                                  },
                                  process.env.ADMIN_JWT_SECRET,{
                                      expiresIn: '24h'
                                  });
                                  let metadata = admin.metadata
                                  metadata.api_token = token
                                  admin.update({metadata:metadata}).then(logged_in =>{
                                      if(logged_in){
                                          let new_admin ={
                                              secret_id: admin.id,
                                              api_token: admin.metadata.api_token
                                          }
                                          h.render_xhr(req, res, {e:0, m:new_admin})
                                      }
                                  })
                              }
                              else{
                                  console.log('pass not match')
                                  h.render_xhr(req, res, {e:1, m:'Authentication Failed'})
                              }
                          })
                      }
                  }
                  else{
                      h.render_xhr(req, res, {e:1, m:'You are not admin!'})
                  }
                  }
                  else{
                      console.log('user not match')
                      h.render_xhr(req, res, {e:1, m:'You are not admin!'})
                  }
              })
          }
          catch (err) {
              console.log(err);
              h.render_xhr(req, res, {e: 1});
          }
      })
  }

add_money.show_add_money_request = function(req, res){
      h.process_post_input(req, res, function(req, res, body){
          try{
              let input = qs.parse(body)
              const Op = h.Sequelize.Op;
              let all_add_request = []
              connection.db.Admin.findOne({
                  where:{
                      [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                  }
              }).then(admin =>{
                  if(admin){
                      connection.db.AccountingEntry.findAll({
                          where:{
                              [Op.and]:[{metadata:{status:'requested'}},{metadata:{type:'Add Money'}},{metadata:{payment_method:input.payment_method}}]
                          },
                          order:[['createdAt', 'ASC']],
                          include:[{model: connection.db.User}]
                      }).then(add_money =>{
                          add_money.forEach(function(each_add){
                              if(each_add.user.metadata.status == 'active'){
                                  let temp_add = {
                                      add_money_id:each_add.id,
                                      name:each_add.user.metadata.name,
                                      user_name: each_add.user.metadata.user_name,
                                      amount:each_add.metadata.amount,
                                      payment_method:each_add.metadata.payment_method,
                                      phone_number:each_add.metadata.phone_number,
                                      requested_time: h.moment(new Date(each_add.createdAt)).add(0, 'h').local().format('MMMM Do YYYY, h:mm a')
                                  }
                                  all_add_request.push(temp_add)
                              }
                          })
                          h.render_xhr(req, res, {e:0, m:all_add_request});
                      })
                  }
                  else{
                      h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                  }
              })
          }
          catch (err) {
              console.log(err);
              h.render_xhr(req, res, {e: 1});
          }
      })
  }

 add_money.add_money_accepted = function(req, res){
      h.process_post_input(req, res, function(req, res, body){
          try{
              
                  let input = qs.parse(body)
                  const Op = h.Sequelize.Op;
                  connection.db.Admin.findOne({
                      where:{
                          [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                      }
                  }).then(admin =>{
                      if(admin){
                          connection.db.AccountingEntry.findOne({
                              where:{
                                  id:input.add_money_id
                              },
                              include:[{model: connection.db.User}]
                          }).then(entry =>{
                              let metadata = entry.metadata
                              metadata.status = 'accepted'
                              metadata.accepted_by = admin.id
                              entry.update({metadata:metadata, adminId:admin.id}).then(updated =>{
                                  if(updated){
                                      let new_user = entry.user
                                      let metadata = new_user.metadata
                                      metadata.total_balance = parseInt(metadata.total_balance) + parseInt(entry.metadata.amount)
                                      
                                      metadata.deposit_balance = parseInt(metadata.deposit_balance) + parseInt(entry.metadata.amount)
                                      new_user.update({metadata:metadata}).then(done =>{
                                          if(done){
                                              let title = 'Add Money'
                                              let body = 'Successfully accepted!'
                                              let topic = `NotificationForAddMoney${entry.id}`
                                              h.send_notification(title, body, topic)
                                              h.render_xhr(req, res, {e:0})
                                          }
                                      })
                                  }
                              })
                          })
                      }
                      else{
                          h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                      }
                  })
                     
                      
          }
          catch (err) {
              console.log(err);
              h.render_xhr(req, res, {e: 1});
          }
      })
  }

  add_money.add_money_rejected = function(req, res){
      h.process_post_input(req, res, function(req, res, body){
          try{
              
                  let input = qs.parse(body)
                  const Op = h.Sequelize.Op;
                  connection.db.Admin.findOne({
                      where:{
                          [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                      }
                  }).then(admin =>{
                      if(admin){
                          connection.db.AccountingEntry.findOne({
                              where:{
                                  id:input.add_money_id
                              },
                              include:[{model: connection.db.User}]
                          }).then(entry =>{
                              let metadata = entry.metadata
                              metadata.status = 'rejected'
                              metadata.rejected_by = admin.id
                              entry.update({metadata:metadata, adminId:admin.id}).then(updated =>{
                                  if(updated){
                                      let title = 'Add Money'
                                      let body = 'Sorry! Rejected.'
                                      let topic = `NotificationForAddMoney${entry.id}`
                                      h.send_notification(title, body, topic)
                                      h.render_xhr(req, res, {e:0})
                                  }
                              })
                          })
                      }
                      else{
                          h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                      }
                  })
                     
                      
          }
          catch (err) {
              console.log(err);
              h.render_xhr(req, res, {e: 1});
          }
      })
  }

exports.add_money = add_money