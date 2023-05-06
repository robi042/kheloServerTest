
const qs = require('querystring');
const dotenv = require('dotenv');
var fs = require('fs');
const h = require('./helper').h;
const connection = require('./connections').connection;
dotenv.config();

var controller = {
    
};


controller.player ={}
controller.player.khelo_back = function(req, res){
   try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 15;

        connection.db.User.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
        }).then(result =>{
            let count = result.count
            let rows = result.rows
            rows.forEach(function(each_player){
                h.send_email(each_player.metadata.email,"Khelo is Back", "download link: https://app-uploads-apk.s3.ap-south-1.amazonaws.com/khelo.apk")
            })
            h.render_xhr(req, res, {e:0, m:{
                count:count,
                page:page
            }})
            
        })
   }
   catch (err) {
    console.log(err);
    h.render_xhr(req, res, { e: 1 });
};
}

controller.player.new_match_entry = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let getplayer = false
            let total_joined = 0
            console.log(input.hasExtraPlayerOne + ' ' + input.hasExtraPlayerTwo)
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).catch((error) => {
                console.log(error);
                h.render_xhr(req, res, { e: 1 });
            })
                .then(user => {
                    if (user) {
                        connection.db.MatchEntry.findOne({
                            where: {
                                [Op.and]: [{ matchId: input.match_id }, { userId: user.id }, { metadata: { refund_amount: null } }]
                            }
                        }).catch((error) => {
                            console.log(error);
                            h.render_xhr(req, res, { e: 1 });
                        })
                            .then(hasJoined => {
                                if (hasJoined) {
                                    h.render_xhr(req, res, { e: 2, m: 'Already Joined!' })
                                }
                                else {
                                    connection.db.MatchEntryHistory.findOne({
                                        where: {
                                            team_no: input.team_no,
                                            matchId: input.match_id
                                        }
                                    }).catch((error) => {
                                        console.log(error);
                                        h.render_xhr(req, res, { e: 1 });
                                    })
                                        .then(found_group => {
                                            if (found_group) {
                                                if ((input.hasFirstPlayer == 'true' && found_group.metadata.hasFirstPlayer) || (input.hasSecondPlayer == 'true' && found_group.metadata.hasSecondPlayer) || (input.hasThirdPlayer == 'true' && found_group.metadata.hasThirdPlayer) || (input.hasForthPlayer == 'true' && found_group.metadata.hasForthPlayer) || (input.hasFifthPlayer == 'true' && found_group.metadata.hasFifthPlayer) || (input.hasSixthPlayer == 'true' && found_group.metadata.hasSixthPlayer)) {
                                                    h.render_xhr(req, res, { e: 6, m: 'Slot has already booked!' })
                                                }
                                                else {
                                                    connection.db.Match.findOne({
                                                        where: {
                                                            id: input.match_id
                                                        }
                                                    }).catch((error) => {
                                                        console.log(error);
                                                        h.render_xhr(req, res, { e: 1 });
                                                    })
                                                        .then(match => {
                                                            let temp_entry = {
                                                                metadata: {
                                                                    paid: 0
                                                                }
                                                            }

                                                            let temp_entry1 = {
                                                                metadata: {

                                                                }
                                                            }

                                                            if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
                                                                getplayer = true
                                                                temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                                temp_entry.metadata.first_player = input.first_player;
                                                                temp_entry.metadata.hasFirstPlayer = true
                                                                temp_entry1.metadata.first_player = input.first_player;
                                                                temp_entry1.metadata.hasFirstPlayer = true
                                                                total_joined += 1

                                                            }
                                                            if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {
                                                                getplayer = true
                                                                temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                                temp_entry.metadata.second_player = input.second_player;
                                                                temp_entry.metadata.hasSecondPlayer = true;
                                                                temp_entry1.metadata.second_player = input.second_player;
                                                                temp_entry1.metadata.hasSecondPlayer = true;
                                                                total_joined += 1

                                                            }
                                                            if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {
                                                                getplayer = true
                                                                temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                                temp_entry.metadata.third_player = input.third_player;
                                                                temp_entry.metadata.hasThirdPlayer = true;
                                                                temp_entry1.metadata.third_player = input.third_player;
                                                                temp_entry1.metadata.hasThirdPlayer = true;
                                                                total_joined += 1

                                                            }
                                                            if (input.hasForthPlayer && input.hasForthPlayer == "true") {
                                                                getplayer = true
                                                                temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                                temp_entry.metadata.forth_player = input.forth_player;
                                                                temp_entry.metadata.hasForthPlayer = true;
                                                                temp_entry1.metadata.forth_player = input.forth_player;
                                                                temp_entry1.metadata.hasForthPlayer = true;
                                                                total_joined += 1
                                                            }
                                                            if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {
                                                                getplayer = true
                                                                temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                                temp_entry.metadata.fifth_player = input.fifth_player;
                                                                temp_entry.metadata.hasFifthPlayer = true;
                                                                temp_entry1.metadata.fifth_player = input.fifth_player;
                                                                temp_entry1.metadata.hasFifthPlayer = true;
                                                                total_joined += 1

                                                            }
                                                            if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {
                                                                //console.log(input.hasSixthPlayer + ' ' + input.sixth_player)
                                                                getplayer = true
                                                                temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                                temp_entry.metadata.sixth_player = input.sixth_player;
                                                                temp_entry.metadata.hasSixthPlayer = true;
                                                                temp_entry1.metadata.sixth_player = input.sixth_player;
                                                                temp_entry1.metadata.hasSixthPlayer = true;
                                                                total_joined += 1

                                                            }

                                                            if (input.hasExtraPlayerOne == "true") {
                                                                getplayer = true
                                                                console.log(input.extraPlayerOne)
                                                                temp_entry.metadata.hasExtraPlayerOne = true;
                                                                temp_entry1.metadata.hasExtraPlayerOne = true;

                                                                temp_entry.metadata.extraPlayerOne = input.extraPlayerOne;
                                                                temp_entry1.metadata.extraPlayerOne = input.extraPlayerOne;

                                                            }

                                                            if (input.hasExtraPlayerTwo == "true") {
                                                                getplayer = true
                                                                console.log(input.extraPlayerTwo)
                                                                temp_entry.metadata.hasExtraPlayerTwo = true;
                                                                temp_entry1.metadata.hasExtraPlayerTwo = true;

                                                                temp_entry.metadata.extraPlayerTwo = input.extraPlayerTwo;
                                                                temp_entry1.metadata.extraPlayerTwo = input.extraPlayerTwo;

                                                            }

                                                            if (getplayer) {
                                                                let promo_active = false;
                                                                if (temp_entry.metadata.paid <= parseInt(user.metadata.total_balance)) {
                                                                    if (parseInt(match.metadata.total_player) > parseInt(match.metadata.total_joined)) {
                                                                        temp_entry.metadata.team_no = parseInt(input.team_no)
                                                                        temp_entry.matchId = match.id
                                                                        temp_entry.userId = user.id
                                                                        connection.db.MatchEntry.create(temp_entry).catch((error) => {
                                                                            console.log(error);
                                                                            h.render_xhr(req, res, { e: 1 });
                                                                        })
                                                                            .then(created => {
                                                                                if (created) {
                                                                                    connection.db.MatchEntryHistory.findOne({
                                                                                        where: {
                                                                                            team_no: input.team_no,
                                                                                            matchId: input.match_id
                                                                                        }
                                                                                    }).catch((error) => {
                                                                                        console.log(error);
                                                                                        h.render_xhr(req, res, { e: 1 });
                                                                                    })
                                                                                        .then(hasGroup => {
                                                                                            if (hasGroup) {
                                                                                                let metadata = hasGroup.metadata
                                                                                                if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
                                                                                                    metadata.first_player = input.first_player;
                                                                                                    metadata.hasFirstPlayer = true

                                                                                                }
                                                                                                if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

                                                                                                    metadata.second_player = input.second_player;
                                                                                                    metadata.hasSecondPlayer = true;

                                                                                                }
                                                                                                if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

                                                                                                    metadata.third_player = input.third_player;
                                                                                                    metadata.hasThirdPlayer = true;

                                                                                                }
                                                                                                if (input.hasForthPlayer && input.hasForthPlayer == "true") {

                                                                                                    metadata.forth_player = input.forth_player;
                                                                                                    metadata.hasForthPlayer = true;
                                                                                                }
                                                                                                if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

                                                                                                    metadata.fifth_player = input.fifth_player;
                                                                                                    metadata.hasFifthPlayer = true;

                                                                                                }
                                                                                                if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

                                                                                                    metadata.sixth_player = input.sixth_player;
                                                                                                    metadata.hasSixthPlayer = true;

                                                                                                }

                                                                                                hasGroup.update({ metadata: metadata }).then(done => {
                                                                                                    if (done) {
                                                                                                        let temp_balance = temp_entry.metadata.paid;
                                                                                                        let metadata = user.metadata
                                                                                                        metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                                                        metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                                                        if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                                                            metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                                                        }
                                                                                                        else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                                                            let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                                                            metadata.winning_balance = 0
                                                                                                            metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                                                        }
                                                                                                        else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                                                            metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                                                        };
                                                                                                        if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                                                            metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                                                            metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                                                            metadata.promo_status = 'inactive'
                                                                                                            promo_active = true;
                                                                                                        }
                                                                                                        user.update({ metadata: metadata })
                                                                                                            .catch((error) => {
                                                                                                                console.log(error);
                                                                                                                h.render_xhr(req, res, { e: 1 });
                                                                                                            })
                                                                                                            .then(update => {
                                                                                                                if (update) {
                                                                                                                    let metadata = match.metadata
                                                                                                                    metadata.total_joined = metadata.total_joined + total_joined
                                                                                                                    match.update({ metadata: metadata })
                                                                                                                        .catch((error) => {
                                                                                                                            console.log(error);
                                                                                                                            h.render_xhr(req, res, { e: 1 });
                                                                                                                        })
                                                                                                                        .then(updated => {
                                                                                                                            // if (user.metadata.promo_shared_id) {
                                                                                                                            //     connection.db.User.findOne({
                                                                                                                            //         where: {
                                                                                                                            //             id: user.metadata.promo_shared_id
                                                                                                                            //         }
                                                                                                                            //     }).catch((error) => {
                                                                                                                            //         console.log(error);
                                                                                                                            //         h.render_xhr(req, res, { e: 1 });
                                                                                                                            //     })
                                                                                                                            //         .then(find_share => {
                                                                                                                            //             if (find_share) {
                                                                                                                            //                 let metadata = find_share.metadata
                                                                                                                            //                 metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                                            //                 metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                                            //                 find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                                            //                     h.render_xhr(req, res, { e: 0 })
                                                                                                                            //                 })
                                                                                                                            //             }
                                                                                                                            //             else {
                                                                                                                            //                 h.render_xhr(req, res, { e: 0 })
                                                                                                                            //             }
                                                                                                                            //         })
                                                                                                                            // }
                                                                                                                            // else {
                                                                                                                            //     h.render_xhr(req, res, { e: 0 })
                                                                                                                            // }
                                                                                                                            h.render_xhr(req, res, { e: 0 })
                                                                                                                        })
                                                                                                                }
                                                                                                            })
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                // let temp_entry1 = {

                                                                                                // }

                                                                                                // if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {

                                                                                                //     temp_entry1.metadata.first_player = input.first_player;
                                                                                                //     temp_entry1.metadata.hasFirstPlayer = true

                                                                                                // }
                                                                                                // if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

                                                                                                //     temp_entry1.metadata.second_ = input.second_player;
                                                                                                //     temp_entry1.metadata.hasSecondPlayer = true;


                                                                                                // }
                                                                                                // if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

                                                                                                //     temp_entry1.metadata.third_player = input.third_player;
                                                                                                //     temp_entry1.metadata.hasThirdPlayer = true;

                                                                                                // }
                                                                                                // if (input.hasForthPlayer && input.hasForthPlayer == "true") {

                                                                                                //     temp_entry1.metadata.forth_player = input.forth_player;
                                                                                                //     temp_entry1.metadata.hasForthPlayer = true;
                                                                                                // }
                                                                                                // if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

                                                                                                //     temp_entry1.metadata.fifth_player = input.fifth_player;
                                                                                                //     temp_entry1.metadata.hasFifthPlayer = true;

                                                                                                // }
                                                                                                // if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

                                                                                                //     temp_entry1.metadata.sixth_player = input.sixth_player;
                                                                                                //     temp_entry1.metadata.hasSixthPlayer = true;

                                                                                                // }
                                                                                                temp_entry1.team_no = parseInt(input.team_no)
                                                                                                temp_entry1.matchId = input.match_id
                                                                                                connection.db.MatchEntryHistory.create(temp_entry1)
                                                                                                    .catch(function (err) {
                                                                                                        // print the error details
                                                                                                        console.log(err);
                                                                                                    })
                                                                                                    .then(done => {
                                                                                                        if (done) {
                                                                                                            let temp_balance = temp_entry.metadata.paid;
                                                                                                            let metadata = user.metadata
                                                                                                            metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                                                            metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                                                            if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                                                                metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                                                            }
                                                                                                            else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                                                                let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                                                                metadata.winning_balance = 0
                                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                                                            }
                                                                                                            else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                                                            };
                                                                                                            if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                                                                metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                                                                metadata.promo_status = 'inactive'
                                                                                                                promo_active = true;
                                                                                                            }
                                                                                                            user.update({ metadata: metadata })
                                                                                                                .catch((error) => {
                                                                                                                    console.log(error);
                                                                                                                    h.render_xhr(req, res, { e: 1 });
                                                                                                                })
                                                                                                                .then(update => {
                                                                                                                    if (update) {
                                                                                                                        let metadata = match.metadata
                                                                                                                        metadata.total_joined = metadata.total_joined + total_joined
                                                                                                                        match.update({ metadata: metadata }).then(updated => {
                                                                                                                            // if (user.metadata.promo_shared_id) {
                                                                                                                            //     connection.db.User.findOne({
                                                                                                                            //         where: {
                                                                                                                            //             id: user.metadata.promo_shared_id
                                                                                                                            //         }
                                                                                                                            //     }).catch((error) => {
                                                                                                                            //         console.log(error);
                                                                                                                            //         h.render_xhr(req, res, { e: 1 });
                                                                                                                            //     })
                                                                                                                            //         .then(find_share => {
                                                                                                                            //             if (find_share) {
                                                                                                                            //                 let metadata = find_share.metadata
                                                                                                                            //                 metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                                            //                 metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                                            //                 find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                                            //                     h.render_xhr(req, res, { e: 0 })
                                                                                                                            //                 })
                                                                                                                            //             }
                                                                                                                            //             else {
                                                                                                                            //                 h.render_xhr(req, res, { e: 0 })
                                                                                                                            //             }
                                                                                                                            //         })
                                                                                                                            // }
                                                                                                                            // else {
                                                                                                                            //     h.render_xhr(req, res, { e: 0 })
                                                                                                                            // }
                                                                                                                            h.render_xhr(req, res, { e: 0 })
                                                                                                                        })
                                                                                                                    }
                                                                                                                })
                                                                                                        }
                                                                                                    })
                                                                                            }
                                                                                        })
                                                                                }
                                                                            })
                                                                    }
                                                                    else {
                                                                        h.render_xhr(req, res, { e: 5, m: 'Match full!' })
                                                                    }
                                                                }
                                                                else {
                                                                    h.render_xhr(req, res, { e: 4, m: 'Not enough balance' })
                                                                }
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 3, m: 'Input missing!' })
                                                            }
                                                        })
                                                }
                                            }
                                            else {
                                                connection.db.Match.findOne({
                                                    where: {
                                                        id: input.match_id
                                                    }
                                                }).catch((error) => {
                                                    console.log(error);
                                                    h.render_xhr(req, res, { e: 1 });
                                                })
                                                    .then(match => {
                                                        let temp_entry = {
                                                            metadata: {
                                                                paid: 0
                                                            }
                                                        }

                                                        let temp_entry1 = {
                                                            metadata: {

                                                            }
                                                        }

                                                        if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
                                                            getplayer = true
                                                            temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                            temp_entry.metadata.first_player = input.first_player;
                                                            temp_entry.metadata.hasFirstPlayer = true
                                                            temp_entry1.metadata.first_player = input.first_player;
                                                            temp_entry1.metadata.hasFirstPlayer = true
                                                            total_joined += 1

                                                        }
                                                        if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {
                                                            getplayer = true
                                                            temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                            temp_entry.metadata.second_player = input.second_player;
                                                            temp_entry.metadata.hasSecondPlayer = true;
                                                            temp_entry1.metadata.second_player = input.second_player;
                                                            temp_entry1.metadata.hasSecondPlayer = true;
                                                            total_joined += 1

                                                        }
                                                        if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {
                                                            getplayer = true
                                                            temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                            temp_entry.metadata.third_player = input.third_player;
                                                            temp_entry.metadata.hasThirdPlayer = true;
                                                            temp_entry1.metadata.third_player = input.third_player;
                                                            temp_entry1.metadata.hasThirdPlayer = true;
                                                            total_joined += 1

                                                        }
                                                        if (input.hasForthPlayer && input.hasForthPlayer == "true") {
                                                            getplayer = true
                                                            temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                            temp_entry.metadata.forth_player = input.forth_player;
                                                            temp_entry.metadata.hasForthPlayer = true;
                                                            temp_entry1.metadata.forth_player = input.forth_player;
                                                            temp_entry1.metadata.hasForthPlayer = true;
                                                            total_joined += 1
                                                        }
                                                        if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {
                                                            getplayer = true
                                                            temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                            temp_entry.metadata.fifth_player = input.fifth_player;
                                                            temp_entry.metadata.hasFifthPlayer = true;
                                                            temp_entry1.metadata.fifth_player = input.fifth_player;
                                                            temp_entry1.metadata.hasFifthPlayer = true;
                                                            total_joined += 1

                                                        }
                                                        if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {
                                                            //console.log(input.hasSixthPlayer + ' ' + input.sixth_player)
                                                            getplayer = true
                                                            temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
                                                            temp_entry.metadata.sixth_player = input.sixth_player;
                                                            temp_entry.metadata.hasSixthPlayer = true;
                                                            temp_entry1.metadata.sixth_player = input.sixth_player;
                                                            temp_entry1.metadata.hasSixthPlayer = true;
                                                            total_joined += 1

                                                        }

                                                        if (input.hasExtraPlayerOne == "true") {
                                                            getplayer = true
                                                            temp_entry.metadata.hasExtraPlayerOne = true;
                                                            temp_entry1.metadata.hasExtraPlayerOne = true;

                                                            temp_entry.metadata.extraPlayerOne = input.extraPlayerOne;
                                                            temp_entry1.metadata.extraPlayerOne = input.extraPlayerOne;

                                                        }

                                                        if (input.hasExtraPlayerTwo == "true") {
                                                            getplayer = true

                                                            temp_entry.metadata.hasExtraPlayerTwo = true;
                                                            temp_entry1.metadata.hasExtraPlayerTwo = true;

                                                            temp_entry.metadata.extraPlayerTwo = input.extraPlayerTwo;
                                                            temp_entry1.metadata.extraPlayerTwo = input.extraPlayerTwo;

                                                        }

                                                        if (getplayer) {
                                                            let promo_active = false;
                                                            if (temp_entry.metadata.paid <= parseInt(user.metadata.total_balance)) {
                                                                if (parseInt(match.metadata.total_player) > parseInt(match.metadata.total_joined)) {
                                                                    temp_entry.metadata.team_no = parseInt(input.team_no)
                                                                    temp_entry.matchId = match.id
                                                                    temp_entry.userId = user.id
                                                                    connection.db.MatchEntry.create(temp_entry).catch((error) => {
                                                                        console.log(error);
                                                                        h.render_xhr(req, res, { e: 1 });
                                                                    })
                                                                        .then(created => {
                                                                            if (created) {
                                                                                connection.db.MatchEntryHistory.findOne({
                                                                                    where: {
                                                                                        team_no: input.team_no,
                                                                                        matchId: input.match_id
                                                                                    }
                                                                                }).then(hasGroup => {
                                                                                    if (hasGroup) {
                                                                                        let metadata = hasGroup.metadata
                                                                                        if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
                                                                                            metadata.first_player = input.first_player;
                                                                                            metadata.hasFirstPlayer = true

                                                                                        }
                                                                                        if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

                                                                                            metadata.second_player = input.second_player;
                                                                                            metadata.hasSecondPlayer = true;

                                                                                        }
                                                                                        if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

                                                                                            metadata.third_player = input.third_player;
                                                                                            metadata.hasThirdPlayer = true;

                                                                                        }
                                                                                        if (input.hasForthPlayer && input.hasForthPlayer == "true") {

                                                                                            metadata.forth_player = input.forth_player;
                                                                                            metadata.hasForthPlayer = true;
                                                                                        }
                                                                                        if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

                                                                                            metadata.fifth_player = input.fifth_player;
                                                                                            metadata.hasFifthPlayer = true;

                                                                                        }
                                                                                        if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

                                                                                            metadata.sixth_player = input.sixth_player;
                                                                                            metadata.hasSixthPlayer = true;

                                                                                        }

                                                                                        hasGroup.update({ metadata: metadata }).catch((error) => {
                                                                                            console.log(error);
                                                                                            h.render_xhr(req, res, { e: 1 });
                                                                                        })
                                                                                            .then(done => {
                                                                                                if (done) {
                                                                                                    let temp_balance = temp_entry.metadata.paid;
                                                                                                    let metadata = user.metadata
                                                                                                    metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                                                    metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                                                    if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                                                        metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                                                    }
                                                                                                    else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                                                        let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                                                        metadata.winning_balance = 0
                                                                                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                                                    }
                                                                                                    else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                                                    };
                                                                                                    if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                                                        metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                                                        metadata.promo_status = 'inactive'
                                                                                                        promo_active = true;
                                                                                                    }
                                                                                                    user.update({ metadata: metadata }).catch((error) => {
                                                                                                        console.log(error);
                                                                                                        h.render_xhr(req, res, { e: 1 });
                                                                                                    })
                                                                                                        .then(update => {
                                                                                                            if (update) {
                                                                                                                let metadata = match.metadata
                                                                                                                metadata.total_joined = metadata.total_joined + total_joined
                                                                                                                match.update({ metadata: metadata }).then(updated => {
                                                                                                                    // if (user.metadata.promo_shared_id) {
                                                                                                                    //     connection.db.User.findOne({
                                                                                                                    //         where: {
                                                                                                                    //             id: user.metadata.promo_shared_id
                                                                                                                    //         }
                                                                                                                    //     }).catch((error) => {
                                                                                                                    //         console.log(error);
                                                                                                                    //         h.render_xhr(req, res, { e: 1 });
                                                                                                                    //     })
                                                                                                                    //         .then(find_share => {
                                                                                                                    //             if (find_share) {
                                                                                                                    //                 let metadata = find_share.metadata
                                                                                                                    //                 metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                                    //                 metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                                    //                 find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                                    //                     h.render_xhr(req, res, { e: 0 })
                                                                                                                    //                 })
                                                                                                                    //             }
                                                                                                                    //             else {
                                                                                                                    //                 h.render_xhr(req, res, { e: 0 })
                                                                                                                    //             }
                                                                                                                    //         })
                                                                                                                    // }
                                                                                                                    // else {
                                                                                                                    //     h.render_xhr(req, res, { e: 0 })
                                                                                                                    // }
                                                                                                                    h.render_xhr(req, res, { e: 0 })
                                                                                                                })
                                                                                                            }
                                                                                                        })
                                                                                                }
                                                                                            })
                                                                                    }
                                                                                    else {
                                                                                        // let temp_entry1 = {

                                                                                        // }

                                                                                        // if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {

                                                                                        //     temp_entry1.metadata.first_player = input.first_player;
                                                                                        //     temp_entry1.metadata.hasFirstPlayer = true

                                                                                        // }
                                                                                        // if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

                                                                                        //     temp_entry1.metadata.second_ = input.second_player;
                                                                                        //     temp_entry1.metadata.hasSecondPlayer = true;


                                                                                        // }
                                                                                        // if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

                                                                                        //     temp_entry1.metadata.third_player = input.third_player;
                                                                                        //     temp_entry1.metadata.hasThirdPlayer = true;

                                                                                        // }
                                                                                        // if (input.hasForthPlayer && input.hasForthPlayer == "true") {

                                                                                        //     temp_entry1.metadata.forth_player = input.forth_player;
                                                                                        //     temp_entry1.metadata.hasForthPlayer = true;
                                                                                        // }
                                                                                        // if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

                                                                                        //     temp_entry1.metadata.fifth_player = input.fifth_player;
                                                                                        //     temp_entry1.metadata.hasFifthPlayer = true;

                                                                                        // }
                                                                                        // if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

                                                                                        //     temp_entry1.metadata.sixth_player = input.sixth_player;
                                                                                        //     temp_entry1.metadata.hasSixthPlayer = true;

                                                                                        // }
                                                                                        temp_entry1.team_no = parseInt(input.team_no)
                                                                                        temp_entry1.matchId = input.match_id
                                                                                        connection.db.MatchEntryHistory.create(temp_entry1)
                                                                                            .catch(function (err) {
                                                                                                // print the error details
                                                                                                console.log(err);
                                                                                            })
                                                                                            .then(done => {
                                                                                                if (done) {
                                                                                                    let temp_balance = temp_entry.metadata.paid;
                                                                                                    let metadata = user.metadata
                                                                                                    metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                                                    metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                                                    if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                                                        metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                                                    }
                                                                                                    else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                                                        let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                                                        metadata.winning_balance = 0
                                                                                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                                                    }
                                                                                                    else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                                                    };
                                                                                                    if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                                                        metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                                                        metadata.promo_status = 'inactive'
                                                                                                        promo_active = true;
                                                                                                    }
                                                                                                    user.update({ metadata: metadata }).catch((error) => {
                                                                                                        console.log(error);
                                                                                                        h.render_xhr(req, res, { e: 1 });
                                                                                                    })
                                                                                                        .then(update => {
                                                                                                            if (update) {
                                                                                                                let metadata = match.metadata
                                                                                                                metadata.total_joined = metadata.total_joined + total_joined
                                                                                                                match.update({ metadata: metadata }).catch((error) => {
                                                                                                                    console.log(error);
                                                                                                                    h.render_xhr(req, res, { e: 1 });
                                                                                                                })
                                                                                                                    .then(updated => {
                                                                                                                        // if (user.metadata.promo_shared_id) {
                                                                                                                        //     connection.db.User.findOne({
                                                                                                                        //         where: {
                                                                                                                        //             id: user.metadata.promo_shared_id
                                                                                                                        //         }
                                                                                                                        //     }).catch((error) => {
                                                                                                                        //         console.log(error);
                                                                                                                        //         h.render_xhr(req, res, { e: 1 });
                                                                                                                        //     })
                                                                                                                        //         .then(find_share => {
                                                                                                                        //             if (find_share) {
                                                                                                                        //                 let metadata = find_share.metadata
                                                                                                                        //                 metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                                        //                 metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                                        //                 find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                                        //                     h.render_xhr(req, res, { e: 0 })
                                                                                                                        //                 })
                                                                                                                        //             }
                                                                                                                        //             else {
                                                                                                                        //                 h.render_xhr(req, res, { e: 0 })
                                                                                                                        //             }
                                                                                                                        //         })
                                                                                                                        // }
                                                                                                                        // else {
                                                                                                                        //     h.render_xhr(req, res, { e: 0 })
                                                                                                                        // }
                                                                                                                        h.render_xhr(req, res, { e: 0 })
                                                                                                                    })
                                                                                                            }
                                                                                                        })
                                                                                                }
                                                                                            })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                }
                                                                else {
                                                                    h.render_xhr(req, res, { e: 5, m: 'Match full!' })
                                                                }
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 4, m: 'Not enough balance' })
                                                            }
                                                        }
                                                        else {
                                                            h.render_xhr(req, res, { e: 3, m: 'Input missing!' })
                                                        }
                                                    })
                                            }
                                        })
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
        };
    })
}

// controller.player.new_match_entry = function (req, res) {
//     h.process_post_input(req, res, function (req, res, body) {
//         try {
//             let input = qs.parse(body)
//             const Op = h.Sequelize.Op;
//             let getplayer = false
//             let total_joined = 0
//             console.log(input.hasExtraPlayerOne + ' ' + input.hasExtraPlayerTwo)
//             connection.db.User.findOne({
//                 where: {
//                     [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
//                 }
//             }).catch((error) => {
//                 console.log(error);
//                 h.render_xhr(req, res, { e: 1 });
//             })
//                 .then(user => {
//                     if (user) {
//                         connection.db.MatchEntry.findOne({
//                             where: {
//                                 [Op.and]: [{ matchId: input.match_id }, { userId: user.id }, { metadata: { refund_amount: null } }]
//                             }
//                         }).catch((error) => {
//                             console.log(error);
//                             h.render_xhr(req, res, { e: 1 });
//                         })
//                             .then(hasJoined => {
//                                 if (hasJoined) {
//                                     h.render_xhr(req, res, { e: 2, m: 'Already Joined!' })
//                                 }
//                                 else {
//                                     connection.db.MatchEntryHistory.findOne({
//                                         where: {
//                                             team_no: input.team_no,
//                                             matchId: input.match_id
//                                         }
//                                     }).catch((error) => {
//                                         console.log(error);
//                                         h.render_xhr(req, res, { e: 1 });
//                                     })
//                                         .then(found_group => {
//                                             if (found_group) {
//                                                 if ((input.hasFirstPlayer == 'true' && found_group.metadata.hasFirstPlayer) || (input.hasSecondPlayer == 'true' && found_group.metadata.hasSecondPlayer) || (input.hasThirdPlayer == 'true' && found_group.metadata.hasThirdPlayer) || (input.hasForthPlayer == 'true' && found_group.metadata.hasForthPlayer) || (input.hasFifthPlayer == 'true' && found_group.metadata.hasFifthPlayer) || (input.hasSixthPlayer == 'true' && found_group.metadata.hasSixthPlayer)) {
//                                                     h.render_xhr(req, res, { e: 6, m: 'Slot has already booked!' })
//                                                 }
//                                                 else {
//                                                     connection.db.Match.findOne({
//                                                         where: {
//                                                             id: input.match_id
//                                                         }
//                                                     }).catch((error) => {
//                                                         console.log(error);
//                                                         h.render_xhr(req, res, { e: 1 });
//                                                     })
//                                                         .then(match => {
//                                                             let temp_entry = {
//                                                                 metadata: {
//                                                                     paid: 0
//                                                                 }
//                                                             }

//                                                             let temp_entry1 = {
//                                                                 metadata: {

//                                                                 }
//                                                             }

//                                                             if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
//                                                                 getplayer = true
//                                                                 temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                                 temp_entry.metadata.first_player = input.first_player;
//                                                                 temp_entry.metadata.hasFirstPlayer = true
//                                                                 temp_entry1.metadata.first_player = input.first_player;
//                                                                 temp_entry1.metadata.hasFirstPlayer = true
//                                                                 total_joined += 1

//                                                             }
//                                                             if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {
//                                                                 getplayer = true
//                                                                 temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                                 temp_entry.metadata.second_player = input.second_player;
//                                                                 temp_entry.metadata.hasSecondPlayer = true;
//                                                                 temp_entry1.metadata.second_player = input.second_player;
//                                                                 temp_entry1.metadata.hasSecondPlayer = true;
//                                                                 total_joined += 1

//                                                             }
//                                                             if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {
//                                                                 getplayer = true
//                                                                 temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                                 temp_entry.metadata.third_player = input.third_player;
//                                                                 temp_entry.metadata.hasThirdPlayer = true;
//                                                                 temp_entry1.metadata.third_player = input.third_player;
//                                                                 temp_entry1.metadata.hasThirdPlayer = true;
//                                                                 total_joined += 1

//                                                             }
//                                                             if (input.hasForthPlayer && input.hasForthPlayer == "true") {
//                                                                 getplayer = true
//                                                                 temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                                 temp_entry.metadata.forth_player = input.forth_player;
//                                                                 temp_entry.metadata.hasForthPlayer = true;
//                                                                 temp_entry1.metadata.forth_player = input.forth_player;
//                                                                 temp_entry1.metadata.hasForthPlayer = true;
//                                                                 total_joined += 1
//                                                             }
//                                                             if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {
//                                                                 getplayer = true
//                                                                 temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                                 temp_entry.metadata.fifth_player = input.fifth_player;
//                                                                 temp_entry.metadata.hasFifthPlayer = true;
//                                                                 temp_entry1.metadata.fifth_player = input.fifth_player;
//                                                                 temp_entry1.metadata.hasFifthPlayer = true;
//                                                                 total_joined += 1

//                                                             }
//                                                             if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {
//                                                                 //console.log(input.hasSixthPlayer + ' ' + input.sixth_player)
//                                                                 getplayer = true
//                                                                 temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                                 temp_entry.metadata.sixth_player = input.sixth_player;
//                                                                 temp_entry.metadata.hasSixthPlayer = true;
//                                                                 temp_entry1.metadata.sixth_player = input.sixth_player;
//                                                                 temp_entry1.metadata.hasSixthPlayer = true;
//                                                                 total_joined += 1

//                                                             }

