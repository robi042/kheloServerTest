const qs = require('querystring');
var fs = require('fs');
const { hash } = require('bcryptjs');
const h = require('./helper').h;
const connection = require('./connections').connection;

var tournament = {}
tournament.admin = {}

tournament.admin.add_a_tournament = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    let temp = {
                        metadata: {
                           title: input.title,
                           start_date: input.start_date,
                           end_date: input.end_date,
                           entry_fee: input.entry_fee,
                           total_team: input.total_team
                        }
                    }

                    if(input.hasFirstPrize == 'true'){
                        temp.metadata.hasFirstPrize = true,
                        temp.metadata.first_prize = input.first_prize
                    }
                    if(input.hasSecondPrize == 'true'){
                        temp.metadata.hasSecondPrize = true,
                        temp.metadata.second_prize = input.second_prize
                    }
                    if(input.hasThirdPrize == 'true'){
                        temp.metadata.hasThirdPrize = true,
                        temp.metadata.third_prize = input.third_prize
                    }
                    if(input.hasFourthPrize == 'true'){
                        temp.metadata.hasFourthPrize = true,
                        temp.metadata.fourth_prize = input.fourth_prize
                    }
                    if(input.hasFifthPrize == 'true'){
                        temp.metadata.hasFifthPrize = true,
                        temp.metadata.fifth_prize = input.fifth_prize
                    }
                    if(input.hasSixthPrize == 'true'){
                        temp.metadata.hasSixthPrize = true,
                        temp.metadata.sixth_prize = input.sixth_prize
                    }
                    if(input.hasSeventhPrize == 'true'){
                        temp.metadata.hasSeventhPrize = true,
                        temp.metadata.seventh_prize = input.seventh_prize
                    }
                    if(input.hasEightthPrize == 'true'){
                        temp.metadata.hasEightthPrize = true,
                        temp.metadata.eightth_prize = input.eightth_prize
                    }
                    if(input.hasNinethPrize == 'true'){
                        temp.metadata.hasNinethPrize = true,
                        temp.metadata.nineth_prize = input.nineth_prize
                    }
                    if(input.hasTenthPrize == 'true'){
                        temp.metadata.hasTenthPrize = true,
                        temp.metadata.tenth_prize = input.tenth_prize
                    }

                    if(input.hasEleventhPrize == 'true'){
                        temp.metadata.hasEleventhPrize = true,
                        temp.metadata.eleventh_prize = input.eleventh_prize
                    }
                    if(input.hasTwelvePrize == 'true'){
                        temp.metadata.hasTwelvePrize = true,
                        temp.metadata.twelveth_prize = input.twelveth_prize
                    }
                    connection.db.Tournament.create(temp).then(done => {
                        h.render_xhr(req, res, { e: 0, m: 'Successful!' });
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

tournament.admin.get_tournament_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let tournament_list = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.Tournament.findAll({
                        where:{
                            metadata:{
                                status:null
                            }
                        },
                        order:[['createdAt', 'DESC']] 
                    }).then(tournaments =>{
                        tournaments.forEach(function(each_tournament){
                            let temp ={
                                title: each_tournament.metadata.title,
                                start_date: each_tournament.metadata.start_date,
                                end_date: each_tournament.metadata.end_date,
                                entry_fee: each_tournament.metadata.entry_fee,
                                total_team: each_tournament.metadata.total_team
                            }

                            if(each_tournament.metadata.hasFirstPrize){
                                temp.hasFirstPrize = true;
                                temp.first_prize = each_tournament.metadata.first_prize;
                            }
                            if(each_tournament.metadata.hasSecondPrize){
                                temp.hasSecondPrize = true;
                                temp.second_prize = each_tournament.metadata.second_prize;
                            }
                            if(each_tournament.metadata.hasThirdPrize){
                                temp.hasThirdPrize = true;
                                temp.third_prize = each_tournament.metadata.third_prize;
                            }
                            if(each_tournament.metadata.hasFourthPrize){
                                temp.hasFourthPrize = true;
                                temp.fourth_prize = each_tournament.metadata.fourth_prize;
                            }
                            if(each_tournament.metadata.hasFifthPrize){
                                temp.hasFifthPrize = true;
                                temp.fifth_prize = each_tournament.metadata.fifth_prize;
                            }
                            if(each_tournament.metadata.hasSixthPrize){
                                temp.hasSixthPrize = true;
                                temp.sixth_prize = each_tournament.metadata.sixth_prize;
                            }
                            if(each_tournament.metadata.hasSeventhPrize){
                                temp.hasSeventhPrize = true;
                                temp.seventh_prize = each_tournament.metadata.seventh_prize;
                            }
                            if(each_tournament.metadata.hasEightthPrize){
                                temp.hasEightthPrize = true;
                                temp.eightth_prize = each_tournament.metadata.eightth_prize;
                            }
                            if(each_tournament.metadata.hasNinethPrize){
                                temp.hasNinethPrize = true;
                                temp.nineth_prize = each_tournament.metadata.nineth_prize;
                            }
                            if(each_tournament.metadata.hasTenthPrize){
                                temp.hasTenthPrize = true;
                                temp.tenth_prize = each_tournament.metadata.tenth_prize;
                            }
                            if(each_tournament.metadata.hasEleventhPrize){
                                temp.hasTenthPrize = true;
                                temp.eleventh_prize = each_tournament.metadata.eleventh_prize;
                            }
                            if(each_tournament.metadata.hasTwelvePrize){
                                temp.hasTenthPrize = true;
                                temp.twelveth_prize = each_tournament.metadata.twelveth_prize;
                            }

                            tournament_list.push(temp)
                        })
                        h.render_xhr(req, res, {e:0,m:tournament_list})
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

exports.tournament = tournament;
