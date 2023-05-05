const qs = require('querystring');
var fs = require('fs');
const { hash } = require('bcryptjs');
const h = require('./helper').h;
const connection = require('./connections').connection;

var buyAndSell = {
    
};

buyAndSell.admin = {}

buyAndSell.admin.add_new_product = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    let temp ={
                        metadata:{
                            title:input.title,
                            type: input.type,
                            description: input.description,
                            price: parseInt(input.price),
                            youtube_link: input.watch_link,
                            link:input.link
                        },
                        adminId:admin.id
                    }
                    if(input.discount){
                        temp.metadata.discount = parseInt(input.discount)
                        temp.metadata.hasDiscount = true,
                        temp.metadata.discounted_price = parseInt(input.price) - (parseInt(input.price) * parseInt(input.discount)) / 100

                    }
                    connection.db.buyAndSell.create(temp).then(created =>{
                        if(created){
                            let metadata = created.metadata
                            metadata.image = created.id+'.png'
                            var img = input.image
                            // strip off the data: url prefix to get just the base64-encoded bytes
                            var data = img.replace(/^data:image\/\w+;base64,/, "");
                            var buf = Buffer.from(data, 'base64');
                            fs.writeFile(`./products/${created.id}.png`, buf, function(err) {
                                if (err){
                                    console.log(err)
                                    h.render_xhr(req, res, {e:1})
                                }
                                else{
                                    match.update({metadata:metadata}).then(updated =>{
                                        if(updated){
                                            h.render_xhr(req, res, {e:0})
                                        }
                                        else{
                                            h.render_xhr(req, res, {e:2})
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            h.render_xhr(req, res, { e: 1, m: 'Something went wrong!' })
                        }
                    })
                   
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

buyAndSell.admin.get_products = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op
            let product_list = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                   connection.db.buyAndSell.findAll({
                       where:{
                           hasSold:null
                       }
                   }).then(product =>{
                       product.forEach(function(each_product){
                           let temp ={
                               product_id: each_product.id,
                               title:each_product.metadata.title,
                               description: each_product.metadata.description,
                               image:'https://testv2.khelo.live/products/'+each_product.metadata.image,
                               watch_link: each_product.metadata.youtube_link,
                               price: each_product.metadata.price
                           }
                           if(each_product.metadata.link){
                               temp.link = each_product.metadata.link
                           }
                           if(each_product.metadata.hasDiscount){
                               temp.hasDiscount = true,
                               temp.discount = each_product.metadata.discount,
                               temp.discounted_price = each_product.metadata.discounted_price
                           }
                           product_list.push(temp)

                       })
                       h.render_xhr(req, res, {e:0, m:product_list})
                   })
                   
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}


buyAndSell.admin.update_percentage = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                   connection.db.buyAndSell.findOne({
                       where:{
                           id:input.product_id
                       }
                   }).then(product =>{
                       let metadata = product.metadata
                       metadata.hasDiscount = true
                       metadata.discount = input.discount,
                       discounted_price = parseInt(product.metadata.price) - (parseInt(product.metadata.price) * parseInt(input.discount)) / 100
                       product.update({metadata:metadata}).then(updated =>{
                           h.render_xhr(req, res, {e:0, m:'successfully!'})
                       })
                   })
                   
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

buyAndSell.admin.delete_product = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                   connection.db.buyAndSell.findOne({
                       where:{
                           id:input.product_id
                       }
                   }).then(product =>{
                        let metadata = product.metadata
                        metadata.hasSold = true
                        product.update({metadata:metadata}).then(updated =>{
                            h.render_xhr(req, res, {e:0, m:'successfully!'})
                        })
                   })
                   
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

buyAndSell.player ={}

buyAndSell.player.get_shop_product_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let product_list = []
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.buyAndSell.findAll({
                        where:{
                            metadata:{
                                hasSold:null
                            }
                        }
                    }).then(product =>{
                        product.forEach(function(each_product){
                            let temp ={
                                product_id: each_product.id,
                                title:each_product.metadata.title,
                                description: each_product.metadata.description,
                                image:'https://testv2.khelo.live/products/'+each_product.metadata.image,
                                watch_link: each_product.metadata.youtube_link,
                                price: each_product.metadata.price
                            }
                            if(each_product.metadata.link){
                                temp.link = each_product.metadata.link
                            }
                            if(each_product.metadata.hasDiscount){
                                temp.hasDiscount = true,
                                temp.discount = each_product.metadata.discount,
                                temp.discounted_price = each_product.metadata.discounted_price
                            }
                            product_list.push(temp)
 
                        })
                        h.render_xhr(req, res, {e:0, m:product_list})
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



exports.buyAndSell = buyAndSell;