//                                                             if (input.hasExtraPlayerOne == "true") {
//                                                                 getplayer = true
//                                                                 console.log(input.extraPlayerOne)
//                                                                 temp_entry.metadata.hasExtraPlayerOne = true;
//                                                                 temp_entry1.metadata.hasExtraPlayerOne = true;

//                                                                 temp_entry.metadata.extraPlayerOne = input.extraPlayerOne;
//                                                                 temp_entry1.metadata.extraPlayerOne = input.extraPlayerOne;

//                                                             }

//                                                             if (input.hasExtraPlayerTwo == "true") {
//                                                                 getplayer = true
//                                                                 console.log(input.extraPlayerTwo)
//                                                                 temp_entry.metadata.hasExtraPlayerTwo = true;
//                                                                 temp_entry1.metadata.hasExtraPlayerTwo = true;

//                                                                 temp_entry.metadata.extraPlayerTwo = input.extraPlayerTwo;
//                                                                 temp_entry1.metadata.extraPlayerTwo = input.extraPlayerTwo;

//                                                             }

//                                                             if (getplayer) {
//                                                                 let promo_active = false;
//                                                                 if (temp_entry.metadata.paid <= parseInt(user.metadata.total_balance)) {
//                                                                     if (parseInt(match.metadata.total_player) > parseInt(match.metadata.total_joined)) {
//                                                                         temp_entry.metadata.team_no = parseInt(input.team_no)
//                                                                         temp_entry.matchId = match.id
//                                                                         temp_entry.userId = user.id
//                                                                         connection.db.MatchEntry.create(temp_entry).catch((error) => {
//                                                                             console.log(error);
//                                                                             h.render_xhr(req, res, { e: 1 });
//                                                                         })
//                                                                             .then(created => {
//                                                                                 if (created) {
//                                                                                     connection.db.MatchEntryHistory.findOne({
//                                                                                         where: {
//                                                                                             team_no: input.team_no,
//                                                                                             matchId: input.match_id
//                                                                                         }
//                                                                                     }).catch((error) => {
//                                                                                         console.log(error);
//                                                                                         h.render_xhr(req, res, { e: 1 });
//                                                                                     })
//                                                                                         .then(hasGroup => {
//                                                                                             if (hasGroup) {
//                                                                                                 let metadata = hasGroup.metadata
//                                                                                                 if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
//                                                                                                     metadata.first_player = input.first_player;
//                                                                                                     metadata.hasFirstPlayer = true

//                                                                                                 }
//                                                                                                 if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

//                                                                                                     metadata.second_player = input.second_player;
//                                                                                                     metadata.hasSecondPlayer = true;

//                                                                                                 }
//                                                                                                 if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

//                                                                                                     metadata.third_player = input.third_player;
//                                                                                                     metadata.hasThirdPlayer = true;

//                                                                                                 }
//                                                                                                 if (input.hasForthPlayer && input.hasForthPlayer == "true") {

//                                                                                                     metadata.forth_player = input.forth_player;
//                                                                                                     metadata.hasForthPlayer = true;
//                                                                                                 }
//                                                                                                 if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

//                                                                                                     metadata.fifth_player = input.fifth_player;
//                                                                                                     metadata.hasFifthPlayer = true;

//                                                                                                 }
//                                                                                                 if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

//                                                                                                     metadata.sixth_player = input.sixth_player;
//                                                                                                     metadata.hasSixthPlayer = true;

//                                                                                                 }

//                                                                                                 hasGroup.update({ metadata: metadata }).then(done => {
//                                                                                                     if (done) {
//                                                                                                         let temp_balance = temp_entry.metadata.paid;
//                                                                                                         let metadata = user.metadata
//                                                                                                         metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
//                                                                                                         metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
//                                                                                                         if (parseInt(metadata.winning_balance) >= temp_balance) {
//                                                                                                             metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
//                                                                                                         }
//                                                                                                         else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
//                                                                                                             let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
//                                                                                                             metadata.winning_balance = 0
//                                                                                                             metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
//                                                                                                         }
//                                                                                                         else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
//                                                                                                             metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
//                                                                                                         };
                                                                                                        
//                                                                                                         user.update({ metadata: metadata })
//                                                                                                             .catch((error) => {
//                                                                                                                 console.log(error);
//                                                                                                                 h.render_xhr(req, res, { e: 1 });
//                                                                                                             })
//                                                                                                             .then(update => {
//                                                                                                                 if (update) {
//                                                                                                                     let metadata = match.metadata
//                                                                                                                     metadata.total_joined = metadata.total_joined + total_joined
//                                                                                                                     match.update({ metadata: metadata })
//                                                                                                                         .catch((error) => {
//                                                                                                                             console.log(error);
//                                                                                                                             h.render_xhr(req, res, { e: 1 });
//                                                                                                                         })
//                                                                                                                         .then(updated => {
//                                                                                                                             if (user.metadata.promo_shared_id && user.metadata.promo_status == 'active') {
//                                                                                                                                 connection.db.User.findOne({
//                                                                                                                                     where: {
//                                                                                                                                         id: user.metadata.promo_shared_id,
//                                                                                                                                     }
//                                                                                                                                 }).catch((error) => {
//                                                                                                                                     console.log(error);
//                                                                                                                                     h.render_xhr(req, res, { e: 1 });
//                                                                                                                                 })
//                                                                                                                                     .then(find_share => {
//                                                                                                                                         if (find_share) {
//                                                                                                                                             let metadata = find_share.metadata
//                                                                                                                                             metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
//                                                                                                                                             metadata.total_balance = parseInt(metadata.total_balance) + 10;
//                                                                                                                                             find_share.update({ metadata: metadata }).then(shared_done => {
//                                                                                                                                                 if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
//                                                                                                                                                     let metadata = user.metadata
//                                                                                                                                                     metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
//                                                                                                                                                     metadata.total_balance = parseInt(metadata.total_balance) + 5;
//                                                                                                                                                     metadata.promo_status = 'inactive'
//                                                                                                                                                     promo_active = true;
//                                                                                                                                                     user.update({metadata:metadata}).then(promo_done =>{
//                                                                                                                                                         h.render_xhr(req, res, { e: 0 })
//                                                                                                                                                     })
//                                                                                                                                                 }
                                                                                                                                                
//                                                                                                                                             })
//                                                                                                                                         }
//                                                                                                                                         else {
//                                                                                                                                             h.render_xhr(req, res, { e: 0 })
//                                                                                                                                         }
//                                                                                                                                     })
//                                                                                                                             }
//                                                                                                                             else {
//                                                                                                                                 h.render_xhr(req, res, { e: 0 })
//                                                                                                                             }
                                                                                                                            
//                                                                                                                         })
//                                                                                                                 }
//                                                                                                             })
//                                                                                                     }
//                                                                                                 })
//                                                                                             }
//                                                                                             else {
//                                                                                                 // let temp_entry1 = {

//                                                                                                 // }

//                                                                                                 // if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {

//                                                                                                 //     temp_entry1.metadata.first_player = input.first_player;
//                                                                                                 //     temp_entry1.metadata.hasFirstPlayer = true

//                                                                                                 // }
//                                                                                                 // if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

//                                                                                                 //     temp_entry1.metadata.second_ = input.second_player;
//                                                                                                 //     temp_entry1.metadata.hasSecondPlayer = true;


//                                                                                                 // }
//                                                                                                 // if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

//                                                                                                 //     temp_entry1.metadata.third_player = input.third_player;
//                                                                                                 //     temp_entry1.metadata.hasThirdPlayer = true;

//                                                                                                 // }
//                                                                                                 // if (input.hasForthPlayer && input.hasForthPlayer == "true") {

//                                                                                                 //     temp_entry1.metadata.forth_player = input.forth_player;
//                                                                                                 //     temp_entry1.metadata.hasForthPlayer = true;
//                                                                                                 // }
//                                                                                                 // if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

//                                                                                                 //     temp_entry1.metadata.fifth_player = input.fifth_player;
//                                                                                                 //     temp_entry1.metadata.hasFifthPlayer = true;

//                                                                                                 // }
//                                                                                                 // if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

//                                                                                                 //     temp_entry1.metadata.sixth_player = input.sixth_player;
//                                                                                                 //     temp_entry1.metadata.hasSixthPlayer = true;

//                                                                                                 // }
//                                                                                                 temp_entry1.team_no = parseInt(input.team_no)
//                                                                                                 temp_entry1.matchId = input.match_id
//                                                                                                 connection.db.MatchEntryHistory.create(temp_entry1)
//                                                                                                     .catch(function (err) {
//                                                                                                         // print the error details
//                                                                                                         console.log(err);
//                                                                                                     })
//                                                                                                     .then(done => {
//                                                                                                         if (done) {
//                                                                                                             let temp_balance = temp_entry.metadata.paid;
//                                                                                                             let metadata = user.metadata
//                                                                                                             metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
//                                                                                                             metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
//                                                                                                             if (parseInt(metadata.winning_balance) >= temp_balance) {
//                                                                                                                 metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
//                                                                                                             }
//                                                                                                             else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
//                                                                                                                 let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
//                                                                                                                 metadata.winning_balance = 0
//                                                                                                                 metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
//                                                                                                             }
//                                                                                                             else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
//                                                                                                                 metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
//                                                                                                             };
                                                                                                           
//                                                                                                             user.update({ metadata: metadata })
//                                                                                                                 .catch((error) => {
//                                                                                                                     console.log(error);
//                                                                                                                     h.render_xhr(req, res, { e: 1 });
//                                                                                                                 })
//                                                                                                                 .then(update => {
//                                                                                                                     if (update) {
//                                                                                                                         let metadata = match.metadata
//                                                                                                                         metadata.total_joined = metadata.total_joined + total_joined
//                                                                                                                         match.update({ metadata: metadata }).then(updated => {
//                                                                                                                             if (user.metadata.promo_shared_id && user.metadata.promo_status == 'active') {
//                                                                                                                                 connection.db.User.findOne({
//                                                                                                                                     where: {
//                                                                                                                                         id: user.metadata.promo_shared_id,
//                                                                                                                                     }
//                                                                                                                                 }).catch((error) => {
//                                                                                                                                     console.log(error);
//                                                                                                                                     h.render_xhr(req, res, { e: 1 });
//                                                                                                                                 })
//                                                                                                                                     .then(find_share => {
//                                                                                                                                         if (find_share) {
//                                                                                                                                             let metadata = find_share.metadata
//                                                                                                                                             metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
//                                                                                                                                             metadata.total_balance = parseInt(metadata.total_balance) + 10;
//                                                                                                                                             find_share.update({ metadata: metadata }).then(shared_done => {
//                                                                                                                                                 if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
//                                                                                                                                                     let metadata = user.metadata
//                                                                                                                                                     metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
//                                                                                                                                                     metadata.total_balance = parseInt(metadata.total_balance) + 5;
//                                                                                                                                                     metadata.promo_status = 'inactive'
//                                                                                                                                                     promo_active = true;
//                                                                                                                                                     user.update({metadata:metadata}).then(promo_done =>{
//                                                                                                                                                         h.render_xhr(req, res, { e: 0 })
//                                                                                                                                                     })
//                                                                                                                                                 }
                                                                                                                                                
//                                                                                                                                             })
//                                                                                                                                         }
//                                                                                                                                         else {
//                                                                                                                                             h.render_xhr(req, res, { e: 0 })
//                                                                                                                                         }
//                                                                                                                                     })
//                                                                                                                             }
//                                                                                                                             else {
//                                                                                                                                 h.render_xhr(req, res, { e: 0 })
//                                                                                                                             }
//                                                                                                                         })
//                                                                                                                     }
//                                                                                                                 })
//                                                                                                         }
//                                                                                                     })
//                                                                                             }
//                                                                                         })
//                                                                                 }
//                                                                             })
//                                                                     }
//                                                                     else {
//                                                                         h.render_xhr(req, res, { e: 5, m: 'Match full!' })
//                                                                     }
//                                                                 }
//                                                                 else {
//                                                                     h.render_xhr(req, res, { e: 4, m: 'Not enough balance' })
//                                                                 }
//                                                             }
//                                                             else {
//                                                                 h.render_xhr(req, res, { e: 3, m: 'Input missing!' })
//                                                             }
//                                                         })
//                                                 }
//                                             }
//                                             else {
//                                                 connection.db.Match.findOne({
//                                                     where: {
//                                                         id: input.match_id
//                                                     }
//                                                 }).catch((error) => {
//                                                     console.log(error);
//                                                     h.render_xhr(req, res, { e: 1 });
//                                                 })
//                                                     .then(match => {
//                                                         let temp_entry = {
//                                                             metadata: {
//                                                                 paid: 0
//                                                             }
//                                                         }

//                                                         let temp_entry1 = {
//                                                             metadata: {

//                                                             }
//                                                         }

//                                                         if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
//                                                             getplayer = true
//                                                             temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                             temp_entry.metadata.first_player = input.first_player;
//                                                             temp_entry.metadata.hasFirstPlayer = true
//                                                             temp_entry1.metadata.first_player = input.first_player;
//                                                             temp_entry1.metadata.hasFirstPlayer = true
//                                                             total_joined += 1

//                                                         }
//                                                         if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {
//                                                             getplayer = true
//                                                             temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                             temp_entry.metadata.second_player = input.second_player;
//                                                             temp_entry.metadata.hasSecondPlayer = true;
//                                                             temp_entry1.metadata.second_player = input.second_player;
//                                                             temp_entry1.metadata.hasSecondPlayer = true;
//                                                             total_joined += 1

//                                                         }
//                                                         if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {
//                                                             getplayer = true
//                                                             temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                             temp_entry.metadata.third_player = input.third_player;
//                                                             temp_entry.metadata.hasThirdPlayer = true;
//                                                             temp_entry1.metadata.third_player = input.third_player;
//                                                             temp_entry1.metadata.hasThirdPlayer = true;
//                                                             total_joined += 1

//                                                         }
//                                                         if (input.hasForthPlayer && input.hasForthPlayer == "true") {
//                                                             getplayer = true
//                                                             temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                             temp_entry.metadata.forth_player = input.forth_player;
//                                                             temp_entry.metadata.hasForthPlayer = true;
//                                                             temp_entry1.metadata.forth_player = input.forth_player;
//                                                             temp_entry1.metadata.hasForthPlayer = true;
//                                                             total_joined += 1
//                                                         }
//                                                         if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {
//                                                             getplayer = true
//                                                             temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                             temp_entry.metadata.fifth_player = input.fifth_player;
//                                                             temp_entry.metadata.hasFifthPlayer = true;
//                                                             temp_entry1.metadata.fifth_player = input.fifth_player;
//                                                             temp_entry1.metadata.hasFifthPlayer = true;
//                                                             total_joined += 1

//                                                         }
//                                                         if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {
//                                                             //console.log(input.hasSixthPlayer + ' ' + input.sixth_player)
//                                                             getplayer = true
//                                                             temp_entry.metadata.paid = temp_entry.metadata.paid + parseInt(match.metadata.entry_fee)
//                                                             temp_entry.metadata.sixth_player = input.sixth_player;
//                                                             temp_entry.metadata.hasSixthPlayer = true;
//                                                             temp_entry1.metadata.sixth_player = input.sixth_player;
//                                                             temp_entry1.metadata.hasSixthPlayer = true;
//                                                             total_joined += 1

//                                                         }

//                                                         if (input.hasExtraPlayerOne == "true") {
//                                                             getplayer = true
//                                                             temp_entry.metadata.hasExtraPlayerOne = true;
//                                                             temp_entry1.metadata.hasExtraPlayerOne = true;

//                                                             temp_entry.metadata.extraPlayerOne = input.extraPlayerOne;
//                                                             temp_entry1.metadata.extraPlayerOne = input.extraPlayerOne;

//                                                         }

//                                                         if (input.hasExtraPlayerTwo == "true") {
//                                                             getplayer = true

//                                                             temp_entry.metadata.hasExtraPlayerTwo = true;
//                                                             temp_entry1.metadata.hasExtraPlayerTwo = true;

//                                                             temp_entry.metadata.extraPlayerTwo = input.extraPlayerTwo;
//                                                             temp_entry1.metadata.extraPlayerTwo = input.extraPlayerTwo;

//                                                         }

//                                                         if (getplayer) {
//                                                             let promo_active = false;
//                                                             if (temp_entry.metadata.paid <= parseInt(user.metadata.total_balance)) {
//                                                                 if (parseInt(match.metadata.total_player) > parseInt(match.metadata.total_joined)) {
//                                                                     temp_entry.metadata.team_no = parseInt(input.team_no)
//                                                                     temp_entry.matchId = match.id
//                                                                     temp_entry.userId = user.id
//                                                                     connection.db.MatchEntry.create(temp_entry).catch((error) => {
//                                                                         console.log(error);
//                                                                         h.render_xhr(req, res, { e: 1 });
//                                                                     })
//                                                                         .then(created => {
//                                                                             if (created) {
//                                                                                 connection.db.MatchEntryHistory.findOne({
//                                                                                     where: {
//                                                                                         team_no: input.team_no,
//                                                                                         matchId: input.match_id
//                                                                                     }
//                                                                                 }).then(hasGroup => {
//                                                                                     if (hasGroup) {
//                                                                                         let metadata = hasGroup.metadata
//                                                                                         if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {
//                                                                                             metadata.first_player = input.first_player;
//                                                                                             metadata.hasFirstPlayer = true

//                                                                                         }
//                                                                                         if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

//                                                                                             metadata.second_player = input.second_player;
//                                                                                             metadata.hasSecondPlayer = true;

//                                                                                         }
//                                                                                         if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

//                                                                                             metadata.third_player = input.third_player;
//                                                                                             metadata.hasThirdPlayer = true;

//                                                                                         }
//                                                                                         if (input.hasForthPlayer && input.hasForthPlayer == "true") {

//                                                                                             metadata.forth_player = input.forth_player;
//                                                                                             metadata.hasForthPlayer = true;
//                                                                                         }
//                                                                                         if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

//                                                                                             metadata.fifth_player = input.fifth_player;
//                                                                                             metadata.hasFifthPlayer = true;

//                                                                                         }
//                                                                                         if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

//                                                                                             metadata.sixth_player = input.sixth_player;
//                                                                                             metadata.hasSixthPlayer = true;

//                                                                                         }

//                                                                                         hasGroup.update({ metadata: metadata }).catch((error) => {
//                                                                                             console.log(error);
//                                                                                             h.render_xhr(req, res, { e: 1 });
//                                                                                         })
//                                                                                             .then(done => {
//                                                                                                 if (done) {
//                                                                                                     let temp_balance = temp_entry.metadata.paid;
//                                                                                                     let metadata = user.metadata
//                                                                                                     metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
//                                                                                                     metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
//                                                                                                     if (parseInt(metadata.winning_balance) >= temp_balance) {
//                                                                                                         metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
//                                                                                                     }
//                                                                                                     else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
//                                                                                                         let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
//                                                                                                         metadata.winning_balance = 0
//                                                                                                         metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
//                                                                                                     }
//                                                                                                     else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
//                                                                                                         metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
//                                                                                                     };
//                                                                                                     user.update({ metadata: metadata }).catch((error) => {
//                                                                                                         console.log(error);
//                                                                                                         h.render_xhr(req, res, { e: 1 });
//                                                                                                     })
//                                                                                                         .then(update => {
//                                                                                                             if (update) {
//                                                                                                                 let metadata = match.metadata
//                                                                                                                 metadata.total_joined = metadata.total_joined + total_joined
//                                                                                                                 match.update({ metadata: metadata }).then(updated => {
//                                                                                                                     if (user.metadata.promo_shared_id && user.metadata.promo_status == 'active') {
//                                                                                                                         connection.db.User.findOne({
//                                                                                                                             where: {
//                                                                                                                                 id: user.metadata.promo_shared_id,
//                                                                                                                             }
//                                                                                                                         }).catch((error) => {
//                                                                                                                             console.log(error);
//                                                                                                                             h.render_xhr(req, res, { e: 1 });
//                                                                                                                         })
//                                                                                                                             .then(find_share => {
//                                                                                                                                 if (find_share) {
//                                                                                                                                     let metadata = find_share.metadata
//                                                                                                                                     metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
//                                                                                                                                     metadata.total_balance = parseInt(metadata.total_balance) + 10;
//                                                                                                                                     find_share.update({ metadata: metadata }).then(shared_done => {
//                                                                                                                                         if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
//                                                                                                                                             let metadata = user.metadata
//                                                                                                                                             metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
//                                                                                                                                             metadata.total_balance = parseInt(metadata.total_balance) + 5;
//                                                                                                                                             metadata.promo_status = 'inactive'
//                                                                                                                                             promo_active = true;
//                                                                                                                                             user.update({metadata:metadata}).then(promo_done =>{
//                                                                                                                                                 h.render_xhr(req, res, { e: 0 })
//                                                                                                                                             })
//                                                                                                                                         }
                                                                                                                                        
//                                                                                                                                     })
//                                                                                                                                 }
//                                                                                                                                 else {
//                                                                                                                                     h.render_xhr(req, res, { e: 0 })
//                                                                                                                                 }
//                                                                                                                             })
//                                                                                                                     }
//                                                                                                                     else {
//                                                                                                                         h.render_xhr(req, res, { e: 0 })
//                                                                                                                     }
//                                                                                                                 })
//                                                                                                             }
//                                                                                                         })
//                                                                                                 }
//                                                                                             })
//                                                                                     }
//                                                                                     else {
//                                                                                         // let temp_entry1 = {

//                                                                                         // }

//                                                                                         // if (input.hasFirstPlayer && input.hasFirstPlayer == "true") {

//                                                                                         //     temp_entry1.metadata.first_player = input.first_player;
//                                                                                         //     temp_entry1.metadata.hasFirstPlayer = true

//                                                                                         // }
//                                                                                         // if (input.hasSecondPlayer && input.hasSecondPlayer == "true") {

//                                                                                         //     temp_entry1.metadata.second_ = input.second_player;
//                                                                                         //     temp_entry1.metadata.hasSecondPlayer = true;


//                                                                                         // }
//                                                                                         // if (input.hasThirdPlayer && input.hasThirdPlayer == "true") {

//                                                                                         //     temp_entry1.metadata.third_player = input.third_player;
//                                                                                         //     temp_entry1.metadata.hasThirdPlayer = true;

//                                                                                         // }
//                                                                                         // if (input.hasForthPlayer && input.hasForthPlayer == "true") {

//                                                                                         //     temp_entry1.metadata.forth_player = input.forth_player;
//                                                                                         //     temp_entry1.metadata.hasForthPlayer = true;
//                                                                                         // }
//                                                                                         // if (input.hasFifthPlayer && input.hasFifthPlayer == "true") {

//                                                                                         //     temp_entry1.metadata.fifth_player = input.fifth_player;
//                                                                                         //     temp_entry1.metadata.hasFifthPlayer = true;

//                                                                                         // }
//                                                                                         // if (input.hasSixthPlayer && input.hasSixthPlayer == "true") {

//                                                                                         //     temp_entry1.metadata.sixth_player = input.sixth_player;
//                                                                                         //     temp_entry1.metadata.hasSixthPlayer = true;

//                                                                                         // }
//                                                                                         temp_entry1.team_no = parseInt(input.team_no)
//                                                                                         temp_entry1.matchId = input.match_id
//                                                                                         connection.db.MatchEntryHistory.create(temp_entry1)
//                                                                                             .catch(function (err) {
//                                                                                                 // print the error details
//                                                                                                 console.log(err);
//                                                                                             })
//                                                                                             .then(done => {
//                                                                                                 if (done) {
//                                                                                                     let temp_balance = temp_entry.metadata.paid;
//                                                                                                     let metadata = user.metadata
//                                                                                                     metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
//                                                                                                     metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
//                                                                                                     if (parseInt(metadata.winning_balance) >= temp_balance) {
//                                                                                                         metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
//                                                                                                     }
//                                                                                                     else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
//                                                                                                         let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
//                                                                                                         metadata.winning_balance = 0
//                                                                                                         metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
//                                                                                                     }
//                                                                                                     else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
//                                                                                                         metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
//                                                                                                     };
                                                                                                    
//                                                                                                     user.update({ metadata: metadata }).catch((error) => {
//                                                                                                         console.log(error);
//                                                                                                         h.render_xhr(req, res, { e: 1 });
//                                                                                                     })
//                                                                                                         .then(update => {
//                                                                                                             if (update) {
//                                                                                                                 let metadata = match.metadata
//                                                                                                                 metadata.total_joined = metadata.total_joined + total_joined
//                                                                                                                 match.update({ metadata: metadata }).catch((error) => {
//                                                                                                                     console.log(error);
//                                                                                                                     h.render_xhr(req, res, { e: 1 });
//                                                                                                                 })
//                                                                                                                     .then(updated => {
//                                                                                                                         if (user.metadata.promo_shared_id && user.metadata.promo_status == 'active') {
//                                                                                                                             connection.db.User.findOne({
//                                                                                                                                 where: {
//                                                                                                                                     id: user.metadata.promo_shared_id,
//                                                                                                                                 }
//                                                                                                                             }).catch((error) => {
//                                                                                                                                 console.log(error);
//                                                                                                                                 h.render_xhr(req, res, { e: 1 });
//                                                                                                                             })
//                                                                                                                                 .then(find_share => {
//                                                                                                                                     if (find_share) {
//                                                                                                                                         let metadata = find_share.metadata
//                                                                                                                                         metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
//                                                                                                                                         metadata.total_balance = parseInt(metadata.total_balance) + 10;
//                                                                                                                                         find_share.update({ metadata: metadata }).then(shared_done => {
//                                                                                                                                             if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
//                                                                                                                                                 let metadata = user.metadata
//                                                                                                                                                 metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
//                                                                                                                                                 metadata.total_balance = parseInt(metadata.total_balance) + 5;
//                                                                                                                                                 metadata.promo_status = 'inactive'
//                                                                                                                                                 promo_active = true;
//                                                                                                                                                 user.update({metadata:metadata}).then(promo_done =>{
//                                                                                                                                                     h.render_xhr(req, res, { e: 0 })
//                                                                                                                                                 })
//                                                                                                                                             }
                                                                                                                                            
//                                                                                                                                         })
//                                                                                                                                     }
//                                                                                                                                     else {
//                                                                                                                                         h.render_xhr(req, res, { e: 0 })
//                                                                                                                                     }
//                                                                                                                                 })
//                                                                                                                         }
//                                                                                                                         else {
//                                                                                                                             h.render_xhr(req, res, { e: 0 })
//                                                                                                                         }
//                                                                                                                     })
//                                                                                                             }
//                                                                                                         })
//                                                                                                 }
//                                                                                             })
//                                                                                     }
//                                                                                 })
//                                                                             }
//                                                                         })
//                                                                 }
//                                                                 else {
//                                                                     h.render_xhr(req, res, { e: 5, m: 'Match full!' })
//                                                                 }
//                                                             }
//                                                             else {
//                                                                 h.render_xhr(req, res, { e: 4, m: 'Not enough balance' })
//                                                             }
//                                                         }
//                                                         else {
//                                                             h.render_xhr(req, res, { e: 3, m: 'Input missing!' })
//                                                         }
//                                                     })
//                                             }
//                                         })
//                                 }
//                             })
//                     }
//                     else {
//                         h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
//                     }
//                 })
//         }
//         catch (err) {
//             console.log(err);
//             h.render_xhr(req, res, { e: 1 });
//         };
//     })
// }



controller.player.get_joined_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let entry_list = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    let entry_list = []

    connection.db.MatchEntryHistory.findAll({
        where:{
            matchId:input.match_id
        }
    }).then(entry =>{
        entry.forEach(function(each_entry){
            let new_entry = {
                team_no: each_entry.team_no
            }
            if(each_entry.metadata.hasFirstPlayer){
                new_entry.first_player = each_entry.metadata.first_player
                new_entry.hasFirstPlayer = each_entry.metadata.hasFirstPlayer
            }
            if(each_entry.metadata.hasSecondPlayer){
                new_entry.second_player = each_entry.metadata.second_player
                new_entry.hasSecondPlayer = each_entry.metadata.hasSecondPlayer
            }
            if(each_entry.metadata.hasThirdPlayer){
                new_entry.third_player = each_entry.metadata.third_player
                new_entry.hasThirdPlayer = each_entry.metadata.hasThirdPlayer
            }
            if(each_entry.metadata.hasForthPlayer){
                new_entry.forth_player = each_entry.metadata.forth_player
                new_entry.hasForthPlayer = each_entry.metadata.hasForthPlayer
            }
            if(each_entry.metadata.hasFifthPlayer){
                new_entry.fifth_player = each_entry.metadata.fifth_player
                new_entry.hasFifthPlayer = each_entry.metadata.hasFifthPlayer
            }
            if(each_entry.metadata.hasSixthPlayer){
                new_entry.sixth_player = each_entry.metadata.sixth_player
                new_entry.hasSixthPlayer = each_entry.metadata.hasSixthPlayer
            }
            
            if(each_entry.metadata.hasExtraPlayerOne){
                new_entry.extra_player_one = each_entry.metadata.extraPlayerOne
                new_entry.hasExtraOne = true
            }
            
            if(each_entry.metadata.hasExtraPlayerTwo){
                new_entry.extra_player_two = each_entry.metadata.extraPlayerTwo
                new_entry.hasExtraTwo = true
            }


            entry_list.push(new_entry)
        })
        h.render_xhr(req, res, {e: 0, m:entry_list})
    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        };
    })
}

controller.player.test = function(req, res){
    //if(req.useragent.isWindows == true){
        // let a = 'jfjfjj3jkk2kmmfhgjkjfkkkfkf'
        // const token = h.jwt.sign({
        //     name: "Robi",
        //     id: 5,
        // },
        // process.env.JWT_SECRET,{
        //     expiresIn: '1h'
        // });
        // h.hash(a).then(hash =>{
        //     //const {v4: uuidv4} = require('uuid');
        //     let player ={
        //         name: "Robi",
        //         id: 4,
        //         pass:hash,
        //         api_token: token,
        //         agents: req.useragent
                
        //     }
        //     h.render_xhr(req, res, {e:0, m:player})
        // })
    //}
    // h.process_post_input(req, res, function(req, res, body){
    //     let input = qs.parse(body)
    //     let file = {
    //         name: input.name,
    //         id:input.id
    //     }
    //     console.log(file)
    //     h.render_xhr(req, res, {e:0, m:file})
    // })
    // let i = 0
    // let now = h.moment().add(0, 'h').format('MMMM Do YYYY, h:mm:ss a');
    // connection.db.User.findOne({
    //     where:{
    //         id:1
    //     }
    // }).then(user =>{
    //     let a = `hi robi, your user name is${user.metadata.user_name}`
    //     h.render_xhr(req, res, {e:0, m:a, now})
    // })
    
    // let tittle = 'Test'
    // let body = 'Testing Firebase'
    // let topic = 'topics'
    // let
    // h.send_notification(tittle, body, topic)
    // h.render_xhr(req, res, {e:0})
    // connection.db.MatchEntryHistory.findOne({
    //     where:{
    //         matchId:13455
    //     }
    // }).then(entry =>{
    //     h.render_xhr(req, res, {e:0, m:entry})
    // })
    // let entry_list = []
    // connection.db.MatchEntryHistory.findAll({
    //     where:{
    //         matchId:13455
    //     }
    // }).then(entry =>{
    //     entry.forEach(function(each_entry){
    //         let new_entry = {
    //             team_no: each_entry.team_no
    //         }
    //         if(each_entry.metadata.hasFirstPlayer){
    //             new_entry.first_player = each_entry.metadata.first_player
    //             new_entry.hasFirstPlayer = each_entry.metadata.hasFirstPlayer
    //         }
    //         if(each_entry.metadata.hasSecondPlayer){
    //             new_entry.second_player = each_entry.metadata.second_player
    //             new_entry.hasSecondPlayer = each_entry.metadata.hasSecondPlayer
    //         }
    //         if(each_entry.metadata.hasThirdPlayer){
    //             new_entry.third_player = each_entry.metadata.third_player
    //             new_entry.hasThirdPlayer = each_entry.metadata.hasThirdPlayer
    //         }
    //         if(each_entry.metadata.hasForthPlayer){
    //             new_entry.forth_player = each_entry.metadata.forth_player
    //             new_entry.hasForthPlayer = each_entry.metadata.hasForthPlayer
    //         }
    //         if(each_entry.metadata.hasFifthPlayer){
    //             new_entry.fifth_player = each_entry.metadata.fifth_player
    //             new_entry.hasFifthPlayer = each_entry.metadata.hasFifthPlayer
    //         }
    //         if(each_entry.metadata.hasSixthPlayer){
    //             new_entry.sixth_player = each_entry.metadata.sixth_player
    //             new_entry.hasSixthPlayer = each_entry.metadata.hasSixthPlayer
    //         }
            
    //         if(each_entry.metadata.hasExtraPlayerOne){
    //             new_entry.extra_player_one = each_entry.metadata.extraPlayerOne
    //             new_entry.hasExtraPlayerOne = true
    //         }
            
    //         if(each_entry.metadata.hasExtraPlayerTwo){
    //             new_entry.extra_player_two = each_entry.metadata.extraPlayerTwo
    //             new_entry.hasExtraPlayerTwo = true
    //         }


    //         entry_list.push(new_entry)
    //     })
    //     h.render_xhr(req, res, {e: 0, m:entry_list})
    // })
    let list = []
    const Op = h.Sequelize.Op
    let count = 0
    connection.db.User.findAll({
        where:{
            metadata:{
                total_balance:{
                    [Op.gte]:500
                }
            }
            
            // metadata:{
            //     'promo_shared_id':145294
            // }
        },
        order: [['id', 'ASC']]
    }).then(user =>{
        user.forEach(function(each_user){
            //if(each_user.metadata.total_balance >= 1000){
                count++
                let temp ={
                    user_id: each_user.id,
                    user_name:each_user.metadata.user_name,
                    balance: each_user.metadata.total_balance,
                    deposit_balance: each_user.metadata.deposit_balance,
                    winning_balance: each_user.metadata.winning_balance
                }
                list.push(temp)
            //}
            
        })
        h.render_xhr(req, res, {e:0, m:count, list})
    })
}

