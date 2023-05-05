const qs = require('querystring');
const dotenv = require('dotenv');
var fs = require('fs');
const h = require('./helper').h;
const connection = require('./connections').connection;
dotenv.config();

var ludoApp = {
    
};

ludoApp.app = {}

ludoApp.app.ludo_login = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body);
            if (input.phone && input.password) {
                connection.db.User.findOne({
                    where: {
                        metadata: {
                            phone: input.phone
                        }
                    }
                }).then(user => {
                    if (user) {
                        h.verify(input.password, user.metadata.password).then(check => {
                            if (check == true) {
                                const token = h.jwt.sign({
                                        name: user.metadata.phone,
                                        auth_code: h.generate_refer_code(7),
                                    },
                                    process.env.LUDO_SECRET,{
                                        expiresIn: '7d'
                                    });
                                    let metadata = user.metadata
                                    metadata.ludo_token = token
                                    user.update({metadata:metadata}).then(done=>{
                                        if(done){
                                            let temp_info ={
                                                secret_id: user.id,
                                                jwt_token: user.metadata.ludo_token
                                            }
                                            h.render_xhr(req, res, {e:0, m:temp_info})
                                        }
                                        else{
                                            h.render_xhr(req, res, {e: 1, m:'JWT creation Failed!'});
                                        }
                                    })
                                
                            } else {
                                h.render_xhr(req, res, {e: 1, m:'Authentication failed!'});
                            }
                        });
                    } else {
                        h.render_xhr(req, res, {e: 1});
                    }
                });
            } else {
                h.render_xhr(req, res, {e: 2, m: 'Phone or password not found!'});
            }
        } catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 3, m: 'Phone or password not found!'});
        }
    })
}

ludoApp.app.get_profile_info = function(req, res){
    h.process_post_input(req, res, function(req,res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{ludo_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    let temp_info = {
                        name:user.metadata.name,
                        email:user.metadata.email,
                        phone:user.metadata.phome_number,
                        user_name:user.metadata.user_name,
                        promo:user.metadata.promo,
                        refer:user.metadata.refer,
                        status:user.metadata.status,
                        total_win:user.metadata.ludo_win,
                        total_balance: user.metadata.total_balance,
                        deposit_balance: user.metadata.deposit_balance,
                        winning_balance: user.metadata.winning_balance,
                        total_match_play: user.metadata.total_ludo_played
                    }
                    h.render_xhr(req, res,{e:0, m:temp_info})
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

ludoApp.app.statastic_palyed_ludo_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{ludo_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            userId:user.id
                        },
                        include:[{model: connection.db.LudoMatch}]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            if(each_entry.ludo_match){
                                let tem_entry ={
                                    match_title: each_entry.ludo_match.metadata.title,
                                    palyed_on: each_entry.ludo_match.metadata.date + ', '+ each_entry.ludo_match.metadata.time,
                                    paid: 0,
                                    winning: 0,
                                    refund_amount: 0
                                }
                    
                                if(each_entry.metadata.paid){
                                    tem_entry.paid = each_entry.metadata.paid
                                };
                    
                                if(each_entry.metadata.winning_money){
                                    tem_entry.winning = each_entry.metadata.winning_money
                                }
                    
                                if(each_entry.metadata.refund_amount){
                                    tem_entry.refund_amount = each_entry.metadata.refund_amount
                                }
                                all_entry.push(tem_entry)
                            }
                            
                            
                    
                        })
                        h.render_xhr(req, res, {e:0, m:all_entry})
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
        };
    })
}

ludoApp.app.show_slider_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let slider_list = []
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{ludo_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.LudoAppSlider.findAll({
                        where:{
                            metadata:{
                                status:'active'
                            }
                        }
                    }).then(sliders =>{
                        sliders.forEach(function(each_slider){
                            let temp_slider ={
                                slider_id: each_slider.id,
                                title:each_slider.metadata.title,
                                link:each_slider.metadata.link,
                                image_link:'https://testv2.khelo.live/ludo-app-slider/' + each_slider.metadata.image
                            }
                            slider_list.push(temp_slider)
                        })
                        h.render_xhr(req, res, {e:0, m:slider_list})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 2, m:err});
        }
    })
}

exports.ludoApp = ludoApp;