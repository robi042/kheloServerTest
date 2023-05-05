const qs = require('querystring');
const dotenv = require('dotenv');
var fs = require('fs');
const h = require('./helper').h;
const connection = require('./connections').connection;
dotenv.config();

var ludoAppAdmin = {
    
};

ludoAppAdmin.admin = {}

ludoAppAdmin.admin.add_new_slider = function(req, res){
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
                    if(input.title && input.image && input.link){
                        let slider_info = {
                            metadata:{
                                title:input.title,
                                status:'active',
                                link:input.link
                            },
                            adminId:admin.id
                        }
                        connection.db.LudoAppSlider.create(slider_info).then(created =>{
                            if(created){
                                let metadata = created.metadata
                                metadata.image = created.id+'.png'
                                var img = input.image
                                // strip off the data: url prefix to get just the base64-encoded bytes
                                var data = img.replace(/^data:image\/\w+;base64,/, "");
                                var buf = Buffer.from(data, 'base64');
                                fs.writeFile(`./ludo_app_slider/${created.id}.png`, buf, function(err) {
                                    if (err){
                                        h.render_xhr(req, res, {e:3, m:err})
                                    }
                                    else{
                                        created.update({metadata:metadata}).then(updated =>{
                                            if(updated){
                                                h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                                            }
                                            else{
                                                h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                            }
                                        })
                                    }
                                });
                            }
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:1, m:'input missing!'})
                    }
                }
                else{
                    h.render_xhr(req, res, {e:2, m:'Authentication failed!'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 3, m:err});
        }
    })
}

ludoAppAdmin.admin.show_slider_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let slider_list = []
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin){
                    connection.db.LudoAppSlider.findAll({
                        where:{
                            metadata:{
                                status:input.status
                            }
                        }
                    }).then(slider =>{
                        slider.forEach(function(each_slider){
                            let temp_slider ={
                                slider_id: each_slider.id,
                                title:each_slider.metadata.title,
                                link:each_slider.metadata.link,
                                status:each_slider.metadata.status,
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
            h.render_xhr(req, res, {e: 2,m:err});
        }
    })
}

ludoAppAdmin.admin.active_inactive_slider = function(req, res){
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
                    connection.db.LudoAppSlider.findOne({
                         where:{
                            id:input.slider_id
                        }
                    }).then(sub_admin =>{
                        if(sub_admin){
                            if(sub_admin.metadata.status == 'active'){
                                let metadata = sub_admin.metadata
                                metadata.status = 'inactive'
                                sub_admin.update({metadata:metadata}).then(updated =>{
                                    if(updated){
                                        h.render_xhr(req, res, {e:0, m:'updated succesfully!'})
                                    }
                                    else{
                                        h.render_xhr(req, res, {e:3, m:'something went wrong!'})
                                    }
                                })
                            }
                            else if(sub_admin.metadata.status == 'inactive'){
                                let metadata = sub_admin.metadata
                                metadata.status = 'active'
                                sub_admin.update({metadata:metadata}).then(updated =>{
                                    if(updated){
                                        h.render_xhr(req, res, {e:0, m:'updated succesfully!'})
                                    }
                                    else{
                                        h.render_xhr(req, res, {e:3, m:'something went wrong!'})
                                    }
                                })
                            }
                            else{
                                h.render_xhr(req, res, {e:4, m:'no operation executed!'})
                            }

                        }
                        else{
                            h.render_xhr(req, res, {e:2, m:'no slider found!'})
                        }
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

exports.ludoAppAdmin = ludoAppAdmin;