controller.player.update_app = function(req, res){
    try{
        let update = {
            khelo: "62",
            link: "https://khelo.live/wp-content/uploads/2022/11/Khelo3.1.5.apk",
            id: "1"
        }
        h.render_xhr(req, res, {e:0, m:update})
    }
    catch(err){
        console.log(err)
        h.render_xhr(req, res, {e:1})
    }
}

controller.player.send_registration_token = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            connection.db.User.findOne({
                where: {
                    metadata: { phone: input.phone } 
                    //[Op.or]: [{ metadata: { phone: input.phone } }, { metadata: { email: input.deviceId } }]
                }
            }).then(user => {
                if (user) {
                    h.render_xhr(req, res, { e: 2, m: 'Your phone number exist!' })
                }
                else {
                    connection.db.User.findOne({
                        where: {
                            metadata: {
                                user_name: input.user_name
                            }
                        }
                    }).then(user_name => {
                        if (user_name) {
                            h.render_xhr(req, res, { e: 3, m: 'Your userName already exist!' })
                        }
                        else {
                            connection.db.User.findOne({
                                where:{
                                    metadata:{
                                        email: input.deviceId
                                    }
                                }
                            }).then(euser =>{
                                if(euser){
                                   h.render_xhr(req, res, { e: 4, m: 'Your email already exist!' }) 
                                }
                                else{
                                    connection.db.ResetToken.findAll({
                                where: {
                                    metadata: {
                                        phone: input.phone
                                    },
                                    createdAt: {
                                        [Op.between]: [start, end]
                                    }
                                }
                            }).then(token_list => {
                                if (token_list.length > 2) {
                                    h.render_xhr(req, res, { e: 5, m: "You are blocked for today!" });
                                }
                                else {
                                    let token = Math.floor(Math.random() * 899999 + 100000);
                                    connection.db.ResetToken.create({
                                        token: token,
                                        userId: null,
                                        metadata: {
                                            phone: input.phone
                                        }
                                    }).then(created => {
                                        if (created) {
                                            // try {
                                            //     h.send_sms({
                                            //         number: input.phone,
                                            //         body: `Your Khelo.Shop OTP token is: ${token}`
                                            //     });
                                            //     h.render_xhr(req, res, { e: 0 })
                                            // } catch (err) {
                                            //     console.log(`MDL SMS error: ${err}`);
                                            // }
                                            h.send_email(input.deviceId, 'Khelo Registration OTP', `Your OTP code: ${token}`)
                                            h.render_xhr(req, res, { e: 0 })
                                        }
                                    })
                                }
                            })
                                }
                            })
                        }
                    })
                }
            })

        }
        catch (err) {
            console.log(err)
            h.render_xhr(req, res, { e: 1 })
        }
    })
}    
    
