const qs = require('querystring');
var fs = require('fs');
const { hash } = require('bcryptjs');
const h = require('./helper').h;
const connection = require('./connections').connection;




var promoter = {
    
};


promoter.admin ={}

promoter.admin.login = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            connection.db.Promoter.findOne({
                where:{
                    metadata:{
                        user_name:input.user_name
                    }
                }
            }).then(admin =>{
                if(admin){
                    if(input.auth_code && input.password){
                    if(admin.metadata && admin.metadata.password){
                        h.verify(input.password, admin.metadata.password).then(check => {
                            if (check == true) {
                                const token = h.jwt.sign({
                                    name: admin.metadata.user_name,
                                    auth_key: input.auth_code,
                                },
                                process.env.PROMOTER_JWT_TOKEN,{
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

promoter.admin.add_a_link = function(req, res){
    h.process_post_input(req, res, function(res, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if(promoter){
                    let temp ={
                        metadata:{
                            type: input.type,
                            link:input.link
                        }
                        ,promoterId:promoter.id
                    }
                    connection.db.PromoterLink.create(temp)
                        .then(created =>{
                            if(created){
                                h.render_xhr(req, res, {e:0, m:'Succesfully created!'})
                            }
                            else{
                                h.render_xhr(req, res, {e:2, m:'something went wrong!'})
                            }
                        })
                        .catch(err =>{
                            console.log(err)
                            h.render_xhr(req, res, {e:2, m:'something went wrong!'})
                        })
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.admin.add_promoter_history = function(req, res){
    h.process_post_input(req, res, function(res, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if(promoter){
                    let temp ={
                        metadata:{
                            link:input.link
                        },
                        promoterId:promoter.id
                    }
                    if(input.title){
                        temp.metadata.title = input.title
                    }
                    else{
                        temp.metadata.title = ''
                    }
                    
                    connection.db.PromoterHistory.create(temp).then(created =>{
                        if(created){
                            let metadata = created.metadata
                            metadata.image = created.id+'.png'
                            var img = input.image
                            // strip off the data: url prefix to get just the base64-encoded bytes
                            var data = img.replace(/^data:image\/\w+;base64,/, "");
                            var buf = Buffer.from(data, 'base64');
                            fs.writeFile(`./promoters/${created.id}.png`, buf, function(err) {
                                if (err){
                                    console.log(err)
                                    h.render_xhr(req, res, {e:1})
                                }
                                else{
                                    created.update({metadata:metadata}).then(updated =>{
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
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.admin.get_profile = function(req, res){
    h.process_post_input(req, res, function(res, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if(promoter){
                     let promoter_list = {
                        user_name: promoter.metadata.user_name,
                        name: promoter.metadata.name,
                        phone: promoter.metadata.phone,
                        status: promoter.metadata.status
                    }
                    h.render_xhr(req, res, {e:0, m:promoter_list})
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.admin.get_links = function(req, res){
    h.process_post_input(req, res, function(res, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let link_list = []
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if(promoter){
                    connection.db.PromoterLink.findOne({
                        where:{
                            promoterId:promoter.id,
                            metadata:{
                                type:input.type
                            }
                        },
                        order: [['createdAt', 'DESC']]
                    }).then(links =>{
                         let temp = {
                                type:links.metadata.type,
                                link: links.metadata.link
                            }
                        h.render_xhr(req, res, {e:0, m:temp})
                    })
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.admin.get_memories = function(req, res){
    h.process_post_input(req, res, function(res, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_history = []
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if(promoter){
                    connection.db.PromoterHistory.findAll({
                        where:{
                            promoterId:promoter.id,
                        },
                        order: [['createdAt', 'DESC']]
                    }).then(promoters_history =>{
                        
                        promoters_history.forEach(function(each_history){
                            let temp ={
                                link: each_history.metadata.link,
                            }
                            if(each_history.metadata.title){
                                temp.title = each_history.metadata.title
                            }
                            if(each_history.metadata.image){
                                temp.image = 'https://testv2.khelo.live/promoters/'+each_history.metadata.image
                            }
                            all_history.push(temp)
                        })
                        h.render_xhr(req, res, {e:0, m:all_history})
                    }) 
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.admin.add_new_promoter_slider = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if (promoter) {
                    if (input.image) {
                        let slider_info = {
                            metadata: {
                                status: 'active'
                            },
                            promoterId: promoter.id
                        }
                        connection.db.PromoterSlider.create(slider_info).then(created => {
                            if (created) {
                                let metadata = created.metadata
                                metadata.image = created.id + '.png'
                                var img = input.image
                                // strip off the data: url prefix to get just the base64-encoded bytes
                                var data = img.replace(/^data:image\/\w+;base64,/, "");
                                var buf = Buffer.from(data, 'base64');
                                fs.writeFile(`./promoterSlider/${created.id}.png`, buf, function (err) {
                                    if (err) {
                                        h.render_xhr(req, res, { e: 3, m: err })
                                    }
                                    else {
                                        created.update({ metadata: metadata }).then(updated => {
                                            if (updated) {
                                                h.render_xhr(req, res, { e: 0, m: 'Successfully added!' })
                                            }
                                            else {
                                                h.render_xhr(req, res, { e: 4, m: 'Something went wrong!' })
                                            }
                                        })
                                    }
                                });
                            }
                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 1, m: 'input missing!' })
                    }
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

promoter.admin.aget_sliders = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            let active_sliders = []
            const Op = h.Sequelize.Op;
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if (promoter) {
                   connection.db.PromoterSlider.findAll({
                       where:{
                        [Op.and]: [{ promoterId: promoter.id }, { metadata: { status: 'active' } }]
                       }
                   }).then(sliders =>{
                       sliders.forEach(function(each_slider){
                           let slider_list = {
                               slider_id: each_slider.id,
                               image_link:'https://testv2.khelo.live/promoter_slider/' + each_slider.metadata.image
                           }
                           active_sliders.push(slider_list)
                       })
                       h.render_xhr(req, res, {e:0, m:active_sliders})
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

promoter.admin.remove_slider = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Promoter.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(promoter => {
                if (promoter) {
                   connection.db.PromoterSlider.findOne({
                       where:{
                           id:input.slider_id
                       }
                   }).then(slider =>{
                       let metadata = slider.metadata
                       metadata.status = 'inactive'
                       slider.update({metadata:metadata}).then(updated =>{
                           if(updated){
                               h.render_xhr(req, res, {e:0, m:'Successfully deleted'})
                           }
                           else{
                            h.render_xhr(req, res, {e:2, m:'Something went wrong'})
                           }
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

promoter.client = {}

promoter.client.get_promoter_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            connection.db.Promoter.findOne({
                where:{
                    id:input.promoter_id
                }
            }).then(promoter =>{
                if(promoter){
                    let promoter_list = {
                        user_name: promoter.metadata.user_name,
                        name: promoter.metadata.name,
                        phone: promoter.metadata.phone,
                        status: promoter.metadata.status
                    }
                    h.render_xhr(req, res, {e:0, m:promoter_list})
                }
                else{
                    h.render_xhr(req, res, {e:2, m:'No promoter found!'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.client.get_promoter_links = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let link_list = []
            connection.db.PromoterLink.findOne({
                where:{
                    promoterId:input.promoter_id,
                    metadata:{
                        type:input.type
                    }
                },
                order: [['createdAt', 'DESC']]
            }).then(links =>{
                if(links){
                    let temp = {
                    type:links.metadata.type,
                    link: links.metadata.link
                    
                    }
                    h.render_xhr(req, res, {e:0, m:temp})
                }
                else{
                    h.render_xhr(req, res, {e:0, m:'No type matched!'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.client.get_promoter_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let all_history = []
            connection.db.PromoterHistory.findAll({
                where:{
                    promoterId:input.promoter_id,
                },
                order: [['createdAt', 'DESC']]
            }).then(promoters_history =>{
                
                promoters_history.forEach(function(each_history){
                    let temp ={
                        link: each_history.metadata.link,
                    }
                    if(each_history.metadata.title){
                        temp.title = each_history.metadata.title
                    }
                    if(each_history.metadata.image){
                        temp.image = 'https://testv2.khelo.live/promoters/'+each_history.metadata.image
                    }
                    all_history.push(temp)
                })
                h.render_xhr(req, res, {e:0, m:all_history})
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

promoter.client.get_sliders = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            let active_sliders = []
            const Op = h.Sequelize.Op;
            connection.db.PromoterSlider.findAll({
                where:{
                 promoterId:input.promoter_id
                }
            }).then(sliders =>{
                sliders.forEach(function(each_slider){
                    let slider_list = {
                        slider_id: each_slider.id,
                        image_link:'https://testv2.khelo.live/promoter_slider/' + each_slider.metadata.image
                    }
                    active_sliders.push(slider_list)
                })
                h.render_xhr(req, res, {e:0, m:active_sliders})
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}



exports.promoter = promoter;