controller.player.user_regitration = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    metadata:{
                        phone:input.phone
                    }
                }
            }).catch(err => console.log(err))
            .then(user =>{
                if(user){
                    h.render_xhr(req, res, {e:1, m:'You already have an account!'})
                }
                else{
                    connection.db.ResetToken.findOne({
                        where:{
                            [Op.and]:[{token:input.token}, {active:true}, {metadata:{phone:input.phone}}]
                        }
                    }).catch(err => console.log(err))
                    .then(find_token=>{
                        if(find_token){
                            connection.db.User.findOne({
                                 order: [['id', 'DESC']]
                                }).catch(err => console.log(err)).then(new_i =>{
                                    find_token.update({active:false}).catch(err => console.log(err)).then(done=>{
                                h.hash(input.password).catch(err => console.log(err)).then(hash =>{
                                    let user_info = {
                                        id:new_i.id+1,
                                        metadata:{
                                            total_balance:0,
                                            deposit_balance:0,
                                            winning_balance:0,
                                            email:input.email,
                                            name:input.name,
                                            user_name: input.user_name,
                                            total_kill:0,
                                            phone:input.phone,
                                            promo:input.user_name,
                                            total_match_play:0,
                                            match_win:0,
                                            ludo_win:0,
                                            total_ludo_played:0,
                                            password:hash,
                                            status:'active'
                                        }
                                    }
                                    
                                    if(input.promo){
                                        connection.db.User.findOne({
                                            where:{
                                                metadata:{
                                                    promo:input.promo
                                                }
                                            }
                                        }).catch(err => console.log(err)).then(get_promo =>{
                                            if(get_promo){
                                                user_info.metadata.refer = input.promo
                                                user_info.metadata.promo_status = 'active'
                                                user_info.metadata.promo_shared_id = get_promo.id
                                                connection.db.User.create(user_info).catch(err => console.log(err)).then(successful=>{
                                                    if(successful){
                                                        find_token.update({userId:successful.id}).then(update_done =>{
                                                            if(update_done){
                                                                h.render_xhr(req, res,{e:0, m:'successfully registartd!'})
                                                            }
                                                            else{
                                                                h.render_xhr(req, res,{e:5, m:'Something went wrong!'})
                                                            }
                                                        })
                                                    }
                                                   
                                                })
                                            }
                                            else{
                                                connection.db.User.create(user_info).catch(err => console.log(err)).then(successful=>{
                                                    if(successful){
                                                        find_token.update({userId:successful.id}).then(update_done =>{
                                                            if(update_done){
                                                                h.render_xhr(req, res,{e:0, m:'successfully registartd!'})
                                                            }
                                                            else{
                                                                h.render_xhr(req, res,{e:5, m:'Something went wrong!'})
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })

                                    }
                                    else{
                                        connection.db.User.create(user_info).catch(err => console.log(err)).then(successful=>{
                                            if(successful){
                                                find_token.update({userId:successful.id}).catch(err => console.log(err)).then(update_done =>{
                                                    if(update_done){
                                                        h.render_xhr(req, res,{e:0, m:'successfully registartd!'})
                                                    }
                                                    else{
                                                        h.render_xhr(req, res,{e:5, m:'Something went wrong!'})
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    
                                })
                            })
                                })
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m:'Try again!'})
                        }
                        
                    })
                }
            })
        }catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:1})
        }
    })
}

controller.player.user_login = function(req, res){
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
                        h.verify(input.password, user.metadata.password).catch(err => console.log(err)).then(check => {
                            if (check == true) {
                                const token = h.jwt.sign({
                                        name: user.metadata.name,
                                        auth_code: h.generate_refer_code(6),
                                    },
                                    process.env.JWT_SECRET,{
                                        expiresIn: '7d'
                                    });
                                    let metadata = user.metadata
                                    metadata.jwt_token = token
                                    user.update({metadata:metadata}).then(done=>{
                                        if(done){
                                            let temp_info ={
                                                secret_id: user.id,
                                                jwt_token: user.metadata.jwt_token
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
            h.render_xhr(req, res, {e: 2});
        }
    })
}

controller.player.reset_pass_request = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body);
            const Op = h.Sequelize.Op;
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            if (input.phone) {
                console.log(input.phone)
                connection.db.User.findOne({ where: { metadata: { email: input.phone } } }).then(user => {
                    if (!user) {
                        h.render_xhr(req, res, { e: 0, m: "You don't have any account!" });
                    } else {
                        connection.db.ResetToken.findAll({
                            where: {
                                userId: user.id,
                                createdAt: {
                                    [Op.between]: [start, end]
                                }
                            }
                        }).then(token_list => {
                            if (token_list.length > 2) {
                                h.render_xhr(req, res, { e: 1, m: "You are blocked for today!" });
                            }
                            else {
                                let token = Math.floor(1000 + Math.random() * 9000);
                                connection.db.ResetToken.create({
                                    token: token,
                                    userId: user.id,
                                    metadata: {
                                        phone: user.metadata.phone,
                                        request: 'pass'
                                    }
                                }).then(created => {
                                    if (created) {
                                        //try {
                                            // h.send_sms({
                                            //     number: input.phone,
                                            //     body: `Your Khelo.Shop reset OTP token is: ${token}`
                                            // });
                                            
                                        // } catch (err) {
                                        //     console.log(`MDL SMS error: ${err}`);
                                        // }
                                        h.send_email(input.phone, 'Khelo Reset OTP', `Your OTP code: ${token}`)
                                            h.render_xhr(req, res, { e: 0 })
                                    }
                                })
                            }
                        })
                    }

                });
            } else {
                h.render_xhr(req, res, { e: 1, m: 'phone number not found!' });
            }
        } catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.player.reset_password = function(req, res){
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body);
            if (input.token && input.password) {
                connection.db.ResetToken.findOne({
                    where: {token: input.token, active: true},
                    include: [{model: connection.db.User}]
                }).then(token => {
                    if (token && token.user) {
                        // Gen pw
                        h.hash(input.password).then(hash =>{ 
                            let updated_metadata = token.user.metadata;
                            updated_metadata.password = hash;
                            token.user.update({metadata:updated_metadata}).then(updated_user => {
                                token.update({active:false}).then(done => {
                                    h.render_xhr(req, res, {e: 0});
                                });
                            });
                        });
                    } else {
                        h.render_xhr(req, res, {e: 1, m:'No token found!'});
                    }
                });
            }

        } catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        };
    })
}

controller.player.refresh_token = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            connection.db.User.findOne({
                where:{
                    id:input.secret_id
                }
            }).then(user =>{
                if(user){
                    if(input.auth_code){
                        const token = h.jwt.sign({
                            name: user.metadata.user_name,
                            auth_key: h.generate_refer_code(6),
                        },
                        process.env.JWT_SECRET,{
                            expiresIn: '24h'
                        });
                        let metadata = user.metadata
                        metadata.jwt_token = token
                        user.update({metadata:metadata}).then(logged_in =>{
                            if(logged_in){
                                h.render_xhr(req, res, {e:0, m:user.metadata.jwt_token})
                            }
                            else{
                                h.render_xhr(req, res, {e:1, m:'Token update failed!'})
                            }
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:1, m:'Invalid input!'})
                    }
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

controller.player.check_user_status = function(req, res){
    h.process_post_input(req, res, function(req,res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    let temp_status = {
                        status: user.metadata.status
                    }
                    h.render_xhr(req, res, {e:0, m:temp_status})
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

controller.player.get_profile_info = function(req, res){
    h.process_post_input(req, res, function(req,res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
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
                        match_win:user.metadata.match_win,
                        total_kill:user.metadata.total_kill,
                        total_balance: user.metadata.total_balance,
                        deposit_balance: user.metadata.deposit_balance,
                        winning_balance: user.metadata.winning_balance,
                        total_match_play: user.metadata.total_match_play
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

controller.player.update_profile_info = function(req, res){
    h.process_post_input(req, res, function(req,res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    let metadata = user.metadata
                    metadata.name = input.name,
                    metadata.email = input.email,
                    metadata.phone = input.phone
                    user.update({metadata:metadata}).then(update =>{
                        if(update){
                            h.render_xhr(req, res,{e:0})
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

controller.player.get_all_cs_lover_match_length = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where: {
                            [Op.and]: [{ [Op.or]:[{gameId:2}, {gameId:5}]}, { metadata: { status: 'created' } }]
                        }
                    }).then(matchs => {
                        h.render_xhr(req, res, { e: 0, m: matchs.length })
                    })
                }
                else {
                    h.render_xhr(req, res, { e: 1 })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.player.get_cs_lover_match_length = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id}, {metadata:{status:'created'}}]
                        }
                    }).then(matchs =>{
                        h.render_xhr(req, res, {e:0, m:matchs.length})
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

controller.player.get_cs_lover_separated_match_length = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id},{playingTypeId:input.playing_type_id}, {metadata:{status:'created'}}]
                        }
                    }).then(matchs =>{
                        h.render_xhr(req, res, {e:0, m:matchs.length})
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

controller.player.get_regular_match_length = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:1}, {metadata:{status:'created'}}]
                        }
                    }).then(matchs =>{
                        h.render_xhr(req, res, {e:0, m:matchs.length})
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

controller.player.get_full_map_match_length = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where: {
                            [Op.and]: [{ [Op.or]:[{gameId:1}, {gameId:9}, {gameId:10}]}, { metadata: { status: 'created' } }]
                        }
                    }).then(matchs => {
                        h.render_xhr(req, res, { e: 0, m: matchs.length })
                    })
                }
                else {
                    h.render_xhr(req, res, { e: 1 })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.player.get_tournament_match_length = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where: {
                            [Op.and]: [{ gameId: 6 }, { metadata: { status: 'created' } }]
                        }
                    }).then(matchs => {
                        h.render_xhr(req, res, { e: 0, m: matchs.length })
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

controller.player.get_freefire_premium_match_length = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where: {
                            [Op.and]: [{ gameId: 9 }, { metadata: { status: 'created' } }]
                        }
                    }).then(matchs => {
                        h.render_xhr(req, res, { e: 0, m: matchs.length })
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

controller.player.get_freefire_grand_match_length = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Match.findAll({
                        where: {
                            [Op.and]: [{ gameId: 10 }, { metadata: { status: 'created' } }]
                        }
                    }).then(matchs => {
                        h.render_xhr(req, res, { e: 0, m: matchs.length })
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

controller.player.get_created_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAll({
                            where: {
                                [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'new_created' } }]//game id is actually is it cs or regular match
                            },
                            order: [['createdAt', 'ASC']],
                            include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
                        }).then(matches => {
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: each_match.metadata.total_joined,
                                    total_prize: each_match.metadata.total_prize,
                                    first_prize: each_match.metadata.first_prize,
                                    second_prize: each_match.metadata.second_prize,
                                    third_prize: each_match.metadata.third_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if (parseInt(each_match.metadata.total_joined) == parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                                    // if(each_entry.matchId == each_match.id){
                                    //     if(each_entry.metadata.first_player && each_entry.metadata.second_player && each_entry.metadata.third_player && each_entry.metadata.forth_player){
                                    //         temp_match.joined_player+=4
                                    //     }
                                    //     if(each_entry.metadata.first_player && each_entry.metadata.second_player && each_entry.metadata.third_player && !each_entry.metadata.forth_player){
                                    //         temp_match.joined_player+=3
                                    //     }
                                    //     if(each_entry.metadata.first_player && each_entry.metadata.second_player && !each_entry.metadata.third_player && !each_entry.metadata.forth_player){
                                    //         temp_match.joined_player+=2
                                    //     }
                                    //     if(each_entry.metadata.first_player && !each_entry.metadata.second_player && !each_entry.metadata.third_player && !each_entry.metadata.forth_player){
                                    //         temp_match.joined_player+=1
                                    //     }
                                        
                                    // }
                    
                                })
                    
                                temp_match.left_player = parseInt(each_match.metadata.total_player) - temp_match.joined_player
                    
                                all_created_match.push(temp_match)
                            })
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_cs = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'DESC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    first_prize: each_match.metadata.first_prize,
                                    second_prize: each_match.metadata.second_prize,
                                    third_prize: each_match.metadata.third_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_regular = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'DESC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    first_prize: each_match.metadata.first_prize,
                                    second_prize: each_match.metadata.second_prize,
                                    third_prize: each_match.metadata.third_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

//update
controller.player.get_created_match_cs_one = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'ASC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_cs_two = function (req, res) {
   h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'ASC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_separated_cs_one = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
         try {
             let input = qs.parse(body)
             const Op = h.Sequelize.Op;
             let all_created_match = []
             const page_size = 8;
             let page_number = input.page_number;
     
             let offset = (page_number-1)*page_size;
     
             let filter = {
                 order:[['createdAt', 'ASC']]
                 ,limit: page_size
                 ,offset: offset
                 ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
     
             };
             filter. where = {
                 [Op.and]: [{ gameId:input.game_id},{playingTypeId:input.playing_type_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
             }
             connection.db.User.findOne({
                 where: {
                     [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                 }
             }).then(user => {
                 if (user) {
                     connection.db.MatchEntry.findAll({
                     }).then(entry_match => {
                         connection.db.Match.findAndCountAll(filter).then(result =>{
                             let count = result.count;
     
                             let has_results = false;
     
                             if(count > 0){
                                 has_results = true;
                             }
     
                             let matches = result.rows;
     
                             let records_remaining = count - (offset + matches.length);
     
                             let show_next = false;
                             let show_prev = true;
     
                             if(records_remaining > 0){
                                 show_next = true;
                             };
     
                             if(offset == 0){
                                 show_prev = false;
                             };
                             matches.map(function (each_match) {
                                 let temp_match = {
                                     match_id: each_match.id,
                                     entry_fee: each_match.metadata.entry_fee,
                                     map: each_match.metadata.map,
                                     per_kill_rate: each_match.metadata.per_kill_rate,
                                     title: each_match.metadata.title,
                                     total_player: each_match.metadata.total_player,
                                     joined_player: parseInt(each_match.metadata.total_joined),
                                     left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                     total_prize: each_match.metadata.total_prize,
                                     version: each_match.metadata.version,
                                     game_type: each_match.game.name,
                                     player_type: each_match.playing_type.type,
                                     isJoined: false,
                                 }
                                 
                                 if(each_match.metadata.date){
                                        temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                                    }
                                    else{
                                        temp_match.match_time = each_match.metadata.match_time
                                    }
                                 
                                 if(each_match.metadata.hasFirstPrize){
                                     temp_match.hasFirstPrize = true;
                                     temp_match.first_prize = each_match.metadata.first_prize;
                                 }
                                 if(each_match.metadata.hasSecondPrize){
                                     temp_match.hasSecondPrize = true;
                                     temp_match.second_prize = each_match.metadata.second_prize;
                                 }
                                 if(each_match.metadata.hasThirdPrize){
                                     temp_match.hasThirdPrize = true;
                                     temp_match.third_prize = each_match.metadata.third_prize;
                                 }
                                 if(each_match.metadata.hasFourthPrize){
                                     temp_match.hasFourthPrize = true;
                                     temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                 }
                                 if(each_match.metadata.hasFifthPrize){
                                     temp_match.hasFifthPrize = true;
                                     temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                 }
                                 if(each_match.metadata.hasSixthPrize){
                                     temp_match.hasSixthPrize = true;
                                     temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                 }
                                 if(each_match.metadata.hasSeventhPrize){
                                     temp_match.hasSeventhPrize = true;
                                     temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                 }
                                 if(each_match.metadata.hasEightthPrize){
                                     temp_match.hasEightthPrize = true;
                                     temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                 }
                                 if(each_match.metadata.hasNinethPrize){
                                     temp_match.hasNinethPrize = true;
                                     temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                 }
                                 if(each_match.metadata.hasTenthPrize){
                                     temp_match.hasTenthPrize = true;
                                     temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                 }
                                 if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                     temp_match.isMatchFull = true
                                 }
                                 else {
                                     temp_match.isMatchFull = false
                                 }
                                 
                                  if(each_match.metadata.room_id){
                                 temp_match.room_id = each_match.metadata.room_id
                                 }
                                 else{
                                     temp_match.room_id = ''
                                 }
                                 
                                 if(each_match.metadata.room_pass){
                                 temp_match.room_pass = each_match.metadata.room_pass
                                 }
                                 else{
                                     temp_match.room_pass = ''
                                 }
                                 
                                 entry_match.forEach(function (each_entry) {
                                     //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                     if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                         //console.log('true')
                                         temp_match.isJoined = true;
                                     }
                     
                                 })
                                 
                                 all_created_match.push(temp_match)
                             })
                             let pkt = {
                                 page_info:{
                                     has_results:has_results
                                     ,page_number:page_number
                                     ,show_next: show_next
                                     ,show_prev: show_prev
                                     ,records_remaining:records_remaining
                                     ,offset:offset
                                 }
                             };
                             all_created_match.push(pkt)
                             h.render_xhr(req, res, { e: 0, m: all_created_match });
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


 controller.player.get_created_match_separated_cs_two = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
         try {
             let input = qs.parse(body)
             const Op = h.Sequelize.Op;
             let all_created_match = []
             const page_size = 8;
             let page_number = input.page_number;
     
             let offset = (page_number-1)*page_size;
     
             let filter = {
                 order:[['createdAt', 'ASC']]
                 ,limit: page_size
                 ,offset: offset
                 ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
     
             };
             filter. where = {
                 [Op.and]: [{ gameId:input.game_id},{playingTypeId:input.playing_type_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
             }
             connection.db.User.findOne({
                 where: {
                     [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                 }
             }).then(user => {
                 if (user) {
                     connection.db.MatchEntry.findAll({
                     }).then(entry_match => {
                         connection.db.Match.findAndCountAll(filter).then(result =>{
                             let count = result.count;
     
                             let has_results = false;
     
                             if(count > 0){
                                 has_results = true;
                             }
     
                             let matches = result.rows;
     
                             let records_remaining = count - (offset + matches.length);
     
                             let show_next = false;
                             let show_prev = true;
     
                             if(records_remaining > 0){
                                 show_next = true;
                             };
     
                             if(offset == 0){
                                 show_prev = false;
                             };
                             matches.map(function (each_match) {
                                 let temp_match = {
                                     match_id: each_match.id,
                                     
                                     entry_fee: each_match.metadata.entry_fee,
                                     map: each_match.metadata.map,
                                     per_kill_rate: each_match.metadata.per_kill_rate,
                                     title: each_match.metadata.title,
                                     total_player: each_match.metadata.total_player,
                                     joined_player: parseInt(each_match.metadata.total_joined),
                                     left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                     total_prize: each_match.metadata.total_prize,
                                     version: each_match.metadata.version,
                                     game_type: each_match.game.name,
                                     player_type: each_match.playing_type.type,
                                     isJoined: false,
                                 }
                                 
                                 if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                                 if(each_match.metadata.hasFirstPrize){
                                     temp_match.hasFirstPrize = true;
                                     temp_match.first_prize = each_match.metadata.first_prize;
                                 }
                                 if(each_match.metadata.hasSecondPrize){
                                     temp_match.hasSecondPrize = true;
                                     temp_match.second_prize = each_match.metadata.second_prize;
                                 }
                                 if(each_match.metadata.hasThirdPrize){
                                     temp_match.hasThirdPrize = true;
                                     temp_match.third_prize = each_match.metadata.third_prize;
                                 }
                                 if(each_match.metadata.hasFourthPrize){
                                     temp_match.hasFourthPrize = true;
                                     temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                 }
                                 if(each_match.metadata.hasFifthPrize){
                                     temp_match.hasFifthPrize = true;
                                     temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                 }
                                 if(each_match.metadata.hasSixthPrize){
                                     temp_match.hasSixthPrize = true;
                                     temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                 }
                                 if(each_match.metadata.hasSeventhPrize){
                                     temp_match.hasSeventhPrize = true;
                                     temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                 }
                                 if(each_match.metadata.hasEightthPrize){
                                     temp_match.hasEightthPrize = true;
                                     temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                 }
                                 if(each_match.metadata.hasNinethPrize){
                                     temp_match.hasNinethPrize = true;
                                     temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                 }
                                 if(each_match.metadata.hasTenthPrize){
                                     temp_match.hasTenthPrize = true;
                                     temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                 }
                                 if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                     temp_match.isMatchFull = true
                                 }
                                 else {
                                     temp_match.isMatchFull = false
                                 }
                                 
                                  if(each_match.metadata.room_id){
                                 temp_match.room_id = each_match.metadata.room_id
                                 }
                                 else{
                                     temp_match.room_id = ''
                                 }
                                 
                                 if(each_match.metadata.room_pass){
                                 temp_match.room_pass = each_match.metadata.room_pass
                                 }
                                 else{
                                     temp_match.room_pass = ''
                                 }
                                 
                                 entry_match.forEach(function (each_entry) {
                                     //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                     if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                         //console.log('true')
                                         temp_match.isJoined = true;
                                     }
                     
                                 })
                                 
                                 all_created_match.push(temp_match)
                             })
                             let pkt = {
                                 page_info:{
                                     has_results:has_results
                                     ,page_number:page_number
                                     ,show_next: show_next
                                     ,show_prev: show_prev
                                     ,records_remaining:records_remaining
                                     ,offset:offset
                                 }
                             };
                             all_created_match.push(pkt)
                             h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_regular_one = function (req, res) {
   h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'ASC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_regular_two = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'ASC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                
                                 if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_match_tournament = function (req, res) {
   h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'ASC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.Match.findAndCountAll(filter).then(result =>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.match_time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: parseInt(each_match.metadata.total_joined),
                                    left_player: parseInt(each_match.metadata.total_player) - parseInt(each_match.metadata.total_joined),
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined: false,
                                }
                                
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                
                                if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                                }
                                else{
                                    temp_match.room_id = ''
                                }
                                
                                if(each_match.metadata.room_pass){
                                temp_match.room_pass = each_match.metadata.room_pass
                                }
                                else{
                                    temp_match.room_pass = ''
                                }
                                
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                    
                                })
                                
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_ongoing_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_ongoing_match = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    if(input.game_id){
                        connection.db.MatchEntry.findAll({
                        }).then(entry_match =>{
                            connection.db.Match.findAll({
                                where:{
                                    [Op.and]:[{gameId:input.game_id},{metadata:{status:'ongoing'}}]
                                },
                                order:[['createdAt', 'ASC']],
                                include:[{model: connection.db.Game},{model: connection.db.PlayingType}]
                            }).then(matches=>{
        
                                matches.map(function(each_match){
                                    let temp_match = {
                                        match_id: each_match.id,
                                       
                                        entry_fee: each_match.metadata.entry_fee,
                                        map: each_match.metadata.map,
                                        per_kill_rate: each_match.metadata.per_kill_rate,
                                        title: each_match.metadata.title,
                                        total_player: each_match.metadata.total_player,
                                        total_prize: each_match.metadata.total_prize,
                                        first_prize: each_match.metadata.first_prize,
                                        second_prize: each_match.metadata.second_prize,
                                        third_prize: each_match.metadata.third_prize,
                                        version: each_match.metadata.version,
                                        game_type: each_match.game.name,
                                        player_type: each_match.playing_type.type,
                                        isJoined:false
                                    }
                                    
                                    if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                                    entry_match.forEach(function(each_entry){
                                        if(each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount){
                                            temp_match.isJoined = true;
                                        }
                                    })
        
                                    all_ongoing_match.push(temp_match)
                                })
                                h.render_xhr(req, res, {e: 0, m:all_ongoing_match});
                            })
                        })
                    }
                    else{
                        connection.db.MatchEntry.findAll({
                        }).then(entry_match =>{
                            connection.db.Match.findAll({
                                where:{
                                   metadata:{
                                       status:'ongoing'
                                   }
                                },
                                order:[['createdAt', 'ASC']],
                                include:[{model: connection.db.Game},{model: connection.db.PlayingType}]
                            }).then(matches=>{
        
                                Array.from(matches).forEach(each_match =>{
                                    let temp_match = {
                                        match_id: each_match.id,
                                        match_time: each_match.metadata.match_time,
                                        entry_fee: each_match.metadata.entry_fee,
                                        map: each_match.metadata.map,
                                        per_kill_rate: each_match.metadata.per_kill_rate,
                                        title: each_match.metadata.title,
                                        total_player: each_match.metadata.total_player,
                                        total_prize: each_match.metadata.total_prize,
                                        first_prize: each_match.metadata.first_prize,
                                        second_prize: each_match.metadata.second_prize,
                                        third_prize: each_match.metadata.third_prize,
                                        version: each_match.metadata.version,
                                        game_type: each_match.game.name,
                                        player_type: each_match.playing_type.type,
                                        isJoined:false
                                    }
                                    entry_match.forEach(function(each_entry){
                                        if(each_entry.userId == user.id && each_entry.matchId == each_match.id){
                                            temp_match.isJoined = true;
                                        }
                                    })
        
                                    all_ongoing_match.push(temp_match)
                                })
                                h.render_xhr(req, res, {e: 0, m:all_ongoing_match});
                            })
                        })
                    }
                    
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

controller.player.get_result_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let all_result_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['updatedAt', 'DESC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'result' } }]//game id is actually is it cs or regular match
                ,createdAt: {
                     [Op.between]: [yesterday, today]
                 }
            }
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match =>{
                        connection.db.Match.findAndCountAll(filter).then(result=>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
    
                            Array.from(matches).forEach(each_match =>{
                                let temp_match = {
                                    match_id: each_match.id,
                                    
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    total_prize: each_match.metadata.total_prize,
                                    first_prize: each_match.metadata.first_prize,
                                    second_prize: each_match.metadata.second_prize,
                                    third_prize: each_match.metadata.third_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined:false
                                }
                                
                                if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                                entry_match.forEach(function(each_entry){
                                    if(each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount){
                                        temp_match.isJoined = true;
                                    }
                                })
    
                                all_result_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_result_match.push(pkt)
                            h.render_xhr(req, res, {e: 0, m:all_result_match});
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


//update
controller.player.get_result_match_one = function(req, res){
   h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let all_result_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['updatedAt', 'DESC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'result' } }]//game id is actually is it cs or regular match
                ,createdAt: {
                     [Op.between]: [yesterday, today]
                 }
            }
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match =>{
                        connection.db.Match.findAndCountAll(filter).then(result=>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
    
                            Array.from(matches).forEach(each_match =>{
                                let temp_match = {
                                    match_id: each_match.id,
                                    
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined:false
                                }
                                
                                if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                
                                if(entry_match && entry_match.metadata && entry_match.metadata.result_done){
                                    temp_match.result_done = true;
                                }
                                else{
                                    temp_match.result_done = false;
                                }
                                entry_match.forEach(function(each_entry){
                                    if(each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount){
                                        temp_match.isJoined = true;
                                    }
                                })
    
                                all_result_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_result_match.push(pkt)
                            h.render_xhr(req, res, {e: 0, m:all_result_match});
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

controller.player.get_result_match_two = function(req, res){
   h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let all_result_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['updatedAt', 'DESC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'result' } }]//game id is actually is it cs or regular match
                ,createdAt: {
                     [Op.between]: [yesterday, today]
                 }
            }
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findAll({
                    }).then(entry_match =>{
                        connection.db.Match.findAndCountAll(filter).then(result=>{
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
    
                            Array.from(matches).forEach(each_match =>{
                                let temp_match = {
                                    match_id: each_match.id,
                                    
                                    entry_fee: each_match.metadata.entry_fee,
                                    map: each_match.metadata.map,
                                    per_kill_rate: each_match.metadata.per_kill_rate,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    total_prize: each_match.metadata.total_prize,
                                    version: each_match.metadata.version,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    isJoined:false
                                }
                                
                                if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                                if(each_match.metadata.hasFirstPrize){
                                    temp_match.hasFirstPrize = true;
                                    temp_match.first_prize = each_match.metadata.first_prize;
                                }
                                if(each_match.metadata.hasSecondPrize){
                                    temp_match.hasSecondPrize = true;
                                    temp_match.second_prize = each_match.metadata.second_prize;
                                }
                                if(each_match.metadata.hasThirdPrize){
                                    temp_match.hasThirdPrize = true;
                                    temp_match.third_prize = each_match.metadata.third_prize;
                                }
                                if(each_match.metadata.hasFourthPrize){
                                    temp_match.hasFourthPrize = true;
                                    temp_match.fourth_prize = each_match.metadata.fourth_prize;
                                }
                                if(each_match.metadata.hasFifthPrize){
                                    temp_match.hasFifthPrize = true;
                                    temp_match.fifth_prize = each_match.metadata.fifth_prize;
                                }
                                if(each_match.metadata.hasSixthPrize){
                                    temp_match.hasSixthPrize = true;
                                    temp_match.sixth_prize = each_match.metadata.sixth_prize;
                                }
                                if(each_match.metadata.hasSeventhPrize){
                                    temp_match.hasSeventhPrize = true;
                                    temp_match.seventh_prize = each_match.metadata.seventh_prize;
                                }
                                if(each_match.metadata.hasEightthPrize){
                                    temp_match.hasEightthPrize = true;
                                    temp_match.eightth_prize = each_match.metadata.eightth_prize;
                                }
                                if(each_match.metadata.hasNinethPrize){
                                    temp_match.hasNinethPrize = true;
                                    temp_match.nineth_prize = each_match.metadata.nineth_prize;
                                }
                                if(each_match.metadata.hasTenthPrize){
                                    temp_match.hasTenthPrize = true;
                                    temp_match.tenth_prize = each_match.metadata.tenth_prize;
                                }
                                entry_match.forEach(function(each_entry){
                                    if(each_entry.userId == user.id && each_entry.matchId == each_match.id && !each_entry.metadata.refund_amount){
                                        temp_match.isJoined = true;
                                    }
                                })
    
                                all_result_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_result_match.push(pkt)
                            h.render_xhr(req, res, {e: 0, m:all_result_match});
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

controller.player.result_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let result_info = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findAll({
                        where:{
                            matchId:input.match_id
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User}]
                    }).then(matchEntry =>{
                        
                        matchEntry.forEach(function(each_entry){
                            if(each_entry.user){
                                let temp_match_player_info = {
                                user_name:each_entry.user.metadata.user_name 
                            }
                            if(each_entry.metadata.first_player){
                                temp_match_player_info.first_player = each_entry.metadata.first_player
                            };
                            if(each_entry.metadata.second_player){
                                temp_match_player_info.second_player = each_entry.metadata.second_player
                            };
                            if(each_entry.metadata.third_player){
                                temp_match_player_info.third_player = each_entry.metadata.third_player
                            };
                            if(each_entry.metadata.forth_player){
                                temp_match_player_info.forth_player = each_entry.metadata.forth_player
                            };
                            if (each_entry.metadata.fifth_player) {
                                temp_match_player_info.fifth_player = each_entry.metadata.fifth_player
                            }
                            else {
                                temp_match_player_info.fifth_player = ''
                            };
                            if (each_entry.metadata.sixth_player) {
                                temp_match_player_info.sixth_player = each_entry.metadata.sixth_player
                            }
                            else {
                                temp_match_player_info.sixth_player = ''
                            };
                            if(each_entry.metadata.rank){
                                temp_match_player_info.rank = parseInt(each_entry.metadata.rank)
                            }
                            else{
                                temp_match_player_info.rank = 100
                            };

                            if(each_entry.metadata.kill){
                                temp_match_player_info.kill = each_entry.metadata.kill
                            }
                            else{
                                temp_match_player_info.kill = 0
                            };
                            if(each_entry.metadata.winning_money){
                                temp_match_player_info.winning_money = each_entry.metadata.winning_money
                            }
                            else{
                                temp_match_player_info.winning_money = 0
                            };
                            if(each_entry.metadata.refunded){
                                temp_match_player_info.isrefunded = each_entry.metadata.refunded,
                                temp_match_player_info.refund_amount = parseInt(each_entry.metadata.refund_amount)
                            }
                            result_info.push(temp_match_player_info)
                            }
                        })
                        function compareValues(key, order = 'asc') {
                            return function innerSort(a, b) {
                                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                                    return 0;
                                }
    
                                const varA = (typeof a[key] === 'string')
                                    ? a[key].toUpperCase() : a[key];
                                const varB = (typeof b[key] === 'string')
                                    ? b[key].toUpperCase() : b[key];
    
                                let comparison = 0;
                                if (varA > varB) {
                                    comparison = 1;
                                } else if (varA < varB) {
                                    comparison = -1;
                                }
                                return (
                                    (order === 'desc') ? (comparison * -1) : comparison
                                );
                            };
                        }
    
                        result_info.sort(compareValues('rank', 'asc'))
                        h.render_xhr(req, res, {e: 0, m:result_info});
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

controller.player.check_join_players_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let entry_player_list = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findAll({
                        where:{
                            matchId:input.match_id
                        },
                        order:[['createdAt', 'ASC']],
                    }).then(entries =>{
                        entries.forEach(function(each_entry){
                           if(!each_entry.metadata.refund_amount){
                                if (each_entry.metadata.first_player) {
                                    entry_player_list.push(each_entry.metadata.first_player)
                                }
                                if (each_entry.metadata.second_player) {
                                    entry_player_list.push(each_entry.metadata.second_player)
                                }
                                if (each_entry.metadata.third_player) {
                                    entry_player_list.push(each_entry.metadata.third_player)
                                }
                                if (each_entry.metadata.forth_player) {
                                    entry_player_list.push(each_entry.metadata.forth_player)
                                }
                                if (each_entry.metadata.fifth_player) {
                                    entry_player_list.push(each_entry.metadata.fifth_player)
                                }
                                if (each_entry.metadata.sixth_player) {
                                    entry_player_list.push(each_entry.metadata.sixth_player)
                                }
                           }

                        })
                        h.render_xhr(req, res, {e:0, m:entry_player_list});
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


//entry a match
controller.player.joining_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Match.findOne({
                where: {
                    id: input.match_id
                }
            }).then(check_length => {
                if (parseInt(check_length.metadata.total_joined) < parseInt(check_length.metadata.total_player)) {
                    connection.db.User.findOne({
                        where: {
                            [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                        }
                    }).then(user => {
                        if (user) {
                            connection.db.MatchEntry.findOne({
                                where: {
                                    [Op.and]: [{ userId: user.id }, { matchId: input.match_id }]
                                }
                            }).then(joined => {
                                if (joined) {
                                    h.render_xhr(req, res, { e: 6, m: 'Already joined' })
                                }
                                else {
                                    connection.db.MatchEntry.findAll({
                                        where: {
                                            matchId: input.match_id
                                        }
                                    }).then(check_again => {
                                        //console.log(check_again.length)
                                        if (check_again.length < parseInt(check_length.metadata.total_player)) {
                                            let promo_active = false;
                                            if (user.metadata.status == 'active') {
                                                connection.db.Match.findOne({
                                                    where: {
                                                        id: input.match_id
                                                    }
                                                }).then(match => {
                                                    let temp_info = {}
                                                    if (match.metadata.status == 'created') {
                                                        let left_space = parseInt(match.metadata.total_player) - parseInt(match.metadata.total_joined)
                                                        if (input.first_player && input.second_player && input.third_player && input.forth_player && left_space >= 4) {
                                                            let temp_balance = 4 * parseInt(match.metadata.entry_fee);
                                                            if (parseInt(user.metadata.total_balance) >= temp_balance) {
                                                                let metadata = user.metadata
                                                                metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                    metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                }
                                                                else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                    let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                    metadata.winning_balance = 0
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                }
                                                                else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                };
                                                                if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                    metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                    metadata.promo_status = 'inactive'
                                                                    promo_active = true;
                                                                }
                                                                user.update({ metadata: metadata }).then(update => {
                                                                    if (update) {
                                                                        temp_info.metadata = {
                                                                            first_player: input.first_player,
                                                                            second_player: input.second_player,
                                                                            third_player: input.third_player,
                                                                            forth_player: input.forth_player,
                                                                            paid: temp_balance
                                                                        }
                                                                        temp_info.matchId = match.id,
                                                                            temp_info.userId = user.id
                                                                        connection.db.MatchEntry.create(temp_info).then(entry_create => {
                                                                            if (entry_create) {
                                                                                let metadata = match.metadata
                                                                                metadata.total_joined += 4
                                                                                match.update({ metadata: metadata }).then(updated => {
                                                                                    if (user.metadata.promo_shared_id) {
                                                                                        connection.db.User.findOne({
                                                                                            where: {
                                                                                                id: user.metadata.promo_shared_id
                                                                                            }
                                                                                        }).then(find_share => {
                                                                                            if (find_share) {
                                                                                                let metadata = find_share.metadata
                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                    h.render_xhr(req, res, { e: 0 })
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                h.render_xhr(req, res, { e: 0 })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        h.render_xhr(req, res, { e: 0 })
                                                                                    }

                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 5, m: 'Not enough balance!' })
                                                            }
                                                        }
                                                        else if (input.first_player && input.second_player && input.third_player && !input.forth_player && left_space >= 3) {
                                                            let temp_balance = 3 * parseInt(match.metadata.entry_fee);

                                                            if (parseInt(user.metadata.total_balance) >= temp_balance) {
                                                                let metadata = user.metadata
                                                                metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                    metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                }
                                                                else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                    let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                    metadata.winning_balance = 0
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                }
                                                                else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                }

                                                                if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                    metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                    metadata.promo_status = 'inactive'
                                                                    promo_active = true;
                                                                }
                                                                user.update({ metadata: metadata }).then(update => {
                                                                    if (update) {
                                                                        temp_info.metadata = {
                                                                            first_player: input.first_player,
                                                                            second_player: input.second_player,
                                                                            third_player: input.third_player,
                                                                            paid: temp_balance
                                                                        }
                                                                        temp_info.matchId = match.id,
                                                                            temp_info.userId = user.id
                                                                        connection.db.MatchEntry.create(temp_info).then(entry_create => {
                                                                            if (entry_create) {
                                                                                let metadata = match.metadata
                                                                                metadata.total_joined += 3
                                                                                match.update({ metadata: metadata }).then(updated => {
                                                                                    if (user.metadata.promo_shared_id) {
                                                                                        connection.db.User.findOne({
                                                                                            where: {
                                                                                                id: user.metadata.promo_shared_id
                                                                                            }
                                                                                        }).then(find_share => {
                                                                                            if (find_share) {
                                                                                                let metadata = find_share.metadata
                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                    h.render_xhr(req, res, { e: 0 })
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                h.render_xhr(req, res, { e: 0 })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        h.render_xhr(req, res, { e: 0 })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 5, m: 'Not enough balance!' })
                                                            }
                                                        }
                                                        else if (input.first_player && input.second_player && !input.third_player && !input.forth_player && left_space >= 2) {
                                                            let temp_balance = 2 * parseInt(match.metadata.entry_fee);
                                                            if (parseInt(user.metadata.total_balance) >= temp_balance) {
                                                                let metadata = user.metadata
                                                                metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                    metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                }
                                                                else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                    let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                    metadata.winning_balance = 0
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                }
                                                                else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                };
                                                                if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                    metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                    metadata.promo_status = 'inactive'
                                                                    promo_active = true;
                                                                }
                                                                user.update({ metadata: metadata }).then(update => {
                                                                    if (update) {
                                                                        temp_info.metadata = {
                                                                            first_player: input.first_player,
                                                                            second_player: input.second_player,
                                                                            paid: temp_balance
                                                                        }
                                                                        temp_info.matchId = match.id,
                                                                            temp_info.userId = user.id
                                                                        connection.db.MatchEntry.create(temp_info).then(entry_create => {
                                                                            if (entry_create) {
                                                                                let metadata = match.metadata
                                                                                metadata.total_joined += 2
                                                                                match.update({ metadata: metadata }).then(updated => {
                                                                                    if (user.metadata.promo_shared_id) {
                                                                                        connection.db.User.findOne({
                                                                                            where: {
                                                                                                id: user.metadata.promo_shared_id
                                                                                            }
                                                                                        }).then(find_share => {
                                                                                            if (find_share) {
                                                                                                let metadata = find_share.metadata
                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                    h.render_xhr(req, res, { e: 0 })
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                h.render_xhr(req, res, { e: 0 })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        h.render_xhr(req, res, { e: 0 })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 5, m: 'Not enough balance!' })
                                                            }
                                                        }
                                                        else if (input.first_player && !input.second_player && !input.third_player && !input.forth_player && left_space >= 1) {
                                                            let temp_balance = parseInt(match.metadata.entry_fee);
                                                            if (parseInt(user.metadata.total_balance) >= temp_balance) {
                                                                let metadata = user.metadata
                                                                metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                    metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                }
                                                                else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                    let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                    metadata.winning_balance = 0
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                }
                                                                else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                };
                                                                if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                    metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                    metadata.promo_status = 'inactive'
                                                                    promo_active = true;
                                                                }
                                                                user.update({ metadata: metadata }).then(update => {
                                                                    if (update) {
                                                                        temp_info.metadata = {
                                                                            first_player: input.first_player,
                                                                            paid: temp_balance
                                                                        }
                                                                        temp_info.matchId = match.id,
                                                                            temp_info.userId = user.id
                                                                        connection.db.MatchEntry.create(temp_info).then(entry_create => {
                                                                            if (entry_create) {
                                                                                let metadata = match.metadata
                                                                                metadata.total_joined += 1
                                                                                match.update({ metadata: metadata }).then(updated => {
                                                                                    if (user.metadata.promo_shared_id) {
                                                                                        connection.db.User.findOne({
                                                                                            where: {
                                                                                                id: user.metadata.promo_shared_id
                                                                                            }
                                                                                        }).then(find_share => {
                                                                                            if (find_share) {
                                                                                                let metadata = find_share.metadata
                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                    h.render_xhr(req, res, { e: 0 })
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                h.render_xhr(req, res, { e: 0 })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        h.render_xhr(req, res, { e: 0 })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 5, m: 'Not enough balance!' })
                                                            }
                                                        }

                                                    }
                                                    else {
                                                        h.render_xhr(req, res, { e: 4, m: 'The match is finished!' })
                                                    }

                                                })
                                            }
                                            else {
                                                h.render_xhr(req, res, { e: 3, m: 'You are blocked' })
                                            }
                                        }
                                        else {
                                            h.render_xhr(req, res, { e: 2, m: 'Match full' })
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                        }
                    })

                }
                else {
                    h.render_xhr(req, res, { e: 2, m: 'Match full' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        };
    })
}

//entry a tournament
controller.player.joining_torunament_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Match.findOne({
                where: {
                    id: input.match_id
                }
            }).then(check_length => {
                if (parseInt(check_length.metadata.total_joined) < parseInt(check_length.metadata.total_player)) {
                    connection.db.User.findOne({
                        where: {
                            [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                        }
                    }).then(user => {
                        if (user) {
                            connection.db.MatchEntry.findOne({
                                where: {
                                    [Op.and]: [{ userId: user.id }, { matchId: input.match_id }]
                                }
                            }).then(joined => {
                                if (joined) {
                                    h.render_xhr(req, res, { e: 6, m: 'Already joined' })
                                }
                                else {
                                    connection.db.MatchEntry.findAll({
                                        where: {
                                            matchId: input.match_id
                                        }
                                    }).then(check_again => {
                                        //console.log(check_again.length)
                                        if (check_again.length < parseInt(check_length.metadata.total_player)) {
                                            let promo_active = false;
                                            if (user.metadata.status == 'active') {
                                                connection.db.Match.findOne({
                                                    where: {
                                                        id: input.match_id
                                                    }
                                                }).then(match => {
                                                    let temp_info = {}
                                                    if (match.metadata.status == 'created') {
                                                        let left_space = parseInt(match.metadata.total_player) - parseInt(match.metadata.total_joined)
                                                        if (input.hasFirstPlayer == 'true' && input.hasSecondPlayer == 'true' && input.hasThirdPlayer == 'true' && input.hasForthPlayer == 'true' && left_space >= 4) {
                                                            let temp_balance = parseInt(match.metadata.entry_fee);
                                                            if (parseInt(user.metadata.total_balance) >= temp_balance) {
                                                                let metadata = user.metadata
                                                                metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                                metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                                if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                                    metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                                }
                                                                else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                                    let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                                    metadata.winning_balance = 0
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                                }
                                                                else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                                };
                                                                if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                                    metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                                    metadata.promo_status = 'inactive'
                                                                    promo_active = true;
                                                                }
                                                                user.update({ metadata: metadata }).then(update => {
                                                                    if (update) {
                                                                        temp_info.metadata = {
                                                                            hasFirstPlayer : true,
                                                                            hasSecondPlayer: true,
                                                                            hasThirdPlayer:true,
                                                                            hasForthPlayer: true,
                                                                            first_player: input.first_player,
                                                                            second_player: input.second_player,
                                                                            third_player: input.third_player,
                                                                            forth_player: input.forth_player,
                                                                            paid: temp_balance
                                                                        }
                                                                        temp_info.matchId = match.id,
                                                                        temp_info.userId = user.id
                                                                        if(input.hasExtraOne == 'true'){
                                                                            temp_info.metadata.hasExtraOne = true,
                                                                            temp_info.metadata.extra_player_one = input.extra_player_one
                                                                        }
                                                                        if(input.hasExtraTwo == 'true'){
                                                                            temp_info.metadata.hasExtraTwo = true,
                                                                            temp_info.metadata.extra_player_two = input.extra_player_two
                                                                        }
                                                                        connection.db.MatchEntry.create(temp_info).then(entry_create => {
                                                                            if (entry_create) {
                                                                                let metadata = match.metadata
                                                                                metadata.total_joined += 4
                                                                                match.update({ metadata: metadata }).then(updated => {
                                                                                    if (user.metadata.promo_shared_id) {
                                                                                        connection.db.User.findOne({
                                                                                            where: {
                                                                                                id: user.metadata.promo_shared_id
                                                                                            }
                                                                                        }).then(find_share => {
                                                                                            if (find_share) {
                                                                                                let metadata = find_share.metadata
                                                                                                metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                                                metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                                                find_share.update({ metadata: metadata }).then(shared_done => {
                                                                                                    h.render_xhr(req, res, { e: 0 })
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                h.render_xhr(req, res, { e: 0 })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        h.render_xhr(req, res, { e: 0 })
                                                                                    }

                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                h.render_xhr(req, res, { e: 5, m: 'Not enough balance!' })
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        h.render_xhr(req, res, { e: 4, m: 'The match is finished!' })
                                                    }

                                                })
                                            }
                                            else {
                                                h.render_xhr(req, res, { e: 3, m: 'You are blocked' })
                                            }
                                        }
                                        else {
                                            h.render_xhr(req, res, { e: 2, m: 'Match full' })
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                        }
                    })

                }
                else {
                    h.render_xhr(req, res, { e: 2, m: 'Match full' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        };
    })
}

controller.player.add_withdraw_money_request = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    if(user.metadata.status == 'active'){
                        if(input.amount > 0){
                            if(input.type == 'Add Money'){
                                connection.db.AccountingEntry.findAll({
                                    where:{
                                        [Op.and]:[{userId:user.id},{metadata:{status:'requested'}},{metadata:{type:input.type}}]
                                    },
                                    order:[['createdAt', 'DESC']]
                                }).then(get_user =>{
                                    if(get_user){
                                        if(get_user.length > 2){
                                            h.render_xhr(req, res, {e:1, m:'You already have pending request!'})
                                        }
                                        else{
                                            let temp_data ={
                                                        metadata:{
                                                            payment_method:input.payment_method,
                                                            phone_number: input.phone_number,
                                                            type:input.type,
                                                            amount: parseInt(input.amount),
                                                            status:'requested'
                                                        },
                                                        userId:user.id
                                                    }
                                                
                                            connection.db.AccountingEntry.create(temp_data).then(done =>{
                                                if(done){
                                                    h.render_xhr(req, res, {e: 0, m: done.id});
                                                }
                                            })
                                        }
                                    }
                                    else{
                                        let temp_data ={
                                            metadata:{
                                                payment_method:input.payment_method,
                                                phone_number: input.phone_number,
                                                amount:parseInt(input.amount),
                                                type:input.type,
                                                status:'requested'
                                            },
                                            userId:user.id
                                        }
                                        connection.db.AccountingEntry.create(temp_data).then(done =>{
                                            if(done){
                                                h.render_xhr(req, res, {e: 0, m: done.id});
                                            }
                                        })
                                    }
                                })
                                
                            }
                            else if(input.type == 'Withdraw Money'){
                                connection.db.AccountingEntry.findOne({
                                    where:{
                                        [Op.and]:[{userId:user.id},{metadata:{status:'requested'}}, {metadata:{type:input.type}}]
                                    },
                                    order:[['createdAt', 'DESC']]
                                }).then(get_user =>{
                                    if(get_user){
                                        let time_left = 24 -  parseInt(h.moment.duration(h.moment(new Date()).diff(h.moment(new Date(get_user.createdAt)))).asHours());
                                        if(time_left < 1){
                                            if(parseInt(user.metadata.winning_balance) >= 100){
                                                if(parseInt(user.metadata.winning_balance) >= parseInt(input.amount)){
                                                    let temp_data ={
                                                        metadata:{
                                                            payment_method:input.payment_method,
                                                            phone_number: input.phone_number,
                                                            type:input.type,
                                                            status:'requested'
                                                        },
                                                        userId:user.id
                                                    }
                                                    if(parseInt(input.amount) >= 110){
                                                        temp_data.metadata.amount= parseInt(input.amount) - 10;
                                                        temp_data.metadata.withdraw_cost = 10
                                                    }
                                                    else{
                                                        temp_data.metadata.amount= parseInt(input.amount);
                                                        temp_data.metadata.withdraw_cost = 0
                                                    }
                                                    
                                                    connection.db.AccountingEntry.create(temp_data).then(done =>{
                                                        if(done){
                                                            let metadata = user.metadata
                                                            metadata.total_balance = parseInt(metadata.total_balance) - parseInt(input.amount)
                                                            
                                                            metadata.winning_balance = parseInt(metadata.winning_balance) - parseInt(input.amount)
                                                            user.update({metadata:metadata}).then(done =>{
                                                                h.render_xhr(req, res, {e: 0, m:done.id});
                                                            })
                                                            
                                                        }
                                                    })
                                                }
                                                else{
                                                    h.render_xhr(req, res, {e: 1, m: 'You do not have enough balance!'})
                                                }
                                            }
                                            else{
                                                h.render_xhr(req, res, {e: 1, m: 'You must have atleast 100 tk!'})
                                            }
                                        }
                                        else{
                                            h.render_xhr(req, res, {e: 1, m: 'You have already withdrawn today!'})
                                        }

                                    }
                                    else{
                                        if(parseInt(user.metadata.winning_balance) >= 100){
                                            if(parseInt(user.metadata.winning_balance) >= parseInt(input.amount)){
                                                let temp_data ={
                                                        metadata:{
                                                            payment_method:input.payment_method,
                                                            phone_number: input.phone_number,
                                                            type:input.type,
                                                            status:'requested'
                                                        },
                                                        userId:user.id
                                                    }
                                                    if(parseInt(input.amount) >= 110){
                                                        temp_data.metadata.amount= parseInt(input.amount) - 10;
                                                        temp_data.metadata.withdraw_cost = 10
                                                    }
                                                    else{
                                                        temp_data.metadata.amount= parseInt(input.amount);
                                                        temp_data.metadata.withdraw_cost = 0
                                                    }
                                                connection.db.AccountingEntry.create(temp_data).then(done =>{
                                                    if(done){
                                                        let metadata = user.metadata
                                                        metadata.total_balance = parseInt(metadata.total_balance) - parseInt(input.amount)
                                                        
                                                        metadata.winning_balance = parseInt(metadata.winning_balance) - parseInt(input.amount)
                                                        user.update({metadata:metadata}).then(done =>{
                                                            h.render_xhr(req, res, {e: 0, m:done.id});
                                                        })
                                                        
                                                    }
                                                })
                                            }
                                            else{
                                                h.render_xhr(req, res, {e: 1, m: 'You do not have enough balance!'})
                                            }
                                        }
                                        else{
                                            h.render_xhr(req, res, {e: 1, m: 'You must have atleast 100 tk!'})
                                        }
                                    }
                                })
                                
                            }
                            else{
                                h.render_xhr(req, res, {e:1, m: 'Invalid input!'})
                            }
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m: 'Invalid input!'})
                        }
                    }
                    else{
                        h.render_xhr(req, res, {e:5, m:'You are blocked'})
                    }
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

controller.player.see_all_account_activity = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entries = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            userId: user.id
                        },
                        order:[['createdAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            let temp_entry = {
                                type: each_entry.metadata.type,
                                amount: each_entry.metadata.amount,
                                status:each_entry.metadata.status,
                                phome_number: each_entry.metadata.phone_number,
                                payment_method:each_entry.metadata.payment_method,
                                requested_time: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a')
                            }
                            all_entries.push(temp_entry)
                        })
                        h.render_xhr(req, res,{e:0, m:all_entries})
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

controller.player.see_all_order_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entries = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            userId: user.id,
                            metadata:{
                                status:'requested'
                            }
                        },
                        order:[['createdAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            let temp_entry = {
                                type: each_entry.metadata.type,
                                amount: each_entry.metadata.amount,
                                status:each_entry.metadata.status,
                                phome_number: each_entry.metadata.phone_number,
                                payment_method:each_entry.metadata.payment_method,
                                requested_time: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a')
                            }
                            all_entries.push(temp_entry)
                        })
                        h.render_xhr(req, res,{e:0, m:all_entries})
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

controller.player.see_all_playing_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entries = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findAll({
                        where:{
                            userId:user.id
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User},{model: connection.db.Match}]
                    }).then(matchEntry =>{
                        
                        matchEntry.forEach(function(each_entry){
                            let temp_match_player_info = {
                                user_name: each_entry.user.metadata.user_name,
                                entry_fee: each_entry.match.metadata.entry_fee
                            }
                            if(each_entry.metadata.first_player){
                                temp_match_player_info.first_player = each_entry.metadata.first_player
                            };
                            if(each_entry.metadata.second_player){
                                temp_match_player_info.second_player = each_entry.metadata.second_player
                            };
                            if(each_entry.metadata.third_player){
                                temp_match_player_info.third_player = each_entry.metadata.third_player
                            };
                            if(each_entry.metadata.forth_player){
                                temp_match_player_info.forth_player = each_entry.metadata.forth_player
                            };
                            if(each_entry.metadata.rank){
                                temp_match_player_info.rank = each_entry.metadata.rank
                            }
                            else{
                                temp_match_player_info.rank = 0
                            };

                            if(each_entry.metadata.kill){
                                temp_match_player_info.kill = each_entry.metadata.kill
                            }
                            else{
                                temp_match_player_info.kill = 0
                            };
                            if(each_entry.metadata.winning_money){
                                temp_match_player_info.winning_money = each_entry.metadata.winning_money
                            }
                            else{
                                temp_match_player_info.winning_money = 0
                            };
                            all_entries.push(temp_match_player_info)
                        })
                        h.render_xhr(req, res, {e: 0, m:all_entries});
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

controller.player.get_rules_according_type = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Rule.findOne({
                        where: {
                            metadata:{
                                type:input.type
                            }
                        }
                    }).then(rules => {
                        h.render_xhr(req, res, { e: 0, m: rules.metadata });
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
        };
    })
}

controller.player.get_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.Rule.findOne({
                        where:{
                            id:1
                        }
                    }).then(rules =>{
                        h.render_xhr(req, res, {e:0, m:rules.metadata});
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

controller.player.get_freefire_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.Rule.findOne({
                        where:{
                            id:2
                        }
                    }).then(rules =>{
                        h.render_xhr(req, res, {e:0, m:rules.metadata});
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

controller.player.get_tournament_rules = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Rule.findOne({
                        where: {
                            id: 5
                        }
                    }).then(rules => {
                        h.render_xhr(req, res, { e: 0, m: rules.metadata });
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
        };
    })
}

controller.player.get_payment_number = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.PaymentNumber.findOne({
                        where:{
                            metadata:{
                                type:input.type
                            }
                        }
                    }).then(payment_numbers =>{
                        if(payment_numbers){
                            let test ={
                            }
                            if(payment_numbers.metadata.first_number){
                                test.first_number = payment_numbers.metadata.first_number
                            };
                            if(payment_numbers.metadata.second_number){
                                test.second_number = payment_numbers.metadata.second_number
                            };
                            h.render_xhr(req, res, {e:0, m:test});
                        }
                        else{
                            res.status(503)
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
        };
    })
}

controller.player.get_support_number = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.PaymentNumber.findOne({
                        where:{
                            metadata:{
                                type:input.type
                            }
                        }
                    }).then(payment_numbers =>{
                        if(payment_numbers){
                            let test ={
                                number: payment_numbers.metadata.first_number
                            }
                            h.render_xhr(req, res, {e:0, m:test});
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m:'Type not found!'})
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
        };
    })
}

controller.player.get_room_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.MatchEntry.findOne({
                        where:{
                             [Op.and]: [{ userId: input.secret_id }, { matchId: input.match_id }, {metadata:{refunded:null}}]
                        },
                        include:[{model: connection.db.User},{model: connection.db.Match}]
                    }).then(joined_player =>{
                        if(joined_player){
                            if(joined_player.match.metadata.room_id && joined_player.match.metadata.room_pass){
                                let room_info = {
                                    room_id: joined_player.match.metadata.room_id,
                                    room_pass: joined_player.match.metadata.room_pass
                                }
                                h.render_xhr(req, res, {e:0, m:room_info})

                            }
                            else{
                                let room_info = {
                                    room_id: '',
                                    room_pass: ''
                                }
                                h.render_xhr(req, res, {e:0, m:room_info})
                            }
                        }
                        else{
                            let room_info = {
                                room_id: '',
                                room_pass: ''
                            }
                            h.render_xhr(req, res, {e:0, m:room_info})
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
        };
    })
}

controller.player.statastic_palyed_match_info = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                        where: {
                            userId: user.id
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.Match }]
                    }).then(entry => {
                        entry.forEach(function (each_entry) {
                            if (each_entry.match && each_entry.match.gameId !=6) {
                                let tem_entry = {
                                    match_title: each_entry.match.metadata.title,
                                    palyed_on: each_entry.match.metadata.match_time,
                                    paid: 0,
                                    winning: 0,
                                    refund_amount: 0
                                }

                                if (each_entry.metadata.paid) {
                                    tem_entry.paid = each_entry.metadata.paid
                                };

                                if (each_entry.metadata.winning_money) {
                                    tem_entry.winning = each_entry.metadata.winning_money
                                }
                                if (each_entry.metadata.refund_amount) {
                                    tem_entry.refund_amount = each_entry.metadata.refund_amount
                                }

                                all_entry.push(tem_entry)
                            }



                        })
                        h.render_xhr(req, res, { e: 0, m: all_entry })
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
        };
    })
}

controller.player.statastic_palyed_tournament_match_info = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                        where: {
                            userId: user.id
                        },
                        include: [{ model: connection.db.Match }]
                        ,order: [['createdAt', 'DESC']]
                    }).then(entry => {
                        entry.forEach(function (each_entry) {
                            if (each_entry.match && each_entry.match.gameId ==6) {
                                let tem_entry = {
                                    match_title: each_entry.match.metadata.title,
                                    palyed_on: each_entry.match.metadata.match_time,
                                    paid: 0,
                                    winning: 0,
                                    refund_amount: 0
                                }

                                if (each_entry.metadata.paid) {
                                    tem_entry.paid = each_entry.metadata.paid
                                };

                                if (each_entry.metadata.winning_money) {
                                    tem_entry.winning = each_entry.metadata.winning_money
                                }
                                if (each_entry.metadata.refund_amount) {
                                    tem_entry.refund_amount = each_entry.metadata.refund_amount
                                }

                                all_entry.push(tem_entry)
                            }



                        })
                        h.render_xhr(req, res, { e: 0, m: all_entry })
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
        };
    })
}



// ludo player

controller.player.all_ludo_match_length = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatch.findAll({
                        where: {
                            metadata: {
                                status: 'created'
                            }
                        }
                    }).then(ludo_matches => {
                        h.render_xhr(req, res, { e: 0, m: ludo_matches.length });
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

controller.player.ludo_match_length = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                   connection.db.LudoMatch.findAll({
                       where:{
                           metadata:{
                               status:'created'
                               
                           },
                           gameId:input.game_id
                       }
                   }).then(ludo_matches =>{
                    h.render_xhr(req, res, { e: 0, m: ludo_matches.length});
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

controller.player.get_ludo_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.Rule.findOne({
                        where:{
                            id:3
                        }
                    }).then(rules =>{
                        h.render_xhr(req, res, {e:0, m:rules.metadata});
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

controller.player.get_ludo_links = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.Rule.findOne({
                        where:{
                            id:4
                        }
                    }).then(links =>{
                        let temp = {
                            link: links.metadata.rule
                        }
                        h.render_xhr(req, res, {e:0, m:temp});
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

controller.player.get_created_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.LudoMatch.findAll({
                            where: {
                                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
                            },
                            order: [['createdAt', 'ASC']],
                        }).then(matches => {
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_date: each_match.metadata.date,
                                    match_time: each_match.metadata.time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    host_app: each_match.metadata.host_app,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: 0,
                                    total_prize: each_match.metadata.total_prize
                                }
                                if (parseInt(each_match.metadata.total_joined) == parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                if(each_match.metadata.room_code){
                                    temp_match.hasRoomcode = true;
                                    temp_match.room_code = each_match.metadata.room_code
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.ludoMatchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.ludoMatchId == each_match.id) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                        if(each_entry.metadata.isReady){
                                            temp_match.isReady = true
                                        }
                                    }
                                    if (each_entry.ludoMatchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        temp_match.joined_player += 1

                                    }
                    
                                })
                    
                                temp_match.left_player = parseInt(each_match.metadata.total_player) - temp_match.joined_player
                    
                                all_created_match.push(temp_match)
                            })
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_created_paginated_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order: [['id', 'ASC']]
                ,limit: page_size
                ,offset: offset
                ,include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.LudoMatch.findAndCountAll(filter).then(result => {
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_date: each_match.metadata.date,
                                    match_time: each_match.metadata.time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    host_app: each_match.metadata.host_app,
                                    title: each_match.metadata.title,
                                    total_player: each_match.metadata.total_player,
                                    joined_player: 0,
                                    total_prize: each_match.metadata.total_prize
                                }
                                if (parseInt(each_match.metadata.total_joined) == parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                if(each_match.metadata.room_code){
                                    temp_match.hasRoomcode = true;
                                    temp_match.room_code = each_match.metadata.room_code
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.ludoMatchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.ludoMatchId == each_match.id) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                        if(each_entry.metadata.isReady){
                                            temp_match.isReady = true
                                        }
                                    }
                                    if (each_entry.ludoMatchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        temp_match.joined_player += 1

                                    }
                    
                                })
                    
                                temp_match.left_player = parseInt(each_match.metadata.total_player) - temp_match.joined_player
                    
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_ongoing_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.LudoMatch.findAll({
                            where: {
                                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'ongoing' } }]//game id is actually is it cs or regular match
                            },
                            order:[['createdAt', 'DESC']]
                        }).then(matches => {
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_date: each_match.metadata.date,
                                    match_time: each_match.metadata.time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    host_app: each_match.metadata.host_app,
                                    title: each_match.metadata.title,
                                    total_prize: each_match.metadata.total_prize,
                                    //isJoined = false
                                }
                                if(each_match.metadata.room_code){
                                    temp_match.room_code = each_match.metadata.room_code
                                }
                                if(each_match.metadata.image){
                                    temp_match.hasImage = true
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.ludoMatchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.ludoMatchId == each_match.id) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                                })
                    
                                all_created_match.push(temp_match)
                            })
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.player.get_result_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let all_created_match = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.LudoMatch.findAll({
                            where: {
                                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'result' } }]//game id is actually is it cs or regular match
                                ,createdAt: {
                                     [Op.between]: [yesterday, today]
                                 }
                            },
                            order:[['createdAt', 'DESC']]
                        }).then(matches => {
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_date: each_match.metadata.date,
                                    match_time: each_match.metadata.time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    host_app: each_match.metadata.host_app,
                                    title: each_match.metadata.title,
                                    total_prize: each_match.metadata.total_prize,
                                    
                                }
                                
                                if (each_match.metadata.message) {
                                    temp_match.hasMessage = true;
                                    temp_match.message = each_match.metadata.message
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.ludoMatchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.ludoMatchId == each_match.id) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                                })
                    
                                all_created_match.push(temp_match)
                            })
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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


controller.player.join_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    if(user.metadata.status == 'active'){
                        connection.db.LudoMatch.findOne({
                            where:{
                                id:input.match_id
                            }
                        }).then(match =>{
                            connection.db.LudoMatchEntry.findAll({
                                where:{
                                    ludoMatchId:input.match_id
                                }
                            }).then(length_check =>{
                                if(length_check.length < parseInt(match.metadata.total_player)){
                                    connection.db.LudoMatchEntry.findOne({
                                        where:{
                                            [Op.and]: [{ userId:user.id },{ ludoMatchId: input.match_id }]
                                        }
                                    }).then(already_joined =>{
                                        if(already_joined){
                                            h.render_xhr(req, res, { e: 4, m: 'Already Joined!'})
                                        }
                                        else{
                                            let temp_balance = parseInt(match.metadata.entry_fee);
                                            if (parseInt(user.metadata.total_balance) >= temp_balance) {
                                                let metadata = user.metadata
                                                metadata.total_match_play = parseInt(metadata.total_match_play) + 1;
                                                metadata.total_balance = parseInt(metadata.total_balance) - temp_balance
                                                if (parseInt(metadata.winning_balance) >= temp_balance) {
                                                    metadata.winning_balance = parseInt(metadata.winning_balance) - temp_balance
                                                }
                                                else if (parseInt(metadata.winning_balance) != 0 && parseInt(metadata.winning_balance) < temp_balance) {
                                                    let temp_winning_balance = temp_balance - parseInt(metadata.winning_balance)
                                                    metadata.winning_balance = 0
                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_winning_balance;
                                                }
                                                else if (parseInt(metadata.winning_balance) == 0 && parseInt(metadata.deposit_balance) >= temp_balance) {
                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) - temp_balance;
                                                };
                                                if (user.metadata.refer && user.metadata.refer != '' && user.metadata.promo_status == 'active' && parseInt(user.metadata.total_balance) > 0) {
                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + 5;
                                                    metadata.total_balance = parseInt(metadata.total_balance) + 5;
                                                    metadata.promo_status = 'inactive'
                                                    promo_active = true;
                                                }
                                                user.update({ metadata: metadata }).then(update => {
                                                    if (update) {
                                                        temp_info = {
                                                           metadata:{
                                                            player_name: input.first_player,
                                                            paid: temp_balance
                                                           }
                                                        }
                                                        temp_info.ludoMatchId = match.id,
                                                        temp_info.userId = user.id
                                                        connection.db.LudoMatchEntry.create(temp_info).then(entry_create => {
                                                            if (entry_create) {
                                                                let metadata = match.metadata
                                                                metadata.total_joined += 1
                                                                match.update({ metadata: metadata }).then(updated => {
                                                                    // if (user.metadata.promo_shared_id) {
                                                                    //     connection.db.User.findOne({
                                                                    //         where: {
                                                                    //             id: user.metadata.promo_shared_id
                                                                    //         }
                                                                    //     }).then(find_share => {
                                                                    //         if (find_share) {
                                                                    //             let metadata = find_share.metadata
                                                                    //             metadata.deposit_balance = parseInt(metadata.deposit_balance) + 10
                                                                    //             metadata.total_balance = parseInt(metadata.total_balance) + 10;
                                                                    //             find_share.update({ metadata: metadata }).then(shared_done => {
                                                                    //                 h.render_xhr(req, res, { e: 0 })
                                                                    //             })
                                                                    //         }
                                                                    //         else {
                                                                    //             h.render_xhr(req, res, { e: 0 })
                                                                    //         }
                                                                    //     })
                                                                    // }
                                                                    // else {
                                                                    //     h.render_xhr(req, res, { e: 0 })
                                                                    // }
                                                                    h.render_xhr(req, res, { e: 0 })
                                                                })
                                                            }
                                                            else{
                                                                h.render_xhr(req, res, { e: 9, m:'vul hoise' })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                            else {
                                                h.render_xhr(req, res, { e: 5, m: 'Not enough balance!' })
                                            }
                                        }
                                    })
                                }
                                else{
                                    h.render_xhr(req, res, { e: 3, m: 'match full!'})
                                }
                            })
                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 2, m: 'you are blocked!'})
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

controller.player.ludo_match_join_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_player_list = []
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(7, 'day').startOf('day');
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                  connection.db.LudoMatchEntry.findAll({
                      where:{
                          ludoMatchId:input.match_id
                           ,createdAt: {
                     [Op.between]: [yesterday, today]
                 }
                      }
                  }).then(entries =>{
                      entries.map(function(each_entry){
                          if(!(each_entry.metadata.refund_amount)){
                                let temp_player = {
                                    joined_player: each_entry.metadata.player_name
                                }
                                all_player_list.push(temp_player)
                            }
                      })
                      h.render_xhr(req, res, {e:0, m:all_player_list})
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

controller.player.ludo_result_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let result_info = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            ludoMatchId:input.match_id
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User}]
                    }).then(matchEntry =>{
                        
                        matchEntry.forEach(function(each_entry){
                            if(each_entry.user){
                                let temp_match_player_info = {
                                user_name:each_entry.user.metadata.user_name 
                            }
                            if(each_entry.metadata.player_name){
                                temp_match_player_info.player_name = each_entry.metadata.player_name
                            };
                            if(each_entry.metadata.rank){
                                temp_match_player_info.rank = each_entry.metadata.rank
                            }
                            else{
                                temp_match_player_info.rank = 100
                            };

                            if(each_entry.metadata.winning_money){
                                temp_match_player_info.winning_money = each_entry.metadata.winning_money
                            }
                            else{
                                temp_match_player_info.winning_money = 0
                            };
                            if(each_entry.metadata.refunded){
                                temp_match_player_info.isrefunded = each_entry.metadata.refunded,
                                temp_match_player_info.refund_amount = parseInt(each_entry.metadata.refund_amount)
                            }
                            result_info.push(temp_match_player_info)
                            }
                        })
                        function compareValues(key, order = 'asc') {
                            return function innerSort(a, b) {
                                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                                    return 0;
                                }
    
                                const varA = (typeof a[key] === 'string')
                                    ? a[key].toUpperCase() : a[key];
                                const varB = (typeof b[key] === 'string')
                                    ? b[key].toUpperCase() : b[key];
    
                                let comparison = 0;
                                if (varA > varB) {
                                    comparison = 1;
                                } else if (varA < varB) {
                                    comparison = -1;
                                }
                                return (
                                    (order === 'desc') ? (comparison * -1) : comparison
                                );
                            };
                        }
    
                        result_info.sort(compareValues('rank', 'asc'))
                        h.render_xhr(req, res, {e: 0, m:result_info});
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

controller.player.ludo_upload_image = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.LudoMatch.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        let metadata = match.metadata
                        metadata.image = match.id+'.jpg'
                        metadata.image_uploaded_by = user.metadata.user_name
                        var img = input.image
                        var data = img.replace(/^data:image\/\w+;base64,/, "");
                        var buf = Buffer.from(data, 'base64');
                        // strip off the data: url prefix to get just the base64-encoded bytes
                        h.s3.putObject({
                            Bucket: 'uploadssssss',
                            Key: `${match.id}.jpg`,
                            Body: buf,
                            ACL: 'public-read',
                            ContentType: 'image/jpeg'
                        },function (resp) {
                            if(resp){
                                console.log("Error uploading image");
                                console.log(resp);
                            }
                            match.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                                }
                                else{
                                    h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                }
                            })
                        });

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


controller.player.new_ludo_upload_image = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.LudoMatchEntry.findOne({
                        where:{
                            [Op.and]:[{userId:user.id},{ludoMatchId:input.match_id}]
                        }
                    }).then(match =>{
                        if(match){
                            if(match.metadata){
                                if(match.metadata.image){
                            h.render_xhr(req, res, {e:3, m:'You have already uploaded image'})
                        }
                        else{
                            let metadata = match.metadata
                            metadata.image = input.match_id+'_'+user.id+'.jpg'
                            metadata.image_uploaded_by = user.metadata.user_name
                            var img = input.image
                            // strip off the data: url prefix to get just the base64-encoded bytes
                            h.s3.putObject({
                                Bucket: 'uploadssssss',
                                Key: `${input.match_id+'_'+user.id}.jpg`,
                                Body: h.dataUriToBuffer('data:text/plain;base64,' + img),
                                ACL: 'public-read',
                                ContentType: 'image/jpeg'
                            },function (resp) {
                                if(resp){
                                    console.log("Error uploading image");
                                    console.log(resp);
                                }
                                match.update({metadata:metadata}).then(updated =>{
                                    if(updated){
                                        h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                                    }
                                    else{
                                        h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                    }
                                })
                            });
                        }
                            }
                        }
                        else{
                            h.render_xhr(req, res, {e:4, m:'you have not joined!'})
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

controller.player.view_ludo_image = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let image_links = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            ludoMatchId:input.match_id
                        }
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            if(each_entry.metadata.image){
                                let temp = {
                                    image_link:'https://uploadssssss.s3.ap-south-1.amazonaws.com/' + each_entry.metadata.image,
                                    uploaded_by : each_entry.metadata.image_uploaded_by
                                }
                                image_links.push(temp)
                            }
                        })
                        h.render_xhr(req, res, {e: 0, m: image_links})
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

controller.player.statastic_palyed_ludo_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
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

controller.player.ready_for_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.LudoMatchEntry.findOne({
                        where:{
                            [Op.and]:[{userId:user.id},{ludoMatchId:input.match_id}]
                        }
                    }).then(match =>{
                        if(match){
                            if(!(match.metadata.isReady)){
                                let metadata = match.metadata
                                metadata.isReady = true
                                match.update({metadata:metadata}).then(updated =>{
                                    if(updated){
                                        h.render_xhr(req, res, {e:0, m:'You are ready!'})
                                    }
                                })
                            }
                            else{
                                h.render_xhr(req, res, {e:2, m:'You are already ready for play!'})
                            }
                        }
                        else{
                            h.render_xhr(req, res, {e:2, m:'You have not joined!'})
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

controller.player.get_all_notice = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_notice = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Notice.findAll({
                        order: [['createdAt', 'DESC']],
                        limit:5
                    }).then(notice =>{
                        notice.forEach(function(each_notice){
                            let new_notice ={
                                id:each_notice.id,
                                title:each_notice.metadata.title
                            }
                            all_notice.push(new_notice)
                        })
                        h.render_xhr(req, res, {e:0, m:all_notice})
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

controller.player.top_player_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let top_player = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    
                    connection.db.User.findAll({
                        // order: [[h.Sequelize.literal('metadata->>\'match_win\''), 'DESC']],
                        // limit: 100
                    }).then(user => {
                        user.forEach(function (each_user) {
                            let new_user = {
                                id: each_user.id,
                                name: each_user.metadata.name,
                                total_match_played: each_user.metadata.total_match_play,
                                win: each_user.metadata.match_win
                            }
                            top_player.push(new_user)
                        })

                        function compareValues(key, order = 'desc') {
                            return function innerSort(a, b) {
                                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                                    return 0;
                                }

                                const varA = (typeof a[key] === 'string')
                                    ? a[key].toUpperCase() : a[key];
                                const varB = (typeof b[key] === 'string')
                                    ? b[key].toUpperCase() : b[key];

                                let comparison = 0;
                                if (varA > varB) {
                                    comparison = 1;
                                } else if (varA < varB) {
                                    comparison = -1;
                                }
                                return (
                                    (order === 'desc') ? (comparison * -1) : comparison
                                );
                            };
                        }

                        top_player.sort(compareValues('win', 'desc'))
                        let top_players = top_player.slice(0, 100)
                        h.render_xhr(req, res, { e: 0, m: top_players })
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

controller.player.get_all_support_numbers = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_support = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.SupportNumber.findAll({

                    }).then(support =>{
                        support.forEach(function(each_support){
                            all_support.push(each_support.metadata)
                        })
                        h.render_xhr(req, res, {e:0, m:all_support})
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

controller.player.upcoming_match_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_upcoming = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findAll({
                        where:{
                            userId:user.id
                        },
                        include: [{ 
                            model: connection.db.Match}]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            if(each_entry.match && each_entry.match.metadata.status == 'created'){
                                let temp_entry ={
                                title:each_entry.match.metadata.title,
                                match_time: each_entry.match.metadata.match_time
                                }
                                all_upcoming.push(temp_entry)
                            }
                        })
                        h.render_xhr(req, res, {e:0, m:all_upcoming})

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

controller.player.upcoming_ludo_match_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_upcoming = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                        where: {
                            userId: user.id
                        },
                        include: [{ 
                            model: connection.db.LudoMatch}]
                    }).catch(function(err){
                        console.log(err)
                    })
                    .then(entry => {
                        entry.forEach(function (each_entry) {
                            if(each_entry.ludo_match && each_entry.ludo_match.metadata.status == 'created'){
                                let temp_entry = {
                                title: each_entry.ludo_match.metadata.title,
                                match_time: each_entry.ludo_match.metadata.time,
                                match_date: each_entry.ludo_match.metadata.date
                            }
                            all_upcoming.push(temp_entry)
                            }
                        })
                        h.render_xhr(req, res, { e: 0, m: all_upcoming })

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

controller.player.get_links = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            if(input.type == 'Sign Up' || input.type == 'Log In'){
                connection.db.Link.findOne({
                    where: {
                        metadata: {
                            type: input.type
                        }
                    },
                    order: [['createdAt', 'DESC']]
                }).then(link => {
                    if (link) {
                        let temp_link = link.metadata.link
                        h.render_xhr(req, res, { e: 0, m: temp_link })
                    }
                    else {
                        h.render_xhr(req, res, { e: 1, m: 'Type does not match!' })
                    }
                })
            }
            else{
                connection.db.User.findOne({
                    where: {
                        [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                    }
                }).then(user => {
                    if (user) {
                        connection.db.Link.findOne({
                            where: {
                                metadata: {
                                    type: input.type
                                }
                            },
                            order: [['createdAt', 'DESC']]
                        }).then(link => {
                            if (link) {
                                let temp_link = link.metadata.link
                                h.render_xhr(req, res, { e: 0, m: temp_link })
                            }
                            else {
                                h.render_xhr(req, res, { e: 1, m: 'Type does not match!' })
                            }
                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                    }
                })
            }
           
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.player.join_player_list_according_team = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let join_list = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntryHistory.findAll({
                        where:{
                            matchId:input.match_id
                        }
                    }).catch(function(err){
                        Console.log(err)
                    })
                    .then(match_history =>{
                        match_history.forEach(function(each_history){
                            let temp_list={
                                team_no: each_history.team_no
                            }
                            if(each_history.metadata.hasFirstPlayer){
                                temp_list.hasFirstPlayer = each_history.metadata.hasFirstPlayer
                                temp_list.first_player = each_history.metadata.first_player
                            };
                            if(each_history.metadata.hasSecondPlayer){
                                temp_list.hasSecondPlayer= each_history.metadata.hasSecondPlayer
                                temp_list.second_player= each_history.metadata.second_player
                            };
                            if(each_history.metadata.hasThirdPlayer){
                                temp_list.hasThirdPlayer= each_history.metadata.hasThirdPlayer
                                temp_list.third_player = each_history.metadata.third_player
                            };
                            if(each_history.metadata.hasForthPlayer){
                                temp_list.hasForthPlayer= each_history.metadata.hasForthPlayer
                                temp_list.forth_player = each_history.metadata.forth_player
                            };
                            if(each_history.metadata.hasFifthPlayer){
                                temp_list.hasFifthPlayer= each_history.metadata.hasFifthPlayer
                                temp_list.fifth_player = each_history.metadata.fifth_player
                            };
                            if(each_history.metadata.hasSixthPlayer){
                                temp_list.hasSixthPlayer= each_history.metadata.hasSixthPlayer
                                temp_list.sixth_player = each_history.metadata.sixth_player
                            };
                            join_list.push(temp_list)
                        })
                        h.render_xhr(req, res, {e:0, m:join_list})

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

controller.player.read_message = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            let msg_list = []
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.Message.findAll({
                        where:{
                            userId:user.id
                        },
                        order:[['createdAt', 'DESC']]
                    }).then(message =>{
                        message.forEach(function(each_match){
                            let temp = {
                                message: each_match.metadata.message,
                                time:h.moment(new Date(each_match.createdAt)).add(0, 'h').local().format('h:mm a'),
                                date:h.moment(each_match.createdAt).fromNow()
                            }
                            msg_list.push(temp)
                        })
                        h.render_xhr(req, res, {e:0, m:msg_list})
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


controller.player.read_message_from_admin = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.AdminToUserMessage.findOne({
                        where:{
                            userId:user.id
                        },
                        order:[['createdAt', 'DESC']]
                    }).then(message =>{
                        if(message){
                            h.render_xhr(req, res, {e:0, m:message.metadata.message})
                        }
                        else{
                            h.render_xhr(req, res, { e: 2, m: 'No message to read!' })
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

controller.player.edit_join_player = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.MatchEntry.findOne({
                        where:{
                            [Op.and]: [{ matchId: input.match_id }, { userId: user.id}]
                        }
                    }).then(got_entry =>{
                        if(got_entry){
                            let metadata = got_entry.metadata
                            if(hasEditPlayerOne == 'true'){
                                metadata.first_player = input.first_player
                            }
                            if(hasEditPlayerTwo == 'true'){
                                metadata.second_player = input.second_player
                            }
                            got_entry.update({metadata:metadata}).then(update =>{
                                if(update){
                                    connection.db.MatchEntryHistory.findOne({
                                        where:{
                                            [Op.and]: [{ matchId: input.match_id }, { team_no: update.metadata.team_no}]
                                        }
                                    }).then(history =>{
                                        if(history){
                                            let metadata = history.metadata
                                            if(hasEditPlayerOne == 'true'){
                                                metadata.first_player = input.first_player
                                            }
                                            if(hasEditPlayerTwo == 'true'){
                                                metadata.second_player = input.second_player
                                            }
                                            history.update({metadata:metadata}).then(update_history =>{
                                                if(update_history){
                                                    h.render_xhr(req, res, {e:0, m:'Successfully updated'})
                                                }
                                                else {
                                                    h.render_xhr(req, res, { e: 4, m: 'Soumething went wrong!' })
                                                }
                                            })
                                        }
                                        else {
                                            h.render_xhr(req, res, { e: 3, m: 'No history found!' })
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            h.render_xhr(req, res, { e: 2, m: 'User not join in this match!' })
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


//admin part
controller.admin={}

controller.admin.test = function(req, res){
    let user_name = 'Khelo123'
    let pass = 'shams123'
    const token = h.jwt.sign({
        name: "Robi",
        id: 5,
    },
    process.env.ADMIN_JWT_SECRET,{
        expiresIn: '8h'
    });
    h.hash(pass).then(hash =>{
        //const {v4: uuidv4} = require('uuid');
        let player ={
           metadata:{
            user_name: user_name,
            password:hash,
            api_token: token,
           }
            
        }
        connection.db.Admin.create(player).then(done =>{
            h.render_xhr(req, res, {e:0, m:done.metadata})
        })
        
    })
}

controller.player.show_slider_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let slider_list = []
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.Slider.findAll({
                        where:{
                            metadata:{
                                status:'active'
                            }
                        }
                    }).then(slider =>{
                        slider.forEach(function(each_slider){
                            let temp_slider ={
                                slider_id: each_slider.id,
                                title:each_slider.metadata.title,
                                link:each_slider.metadata.link,
                                status:each_slider.metadata.status,
                                image_link:'https://sliderss.s3.ap-south-1.amazonaws.com/' + each_slider.metadata.image
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
            h.render_xhr(req, res, {e: 1});
        }
    })
}

//slider

controller.player.show_slider_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let slider_list = []
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.Slider.findAll({
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
                                image_link:'https://sliderss.s3.ap-south-1.amazonaws.com/' + each_slider.metadata.image
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
            h.render_xhr(req, res, {e: 1});
        }
    })
}


//player popup
controller.player.check_popup_status = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.PopupStatus.findOne({
                        where:{
                            id:1
                        }
                    }).then(status =>{
                        let temp = {
                            popup_status: status.metadata.status
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
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

controller.player.pop_up_show = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.User.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{jwt_token:input.jwt_token}}]
                }
            }).then(user =>{
                if(user){
                    connection.db.PopUp.findOne({
                        order:[['createdAt', 'DESC']]
                    }).then(pop_up =>{
                        let temp = {
                            type:pop_up.metadata.type,
                            link:pop_up.metadata.link,
                            text:pop_up.metadata.text,
                            image:pop_up.metadata.image

                        }
                        if(pop_up.metadata.type == 'text'){
                            temp.hasText = true,
                            temp.hasImage = false,
                            temp.image_link = ''
                        }
                        if(pop_up.metadata.type == 'image'){
                            temp.hasImage = true,
                            temp.hasText = false,
                            temp.image_link = 'https://popupss.s3.ap-south-1.amazonaws.com/' + pop_up.metadata.image
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
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

controller.player.get_tournament_joined_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let team = 1
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    let entry_list = []

                    connection.db.MatchEntry.findAll({
                        where: {
                            matchId: input.match_id
                        }
                    }).then(entry => {
                        entry.forEach(function (each_entry) {
                            let new_entry = {
                                team_no: team
                            }
                            if (each_entry.metadata.hasFirstPlayer) {
                                new_entry.first_player = each_entry.metadata.first_player
                                new_entry.hasFirstPlayer = each_entry.metadata.hasFirstPlayer
                            }
                            if (each_entry.metadata.hasSecondPlayer) {
                                new_entry.second_player = each_entry.metadata.second_player
                                new_entry.hasSecondPlayer = each_entry.metadata.hasSecondPlayer
                            }
                            if (each_entry.metadata.hasThirdPlayer) {
                                new_entry.third_player = each_entry.metadata.third_player
                                new_entry.hasThirdPlayer = each_entry.metadata.hasThirdPlayer
                            }
                            if (each_entry.metadata.hasForthPlayer) {
                                new_entry.forth_player = each_entry.metadata.forth_player
                                new_entry.hasForthPlayer = each_entry.metadata.hasForthPlayer
                            }
                            if (each_entry.metadata.hasExtraOne) {
                                new_entry.extra_player_one = each_entry.metadata.extra_player_one
                                new_entry.hasExtraOne = each_entry.metadata.hasExtraOne
                            }
                            if (each_entry.metadata.hasExtraTwo) {
                                new_entry.extra_player_two = each_entry.metadata.extra_player_two
                                new_entry.hasExtraTwo = each_entry.metadata.hasExtraTwo
                            }

                            entry_list.push(new_entry)
                            team+=1;
                        })
                        h.render_xhr(req, res, { e: 0, m: entry_list })
                    })
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1, m: err });
        };
    })
}

//admin_login
controller.admin.login = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    metadata:{
                        user_name:input.user_name
                    }
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
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

controller.admin.refresh_token = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    id:input.secret_id
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
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
                            h.render_xhr(req, res, {e:0, m:admin.metadata.api_token})
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

controller.admin.get_all_games = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_game = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Game.findAll({

                    }).then(games =>{
                        games.forEach(function(each_game){
                            let new_game = {
                                game_id: each_game.id,
                                game_name:each_game.name
                            }
                            all_game.push(new_game)

                        })
                        h.render_xhr(req, res, {e: 0, m:all_game});
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

controller.admin.get_all_playing_type = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_play_type = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.PlayingType.findAll({

                    }).then(games_type =>{
                        games_type.forEach(function(each_type){
                            let new_type = {
                                playType_id: each_type.id,
                                playing_type: each_type.type
                            }
                            all_play_type.push(new_type)

                        })
                        h.render_xhr(req, res, {e: 0, m:all_play_type});
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

controller.admin.new_add_match = function(req, res){
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    let temp = {
                        metadata: {
                            match_time: input.date,
                            entry_fee: input.entry_fee,
                            map: input.map,
                            per_kill_rate: input.per_kill,
                            status: 'created',
                            title: input.title,
                            total_player: input.total_player,
                            total_prize: input.total_prize,
                            version: 'mobile',
                            total_joined: 0
                        },
                        gameId: input.game_id,
                        playingTypeId: input.playType_id,
                        adminId: admin.id
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
                    connection.db.Match.create(temp).then(done => {
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

controller.admin.add_match = function(req, res){
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    let temp = {
                        metadata: {
                            match_time: input.date,
                            entry_fee: input.entry_fee,
                            map: input.map,
                            per_kill_rate: input.per_kill,
                            status: 'created',
                            title: input.title,
                            total_player: input.total_player,
                            total_prize: input.total_prize,
                            version: 'mobile',
                            total_joined: 0
                        },
                        gameId: input.game_id,
                        playingTypeId: input.playType_id,
                        adminId: admin.id
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
                    connection.db.Match.create(temp).then(done => {
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

controller.admin.add_automated_cs_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;     
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(async admin => {
                if(admin && admin.metadata.status == 'active') {
                    let time =  h.moment(input.time, 'h:mm A')
                    //let next_time = h.moment(time.add(input.gap_time, 'minutes')).format('h:mm A')
                    let match_number = parseInt(input.match_number)
                    let total_match = parseInt(input.total_match)
                    let same_time_match = parseInt(input.same_time_match)
                    for(let i = 0; i< total_match; i++){
                        for(let j = 0; j<same_time_match; j++){
                            // console.log(match_number)
                            // console.log(time.format('h:mm A'))

                            let temp = {
                                metadata: {
                                    date: input.date,
                                    match_time: time.format('h:mm A'),
                                    map: input.map,
                                    title: input.title + match_number,
                                    entry_fee: input.entry_fee,
                                    total_player: input.total_player,
                                    total_prize: input.total_prize,
                                    version: 'mobile',
                                    status: 'created',
                                    total_joined: 0
                                },
                                gameId: input.game_id,
                                playingTypeId: input.playType_id,
                                adminId: admin.id
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
                            await connection.db.Match.create(temp).then(done => {
                                
                            })



                            match_number+=1
                        }
                        time = h.moment(time.add(parseInt(input.gap_time), 'minutes'))
                    }
                    h.render_xhr(req, res, { e: 0, m: 'Successful!' });
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

controller.admin.add_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    let temp = {
                        metadata:{
                            date:input.date,
                            time:input.time,
                            title:input.title,
                            entry_fee: input.entry_fee,
                            total_player:input.total_player,
                            total_prize:input.total_prize,
                            host_app:input.host_app,
                            status:'created'
                        },
                        gameId:input.game_id,
                        playingTypeId:8,
                        adminId:admin.id
                    }
                    connection.db.LudoMatch.create(temp).then(done =>{
                        h.render_xhr(req, res, {e: 0, m:'Successful!'});
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

controller.admin.add_new_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(async admin => {
                if(admin && admin.metadata.status == 'active') {
                    let time =  h.moment(input.time, 'h:mm A')
                    //let next_time = h.moment(time.add(input.gap_time, 'minutes')).format('h:mm A')
                    let match_number = parseInt(input.match_number)
                    let total_match = parseInt(input.total_match)
                    let same_time_match = parseInt(input.same_time_match)
                    for(let i = 0; i< total_match; i++){
                        for(let j = 0; j<same_time_match; j++){
                            // console.log(match_number)
                            // console.log(time.format('h:mm A'))

                            let temp = {
                                metadata: {
                                    date: input.date,
                                    time: time.format('h:mm A'),
                                    title: input.title + match_number,
                                    entry_fee: input.entry_fee,
                                    total_player: input.total_player,
                                    total_prize: input.total_prize,
                                    host_app: input.host_app,
                                    status: 'created'
                                },
                                gameId: input.game_id,
                                playingTypeId: 8,
                                adminId: admin.id
                            }
                            await connection.db.LudoMatch.create(temp).then(done => {
                                
                            })



                            match_number+=1
                        }
                        time = h.moment(time.add(parseInt(input.gap_time), 'minutes'))
                    }
                    h.render_xhr(req, res, { e: 0, m: 'Successful!' });
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

controller.admin.edit_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatch.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        if(match){
                            let metadata = match.metadata
                            metadata.date = input.date,
                            metadata.time = input.time,
                            metadata.title = input.title,
                            metadata.entry_fee = input.entry_fee,
                            metadata.total_player = input.total_player,
                            metadata.total_prize = input.total_prize,
                            metadata.host_app = input.host_app
                            match.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    h.render_xhr(req, res, {e:0, m:'Successfully updated!'})
                                }
                                else{
                                    h.render_xhr(req, res, {e:3, m:'No match found!'})
                                }
                            })

                        }
                        else{
                            h.render_xhr(req, res, {e:2, m:'No match found!'})
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

controller.admin.get_created_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            const Op = h.Sequelize.Op;
            let all_ludo_match = []
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatch.findAll({
                        where:{
                           [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'created' } }]
                        },
                        order:[['createdAt', 'ASC']]
                    }).then(ludo_matches =>{
                        ludo_matches.map(function(each_match){
                            let temp_match = {
                                match_id: each_match.id,
                                date: each_match.metadata.date,
                                time: each_match.metadata.time,
                                title: each_match.metadata.title,
                                entry_fee:each_match.metadata.entry_fee,
                                total_player:each_match.metadata.total_player,
                                total_prize:each_match.metadata.total_prize,
                                host_app:each_match.metadata.host_app
                            }
                            
                            if(each_match.metadata.room_code){
                                temp_match.room_code = each_match.metadata.room_code
                            }
                            else{
                                temp_match.room_code = ''
                            }
                            
                            all_ludo_match.push(temp_match)
                        })
                        h.render_xhr(req, res, {e:0, m:all_ludo_match})
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

controller.admin.update_ludo_match_roomcode = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    if(input.match_id && input.room_code){
                        connection.db.LudoMatch.findOne({
                            where:{
                                id:input.match_id
                            }
                        }).then(match =>{
                            if(match){
                                let metadata = match.metadata
                                
                                if(metadata.room_code){
                                    metadata.room_code = input.room_code
                                    match.update({metadata:metadata}).then(successful =>{
                                        if(successful){
                                            let title = 'Ludo match id and pass'
                                            let body = 'দেওয়া হয়েছে। এখনই সংগ্রহ করে ম্যাচ join করুন।'
                                            let topic = `NotificationForLudoMatch${match.id}`
                                            h.send_notification(title, body, topic)
                                            h.render_xhr(req, res, {e:0})  
                                        }
                                    })
                                }
                                else{
                                    metadata.room_code = input.room_code
                                    metadata.room_update_time = new Date()
                                    match.update({metadata:metadata}).then(successful =>{
                                        if(successful){
                                            let title = 'Ludo match id and pass'
                                            let body = 'দেওয়া হয়েছে। এখনই সংগ্রহ করে ম্যাচ join করুন।'
                                            let topic = `NotificationForLudoMatch${match.id}`
                                            h.send_notification(title, body, topic)
                                            h.render_xhr(req, res, {e:0})  
                                        }
                                    })
                                }
                            }
                            else{
                                h.render_xhr(req, res, {e:3, m:'match not found!'})
                            }
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:2, m:'input missing!'})
                    }
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

controller.admin.remove_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            if(input.match_id && input.secret_id && input.api_token){
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where:{
                        [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                    }
                }).then(admin =>{
                    if(admin && admin.metadata.status == 'active'){
                        connection.db.LudoMatch.destroy({where:{id:input.match_id}}).then(removed =>{
                            if(removed){
                                h.render_xhr(req, res, {e:0});
                            }
                            else{
                                h.render_xhr(req, res, {e:1, m:'Failed to remove!'});
                            }
                            
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                    }
                })
            }
            else{
                console.log('input missing')
                h.render_xhr(req, res, {e:1, m:'Invalid input!'})
            }
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

controller.admin.ludo_match_move_to_ongoing = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatch.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        let metadata = match.metadata
                        metadata.status = 'ongoing',
                        metadata.ongoing_admin_id = admin.id,
                        metadata.ongoing_by = admin.metadata.user_name
                        match.update({metadata:metadata}).then(done =>{
                            h.render_xhr(req, res,{e:0})
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

controller.admin.get_ongoing_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            const Op = h.Sequelize.Op;
            let all_ludo_match = []
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatchEntry.findAll({
                        
                    }).then(match_entry =>{
                        connection.db.LudoMatch.findAll({
                            where:{
                                [Op.and]:[{gameId:input.game_id},{metadata:{status:'ongoing'}}]
                            },
                            order:[['createdAt', 'DESC']]
                        }).then(ludo_matches =>{
                            ludo_matches.map(function(each_match){
                                let temp_match = {
                                    match_id: each_match.id,
                                    date: each_match.metadata.date,
                                    time: each_match.metadata.time,
                                    title: each_match.metadata.title,
                                    entry_fee:each_match.metadata.entry_fee,
                                    total_player:each_match.metadata.total_player,
                                    total_prize:each_match.metadata.total_prize,
                                    host_app:each_match.metadata.host_app,
                                    total_image_upload: 0
                                }
                                
                                // if(each_match.metadata.image){
                                //     temp_match.hasImage = true,
                                //      temp_match.image_link = 'https://testv2.khelo.live/uploads/' + each_match.metadata.image
                                     
                                // };
                                
                                // if(each_match.metadata.image_uploaded_by){
                                //     temp_match.image_uploaded_by = each_match.metadata.image_uploaded_by
                                // };
                                if(each_match.metadata.ongoing_by){
                                    temp_match.ongoing_by = each_match.metadata.ongoing_by
                                }
                                else{
                                    temp_match.ongoing_by = ''
                                }
                                
                                if(each_match.metadata.room_code){
                                        temp_match.hasRoomcode = true;
                                        temp_match.room_code = each_match.metadata.room_code
                                    }
                                 if(each_match.metadata.admin_note){
                                    temp_match.note = each_match.metadata.admin_note
                                }
                                match_entry.forEach(function(each_entry){
                                    if(each_entry.ludoMatchId == each_match.id && each_entry.metadata.image){
                                        temp_match.total_image_upload +=1
                                    }
                                })
                                all_ludo_match.push(temp_match)
                            })
                            h.render_xhr(req, res, {e:0, m:all_ludo_match})
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

controller.admin.ludo_match_move_to_result = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatch.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        let metadata = match.metadata
                        metadata.status = 'result'
                        match.update({metadata:metadata}).then(done =>{
                            h.render_xhr(req, res,{e:0})
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

controller.admin.get_result_ludo_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            const Op = h.Sequelize.Op;
            let all_ludo_match = []
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatch.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id},{metadata:{status:'result'}}]
                        },
                        order:[['createdAt', 'DESC']]
                    }).then(ludo_matches =>{
                        ludo_matches.map(function(each_match){
                            let temp_match = {
                                match_id: each_match.id,
                                date: each_match.metadata.date,
                                time: each_match.metadata.time,
                                title: each_match.metadata.title,
                                entry_fee:each_match.metadata.entry_fee,
                                total_player:each_match.metadata.total_player,
                                total_prize:each_match.metadata.total_prize,
                                host_app:each_match.metadata.host_app
                            }
                            if(each_match.metadata.image){
                                temp_match.image_link = 'https://uploadssssss.s3.ap-south-1.amazonaws.com/' + each_match.metadata.image
                            };
                            
                            if(each_match.metadata.image_uploaded_by){
                                temp_match.image_uploaded_by = each_match.metadata.image_uploaded_by
                            };
                            
                            if(each_match.metadata.room_code){
                                    temp_match.hasRoomcode = true;
                                    temp_match.room_code = each_match.metadata.room_code
                            };
                             if(each_match.metadata.room_update_time){
                                    temp_match.room_update_time = h.moment(new Date(each_match.metadata.room_update_time)).add(0, 'h').local().format('h:mm a')
                            }
                            else{
                                temp_match.room_update_time = ' '
                            }
                            if(each_match.metadata.result_done){
                                temp_match.result_done = true
                            }
                            else{
                                temp_match.result_done = false
                            }
                             if(each_match.metadata.admin_note){
                                temp_match.note = each_match.metadata.admin_note
                            }
                            all_ludo_match.push(temp_match)
                        })
                        h.render_xhr(req, res, {e:0, m:all_ludo_match})
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

controller.player.get_paginated_ludo_result_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;
    
            let offset = (page_number-1)*page_size;
    
            let filter = {
                order:[['createdAt', 'DESC']]
                ,limit: page_size
                ,offset: offset
    
            };
            filter. where = {
                [Op.and]: [{ gameId:input.game_id}, { metadata: { status: 'result' } }]//game id is actually is it cs or regular match
                ,createdAt: {
                     [Op.between]: [yesterday, today]
                 }
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.LudoMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.LudoMatch.findAndCountAll(filter).then(result => {
                            let count = result.count;
    
                            let has_results = false;
    
                            if(count > 0){
                                has_results = true;
                            }
    
                            let matches = result.rows;
    
                            let records_remaining = count - (offset + matches.length);
    
                            let show_next = false;
                            let show_prev = true;
    
                            if(records_remaining > 0){
                                show_next = true;
                            };
    
                            if(offset == 0){
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_date: each_match.metadata.date,
                                    match_time: each_match.metadata.time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    host_app: each_match.metadata.host_app,
                                    title: each_match.metadata.title,
                                    total_prize: each_match.metadata.total_prize,
                                    
                                }
                                
                                if (each_match.metadata.message) {
                                    temp_match.hasMessage = true;
                                    temp_match.message = each_match.metadata.message
                                }
                                
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.ludoMatchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.ludoMatchId == each_match.id) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                                })
                    
                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info:{
                                    has_results:has_results
                                    ,page_number:page_number
                                    ,show_next: show_next
                                    ,show_prev: show_prev
                                    ,records_remaining:records_remaining
                                    ,offset:offset
                                }
                            };
                            all_created_match.push(pkt)
                            h.render_xhr(req, res, { e: 0, m: all_created_match });
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

controller.admin.ludo_result_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let result_info = []
            console.log('match_id: '+input.match_id)
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            ludoMatchId:input.match_id
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User}]
                    }).then(matchEntry =>{
                        
                        matchEntry.forEach(function(each_entry){
                            if(each_entry.user){
                                let temp_match_player_info = {
                                    user_id:each_entry.userId,
                                    user_name:each_entry.user.metadata.user_name 
                                }
                                if(each_entry.metadata.player_name){
                                    temp_match_player_info.player_name = each_entry.metadata.player_name
                                }
                                else{
                                    temp_match_player_info.player_name = ''
                                };
                                if(each_entry.metadata.rank){
                                    temp_match_player_info.rank = each_entry.metadata.rank
                                }
                                else{
                                    temp_match_player_info.rank = 100
                                };
                                
                                if(each_entry.metadata.winning_money){
                                    temp_match_player_info.winning_money = each_entry.metadata.winning_money
                                }
                                else{
                                    temp_match_player_info.winning_money = 0
                                };
                                if(each_entry.metadata.refund_amount){
                                    temp_match_player_info.refund_amount = each_entry.metadata.refund_amount
                                }
                                else{
                                    temp_match_player_info.refund_amount = 0
                                };
                                
                                
                                if(each_entry.metadata.isReady){
                                    temp_match_player_info.isReady = true
                                }
                                result_info.push(temp_match_player_info)
                            }
                        })
                        function compareValues(key, order = 'asc') {
                            return function innerSort(a, b) {
                                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                                    return 0;
                                }
    
                                const varA = (typeof a[key] === 'string')
                                    ? a[key].toUpperCase() : a[key];
                                const varB = (typeof b[key] === 'string')
                                    ? b[key].toUpperCase() : b[key];
    
                                let comparison = 0;
                                if (varA > varB) {
                                    comparison = 1;
                                } else if (varA < varB) {
                                    comparison = -1;
                                }
                                return (
                                    (order === 'desc') ? (comparison * -1) : comparison
                                );
                            };
                        }
    
                        result_info.sort(compareValues('rank', 'asc'))
                        h.render_xhr(req, res, {e: 0, m:result_info});
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

controller.admin.giving_ludo_result = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatchEntry.findOne({
                        where:{
                            [Op.and]:[{userId:input.user_id},{ludoMatchId:input.match_id}]
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User}]
                    }).then(entry =>{
                        if(entry.metadata.winning_money){
                            let metadata = entry.metadata
                            let temp_winning_money = metadata.winning_money
                            metadata.winning_money = input.winning_money
                            if(input.rank){
                                metadata.rank = input.rank
                            }
                            entry.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    let new_user = entry.user
                                    let metadata = new_user.metadata
                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.winning_money) - parseInt(temp_winning_money)
                                    metadata.winning_balance = parseInt(metadata.winning_balance) + parseInt(input.winning_money) - parseInt(temp_winning_money)
                                    if(parseInt(metadata.rank) != 1 && parseInt(input.rank) == 1){
                                        metadata.match_win = parseInt(metadata.match_win) + 1
                                    }
                                    else if(parseInt(metadata.rank) == 1 && parseInt(input.rank) != 1){
                                        metadata.match_win = parseInt(metadata.match_win) - 1
                                    }
                                    new_user.update({metadata:metadata}).then(done =>{
                                        h.render_xhr(req, res, {e:0});
                                    })

                                }
                            })
                        }
                        else{
                            let metadata = entry.metadata
                            metadata.winning_money = input.winning_money
                            metadata.rank = input.rank
                            entry.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    let new_user = entry.user
                                    let metadata = new_user.metadata
                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.winning_money)
                                    metadata.winning_balance = parseInt(metadata.winning_balance) + parseInt(input.winning_money)
                                    if(parseInt(input.rank) == 1){
                                        metadata.match_win = parseInt(metadata.match_win) + 1
                                    }
                                    new_user.update({metadata:metadata}).then(done =>{
                                        h.render_xhr(req, res, {e:0});
                                    })

                                }
                            })
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

controller.admin.give_ludo_refund = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findOne({
                        where: {
                            [Op.and]: [{ userId: input.user_id }, { ludoMatchId: input.match_id }]
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(entry => {
                        if (input.refund_amount) {
                            if(entry.metadata.refunded && entry.metadata.refund_amount){
                                let pre_refunded_amount = parseInt(entry.metadata.refund_amount)
                                let metadata = entry.metadata
                                metadata.refund_amount = input.refund_amount
                                entry.update({ metadata: metadata }).then(update => {
                                    if (update) {
                                        let new_user = entry.user
                                        let metadata = new_user.metadata
                                        metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.refund_amount) - pre_refunded_amount
                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) + parseInt(input.refund_amount) - pre_refunded_amount
                                        new_user.update({ metadata: metadata }).then(user_updated => {
                                            if (user_updated) {
                                                let title = 'Refund'
                                                let body = 'দেওয়া হয়েছে।'
                                                let topic = `NotificationForLudoRefund${user_updated.id}`
                                                h.send_notification(title, body, topic)
                                                h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                            }
                                        })
                                    }
                                })
                            }
                            else{
                                let metadata = entry.metadata
                                metadata.refund_amount = input.refund_amount
                                metadata.refunded = true
                                entry.update({ metadata: metadata }).then(update => {
                                    if (update) {
                                        let new_user = entry.user
                                        let metadata = new_user.metadata
                                        metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.refund_amount)
                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) + parseInt(input.refund_amount)
                                        new_user.update({ metadata: metadata }).then(user_updated => {
                                            if (user_updated) {
                                                let title = 'Refund'
                                                let body = 'দেওয়া হয়েছে।'
                                                let topic = `NotificationForLudoRefund${user_updated.id}`
                                                h.send_notification(title, body, topic)
                                                h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        else {
                            h.render_xhr(req, res, { e: 1, m: 'Input missing!' })
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

controller.admin.match_move_to_ongoing = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin  && admin.metadata.status == 'active'){
                    connection.db.Match.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        let metadata = match.metadata
                        metadata.status = 'ongoing',
                        metadata.ongoing_admin_id = admin.id,
                        metadata.ongoing_by = admin.metadata.user_name
                        match.update({metadata:metadata}).then(done =>{
                            h.render_xhr(req, res,{e:0})
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

controller.admin.get_edit_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(each_match =>{
                        let temp_match = {
                            match_id: each_match.id,
                            match_time: each_match.metadata.match_time,
                            entry_fee: each_match.metadata.entry_fee,
                            map: each_match.metadata.map,
                            per_kill_rate: each_match.metadata.per_kill,
                            title: each_match.metadata.title,
                            total_player: each_match.metadata.total_player,
                            total_prize: each_match.metadata.total_prize,
                            first_prize: each_match.metadata.first_prize,
                            second_prize: each_match.metadata.second_prize,
                            third_prize: each_match.metadata.third_prize,
                            version: each_match.metadata.version
                        }
                        h.render_xhr(req, res,{e:0, m:temp_match})
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

controller.admin.update_match_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(each_match =>{
                       if(each_match){
                           console.log('find match')
                            let metadata = each_match.metadata
                            metadata.match_time = input.match_time,
                            metadata.entry_fee = input.entry_fee,
                            metadata.map = input.map,
                            metadata.per_kill_rate = input.per_kill_rate,
                            metadata.title = input.title,
                            metadata.total_player = input.total_player,
                            metadata.total_prize = input.total_prize,
                            metadata.first_prize = input.first_prize,
                            metadata.second_prize = input.second_prize,
                            metadata.third_prize = input.third_prize
                            each_match.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    h.render_xhr(req, res,{e:0,m:'Successfully updated!'})
                                }
                                else{
                                    h.render_xhr(req, res,{e:1,m:'Update failed!'})
                                }
                            })

                       }
                       else{
                        console.log('match not found')
                       }
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:1})
        }
    })
}

controller.admin.remove_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            if(input.match_id && input.secret_id && input.api_token){
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where:{
                        [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                    }
                }).then(admin =>{
                    if(admin && admin.metadata.status == 'active'){
                        connection.db.Match.destroy({where:{id:input.match_id}}).then(removed =>{
                            if(removed){
                                h.render_xhr(req, res, {e:0});
                            }
                            else{
                                h.render_xhr(req, res, {e:1, m:'Failed to remove!'});
                            }
                            
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                    }
                })
            }
            else{
                console.log('input missing')
                h.render_xhr(req, res, {e:1, m:'Invalid input!'})
            }
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        }
    })
}

controller.admin.get_created_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id},{metadata:{status:'created'}}]//game id is actually is it cs or regular match
                        },
                        order:[['createdAt', 'ASC']],
                        include:[{model: connection.db.Game},{model: connection.db.PlayingType}]
                    }).then(matches=>{
                        Array.from(matches).forEach(each_match =>{
                            let temp_match = {
                                match_id: each_match.id,
                                match_time: each_match.metadata.match_time,
                                entry_fee: each_match.metadata.entry_fee,
                                map: each_match.metadata.map,
                                per_kill_rate: each_match.metadata.per_kill_rate,
                                title: each_match.metadata.title,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                first_prize: each_match.metadata.first_prize,
                                second_prize: each_match.metadata.second_prize,
                                third_prize: each_match.metadata.third_prize,
                                version: each_match.metadata.version,
                                game_type: each_match.game.name,
                                player_type: each_match.playing_type.type,
                                room_id: ''
                            }
                            if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                            }
                            if(each_match.metadata.total_joined){
                                temp_match.total_joined = each_match.metadata.total_joined
                            }

                            all_created_match.push(temp_match)
                        })
                        h.render_xhr(req, res, {e: 0, m:all_created_match});
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

controller.admin.get_created_automated_cs_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id},{playingTypeId:input.playing_type_id},{metadata:{status:'created'}}]//game id is actually is it cs or regular match
                        },
                        order:[['createdAt', 'ASC']],
                        include:[{model: connection.db.Game},{model: connection.db.PlayingType}]
                    }).then(matches=>{
                        Array.from(matches).forEach(each_match =>{
                            let temp_match = {
                                match_id: each_match.id,
                                entry_fee: each_match.metadata.entry_fee,
                                map: each_match.metadata.map,
                                per_kill_rate: each_match.metadata.per_kill_rate,
                                title: each_match.metadata.title,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                first_prize: each_match.metadata.first_prize,
                                second_prize: each_match.metadata.second_prize,
                                third_prize: each_match.metadata.third_prize,
                                version: each_match.metadata.version,
                                game_type: each_match.game.name,
                                player_type: each_match.playing_type.type,
                                room_id: ''
                            }
                            if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            if(each_match.metadata.room_id){
                                temp_match.room_id = each_match.metadata.room_id
                            }
                            if(each_match.metadata.total_joined){
                                temp_match.total_joined = each_match.metadata.total_joined
                            }

                            all_created_match.push(temp_match)
                        })
                        h.render_xhr(req, res, {e: 0, m:all_created_match});
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

controller.admin.get_ongoing_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_ongoing_match = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id},{metadata:{status:'ongoing'}}]//game id is actually is it cs or regular match
                        },
                        order:[['updatedAt', 'DESC']],
                        include:[{model: connection.db.Game},{model: connection.db.PlayingType}]
                    }).then(matches=>{
                        Array.from(matches).forEach(each_match =>{
                            let temp_match = {
                                match_id: each_match.id,
                                
                                entry_fee: each_match.metadata.entry_fee,
                                map: each_match.metadata.map,
                                per_kill_rate: each_match.metadata.per_kill_rate,
                                title: each_match.metadata.title,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                first_prize: each_match.metadata.first_prize,
                                second_prize: each_match.metadata.second_prize,
                                third_prize: each_match.metadata.third_prize,
                                version: each_match.metadata.version,
                                game_type: each_match.game.name,
                                player_type: each_match.playing_type.type
                            }
                            
                            if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                            if(each_match.metadata.total_joined){
                                total_joined = each_match.metadata.total_joined
                            }
                             if(each_match.metadata.admin_note){
                                temp_match.note = each_match.metadata.admin_note
                            }
                            
                            if(each_match.metadata.ongoing_by){
                                temp_match.ongoing_by = each_match.metadata.ongoing_by
                            }
                            else{
                                temp_match.ongoing_by = ''
                            }

                            all_ongoing_match.push(temp_match)
                        })
                        h.render_xhr(req, res, {e: 0, m:all_ongoing_match});
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

controller.admin.match_move_to_result = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        let metadata = match.metadata
                        metadata.status = 'result'
                        match.update({metadata:metadata}).then(done =>{
                            h.render_xhr(req, res,{e:0})
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

controller.admin.get_result_match = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(2, 'day').startOf('day');
            // let today = h.moment().add(0, 'h')
            // let yesterday = h.moment().subtract(24, 'h')
            let all_result_match = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findAll({
                        where:{
                            [Op.and]:[{gameId:input.game_id},{metadata:{status:'result'}}]//game id is actually is it cs or regular match
                            ,createdAt: {
                                    [Op.between]: [yesterday, today]
                                }
                        },
                        order:[['updatedAt', 'DESC']],
                        include:[{model: connection.db.Game},{model: connection.db.PlayingType}]
                    }).then(matches=>{
                        Array.from(matches).forEach(each_match =>{
                            let temp_match = {
                                match_id: each_match.id,
                                
                                entry_fee: each_match.metadata.entry_fee,
                                map: each_match.metadata.map,
                                per_kill_rate: each_match.metadata.per_kill_rate,
                                title: each_match.metadata.title,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                first_prize: each_match.metadata.first_prize,
                                second_prize: each_match.metadata.second_prize,
                                third_prize: each_match.metadata.third_prize,
                                version: each_match.metadata.version,
                                game_type: each_match.game.name,
                                player_type: each_match.playing_type.type,
                            }
                            
                            if(each_match.metadata.date){
                                temp_match.match_time = each_match.metadata.date+' at '+ each_match.metadata.match_time
                            }
                            else{
                                temp_match.match_time = each_match.metadata.match_time
                            }
                            
                            if(each_match.metadata.total_joined){
                                temp_match.total_joined = each_match.metadata.total_joined
                            }
                            else{
                                temp_match.total_joined = 0
                            }
                            
                            if(each_match.metadata.admin_note){
                                temp_match.note = each_match.metadata.admin_note
                            }
                            
                            if(each_match.metadata.result_done){
                                temp_match.result_done = true;
                            }
                            else{
                                temp_match.result_done = false;
                            }
                            
                            if(each_match.metadata.room_update_time){
                                    temp_match.room_update_time = h.moment(new Date(each_match.metadata.room_update_time)).add(0, 'h').local().format('h:mm a')
                            }
                            else{
                                temp_match.room_update_time = ' '
                            }

                            all_result_match.push(temp_match)
                        })
                        h.render_xhr(req, res, {e: 0, m:all_result_match});
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

controller.admin.give_refund = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.MatchEntry.findOne({
                        where: {
                            [Op.and]: [{ userId: input.user_id }, { matchId: input.match_id }]
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(entry => {
                        if (input.refund_amount) {
                            if(entry.metadata.refunded && entry.metadata.refund_amount){
                                let pre_refunded_amount = parseInt(entry.metadata.refund_amount)
                                let metadata = entry.metadata
                                metadata.refund_amount = input.refund_amount
                                entry.update({ metadata: metadata }).then(update => {
                                    if (update) {
                                        let new_user = entry.user
                                        let metadata = new_user.metadata
                                        metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.refund_amount) - pre_refunded_amount
                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) + parseInt(input.refund_amount) - pre_refunded_amount
                                        new_user.update({ metadata: metadata }).then(user_updated => {
                                            if (user_updated) {
                                                let title = 'Refund'
                                                let body = 'দেওয়া হয়েছে।'
                                                let topic = `NotificationForRefund${user_updated.id}`
                                                h.send_notification(title, body, topic)
                                                h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                            }
                                        })
                                    }
                                })
                            }
                            else{
                                let metadata = entry.metadata
                                metadata.refund_amount = input.refund_amount
                                metadata.refunded = true
                                entry.update({ metadata: metadata }).then(update => {
                                    if (update) {
                                        let new_user = entry.user
                                        let metadata = new_user.metadata
                                        metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.refund_amount)
                                        metadata.deposit_balance = parseInt(metadata.deposit_balance) + parseInt(input.refund_amount)
                                        new_user.update({ metadata: metadata }).then(user_updated => {
                                            if (user_updated) {
                                                let title = 'Refund'
                                                let body = 'দেওয়া হয়েছে।'
                                                let topic = `NotificationForRefund${user_updated.id}`
                                                h.send_notification(title, body, topic)
                                                h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        else {
                            h.render_xhr(req, res, { e: 1, m: 'Input missing!' })
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

controller.admin.update_result_done = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                   if(input.match_id){
                       connection.db.Match.findOne({
                           where:{
                               id:input.match_id
                           }
                       }).then(match =>{
                           if(match){
                               let metadata = match.metadata
                               metadata.result_done = true
                               match.update({metadata:metadata}).then(update =>{
                                   if(update){
                                    h.render_xhr(req, res, {e:0, m:'successfully updated!'})
                                   }
                                   else{
                                    h.render_xhr(req, res, {e:4, m:'update faield!'})
                                   }
                               })
                           }
                           else{
                            h.render_xhr(req, res, {e:3, m:'no match found!'})
                           }
                       })
                   }else{
                    h.render_xhr(req, res, {e:2, m:'input missing!'}) 
                   }
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

controller.admin.result_match_info = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            console.log(input.match_id)
            let result_info = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.MatchEntry.findAll({
                        where: {
                            matchId: input.match_id
                        },
                        //order:[['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(matchEntry => {

                        matchEntry.forEach(function (each_entry) {
                            if (each_entry.user) {
                                let temp_match_player_info = {
                                    user_id: each_entry.userId,
                                    user_name: each_entry.user.metadata.user_name
                                }
                                if (each_entry.metadata.first_player) {
                                    temp_match_player_info.first_player = each_entry.metadata.first_player
                                }
                                else {
                                    temp_match_player_info.first_player = ''
                                };
                                if (each_entry.metadata.second_player) {
                                    temp_match_player_info.second_player = each_entry.metadata.second_player
                                }
                                else {
                                    temp_match_player_info.second_player = ''
                                };
                                if (each_entry.metadata.third_player) {
                                    temp_match_player_info.third_player = each_entry.metadata.third_player
                                }
                                else {
                                    temp_match_player_info.third_player = ''
                                };
                                if (each_entry.metadata.forth_player) {
                                    temp_match_player_info.forth_player = each_entry.metadata.forth_player
                                }
                                else {
                                    temp_match_player_info.forth_player = ''
                                };
                                if (each_entry.metadata.fifth_player) {
                                    temp_match_player_info.fifth_player = each_entry.metadata.fifth_player
                                }
                                else {
                                    temp_match_player_info.fifth_player = ''
                                };
                                if (each_entry.metadata.sixth_player) {
                                    temp_match_player_info.sixth_player = each_entry.metadata.sixth_player
                                }
                                else {
                                    temp_match_player_info.sixth_player= ''
                                };
                                if (each_entry.metadata.rank) {
                                    temp_match_player_info.rank = parseInt(each_entry.metadata.rank)
                                }
                                else {
                                    temp_match_player_info.rank = 100
                                };

                                if (each_entry.metadata.kill) {
                                    temp_match_player_info.kill = each_entry.metadata.kill
                                }
                                else {
                                    temp_match_player_info.kill = 0
                                };
                                if (each_entry.metadata.winning_money) {
                                    temp_match_player_info.winning_money = each_entry.metadata.winning_money
                                }
                                else {
                                    temp_match_player_info.winning_money = 0
                                };
                                if (each_entry.metadata.refund_amount) {
                                    temp_match_player_info.refund_amount = each_entry.metadata.refund_amount
                                }
                                else {
                                    temp_match_player_info.refund_amount = 0
                                };
                                if (each_entry.metadata.kill || each_entry.metadata.winning_money || each_entry.metadata.rank || each_entry.metadata.refund_amount) {
                                    temp_match_player_info.hasResult = true
                                }
                                else {
                                    temp_match_player_info.hasResult = false
                                };
                                result_info.push(temp_match_player_info)
                            }
                        })
                        function compareValues(key, order = 'asc') {
                            return function innerSort(a, b) {
                                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                                    return 0;
                                }

                                const varA = (typeof a[key] === 'string')
                                    ? a[key].toUpperCase() : a[key];
                                const varB = (typeof b[key] === 'string')
                                    ? b[key].toUpperCase() : b[key];

                                let comparison = 0;
                                if (varA > varB) {
                                    comparison = 1;
                                } else if (varA < varB) {
                                    comparison = -1;
                                }
                                return (
                                    (order === 'desc') ? (comparison * -1) : comparison
                                );
                            };
                        }

                        result_info.sort(compareValues('rank', 'asc'))
                        h.render_xhr(req, res, { e: 0, m: result_info });
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

controller.admin.get_each_player_result_update_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.MatchEntry.findOne({
                        where:{
                            [Op.and]:[{userId:input.user_id},{matchId:input.match_id}]
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User}]
                    }).then(each_entry =>{
                        let temp_match_player_info = {
                            user_id:each_entry.userId,
                            user_name:each_entry.user.metadata.user_name,
                            first_player: '',
                            second_player: '',
                            third_player: '',
                            forth_player: ''
                        }
                        if(each_entry.metadata.first_player){
                            temp_match_player_info.first_player = each_entry.metadata.first_player
                        };
                        if(each_entry.metadata.second_player){
                            temp_match_player_info.second_player = each_entry.metadata.second_player
                        };
                        if(each_entry.metadata.third_player){
                            temp_match_player_info.third_player = each_entry.metadata.third_player
                        };
                        if(each_entry.metadata.forth_player){
                            temp_match_player_info.forth_player = each_entry.metadata.forth_player
                        };
                        if(each_entry.metadata.rank){
                            temp_match_player_info.rank = each_entry.metadata.rank
                        }
                        else{
                            temp_match_player_info.rank = 0
                        };

                        if(each_entry.metadata.kill){
                            temp_match_player_info.kill = each_entry.metadata.kill
                        }
                        else{
                            temp_match_player_info.kill = 0
                        };
                        if(each_entry.metadata.winning_money){
                            temp_match_player_info.winning_money = each_entry.metadata.winning_money
                        }
                        else{
                            temp_match_player_info.winning_money = 0
                        };
                        h.render_xhr(req, res, {e:0, m:temp_winning_balance})
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

controller.admin.giving_result = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.MatchEntry.findOne({
                        where:{
                            [Op.and]:[{userId:input.user_id},{matchId:input.match_id}]
                        },
                        order:[['createdAt', 'DESC']],
                        include:[{model: connection.db.User}]
                    }).then(entry =>{
                        if(entry.metadata.winning_money && entry.metadata.kill){
                            let metadata = entry.metadata
                            let temp_winning_money = metadata.winning_money
                            let temp_kill = metadata.kill
                            metadata.kill = input.kill;
                            metadata.winning_money = input.winning_money
                            metadata.rank = input.rank
                            entry.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    let new_user = entry.user
                                    let metadata = new_user.metadata
                                    metadata.total_kill = parseInt(metadata.total_kill) + parseInt(input.kill) - parseInt(temp_kill)
                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.winning_money) - parseInt(temp_winning_money)
                                    metadata.winning_balance = parseInt(metadata.winning_balance) + parseInt(input.winning_money) - parseInt(temp_winning_money)
                                    if(parseInt(metadata.rank) != 1 && parseInt(input.rank) == 1){
                                        metadata.match_win = parseInt(metadata.match_win) + 1
                                    }
                                    else if(parseInt(metadata.rank) == 1 && parseInt(input.rank) != 1){
                                        metadata.match_win = parseInt(metadata.match_win) - 1
                                    }
                                    new_user.update({metadata:metadata}).then(done =>{
                                        h.render_xhr(req, res, {e:0});
                                    })

                                }
                            })
                        }
                        else{
                            let metadata = entry.metadata
                            metadata.kill = input.kill;
                            metadata.winning_money = input.winning_money
                            metadata.rank = input.rank
                            entry.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    let new_user = entry.user
                                    let metadata = new_user.metadata
                                    metadata.total_kill = parseInt(metadata.total_kill) + parseInt(input.kill)
                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.winning_money)
                                    metadata.winning_balance = parseInt(metadata.winning_balance) + parseInt(input.winning_money)
                                    if(parseInt(input.rank) == 1){
                                        metadata.match_win = parseInt(metadata.match_win) + 1
                                    }
                                    new_user.update({metadata:metadata}).then(done =>{
                                        h.render_xhr(req, res, {e:0});
                                    })

                                }
                            })
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

controller.admin.show_add_money_request = function(req, res){
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
                if(admin && admin.metadata.status == 'active'){
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

controller.admin.show_withdraw_money_request_type = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_withdraw_request = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{metadata:{status:'requested'}},{metadata:{type:'Withdraw Money'}},{metadata:{payment_method:input.payment_method}}]
                        },
                        order:[['createdAt', 'ASC']],
                        include:[{model: connection.db.User}]
                    }).then(add_money =>{
                        add_money.forEach(function(each_add){
                            if(each_add.user && each_add.user.metadata.status == 'active'){
                                let temp_add = {
                                withdraw_money_id:each_add.id,
                                name:each_add.user.metadata.name,
                                user_name: each_add.user.metadata.user_name,
                                amount:each_add.metadata.amount,
                                payment_method:each_add.metadata.payment_method,
                                phone_number:each_add.metadata.phone_number,
                                requested_time: h.moment(new Date(each_add.createdAt)).add(0, 'h').local().format('MMMM Do YYYY, h:mm a')
                                }
                                all_withdraw_request.push(temp_add)
                            
                            }
                        })
                        h.render_xhr(req, res, {e:0, m:all_withdraw_request});
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

controller.admin.show_withdraw_money_request = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_withdraw_request = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{metadata:{status:'requested'}},{metadata:{type:'Withdraw Money'}}]
                        },
                        order:[['createdAt', 'ASC']],
                        include:[{model: connection.db.User}]
                    }).then(add_money =>{
                        add_money.forEach(function(each_add){
                            if(each_add.user && each_add.user.metadata.status == 'active'){
                                let temp_add = {
                                withdraw_money_id:each_add.id,
                                name:each_add.user.metadata.name,
                                user_name: each_add.user.metadata.user_name,
                                amount:each_add.metadata.amount,
                                payment_method:each_add.metadata.payment_method,
                                phone_number:each_add.metadata.phone_number,
                                requested_time: h.moment(new Date(each_add.createdAt)).add(0, 'h').local().format('MMMM Do YYYY, h:mm a')
                                }
                                all_withdraw_request.push(temp_add)
                            
                            }
                        })
                        h.render_xhr(req, res, {e:0, m:all_withdraw_request});
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


controller.admin.add_money_accepted = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            
                let input = qs.parse(body)
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where:{
                        [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                    }
                }).then(admin =>{
                    if(admin && admin.metadata.status == 'active'){
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
                                    console.log(metadata.total_balance + " "+ metadata.deposit_balance)
                                   
                                    new_user.update({metadata:metadata}).then(done =>{
                                        if(done){
                                             console.log(done.metadata.total_balance + " "+ done.metadata.deposit_balance)
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

controller.admin.add_money_rejected = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            
                let input = qs.parse(body)
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where:{
                        [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                    }
                }).then(admin =>{
                    if(admin && admin.metadata.status == 'active'){
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

controller.admin.withdraw_money_accepted = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            
                let input = qs.parse(body)
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where:{
                        [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                    }
                }).then(admin =>{
                    if(admin && admin.metadata.status == 'active'){
                        connection.db.AccountingEntry.findOne({
                            where:{
                                id:input.withdraw_money_id
                            },
                            include:[{model: connection.db.User}]
                        }).then(entry =>{
                            let metadata = entry.metadata
                            metadata.status = 'accepted'
                            metadata.accepted_by = admin.id
                            if(input.tranjection_id){
                                metadata.tranjection_id = input.tranjection_id
                            }
                            entry.update({metadata:metadata, adminId:admin.id}).then(updated =>{
                                if(updated){
                                    let title = 'Withdraw Money'
                                    let body = 'Successfully accepted!'
                                    let topic = `NotificationForWithdrawMoney${entry.id}`
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

controller.admin.withdraw_money_rejected = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            
                let input = qs.parse(body)
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where:{
                        [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                    }
                }).then(admin =>{
                    if(admin && admin.metadata.status == 'active'){
                        connection.db.AccountingEntry.findOne({
                            where:{
                                id:input.withdraw_money_id
                            },
                            include:[{model: connection.db.User}]
                        }).then(entry =>{
                            let metadata = entry.metadata
                            metadata.status = 'rejected'
                            metadata.rejected_by = admin.id
                            entry.update({metadata:metadata, adminId:admin.id}).then(updated =>{
                                if(updated){
                                    let title = 'Withdraw Money'
                                    let body = 'Sorry! rejected.'
                                    let topic = `NotificationForWithdrawMoney${entry.id}`
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

controller.admin.update_rules_according_type = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.Rule.findOne({
                        where: {
                            metadata:{
                                type:input.type
                            }
                        }
                    }).then(rules => {
                        let metadata = rules.metadata
                        metadata.rule = input.rule
                        rules.update({ metadata: metadata }).then(updated => {
                            h.render_xhr(req, res, { e: 0 })
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

controller.admin.update_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Rule.findOne({
                        where:{
                            id:1
                        }
                    }).then(rules =>{
                        let metadata = rules.metadata
                        metadata.rule = input.rule
                        rules.update({metadata:metadata}).then(updated =>{
                            h.render_xhr(req, res, {e:0})
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

controller.admin.update_freefire_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Rule.findOne({
                        where:{
                            id:2
                        }
                    }).then(rules =>{
                        if(rules && rules.metadata){
                            let metadata = rules.metadata
                            metadata.rule = input.rule
                            rules.update({metadata:metadata}).then(updated =>{
                                h.render_xhr(req, res, {e:0})
                            })
                        }
                        else{
                    h.render_xhr(req, res, {e:1, m:'No data found!'})
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

controller.admin.update_ludo_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Rule.findOne({
                        where:{
                            id:3
                        }
                    }).then(rules =>{
                        if(rules && rules.metadata){
                            let metadata = rules.metadata
                            metadata.rule = input.rule
                            rules.update({metadata:metadata}).then(updated =>{
                                h.render_xhr(req, res, {e:0})
                            })
                        }
                        else{
                    h.render_xhr(req, res, {e:1, m:'No data found!'})
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

controller.admin.update_ludo_links = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Rule.findOne({
                        where:{
                            id:4
                        }
                    }).then(rules =>{
                        if(rules && rules.metadata){
                            let metadata = rules.metadata
                            metadata.rule = input.link
                            rules.update({metadata:metadata}).then(updated =>{
                                h.render_xhr(req, res, {e:0})
                            })
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m:'No data found!'})
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

controller.admin.update_ludo_result_done = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                   if(input.match_id){
                       connection.db.LudoMatch.findOne({
                           where:{
                               id:input.match_id
                           }
                       }).then(match =>{
                           if(match){
                               let metadata = match.metadata
                               metadata.result_done = true
                               match.update({metadata:metadata}).then(update =>{
                                   if(update){
                                    h.render_xhr(req, res, {e:0, m:'successfully updated!'})
                                   }
                                   else{
                                    h.render_xhr(req, res, {e:4, m:'update faield!'})
                                   }
                               })
                           }
                           else{
                            h.render_xhr(req, res, {e:3, m:'no match found!'})
                           }
                       })
                   }else{
                    h.render_xhr(req, res, {e:2, m:'input missing!'}) 
                   }
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

controller.admin.get_user = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let user_list = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.User.findOne({
                         where:{
                            [Op.or]:[{metadata:{phone:input.phone_or_username}},{metadata:{user_name:input.phone_or_username}}]
                        }
                    }).then(user =>{
                        if(user){
                            let temp_user ={
                                user_id:user.id,
                                name:user.metadata.name,
                                user_name:user.metadata.user_name,
                                status:user.metadata.status,
                                phone:user.metadata.phone,
                                total_balance: user.metadata.total_balance,
                                deposit_balance: user.metadata.deposit_balance,
                                winning_balance: user.metadata.winning_balance,
                                total_match_play: user.metadata.total_match_play,
                                match_win: user.metadata.match_win,
                                total_refer_income: 0,
                                total_add_money: 0,
                                total_withdraw: 0
                            }
                            connection.db.User.findAll({
                                where:{
                                    [Op.and]:[{metadata:{promo_shared_id:user.id}},{metadata:{promo_status:'inactive'}}]
                                }
                            }).then(find_promo =>{
                                temp_user.total_refer = find_promo.length
                                temp_user.total_refer_income = find_promo.length * 10
                                connection.db.AccountingEntry.findAll({
                                    where:{
                                        [Op.and]:[{userId:user.id},{metadata:{status:'accepted'}}]
                                    }
                                }).then(user_amount =>{
                                    user_amount.forEach(function(each_amount){
                                        if(each_amount.metadata.type == 'Add Money'){
                                            temp_user.total_add_money += parseInt(each_amount.metadata.amount)
                                        }
                                        else{
                                            temp_user.total_withdraw += parseInt(each_amount.metadata.amount)
                                        }
                                    })
                                    h.render_xhr(req, res, {e:0, m:temp_user})
                                })
                                
                            })
                            
                        }
                        else{
                            h.render_xhr(req, res, {e:2, m:'no user found!'})
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

controller.admin.get_all_add_withdraw_list_by_admin = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let list = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{userId:input.user_id},{metadata:{type:input.type}}]
                        },
                        order:[['updatedAt', 'DESC']]
                    }).then(get_entry =>{
                        get_entry.forEach(function(each_entry){
                            let temp ={
                                amount: each_entry.metadata.amount,
                                status: each_entry.metadata.status,
                                payment_method: each_entry.metadata.payment_method,
                                phone: each_entry.metadata.phone_number
                            }
                            list.push(temp)
                        })
                        h.render_xhr(req, res, {e:0, m:list})
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

controller.admin.block_and_unblock_an_user = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.User.findOne({
                        where:{
                            id:input.user_id
                        }
                    }).then(user =>{
                        if(user.metadata.status == 'active'){
                            let metadata = user.metadata
                            metadata.status = 'inactive'
                            user.update({metadata:metadata}).then(done =>{
                                h.render_xhr(req, res, {e:0})
                            })
                        }
                        else if(user.metadata.status == 'inactive'){
                            let metadata = user.metadata
                            metadata.status = 'active'
                            user.update({metadata:metadata}).then(done =>{
                                h.render_xhr(req, res, {e:0})
                            })
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

controller.admin.edit_user_balance = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.User.findOne({
                        where:{
                            id:input.user_id
                        }
                    }).then(user =>{
                        if(user){
                            if(input.total_balance && input.deposit_balance && input.winning_balance){
                                let metadata = user.metadata
                                metadata.total_balance = input.total_balance,
                                metadata.deposit_balance = input.deposit_balance,
                                metadata.winning_balance = input.winning_balance
                                user.update({metadata:metadata}).then(update =>{
                                    if(update){
                                        let temp = {
                                            metadata:{
                                                total_balance: input.total_balance,
                                                deposit_balance: input.deposit_balance,
                                                winning_balance: input.winning_balance
                                            },
                                            userId:user.id,
                                            adminId:admin.id
                                        }
                                        connection.db.AccountUpdateLog.create(temp).then(created =>{
                                            if(created){
                                                h.render_xhr(req, res, {e:0, m:'Succesfully updated!'})
                                            }
                                            else{
                                                h.render_xhr(req, res, {e:5, m:'Something went wrong!'})
                                            }
                                        })
                                        // h.render_xhr(req, res, {e:0, m:'Succesfully updated!'})
                                    }
                                    else{
                                        h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                    }
                                })
                            }
                            else{
                                h.render_xhr(req, res, {e:3, m:'Input missing!'})
                            }
                        }
                        else{
                            h.render_xhr(req, res, {e:2, m:'No user found!'})
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

controller.admin.update_payment_number = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.PaymentNumber.findOne({
                        where:{
                            metadata:{
                                type:input.type
                            }
                        }
                    }).then(payment_number =>{
                        if(payment_number){
                            let metadata = payment_number.metadata
                            if(input.first_number && input.second_number){
                                metadata.first_number = input.first_number
                                metadata.second_number = input.second_number
                                payment_number.update({metadata:metadata}).then(update =>{
                                    if(update){
                                        h.render_xhr(req, res, {e:0})
                                    }
                                })
                            }
                           else{
                                h.render_xhr(req, res, {e:0, m:'Missing input!'})
                           }
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m: 'Invalid type'})
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

controller.admin.update_support_number = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.PaymentNumber.findOne({
                        where:{
                            metadata:{
                                type:input.type
                            }
                        }
                    }).then(payment_number =>{
                        if(payment_number){
                            let metadata = payment_number.metadata
                            if(input.first_number){
                                metadata.first_number = input.first_number
                                payment_number.update({metadata:metadata}).then(update =>{
                                    if(update){
                                        h.render_xhr(req, res, {e:0})
                                    }
                                })
                            }
                           else{
                                h.render_xhr(req, res, {e:0, m:'Missing input!'})
                           }
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m: 'Invalid type'})
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

controller.admin.get_rules = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Rule.findOne({
                        where:{
                            id:1
                        }
                    }).then(rules =>{
                        h.render_xhr(req, res, {e:0, m:rules.metadata});
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

controller.admin.update_room_id_pass = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            if(input.secret_id && input.match_id){
                const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Match.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        if(match){
                            let metadata = match.metadata
                            if(input.room_id && input.room_pass){
                                if(metadata.room_id && metadata.room_pass){
                                    metadata.room_id = input.room_id
                                    metadata.room_pass = input.room_pass
                                    match.update({metadata:metadata}).then(updated =>{
                                        if(updated){
                                            let title = 'Match id and pass'
                                            let body = 'দেওয়া হয়েছে। এখনই সংগ্রহ করে ম্যাচ join করুন।'
                                            let topic = `NotificationForMatch${match.id}`
                                            h.send_notification(title, body, topic)
                                            h.render_xhr(req, res, {e:0})
                                        }
                                        else{
                                            h.render_xhr(req, res, {e:1, m:'Something went wrong!'})
                                        }
                                    })
                                }
                                else{
                                    metadata.room_id = input.room_id
                                    metadata.room_pass = input.room_pass
                                    metadata.room_update_time = new Date()
                                    match.update({metadata:metadata}).then(updated =>{
                                        if(updated){
                                            let title = 'Match id and pass'
                                            let body = 'দেওয়া হয়েছে। এখনই সংগ্রহ করে ম্যাচ join করুন।'
                                            let topic = `NotificationForMatch${match.id}`
                                            h.send_notification(title, body, topic)
                                            h.render_xhr(req, res, {e:0})
                                        }
                                        else{
                                            h.render_xhr(req, res, {e:1, m:'Something went wrong!'})
                                        }
                                    })
                                }
                            }
                            else{
                                h.render_xhr(req, res, {e:1, m:'Input missing!'})
                            }
                        }
                        else{
                            h.render_xhr(req, res, {e:1, m:'MatchId missing!'})
                        }
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
            }
            else{
                h.render_xhr(req, res, {e:0, m:'Data input wrongly!'})
            }
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, {e: 1});
        };
    })
}

controller.admin.send_notification_to_all = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    let topic = 'NotificationForAllPlayers'
                    //let image = 'https://testv2.khelo.live/sliders/13.png' 
                    if(input.title && input.message){
                        h.send_notification(input.title, input.message, topic)
                        h.render_xhr(req, res, {e:0})
                    }
                    else{
                        h.render_xhr(req, res, {e:1, m:'Input missing!'})
                    }
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

controller.admin.get_search_account_activity = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let all_entries = []
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(7, 'day').startOf('day');
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    if(input.phone_number){
                        connection.db.AccountingEntry.findAll({
                            where:{
                                metadata:{
                                    phone_number:input.phone_number
                                },
                                createdAt: {
                                    [Op.between]: [yesterday, today]
                                }
                            },
                            order:[['updatedAt', 'DESC']],
                            include: [{ model: connection.db.User }]
                        }).then(entry =>{
                            entry.map(function(each_entry){
                                let temp_entry = {
                                    user_name: each_entry.user.metadata.user_name,
                                    type: each_entry.metadata.type,
                                    amount: each_entry.metadata.amount,
                                    status:each_entry.metadata.status,
                                    phone_number: each_entry.metadata.phone_number,
                                    payment_method:each_entry.metadata.payment_method,
                                    requested_time: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a')
                                }
                                all_entries.push(temp_entry)
                            })
                            h.render_xhr(req, res, {e:0, m:all_entries})
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:2, m:'Phone number missing!'})
                    }
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

controller.admin.get_sub_admin = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let user_list = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.Admin.findAll({
                        where: {
                            metadata: {
                                position: input.admin_type
                            }
                        }
                    }).then(sub_admin => {
                        sub_admin.forEach(function (user) {
                            let temp_user = {
                                sub_admin_id: user.id,
                                user_name: user.metadata.user_name,
                                status: user.metadata.status,
                            }
                            user_list.push(temp_user)
                        })
                        h.render_xhr(req, res, { e: 0, m: user_list })
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

controller.admin.block_unblock_sub_admin = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let user_list = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Admin.findOne({
                         where:{
                            id:input.sub_admin_id
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
                            h.render_xhr(req, res, {e:2, m:'no user found!'})
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

controller.admin.get_sub_admin_status = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    h.render_xhr(req, res, {e:0, m:admin.metadata.status})
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

//sliders

controller.admin.add_new_slider = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    if(input.title && input.image && input.link){
                        let slider_info = {
                            metadata:{
                                title:input.title,
                                status:'active',
                                link:input.link
                            },
                            adminId:admin.id
                        }
                        connection.db.Slider.create(slider_info).then(created =>{
                            if(created){
                                let metadata = created.metadata
                                metadata.image = created.id+'.png'
                                var img = input.image
                                var data = img.replace(/^data:image\/\w+;base64,/, "");
                                var buf = Buffer.from(data, 'base64');
                                h.s3.putObject({
                                    Bucket: 'sliderss',
                                    Key: `${created.id}.png`,
                                    Body: buf,
                                    ACL: 'public-read',
                                    ContentType: 'image/jpeg'
                                },function (resp) {
                                    if(resp){
                                        console.log("Error uploading image");
                                        console.log(resp);
                                    }
                                    created.update({metadata:metadata}).then(updated =>{
                                        if(updated){
                                            h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                                        }
                                        else{
                                            h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                        }
                                    })
                                });

                                // strip off the data: url prefix to get just the base64-encoded bytes
                                // var data = img.replace(/^data:image\/\w+;base64,/, "");
                                // var buf = Buffer.from(data, 'base64');
                                // fs.writeFile(`./sliders/${created.id}.png`, buf, function(err) {
                                //     if (err){
                                //         h.render_xhr(req, res, {e:3, m:err})
                                //     }
                                //     else{
                                //         created.update({metadata:metadata}).then(updated =>{
                                //             if(updated){
                                //                 h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                                //             }
                                //             else{
                                //                 h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                //             }
                                //         })
                                //     }
                                // });
                            }
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:1, m:'input missing!'})
                    }
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

controller.admin.show_slider_list = function(req, res){
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
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Slider.findAll({
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
                                image_link:'https://sliderss.s3.ap-south-1.amazonaws.com/' + each_slider.metadata.image
                            }
                            slider_list.push(temp_slider)
                        })
                        console.log(slider_list)
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
            h.render_xhr(req, res, {e: 1});
        }
    })
}

controller.admin.active_inactive_slider = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Slider.findOne({
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

//add admin option

controller.admin.add_admin_option = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    if(admin.metadata.position && admin.metadata.position =='super_admin'){
                        let temp = {
                            add_admin : true
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    }
                    else{
                        let temp = {
                            add_admin : false
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    }
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

controller.admin.add_a_admin = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    h.hash(input.password).then(hash =>{
                        connection.db.Admin.findAll({

                        }).then(all_admin=>{
                            let temp ={
                                id:all_admin.length+1,
                                metadata:{
                                    position:input.type,
                                    status:'active',
                                    user_name: input.user_name,
                                    password:hash
                                }
                            }
                            connection.db.Admin.create(temp)
                            .then(created =>{
                                if(created){
                                    h.render_xhr(req, res, {e:0, m:'Succesfully created!'})
                                }
                                else{
                                    h.render_xhr(req, res, {e:1, m:'something went wrong!'})
                                }
                            })
                            .catch(err =>{
                                console.log(err)
                                h.render_xhr(req, res, {e:1, m:'something went wrong!'})
                            })
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

//popup

controller.admin.update_popup_status = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.PopupStatus.findOne({
                        where:{
                            id:1
                        }
                    }).then(status =>{
                        if(status.metadata.status == true){
                            let metadata = status.metadata
                            metadata.status = false
                            status.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    let temp ={
                                        popup_status: status.metadata.status
                                    }
                                    h.render_xhr(req, res, {e:0, m:temp})
                                }
                            })
                        }
                        else if(status.metadata.status == false){
                            let metadata = status.metadata
                            metadata.status = true
                            status.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    let temp ={
                                        popup_status: status.metadata.status
                                    }
                                    h.render_xhr(req, res, {e:0, m:temp})
                                }
                            })
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

controller.admin.get_popup_status = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.PopupStatus.findOne({
                        where:{
                            id:1
                        }
                    }).then(status =>{
                        let temp ={
                            popup_status: status.metadata.status
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                        
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

controller.admin.add_new_pop_up = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    if(input.type == 'image'){
                        let popup_info = {
                            metadata:{
                                type: input.type,
                                text:'',
                                link:input.link
                            },
                            adminId:admin.id
                        }
                        connection.db.PopUp.create(popup_info).then(created =>{
                            if(created){
                                let metadata = created.metadata
                                metadata.image = created.id+'.jpg'
                                var img = input.image
                                var data = img.replace(/^data:image\/\w+;base64,/, "");
                                var buf = Buffer.from(data, 'base64');
                                // strip off the data: url prefix to get just the base64-encoded bytes
                                h.s3.putObject({
                                    Bucket: 'popupss',
                                    Key: `${created.id}.jpg`,
                                    Body: buf,
                                    ACL: 'public-read',
                                    ContentType: 'image/jpeg'
                                },function (resp) {
                                    if(resp){
                                        console.log("Error uploading image");
                                        console.log(resp);
                                    }
                                    match.update({metadata:metadata}).then(updated =>{
                                        if(updated){
                                            h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                                        }
                                        else{
                                            h.render_xhr(req, res, {e:4, m:'Something went wrong!'})
                                        }
                                    })
                                });
                            }
                        })
                    }
                    else if(input.type == 'text'){
                        let popup_info = {
                            metadata:{
                                type: input.type,
                                text:input.text,
                                link:'',
                                image:''
                            },
                            adminId:admin.id
                        }
                        connection.db.PopUp.create(popup_info).then(created =>{
                            if(created){
                                h.render_xhr(req, res, {e:0, m:'Successfully added!'})
                            }
                        })
                    }
                    else{
                        h.render_xhr(req, res, {e:5, m:'No type found!'})
                    }
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


controller.admin.get_withdraw_history = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            // let start = h.moment().subtract(720, 'h').startOf('day');
            // let end = h.moment().add(0, 'h').endOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   connection.db.User.findOne({
                       where:{
                           metadata:{
                               user_name:input.user_name
                           }
                       }
                   }).then(user =>{
                       if(user){
                           connection.db.AccountingEntry.findAll({
                               where:{
                                [Op.and]: [{ userId:user.id }, { metadata: { type: 'Withdraw Money' } }],
                                // createdAt: {
                                //     [Op.between]: [start, end]
                                // }
                               }
                           }).then(entry =>{
                               entry.forEach(function(each_entry){
                                   let new_entry = {
                                       type: each_entry.metadata.type,
                                       amount:each_entry.metadata.amount,
                                       status: each_entry.metadata.status,
                                       phone_no: each_entry.metadata.phone_number,
                                       payment_method:each_entry.metadata.payment_method,
                                       requested_time: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY')
                                   }
                                   all_entry.push(new_entry)
                               })
                               h.render_xhr(req, res, {e:0, m:all_entry})
                           })
                       }
                       else{
                        h.render_xhr(req, res, { e: 2 })
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

controller.admin.create_notice = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   if(input.title){
                       let new_notice = {
                           metadata:{
                               title:input.title
                           },
                           adminId:admin.id
                       }
                       connection.db.Notice.create(new_notice).then(created =>{
                           if(created){
                               h.render_xhr(req, res, {e:0, m:'Successfully created!'})
                           }
                       })
                   }
                   else {
                        h.render_xhr(req, res, { e: 2, m: 'Input missing!' })
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

controller.admin.update_all_support_number = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.SupportNumber.findOne({
                        where: {
                            metadata: {
                                type: input.type
                            }
                        }
                    }).then(suppport_number => {
                        if (suppport_number) {
                            let metadata = suppport_number.metadata
                            if (input.number) {
                                metadata.number = input.number
                                suppport_number.update({ metadata: metadata }).then(update => {
                                    if (update) {
                                        h.render_xhr(req, res, { e: 0 })
                                    }
                                })
                            }
                            else {
                                h.render_xhr(req, res, { e: 0, m: 'Missing input!' })
                            }
                        }
                        else {
                            h.render_xhr(req, res, { e: 1, m: 'Invalid type' })
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


controller.admin.add_a_message = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatch.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(ludo_match =>{
                        if(ludo_match){
                            if(input.message){
                                let metadata = ludo_match.metadata
                                metadata.message = input.message
                                ludo_match.update({metadata:metadata}).then(updated =>{
                                    if(updated){
                                        let title = 'Khelo Warning Notice'
                                        let body = input.message
                                        let topic = `NotificationForLudoMessage${ludo_match.id}`
                                        h.send_notification(title, body, topic)
                                        h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                    }
                                    else {
                                        h.render_xhr(req, res, { e: 4, m: 'Update faield!' })
                                    }
                                })
                            }
                            else {
                                h.render_xhr(req, res, { e: 3, m: 'Input missing!' })
                            }
                        }
                        else {
                            h.render_xhr(req, res, { e: 2, m: 'No match found!' })
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

controller.admin.join_player_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.MatchEntry.findAll({
                        where:{
                            matchId:input.match_id
                        },
                        include: [{ model: connection.db.User }]
                    }).then(match_entry =>{
                        match_entry.forEach(function(each_entry){
                            if(!each_entry.metadata.refunded || !each_entry.metadata.refund_amount){
                               let temp_entry ={
                                    user_id:each_entry.user.id,
                                    user_name:each_entry.user.metadata.user_name
                                }
                                if(each_entry.metadata.hasFirstPlayer){
                                    temp_entry.hasFirstPlayer = each_entry.metadata.hasFirstPlayer
                                    temp_entry.first_player = each_entry.metadata.first_player
                                }
                                if(each_entry.metadata.hasSecondPlayer){
                                    temp_entry.hasSecondPlayer = each_entry.metadata.hasSecondPlayer
                                    temp_entry.second_player = each_entry.metadata.second_player
                                }
                                if(each_entry.metadata.hasThirdPlayer){
                                    temp_entry.hasThirdPlayer = each_entry.metadata.hasThirdPlayer
                                    temp_entry.third_player = each_entry.metadata.third_player
                                }
                                if(each_entry.metadata.hasForthPlayer){
                                    temp_entry.hasForthPlayer = each_entry.metadata.hasForthPlayer
                                    temp_entry.forth_player = each_entry.metadata.forth_player
                                }
                               if(each_entry.metadata.hasFifthPlayer){
                                    temp_entry.hasFifthPlayer = each_entry.metadata.hasFifthPlayer
                                    temp_entry.fifth_player = each_entry.metadata.fifth_player
                                }
                                if(each_entry.metadata.hasSixthPlayer){
                                    temp_entry.hasSixthPlayer = each_entry.metadata.hasSixthPlayer
                                    temp_entry.sixth_player = each_entry.metadata.sixth_player
                                }
                                all_entry.push(temp_entry)
                            }
                        })
                        h.render_xhr(req, res, {e:0, m:all_entry})
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

controller.admin.remove_user_from_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let total_player = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.MatchEntry.findOne({
                        where: {
                            [Op.and]: [{ matchId: input.match_id }, { userId: input.user_id }]
                        }
                    }).then(match_entry => {
                        connection.db.MatchEntryHistory.findOne({
                            where: {
                                [Op.and]: [{ matchId: input.match_id }, { team_no: String(match_entry.metadata.team_no) }]
                            },
                            include: [{ model: connection.db.Match }]
                        }).then(history => {
                            let metadata = history.metadata
                            if (match_entry.metadata.hasFirstPlayer) {
                                metadata.hasFirstPlayer = false,
                                    metadata.first_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasSecondPlayer) {
                                metadata.hasSecondPlayer = false
                                metadata.second_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasThirdPlayer) {
                                metadata.hasThirdPlayer = false
                                metadata.third_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasForthPlayer) {
                                metadata.hasForthPlayer = false
                                metadata.forth_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasFifthPlayer) {
                                metadata.hasFifthPlayer = false
                                metadata.fifth_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasSixthPlayer) {
                                metadata.hasSixthPlayer = false
                                metadata.sixth_player = ''
                                total_player += 1
                            }
                            history.update({ metadata: metadata }).then(history_update => {
                                if (history_update) {
                                    let get_match = history.match
                                    let metadata = get_match.metadata
                                    console.log(metadata.total_joined)
                                    metadata.total_joined = metadata.total_joined - total_player
                                    console.log(metadata.total_joined)
                                    get_match.update({ metadata: metadata }).then(match_updated => {
                                        if (match_updated) {
                                            console.log(match_updated.metadata.total_joined)
                                            match_entry.destroy().then(deleted => {
                                                if (deleted) {
                                                    console.log("deleted done")
                                                    console.log(deleted.id)
                                                    h.render_xhr(req, res, { e: 0, m: 'Successfully removed' })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
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

controller.admin.refound_before_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let total_player = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.MatchEntry.findOne({
                        where: {
                            [Op.and]: [{ matchId: input.match_id }, { userId: input.user_id }, {metadata:{refund_amount:null}}]
                        },
                        include: [{ model: connection.db.User }]
                    }).then(match_entry => {
                        connection.db.MatchEntryHistory.findOne({
                            where: {
                                [Op.and]: [{ matchId: input.match_id }, { team_no: String(match_entry.metadata.team_no) }]
                            },
                            include: [{ model: connection.db.Match }]
                        }).then(history => {
                            let metadata = history.metadata
                            if (match_entry.metadata.hasFirstPlayer) {
                                metadata.hasFirstPlayer = false,
                                    metadata.first_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasSecondPlayer) {
                                metadata.hasSecondPlayer = false
                                metadata.second_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasThirdPlayer) {
                                metadata.hasThirdPlayer = false
                                metadata.third_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasForthPlayer) {
                                metadata.hasForthPlayer = false
                                metadata.forth_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasFifthPlayer) {
                                metadata.hasFifthPlayer = false
                                metadata.fifth_player = ''
                                total_player += 1
                            }
                            if (match_entry.metadata.hasSixthPlayer) {
                                metadata.hasSixthPlayer = false
                                metadata.sixth_player = ''
                                total_player += 1
                            }
                            if(match_entry.metadata.extraPlayerOne){
                                metadata.hasExtraPlayerOne = false
                                metadata.extraPlayerOne = ''
                            }
                            if(match_entry.metadata.extraPlayerTwo){
                                metadata.hasExtraPlayerTwo = false
                                metadata.extraPlayerTwo = ''
                            }
                            history.update({ metadata: metadata }).then(history_update => {
                                if (history_update) {
                                    let get_match = history.match
                                    let metadata = get_match.metadata
                                    metadata.total_joined = metadata.total_joined - total_player
                                    get_match.update({ metadata: metadata }).then(match_updated => {
                                        if (match_updated) {
                                            let metadata = match_entry.metadata
                                            metadata.refund_amount = input.refund_amount
                                            metadata.refunded = true
                                            match_entry.update({ metadata: metadata }).then(update => {
                                                if (update) {
                                                    let new_user = match_entry.user
                                                    let metadata = new_user.metadata
                                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.refund_amount)
                                                    metadata.deposit_balance = parseInt(metadata.deposit_balance) + parseInt(input.refund_amount)
                                                    new_user.update({ metadata: metadata }).then(user_updated => {
                                                        if (user_updated) {
                                                            let title = 'Refund'
                                                            let body = 'দেওয়া হয়েছে।'
                                                            let topic = `NotificationForRefund${user_updated.id}`
                                                            h.send_notification(title, body, topic)
                                                            h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
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

controller.admin.show_all_account_activity = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            let accounting_list = []
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(2, 'day').startOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.AccountingEntry.findAll({
                        where: {
                            [Op.and]: [{ metadata: { type: input.type } }, { metadata: { status: input.status } }],
                            createdAt: {
                                [Op.between]: [yesterday, today]
                            }
                        },
                        include: [{ model: connection.db.User }],
                        order: [['createdAt', 'DESC']],
                    }).then(entry => {
                        entry.forEach(function (each_entry) {
                            let temp_entry = {
                                user_name: each_entry.user.metadata.user_name,
                                phone: each_entry.metadata.phone_number,
                                payment_method: each_entry.metadata.payment_method,
                                amount: each_entry.metadata.amount,
                                requested_date: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY')
                            }
                            accounting_list.push(temp_entry)
                        })
                        h.render_xhr(req, res, { e: 0, m: accounting_list })
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

controller.admin.add_new_link = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   let temp_link ={
                       metadata:{
                           type:input.type,
                           link:input.link
                       },
                       adminId:admin.id
                   }
                   connection.db.Link.create(temp_link)
                   .catch(err =>{
                       console.log(err)
                   })
                   .then(created =>{
                       if(created){
                           h.render_xhr(req, res, {e:0, m:'Successfully created!'})
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

controller.admin.send_iamge_notification_to_all = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    var img = input.image
                    var data = img.replace(/^data:image\/\w+;base64,/, "");
                    var buf = Buffer.from(data, 'base64');
                    h.s3.putObject({
                        Bucket: 'notificationss',
                        Key: `notification.jpg`,
                        Body: buf,
                        ACL: 'public-read',
                        ContentType: 'image/jpeg'
                    },function (resp) {
                        if(resp){
                            console.log("Error uploading image");
                            console.log(resp);
                        }
                        else{
                            if (input.title && input.message) {
                                h.send_image_notification(input.title, input.message, topic, image_link)
                                h.render_xhr(req, res, { e: 0 })
                            }
                            else {
                                h.render_xhr(req, res, { e: 1, m: 'Input missing!' })
                            }
                        }
                    });
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        };
    })
}

controller.admin.notification_for_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            if (input.secret_id && input.match_id) {
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where: {
                        [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                    }
                }).then(admin => {
                    if (admin && admin.metadata.status == 'active') {
                        connection.db.Match.findOne({
                            where: {
                                id: input.match_id
                            }
                        }).then(match => {
                            if (match) {
                                let title = `${match.metadata.title}`
                                let body = 'প্রিয় গ্রাহক আপনার পরবর্তী ম্যাচ কিছুক্ষন পরে শুরু হবে তাড়াতাড়ি Room Id নিয়ে ম্যাচে জয়েন করুন'
                                let topic = `NotificationForMatch${match.id}`
                                h.send_notification(title, body, topic)
                                h.render_xhr(req, res, { e: 0 })
                            }
                            else {
                                h.render_xhr(req, res, { e: 1, m: 'MatchId missing!' })
                            }
                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                    }
                })
            }
            else {
                h.render_xhr(req, res, { e: 0, m: 'Data input wrongly!' })
            }
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        };
    })
}

controller.admin.notification_for_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            if (input.secret_id && input.match_id) {
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where: {
                        [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                    }
                }).then(admin => {
                    if (admin && admin.metadata.status == 'active') {
                        connection.db.LudoMatch.findOne({
                            where: {
                                id: input.match_id
                            }
                        }).then(match => {
                            if (match) {
                                let title = `${match.metadata.title}`
                                let body = 'প্রিয় গ্রাহক আপনার পরবর্তী ম্যাচ কিছুক্ষন পরে শুরু হবে তাড়াতাড়ি Room Id নিয়ে ম্যাচে জয়েন করুন'
                                let topic = `NotificationForMatch${match.id}`
                                h.send_notification(title, body, topic)
                                h.render_xhr(req, res, { e: 0 })
                            }
                            else {
                                h.render_xhr(req, res, { e: 1, m: 'MatchId missing!' })
                            }
                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                    }
                })
            }
            else {
                h.render_xhr(req, res, { e: 0, m: 'Data input wrongly!' })
            }
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        };
    })
}

controller.admin.ludo_join_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry =[]
            let team = 1
            connection.db.Admin.findOne({  
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            ludoMatchId:input.match_id
                        },
                        include: [{ model: connection.db.User }]
                    }).then(ludo_entry =>{
                        ludo_entry.forEach(function(each_entry){
                            if(!(each_entry.metadata.refund_amount)){
                                let tem = {
                                    user_id: each_entry.userId,
                                    team:team,
                                    user_name: each_entry.user.metadata.user_name,
                                    player_name: each_entry.metadata.player_name
                                }
                                
                                if(each_entry.metadata.isReady){
                                    tem.isReady = true
                                }
                                all_entry.push(tem)
                                team+=1
                            }
                        })
                        h.render_xhr(req, res, { e: 0, m: all_entry })
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
        };
    })
}

controller.admin.remove_user_from_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findOne({
                        where: {
                            [Op.and]: [{ ludoMatchId: input.match_id }, { userId: input.user_id }]
                        },
                        include: [{ model: connection.db.LudoMatch }]
                    }).then(match_entry => {
                        let match = match_entry.ludo_match
                        let metadata = match.metadata
                        metadata.total_joined -=1
                        match.update({metadata:metadata}).then(updated =>{
                            if(updated){
                                match_entry.destroy().then(deleted =>{
                                    if(deleted){
                                        h.render_xhr(req, res, { e: 0, m: 'Successfully deletd!' })    
                                    }
                                })
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

controller.admin.refund_user_from_ludo_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findOne({
                        where: {
                            [Op.and]: [{ ludoMatchId: input.match_id }, { userId: input.user_id }]
                        },
                        include: [{ model: connection.db.LudoMatch }, { model: connection.db.User }]
                    }).then(match_entry => {
                        let match = match_entry.ludo_match
                        let metadata = match.metadata
                        metadata.total_joined -=1
                        match.update({metadata:metadata}).then(updated =>{
                            if(updated){
                                let metadata = match_entry.metadata
                                metadata.refund_amount = input.refund_amount
                                metadata.refunded = true
                                match_entry.update({metadata:metadata}).then(update_done =>{
                                    if(update_done){
                                        let user = match_entry.user
                                        let metadata = user.metadata
                                        metadata.total_balance = metadata.total_balance + parseInt(input.refund_amount)
                                        metadata.deposit_balance = metadata.deposit_balance + parseInt(input.refund_amount)
                                        user.update({metadata:metadata}).then(done =>{
                                            if(done){
                                                h.render_xhr(req, res, { e: 0, m: 'Successfully refunded!' })
                                            }
                                        })
                                    }
                                })
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

controller.admin.get_add_money_history = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_entry = []
            // let start = h.moment().subtract(720, 'h').startOf('day');
            // let end = h.moment().add(0, 'h').endOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.User.findOne({
                        where: {
                            metadata: {
                                user_name: input.user_name
                            }
                        }
                    }).then(user => {
                        if (user) {
                            connection.db.AccountingEntry.findAll({
                                where: {
                                    [Op.and]: [{ userId: user.id }, { metadata: { type: 'Add Money' } }],
                                    // createdAt: {
                                    //     [Op.between]: [start, end]
                                    // }
                                }
                            }).then(entry => {
                                entry.forEach(function (each_entry) {
                                    let new_entry = {
                                        type: each_entry.metadata.type,
                                        amount: each_entry.metadata.amount,
                                        status: each_entry.metadata.status,
                                        phone_no: each_entry.metadata.phone_number,
                                        payment_method: each_entry.metadata.payment_method,
                                        requested_time: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY')
                                    }
                                    all_entry.push(new_entry)
                                })
                                h.render_xhr(req, res, { e: 0, m: all_entry })
                            })
                        }
                        else {
                            h.render_xhr(req, res, { e: 2, m: 'No user found!' })
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

controller.admin.update_a_note_for_admin_free_fire = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.Match.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        if(match){
                            let metadata = match.metadata
                            metadata.admin_note = input.note,
                            metadata.admin_note_updated_by = admin.id
                            match.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    h.render_xhr(req, res, { e: 0, m: 'Successfully Updated!' })
                                }
                            })
                        }
                        else{
                            h.render_xhr(req, res, { e: 2, m: 'Match not found!' })
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

controller.admin.update_a_note_for_admin_ludo = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatch.findOne({
                        where:{
                            id:input.match_id
                        }
                    }).then(match =>{
                        if(match){
                            let metadata = match.metadata
                            metadata.admin_note = input.note,
                            metadata.admin_note_updated_by = admin.id
                            match.update({metadata:metadata}).then(updated =>{
                                if(updated){
                                    h.render_xhr(req, res, { e: 0, m: 'Successfully Updated!' })
                                }
                            })
                        }
                        else{
                            h.render_xhr(req, res, { e: 2, m: 'Match not found!' })
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

controller.admin.update_tournament_rules = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.Rule.findOne({
                        where: {
                            id: 5
                        }
                    }).then(rules => {
                        if (rules && rules.metadata) {
                            let metadata = rules.metadata
                            metadata.rule = input.rule
                            rules.update({ metadata: metadata }).then(updated => {
                                h.render_xhr(req, res, { e: 0 })
                            })
                        }
                        else {
                            h.render_xhr(req, res, { e: 1, m: 'No data found!' })
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

controller.admin.show_ludo_image = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let image_links = []
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   connection.db.LudoMatchEntry.findAll({
                       where:{
                           ludoMatchId:input.match_id
                       }
                   }).then(entry =>{
                       entry.forEach(function(each_entry){
                           if(each_entry.metadata.image){
                               let temp = {
                                   image_link:'https://uploadssssss.s3.ap-south-1.amazonaws.com/' + each_entry.metadata.image,
                                   uploaded_by : each_entry.metadata.image_uploaded_by
                               }
                               image_links.push(temp)
                           }
                       })
                       h.render_xhr(req, res, {e: 0, m: image_links})
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

controller.admin.get_datewise_ludo_statastic = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            // let today = h.moment().add(0, 'h').endOf('day');
            // let yesterday = h.moment().subtract(0, 'day').startOf('day');
            let ludo_list = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findAll({
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }, { model: connection.db.LudoMatch }]
                    }).then(entries =>{
                        entries.forEach(function(each_entry){
                            if(input.user_name == each_entry.user.metadata.user_name && input.date == each_entry.ludo_match.metadata.date){
                                let temp = {
                                    user_id:each_entry.userId,
                                    match_id: each_entry.ludoMatchId,
                                    match_title: each_entry.ludo_match.metadata.title,
                                    paid: each_entry.metadata.paid
                                }
                                if(each_entry.metadata.refund_amount){
                                    temp.refund_amount = each_entry.metadata.refund_amount
                                }
                                else{
                                    temp.refund_amount = each_entry.metadata.refund_amount
                                }

                                if(each_entry.metadata.winning_money){
                                    temp.winning_money = each_entry.metadata.winning_money
                                }
                                else{
                                    temp.winning_money = each_entry.metadata.winning_money
                                }
                                ludo_list.push(temp)
                            }
                        })
                        h.render_xhr(req, res, {e:0, m:ludo_list})
                    })
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Aithenticate failed !' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.admin.get_datewise_ludo_statastic = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            // let today = h.moment().add(0, 'h').endOf('day');
            // let yesterday = h.moment().subtract(0, 'day').startOf('day');
            let ludo_list = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findAll({
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }, { model: connection.db.LudoMatch }]
                    }).then(entries =>{
                        entries.forEach(function(each_entry){
                            if(each_entry.user && each_entry.ludo_match){
                                if(input.user_name == each_entry.user.metadata.user_name && input.date == each_entry.ludo_match.metadata.date){
                                let temp = {
                                    user_id:each_entry.userId,
                                    match_id: each_entry.ludoMatchId,
                                    match_title: each_entry.ludo_match.metadata.title,
                                    paid: each_entry.metadata.paid
                                }
                                if(each_entry.metadata.refund_amount){
                                    temp.refund_amount = each_entry.metadata.refund_amount
                                }
                                else{
                                    temp.refund_amount = each_entry.metadata.refund_amount
                                }

                                if(each_entry.metadata.winning_money){
                                    temp.winning_money = each_entry.metadata.winning_money
                                }
                                else{
                                    temp.winning_money = each_entry.metadata.winning_money
                                }
                                ludo_list.push(temp)
                            }
                            }
                        })
                        h.render_xhr(req, res, {e:0, m:ludo_list})
                    })
                }
                else {
                    h.render_xhr(req, res, { e: 1, m: 'Aithenticate failed !' })
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}


controller.admin.send_message_to_client = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    let temp ={
                        metadata:{
                            message:input.message
                        },
                        userId:input.user_id,
                        adminId:admin.id
                    }
                   connection.db.Message.create(temp).then(created =>{
                       if(created){
                        let title = 'Khelo'
                        let body = input.message
                        let topic = `NotificationForMessage${input.user_id}`
                        h.send_notification(title, body, topic)
                        h.render_xhr(req, res, {e:0})  
                       }
                       else{
                        h.render_xhr(req, res, { e: 2, m: 'Something went wrong!' })
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


controller.admin.get_todays_withdaw_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let withdraw_done_list = []
            let total_withdraw_amount = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{adminId:admin.id},{metadata:{type:'Withdraw Money'}}, {metadata:{status:'accepted'}}, {metadata:{payment_method:input.method}}]
                            ,updatedAt: {
                                [Op.between]: [yesterday, today]
                            }
                        },
                        order:[['updatedAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            total_withdraw_amount += parseInt(each_entry.metadata.amount)
                            let temp_info = {
                                amount:parseInt(each_entry.metadata.amount),
                                cash_out_time: h.moment(new Date(each_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a'),
                                 requested_number: each_entry.metadata.phone_number
                            }
                            withdraw_done_list.push(temp_info)
                        })
                        h.render_xhr(req, res, {e:0, m:total_withdraw_amount, withdraw_done_list})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Aithenticate failed !'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.admin.check_subadmin_todays_withdaw_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let withdraw_done_list = []
            let total_withdraw_amount = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{adminId:input.sub_admin_id},{metadata:{type:'Withdraw Money'}}, {metadata:{status:'accepted'}}, {metadata:{payment_method:'Bkash'}}]
                            ,updatedAt: {
                                [Op.between]: [yesterday, today]
                            }
                        },
                        order:[['updatedAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            total_withdraw_amount += parseInt(each_entry.metadata.amount)
                            let temp_info = {
                                amount:parseInt(each_entry.metadata.amount),
                                cash_out_time: h.moment(new Date(each_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a')
                            }
                            withdraw_done_list.push(temp_info)
                        })
                        h.render_xhr(req, res, {e:0, m:total_withdraw_amount, withdraw_done_list})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Aithenticate failed !'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.admin.get_sub_admin_withdraw_history = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_history = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   connection.db.AccountingEntry.findAll({
                       where:{
                           metadata:{
                               phone_number:input.phone_number,
                               payment_method:'Bkash',
                               status:'accepted'
                           }
                       },
                       include: [{ model: connection.db.Admin }, { model: connection.db.User}]
                   }).then(entry =>{
                       entry.forEach(function(each_entry){
                           let temp = {
                               accept_amount: each_entry.metadata.amount,
                               requested_by: each_entry.user.metadata.user_name,
                               requested_time: h.moment(new Date(each_entry.createdAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a'),
                               accepted_by: each_entry.admin.metadata.user_name,
                               accepted_time: h.moment(new Date(each_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a'),
                               requested_number: each_entry.metadata.phone_number
                           }
                           if(each_entry.metadata.tranjection_id){
                               temp.tranjection_id = each_entry.metadata.tranjection_id
                           }
                           else{
                            temp.tranjection_id = 'No Tranjection ID'
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
            h.render_xhr(req, res, { e: 1 });
        }
    })
}


controller.admin.get_datewise_withdraw_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            // let today = h.moment().add(0, 'h').endOf('day');
            // let yesterday = h.moment().subtract(0, 'day').startOf('day');
            let withdraw_done_list = []
            let total_withdraw_amount = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{adminId:input.sub_admin_id},{metadata:{type:'Withdraw Money'}}, {metadata:{status:'accepted'}}, {metadata:{payment_method:input.method}}, h.Sequelize.where(h.Sequelize.fn('date', h.Sequelize.col('updatedAt')), '=', input.date)]
                            // ,updatedAt: {
                            //     [Op.]: [yesterday, today]
                            // }
                            
                        },
                        order:[['updatedAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            total_withdraw_amount += parseInt(each_entry.metadata.amount)
                            let temp_info = {
                                amount:parseInt(each_entry.metadata.amount),
                                phone_number: each_entry.metadata.phone_number,
                                time: h.moment(new Date(each_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a')
                            }
                            if(each_entry.metadata.tranjection_id){
                                temp_info.tranjection_id = each_entry.metadata.tranjection_id
                            }
                            else{
                                temp_info.tranjection_id = 'Tranjection ID not found!'
                            }
                            withdraw_done_list.push(temp_info)
                        })
                        h.render_xhr(req, res, {e:0, m:total_withdraw_amount, withdraw_done_list})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Aithenticate failed !'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.admin.get_datewise_add_money_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            // let today = h.moment().add(0, 'h').endOf('day');
            // let yesterday = h.moment().subtract(0, 'day').startOf('day');
            let withdraw_done_list = []
            let total_add_amount = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{adminId:input.sub_admin_id},{metadata:{type:'Add Money'}}, {metadata:{status:'accepted'}}, {metadata:{payment_method:input.method}}, h.Sequelize.where(h.Sequelize.fn('date', h.Sequelize.col('updatedAt')), '=', input.date)]
                            // ,updatedAt: {
                            //     [Op.]: [yesterday, today]
                            // }
                            
                        },
                        order:[['updatedAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            total_add_amount += parseInt(each_entry.metadata.amount)
                            let temp_info = {
                                amount:parseInt(each_entry.metadata.amount),
                                phone_number: each_entry.metadata.phone_number,
                                time: h.moment(new Date(each_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a')
                            }
                            if(each_entry.metadata.tranjection_id){
                                temp_info.tranjection_id = each_entry.metadata.tranjection_id
                            }
                            else{
                                temp_info.tranjection_id = '-'
                            }
                            withdraw_done_list.push(temp_info)
                        })
                        h.render_xhr(req, res, {e:0, m:total_add_amount, withdraw_done_list})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Aithenticate failed !'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

controller.admin.add_a_promoter = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    h.hash(input.password).then(hash =>{
                        let temp ={
                            metadata:{
                                name:input.name,
                                status:'active',
                                user_name: input.user_name,
                                password:hash,
                                phone:input.phone,
                            }
                        }
                        connection.db.Promoter.create(temp)
                        .then(created =>{
                            if(created){
                                h.render_xhr(req, res, {e:0, m:'Succesfully created!'})
                            }
                            else{
                                h.render_xhr(req, res, {e:1, m:'something went wrong!'})
                            }
                        })
                        .catch(err =>{
                            console.log(err)
                            h.render_xhr(req, res, {e:1, m:'something went wrong!'})
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

controller.admin.get_promoter_list = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let promoter_list = []
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Promoter.findAll({

                    }).then(promoter =>{
                        promoter.forEach(function(each_promoter){
                            let temp ={
                                promoter_id: each_promoter.id,
                                user_name: each_promoter.metadata.user_name,
                                name: each_promoter.metadata.name,
                                phone: each_promoter.metadata.phone,
                                status: each_promoter.metadata.status
                            }
                            promoter_list.push(temp)
                        })
                        h.render_xhr(req, res, {e:0, m:promoter_list})
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

controller.admin.update_promoter_info = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Promoter.findOne({
                        where:{
                            id: input.promoter_id
                        }
                    }).then(promoter =>{
                        if(promoter){
                            let metadata = promoter.metadata
                            metadata.user_name = input.user_name
                            metadata.name = input.name
                            metadata.phone = input.phone

                            if(input.hasPassword == 'true'){
                                h.hash(input.password).then(hash =>{
                                    metadata.password = hash
                                    promoter.update({metadata:metadata}).then(updated =>{
                                        if(updated){
                                            h.render_xhr(req, res, {e:0, m:'Successfully updated'})
                                        }
                                    })
                                })
                            }
                            else{
                                promoter.update({metadata:metadata}).then(updated =>{
                                    if(updated){
                                        h.render_xhr(req, res, {e:0, m:'Successfully updated'})
                                    }
                                })
                            }
                        }
                        else{
                            h.render_xhr(req, res, {e:2, m:'No promoter found!'})
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

controller.admin.get_account_statastic_freefire = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)
            let tota_earn_amount = 0
            let total_winning_amount = 0
            let total_refund_amount = 0

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.MatchEntry.findAll({
                        where:h.Sequelize.where(h.Sequelize.fn('date', h.Sequelize.col('match_entry.createdAt')), '=', input.date),
                        order:[['createdAt', 'DESC']],
                        include:[
                            {
                                model: connection.db.Match
                                ,where:{
                                    gameId:parseInt(input.game_id)
                                }
                            }
                        ]
                    }).then(entry =>{
                        entry.forEach(function(new_entry){
                            if(new_entry.metadata.paid){
                                tota_earn_amount+=parseInt(new_entry.metadata.paid)
                            }
                            if(new_entry.metadata.winning_money){
                                total_winning_amount+=parseInt(new_entry.metadata.winning_money)
                            }
                            if(new_entry.metadata.refund_amount){
                                total_refund_amount+=parseInt(new_entry.metadata.refund_amount)
                            }
                            //record.push(h.moment(new Date(new_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a'))
                            
                        })
                        let net_income = tota_earn_amount - (total_winning_amount + total_refund_amount)
                        h.render_xhr(req, res, {e:0, m:tota_earn_amount, total_winning_amount, total_refund_amount, net_income})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.get_account_statastic_ludo = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)
            let tota_earn_amount = 0
            let total_winning_amount = 0
            let total_refund_amount = 0

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatchEntry.findAll({
                        where:h.Sequelize.where(h.Sequelize.fn('date', h.Sequelize.col('ludo_match_entry.updatedAt')), '=', input.date),
                        order:[['createdAt', 'DESC']],
                        include:[
                            {
                                model: connection.db.LudoMatch
                                ,where:{
                                    gameId:parseInt(input.game_id)
                                }
                            }
                        ]
                    }).then(entry =>{
                        entry.forEach(function(new_entry){
                            if(new_entry.metadata.paid){
                                tota_earn_amount+=parseInt(new_entry.metadata.paid)
                            }
                            if(new_entry.metadata.winning_money){
                                total_winning_amount+=parseInt(new_entry.metadata.winning_money)
                            }
                            if(new_entry.metadata.refund_amount){
                                total_refund_amount+=parseInt(new_entry.metadata.refund_amount)
                            }
                            //record.push(h.moment(new Date(new_entry.updatedAt)).add(0, 'h').local().format('MMMM Do, YYYY, h:mm a'))
                            
                        })
                        let net_income = tota_earn_amount - (total_winning_amount + total_refund_amount)
                        h.render_xhr(req, res, {e:0, m:tota_earn_amount, total_winning_amount, total_refund_amount, net_income})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.player_account_avobe_five_hundrad = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let input = qs.parse(body)
            let list = []
            const Op = h.Sequelize.Op
            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    let count = 0
                    connection.db.User.findAll({
                        where:{
                            metadata:{
                                total_balance:{
                                    [Op.gte]:parseInt(input.amount)
                                },
                                status:'active'
                            }
                            
                            // metadata:{
                            //     'promo_shared_id':145294
                            // }
                        },
                        order: [['id', 'ASC']]
                    }).then(user =>{
                        user.forEach(function(each_user){
                            //if(each_user.metadata.total_balance >= 1000){
                                count++
                                let temp ={
                                    user_id: each_user.id,
                                    user_name:each_user.metadata.user_name,
                                    balance: each_user.metadata.total_balance,
                                    deposit_balance: each_user.metadata.deposit_balance,
                                    winning_balance: each_user.metadata.winning_balance
                                }
                                list.push(temp)
                            //}
                            
                        })
                        h.render_xhr(req, res, {e:0, m:user.length, list})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:2, m:'Authentication failed'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.get_total_refer_earn = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.User.findAll({
                        where:{
                            [Op.and]:[{metadata:{promo_shared_id:input.user_id}},{metadata:{promo_status:'inactive'}}]
                        }
                    }).then(users =>{
                        let temp = {
                            income_from_refer: users.length * 10
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    })
                }   
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.get_total_freefire_earn_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)
            let total_paid_amount = 0;
            let total_winning_amount = 0;
            let total_refund_amount = 0

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.MatchEntry.findAll({
                        where:{
                            userId:input.user_id
                        }
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            if(each_entry.metadata.paid){
                                total_paid_amount += parseInt(each_entry.metadata.paid)
                            }
                            if(each_entry.metadata.winning_money){
                                total_winning_amount += parseInt(each_entry.metadata.winning_money)
                            }

                            if(each_entry.metadata.refund_amount){
                                total_refund_amount += parseInt(each_entry.metadata.refund_amount)
                            }
                        })
                        let temp = {
                            total_paid_amount: total_paid_amount,
                            total_winning_amount: total_winning_amount,
                            total_refund_amount: total_refund_amount
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    })
                }   
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.get_total_ludo_earn_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)
            let total_paid_amount = 0;
            let total_winning_amount = 0;
            let total_refund_amount = 0

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            userId:input.user_id
                        }
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            if(each_entry.metadata.paid){
                                total_paid_amount += parseInt(each_entry.metadata.paid)
                            }
                            if(each_entry.metadata.winning_money){
                                total_winning_amount += parseInt(each_entry.metadata.winning_money)
                            }

                            if(each_entry.metadata.refund_amount){
                                total_refund_amount += parseInt(each_entry.metadata.refund_amount)
                            }
                        })
                        let temp = {
                            total_paid_amount: total_paid_amount,
                            total_winning_amount: total_winning_amount,
                            total_refund_amount: total_refund_amount
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    })
                }   
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}


controller.admin.get_add_withdraw_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)
            let total_add_money = 0;
            let total_withdraw_money = 0;

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{userId:input.user_id},{metadata:{status:'accepted'}}]
                        }
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            if(each_entry.metadata.type == 'Add Money'){
                                total_add_money += parseInt(each_entry.metadata.amount)
                            }

                            if(each_entry.metadata.type == 'Withdraw Money'){
                                total_withdraw_money += parseInt(each_entry.metadata.amount)
                            }
                        })
                        let temp = {
                            total_add_money: total_add_money,
                            total_withdraw_money: total_withdraw_money
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    })
                }   
                else{
                    h.render_xhr(req, res, {e:1, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.add_new_message = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try{
            let Op = h.Sequelize.Op
            let input = qs.parse(body)
            

            connection.db.Admin.findOne({
                where:{
                    [Op.and]:[{id:input.secret_id},{metadata:{api_token:input.api_token}}]
                }
            }).then(admin =>{
                if(admin && admin.metadata.status == 'active'){
                    let temp = {
                        metadata:{
                            message:input.message
                        },
                        adminId:admin.id,
                        userId:input.user_id
                    }
                    connection.db.AdminToUserMessage.create(temp).then(created =>{
                        if(created){
                            h.render_xhr(req, res, {e:0, m:'Message sent'})
                        }
                        else{
                            h.render_xhr(req, res, {e:3, m:'Something went wrong'})
                        }
                    })
                }   
                else{
                    h.render_xhr(req, res, {e:2, m:'Authentication failed!'})
                }
            })
        }
        catch(err){
            console.log(err)
            h.render_xhr(req, res, {e:5, m:err})
        }
    })
}

controller.admin.get_datewise_add_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            // let today = h.moment().add(0, 'h').endOf('day');
            // let yesterday = h.moment().subtract(0, 'day').startOf('day');
            let Bkash_add_amount = 0
            let Nagad_add_amount = 0
            let Rocket_add_amount = 0
            let total = 0
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if(admin && admin.metadata.status == 'active'){
                    connection.db.AccountingEntry.findAll({
                        where:{
                            [Op.and]:[{metadata:{type:'Add Money'}}, {metadata:{status:'accepted'}}, h.Sequelize.where(h.Sequelize.fn('date', h.Sequelize.col('updatedAt')), '=', input.date)]
                            // ,updatedAt: {
                            //     [Op.]: [yesterday, today]
                            // }
                            
                        },
                        //order:[['updatedAt', 'DESC']]
                    }).then(entry =>{
                        entry.forEach(function(each_entry){
                            total+=each_entry.metadata.amount
                            if(each_entry.metadata.payment_method == 'Bkash '){
                                Bkash_add_amount += parseInt(each_entry.metadata.amount)
                            }

                            if(each_entry.metadata.payment_method == 'Nagad'){
                                Nagad_add_amount += parseInt(each_entry.metadata.amount)
                            }

                            if(each_entry.metadata.payment_method == 'Rocket'){
                                Rocket_add_amount += parseInt(each_entry.metadata.amount)
                            }
                        })
                        let temp = {
                            total: total,
                            Bkash_add_amount: Bkash_add_amount,
                            Nagad_add_amount: Nagad_add_amount,
                            Rocket_add_amount: Rocket_add_amount
                        }
                        h.render_xhr(req, res, {e:0, m:temp})
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Aithenticate failed !'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}


controller.admin.get_subadmin_host_history = function(req, res){
    h.process_post_input(req, res, function(req, res, body){
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let admin_list = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if(admin && admin.metadata.status == 'active'){
                    connection.db.Admin.findAll({
                        where:{
                            [Op.and]:[{metadata:{position:'sub_admin'}}, {metadata:{status:'active'}}]
                        },
                        
                    }).then(admin =>{
                        console.log(admin.length)
                       admin.forEach(function(each_admin){
                            admin_list.push({
                                sub_admin_id: each_admin.id,
                                user_name: each_admin.metadata.user_name,
                                total_host: 0
                            })
                       })
                       connection.db.Match.findAll({
                            where:{
                                [Op.and]:[{metadata:{ongoing_admin_id:{[Op.ne]: null}}},h.Sequelize.where(h.Sequelize.fn('date', h.Sequelize.col('updatedAt')), '=', input.date)]
                            }
                       }).then(match =>{
                            match.forEach(function(each_match){
                                for(let i = 0; i< admin_list.length; i++){
                                    
                                    if(each_match.metadata.ongoing_admin_id && each_match.metadata.ongoing_admin_id == admin_list[i].sub_admin_id){
                                        console.log(i)
                                        admin_list[i].total_host += 1
                                    }
                                }
                            })
                            h.render_xhr(req, res, {e:0, m:admin_list})
                       })
                       
                    })
                }
                else{
                    h.render_xhr(req, res, {e:1, m:'Aithenticate failed !'})
                }
            })
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}


controller.admin.match_back_to_created_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.Match.findOne({
                        where: {
                            id: input.match_id
                        }
                    }).then(match => {
                        let metadata = match.metadata
                        metadata.status = 'created',
                        match.update({ metadata: metadata }).then(done => {
                            h.render_xhr(req, res, { e: 0 })
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

controller.admin.ludoMatch_back_to_created_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatch.findOne({
                        where: {
                            id: input.match_id
                        }
                    }).then(match => {
                        let metadata = match.metadata
                        metadata.status = 'created',
                        match.update({ metadata: metadata }).then(done => {
                            h.render_xhr(req, res, { e: 0 })
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

controller.admin.dashboard_total_user = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   connection.db.User.findAll({}).then(users =>{
                    h.render_xhr(req, res, {e:0, m:users.length})
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

controller.admin.dashboard_new_join_user = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                   connection.db.User.findAll({
                    where:{
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    }
                   }).then(users =>{
                    h.render_xhr(req, res, {e:0, m:users.length})
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

controller.admin.dashboard_pass_change_request = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.ResetToken.findAll({
                        where:{
                            metadata:{
                                request:'pass'
                            },
                            createdAt: {
                                [Op.between]: [start, end]
                            }
                        }
                    }).then(users =>{
                        h.render_xhr(req, res, {e:0, m:users.length})
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

controller.admin.dashboard_new_active_user = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let users_ = []
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            let start1 = h.moment().subtract(15, 'day').startOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.AccountingEntry.findAll({
                        where:{
                            createdAt: {
                                [Op.between]: [start, end]
                            }
                        },
                        include:[
                            { model: connection.db.User
                                ,where:{
                                    createdAt: {
                                        [Op.between]: [start1, end]
                                    }
                                }
                            }
                        ]
                    }).then(users =>{
                        users.forEach(function(new_){
                            users_.push(new_.userId)
                        })
                        let uniqueChars = [...new Set(users_)];
                        let length  = uniqueChars.length
                        h.render_xhr(req, res, {e:0, m:length})
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

controller.admin.dashboard_old_active_user = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let users_ = []
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            let start1 = h.moment().subtract(15, 'day').startOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.AccountingEntry.findAll({
                        where:{
                            createdAt: {
                                [Op.between]: [start, end]
                            }
                        },
                        include:[
                            { model: connection.db.User
                                ,where:{
                                    createdAt: {
                                        [Op.lt]: start1.toDate()
                                    }
                                }
                            }
                        ]
                    }).then(users =>{
                        users.forEach(function(new_){
                            users_.push(new_.userId)
                        })
                        let uniqueChars = [...new Set(users_)];
                        let length  = uniqueChars.length
                        h.render_xhr(req, res, {e:0, m:length})
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

controller.admin.dashboard_today_firefire_join = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let users_ = []
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.MatchEntry.findAll({
                        where:{
                            createdAt: {
                                [Op.between]: [start, end]
                            }
                        }
                    }).then(users =>{
                        users.forEach(function(new_){
                            users_.push(new_.userId)
                        })
                        let uniqueChars = [...new Set(users_)];
                        let length  = uniqueChars.length
                        h.render_xhr(req, res, {e:0, m:length})
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

controller.admin.dashboard_today_ludo_join = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let users_ = []
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            let start1 = h.moment().subtract(15, 'day').startOf('day');
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.LudoMatchEntry.findAll({
                        where:{
                            createdAt: {
                                [Op.between]: [start, end]
                            }
                        }
                    }).then(users =>{
                        users.forEach(function(new_){
                            users_.push(new_.userId)
                        })
                        let uniqueChars = [...new Set(users_)];
                        let length  = uniqueChars.length
                        h.render_xhr(req, res, {e:0, m:length})
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

controller.admin.dashboard_today_profit= function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let users_ = []
            let start = h.moment().add(0, 'h').startOf('day');
            let end = h.moment().add(0, 'h').endOf('day');
            let total_add = 0
            let total_withdraw = 0
            // let start = h.moment().subtract(1, 'month').startOf('month')
            // let end = h.moment().subtract(1, 'month').endOf('month')
            // let start = h.moment().startOf('month')
            // let end = h.moment().endOf('month')
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.AccountingEntry.findAll({
                        where: {
                            updatedAt: {
                                [Op.between]: [start, end]
                            },
                            metadata: {
                                status: 'accepted'
                            }
                        }
                    }).then(acc_entry => {
                        acc_entry.forEach(function (each_a_entry) {
                            if (each_a_entry.metadata.type == 'Add Money') {
                                total_add += parseInt(each_a_entry.metadata.amount)
                            }
            
                            if (each_a_entry.metadata.type == 'Withdraw Money') {
                                total_withdraw += parseInt(each_a_entry.metadata.amount)
                            }
                        })
                        let income = total_add - total_withdraw
                       
                        h.render_xhr(req, res, { e: 0, m:  total_add+'-'+total_withdraw+'-'+income})
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

controller.admin.dashboard_month_profit= function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let total_add = 0
            let total_withdraw = 0
            // let start = h.moment().subtract(1, 'month').startOf('month')
            // let end = h.moment().subtract(1, 'month').endOf('month')
            let start = h.moment().startOf('month')
            let end = h.moment().endOf('month')
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin && admin.metadata.status == 'active') {
                    connection.db.AccountingEntry.findAll({
                        where: {
                            updatedAt: {
                                [Op.between]: [start, end]
                            },
                            metadata: {
                                status: 'accepted'
                            }
                        }
                    }).then(acc_entry => {
                        acc_entry.forEach(function (each_a_entry) {
                            if (each_a_entry.metadata.type == 'Add Money') {
                                total_add += parseInt(each_a_entry.metadata.amount)
                            }
            
                            if (each_a_entry.metadata.type == 'Withdraw Money') {
                                total_withdraw += parseInt(each_a_entry.metadata.amount)
                            }
                        })
                        let income = total_add - total_withdraw
                       
                        h.render_xhr(req, res, { e: 0, m:  total_add+'-'+total_withdraw+'-'+income})
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
//exports master.js

exports.controller = controller;