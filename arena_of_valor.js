const qs = require('querystring');
var fs = require('fs');
const h = require('./helper').h;
const connection = require('./connections').connection;



var arenaOfValor = {

};

arenaOfValor.admin = {}

arenaOfValor.admin.add_arena_of_valor_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    let temp = {
                        metadata: {
                            date: input.date,
                            time: input.time,
                            title: input.title,
                            entry_fee: input.entry_fee,
                            total_player: input.total_player,
                            total_joined: 0,
                            total_prize: input.total_prize,
                            version: input.version,
                            status: 'created'
                        },
                        gameId: input.game_id,
                        playingTypeId: input.playingType_id,
                        adminId: admin.id
                    }
                    connection.db.ArenaOfValorMatch.create(temp).then(done => {
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

arenaOfValor.admin.edit_arena_of_valor_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findOne({
                        where: {
                            id: input.match_id
                        }
                    }).then(match => {
                        if (match) {
                            let metadata = match.metadata
                            metadata.date = input.date,
                                metadata.time = input.time,
                                metadata.title = input.title,
                                metadata.entry_fee = input.entry_fee,
                                metadata.total_player = input.total_player,
                                metadata.total_prize = input.total_prize,
                                metadata.version = input.version
                            match.update({ metadata: metadata }).then(updated => {
                                if (updated) {
                                    h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                }
                                else {
                                    h.render_xhr(req, res, { e: 3, m: 'No match found!' })
                                }
                            })

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

arenaOfValor.admin.remove_arena_of_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            if (input.match_id && input.secret_id && input.api_token) {
                const Op = h.Sequelize.Op;
                connection.db.Admin.findOne({
                    where: {
                        [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                    }
                }).then(admin => {
                    if (admin) {
                        connection.db.ArenaOfValorMatch.destroy({ where: { id: input.match_id } }).then(removed => {
                            if (removed) {
                                h.render_xhr(req, res, { e: 0 });
                            }
                            else {
                                h.render_xhr(req, res, { e: 1, m: 'Failed to remove!' });
                            }

                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 1, m: 'Authentication failed!' })
                    }
                })
            }
            else {
                console.log('input missing')
                h.render_xhr(req, res, { e: 1, m: 'Invalid input!' })
            }
        }
        catch (err) {
            console.log(err);
            h.render_xhr(req, res, { e: 1 });
        }
    })
}

arenaOfValor.admin.get_created_arena_of_valor_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let all_ludo_match = []
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findAll({
                        where: {
                            [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'created' } }]
                        },
                        order: [['createdAt', 'ASC']]
                    }).then(ludo_matches => {
                        ludo_matches.map(function (each_match) {
                            let temp_match = {
                                match_id: each_match.id,
                                date: each_match.metadata.date,
                                time: each_match.metadata.time,
                                title: each_match.metadata.title,
                                entry_fee: each_match.metadata.entry_fee,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                version: each_match.metadata.version
                            }

                            if (each_match.metadata.room_code) {
                                temp_match.room_code = each_match.metadata.room_code
                            }
                            else {
                                temp_match.room_code = ''
                            }

                            all_ludo_match.push(temp_match)
                        })
                        h.render_xhr(req, res, { e: 0, m: all_ludo_match })
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

arenaOfValor.admin.arena_of_valor_match_move_to_ongoing = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findOne({
                        where: {
                            id: input.match_id
                        }
                    }).then(match => {
                        let metadata = match.metadata
                        metadata.status = 'ongoing'
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

arenaOfValor.admin.update_arena_of_valor_match_roomcode = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    if (input.match_id && input.room_code) {
                        connection.db.ArenaOfValorMatch.findOne({
                            where: {
                                id: input.match_id
                            }
                        }).then(match => {
                            if (match) {
                                let metadata = match.metadata
                                metadata.room_code = input.room_code
                                match.update({ metadata: metadata }).then(successful => {
                                    if (successful) {
                                        let title = 'Arena Of Valor match id and pass'
                                        let body = 'দেওয়া হয়েছে। এখনই সংগ্রহ করে ম্যাচ join করুন।'
                                        let topic = `NotificationForArenaOfValorMatch${match.id}`
                                        h.send_notification(title, body, topic)
                                        h.render_xhr(req, res, { e: 0 })
                                    }
                                })
                            }
                            else {
                                h.render_xhr(req, res, { e: 3, m: 'match not found!' })
                            }
                        })
                    }
                    else {
                        h.render_xhr(req, res, { e: 2, m: 'input missing!' })
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

arenaOfValor.admin.get_ongoing_arena_of_valor_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let all_ludo_match = []
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findAll({
                        where: {
                            [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'ongoing' } }]
                        },
                        order: [['createdAt', 'DESC']]
                    }).then(ludo_matches => {
                        ludo_matches.map(function (each_match) {
                            let temp_match = {
                                match_id: each_match.id,
                                date: each_match.metadata.date,
                                time: each_match.metadata.time,
                                title: each_match.metadata.title,
                                entry_fee: each_match.metadata.entry_fee,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                version: each_match.metadata.version
                            }


                            if (each_match.metadata.room_code) {
                                temp_match.hasRoomcode = true;
                                temp_match.room_code = each_match.metadata.room_code
                            }
                            if(each_match.metadata.admin_note){
                                temp_match.admin_note = each_match.metadata.admin_note
                            }
                            all_ludo_match.push(temp_match)
                        })
                        h.render_xhr(req, res, { e: 0, m: all_ludo_match })
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


arenaOfValor.admin.arena_of_valor_match_move_to_result = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findOne({
                        where: {
                            id: input.match_id
                        }
                    }).then(match => {
                        let metadata = match.metadata
                        metadata.status = 'result'
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

arenaOfValor.admin.get_result_arena_of_valor_match = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            const Op = h.Sequelize.Op;
            let all_ludo_match = []
            let input = qs.parse(body)
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findAll({
                        where: {
                            [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'result' } }]
                        },
                        order: [['createdAt', 'DESC']]
                    }).then(ludo_matches => {
                        ludo_matches.map(function (each_match) {
                            let temp_match = {
                                match_id: each_match.id,
                                date: each_match.metadata.date,
                                time: each_match.metadata.time,
                                title: each_match.metadata.title,
                                entry_fee: each_match.metadata.entry_fee,
                                total_player: each_match.metadata.total_player,
                                total_prize: each_match.metadata.total_prize,
                                version: each_match.metadata.version
                            }
                            if (each_match.metadata.room_code) {
                                temp_match.hasRoomcode = true;
                                temp_match.room_code = each_match.metadata.room_code
                            }
                            if(each_match.metadata.admin_note){
                                temp_match.admin_note = each_match.metadata.admin_note
                            }
                            all_ludo_match.push(temp_match)
                        })
                        h.render_xhr(req, res, { e: 0, m: all_ludo_match })
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


arenaOfValor.admin.result_match_info = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let result_info = []
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatchEntry.findAll({
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
                                if (each_entry.metadata.extra_one) {
                                    temp_match_player_info.extra_one = each_entry.metadata.extra_one
                                }
                                else {
                                    temp_match_player_info.extra_one = ''
                                };
                                if (each_entry.metadata.extra_two) {
                                    temp_match_player_info.extra_two = each_entry.metadata.extra_two
                                }
                                else {
                                    temp_match_player_info.extra_two = ''
                                };
                                if (each_entry.metadata.rank) {
                                    temp_match_player_info.rank = each_entry.metadata.rank
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


arenaOfValor.admin.get_each_player_result_update_info = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatchEntry.findOne({
                        where: {
                            [Op.and]: [{ userId: input.user_id }, { arenaOfValorMatchId: input.match_id }]
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(each_entry => {
                        let temp_match_player_info = {
                            user_id: each_entry.userId,
                            user_name: each_entry.user.metadata.user_name,
                            first_player: '',
                            second_player: '',
                            third_player: '',
                            forth_player: '',
                            fifth_player: '',
                            extra_one: '',
                            extra_two: ''
                        }
                        if (each_entry.metadata.first_player) {
                            temp_match_player_info.first_player = each_entry.metadata.first_player
                        };
                        if (each_entry.metadata.second_player) {
                            temp_match_player_info.second_player = each_entry.metadata.second_player
                        };
                        if (each_entry.metadata.third_player) {
                            temp_match_player_info.third_player = each_entry.metadata.third_player
                        };
                        if (each_entry.metadata.forth_player) {
                            temp_match_player_info.forth_player = each_entry.metadata.forth_player
                        };
                        if (each_entry.metadata.fifth_player) {
                            temp_match_player_info.fifth_player = each_entry.metadata.fifth_player
                        }

                        if (each_entry.metadata.extra_one) {
                            temp_match_player_info.extra_one = each_entry.metadata.extra_one
                        }

                        if (each_entry.metadata.extra_two) {
                            temp_match_player_info.extra_two = each_entry.metadata.extra_two
                        }

                        if (each_entry.metadata.rank) {
                            temp_match_player_info.rank = each_entry.metadata.rank
                        }
                        else {
                            temp_match_player_info.rank = 0
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
                        h.render_xhr(req, res, { e: 0, m: temp_match_player_info })
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

arenaOfValor.admin.giving_result = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatchEntry.findOne({
                        where: {
                            [Op.and]: [{ userId: input.user_id }, { arenaOfValorMatchId: input.match_id }]
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(entry => {
                        if (entry.metadata.winning_money) {
                            let metadata = entry.metadata
                            let temp_winning_money = metadata.winning_money
                            metadata.winning_money = input.winning_money
                            if (input.rank) {
                                metadata.rank = input.rank
                            }
                            entry.update({ metadata: metadata }).then(updated => {
                                if (updated) {
                                    let new_user = entry.user
                                    let metadata = new_user.metadata
                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.winning_money) - parseInt(temp_winning_money)
                                    metadata.winning_balance = parseInt(metadata.winning_balance) + parseInt(input.winning_money) - parseInt(temp_winning_money)
                                    if (parseInt(metadata.rank) != 1 && parseInt(input.rank) == 1) {
                                        metadata.match_win = parseInt(metadata.match_win) + 1
                                    }
                                    else if (parseInt(metadata.rank) == 1 && parseInt(input.rank) != 1) {
                                        metadata.match_win = parseInt(metadata.match_win) - 1
                                    }
                                    new_user.update({ metadata: metadata }).then(done => {
                                        h.render_xhr(req, res, { e: 0 });
                                    })

                                }
                            })
                        }
                        else {
                            let metadata = entry.metadata
                            metadata.winning_money = input.winning_money
                            metadata.rank = input.rank
                            entry.update({ metadata: metadata }).then(updated => {
                                if (updated) {
                                    let new_user = entry.user
                                    let metadata = new_user.metadata
                                    metadata.total_balance = parseInt(metadata.total_balance) + parseInt(input.winning_money)
                                    metadata.winning_balance = parseInt(metadata.winning_balance) + parseInt(input.winning_money)
                                    if (parseInt(input.rank) == 1) {
                                        metadata.match_win = parseInt(metadata.match_win) + 1
                                    }
                                    new_user.update({ metadata: metadata }).then(done => {
                                        h.render_xhr(req, res, { e: 0 });
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
        }
    })
}

arenaOfValor.admin.give_refund = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatchEntry.findOne({
                        where: {
                            [Op.and]: [{ userId: input.user_id }, { arenaOfValorMatchId: input.match_id }]
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(entry => {
                        if (input.refund_amount) {
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
                                            let topic = `NotificationForArenaOfValorRefund${user_updated.id}`
                                            h.send_notification(title, body, topic)
                                            h.render_xhr(req, res, { e: 0, m: 'Successfully updated!' })
                                        }
                                    })
                                }
                            })
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

arenaOfValor.admin.update_a_note_for_admin = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            connection.db.Admin.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { api_token: input.api_token } }]
                }
            }).then(admin => {
                if (admin) {
                    connection.db.ArenaOfValorMatch.findOne({
                        where: {
                            id: input.match_id
                        }
                    }).then(match => {
                        if (match) {
                            let metadata = match.metadata
                            metadata.admin_note = input.note,
                                metadata.admin_note_updated_by = admin.id
                            match.update({ metadata: metadata }).then(updated => {
                                if (updated) {
                                    h.render_xhr(req, res, { e: 0, m: 'Successfully Updated!' })
                                }
                            })
                        }
                        else {
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

arenaOfValor.player = {}

arenaOfValor.player.get_match_length = function (req, res) {
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
                    connection.db.ArenaOfValorMatch.findAll({
                        where: {
                            metadata: {
                                status: 'created'
                            }
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

arenaOfValor.player.get_each_match_length = function (req, res) {
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
                    connection.db.ArenaOfValorMatch.findAll({
                        where: {
                            [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'created' } }]
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

arenaOfValor.player.get_created_match_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;

            let offset = (page_number - 1) * page_size;

            let filter = {
                order: [['createdAt', 'ASC']]
                , limit: page_size
                , offset: offset
                , include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]

            };
            filter.where = {
                [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'created' } }]//game id is actually is it cs or regular match
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.ArenaOfValorMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.ArenaOfValorMatch.findAndCountAll(filter).then(result => {
                            let count = result.count;

                            let has_results = false;

                            if (count > 0) {
                                has_results = true;
                            }

                            let matches = result.rows;

                            let records_remaining = count - (offset + matches.length);

                            let show_next = false;
                            let show_prev = true;

                            if (records_remaining > 0) {
                                show_next = true;
                            };

                            if (offset == 0) {
                                show_prev = false;
                            };
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_time: each_match.metadata.time,
                                    match_date: each_match.metadata.date,
                                    entry_fee: each_match.metadata.entry_fee,
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
                                if (parseInt(each_match.metadata.total_joined) >= parseInt(each_match.metadata.total_player)) {
                                    temp_match.isMatchFull = true
                                }
                                else {
                                    temp_match.isMatchFull = false
                                }
                                if (each_match.metadata.room_code) {
                                    temp_match.hasRoomcode = true;
                                    temp_match.room_code = each_match.metadata.room_code
                                }
                                else {
                                    temp_match.hasRoomcode = false;
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.matchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.arenaOfValorMatchId == each_match.id && !each_entry.metadata.refund_amount) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }

                                })

                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info: {
                                    has_results: has_results
                                    , page_number: page_number
                                    , show_next: show_next
                                    , show_prev: show_prev
                                    , records_remaining: records_remaining
                                    , offset: offset
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

arenaOfValor.player.get_ongoing_match = function (req, res) {
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
                    connection.db.ArenaOfValorMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.ArenaOfValorMatch.findAll({
                            where: {
                                [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'ongoing' } }]//game id is actually is it cs or regular match
                            },
                            order: [['createdAt', 'DESC']],
                            include: [{ model: connection.db.Game }, { model: connection.db.PlayingType }]
                        }).then(matches => {
                            matches.map(function (each_match) {
                                let temp_match = {
                                    match_id: each_match.id,
                                    match_date: each_match.metadata.date,
                                    match_time: each_match.metadata.time,
                                    entry_fee: each_match.metadata.entry_fee,
                                    version: each_match.metadata.version,
                                    title: each_match.metadata.title,
                                    total_prize: each_match.metadata.total_prize,
                                    game_type: each_match.game.name,
                                    player_type: each_match.playing_type.type,
                                    //isJoined = false
                                }
                                if (each_match.metadata.room_code) {
                                    temp_match.room_code = each_match.metadata.room_code
                                }
                                if (each_match.metadata.image) {
                                    temp_match.hasImage = true
                                }
                                entry_match.forEach(function (each_entry) {
                                    //console.log(each_entry.userId +' '+ user.id + ' '+ each_entry.ludoMatchId + ' '+ each_match.id)
                                    if (each_entry.userId == user.id && each_entry.arenaOfValorMatchId == each_match.id) {
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

arenaOfValor.player.get_paginated_result_list = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let today = h.moment().add(0, 'h').endOf('day');
            let yesterday = h.moment().subtract(1, 'day').startOf('day');
            let all_created_match = []
            const page_size = 8;
            let page_number = input.page_number;

            let offset = (page_number - 1) * page_size;

            let filter = {
                order: [['createdAt', 'DESC']]
                , limit: page_size
                , offset: offset

            };
            filter.where = {
                [Op.and]: [{ gameId: input.game_id }, { metadata: { status: 'result' } }]//game id is actually is it cs or regular match
                , createdAt: {
                    [Op.between]: [yesterday, today]
                }
            }
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.ArenaOfValorMatchEntry.findAll({
                    }).then(entry_match => {
                        connection.db.ArenaOfValorMatch.findAndCountAll(filter).then(result => {
                            let count = result.count;

                            let has_results = false;

                            if (count > 0) {
                                has_results = true;
                            }

                            let matches = result.rows;

                            let records_remaining = count - (offset + matches.length);

                            let show_next = false;
                            let show_prev = true;

                            if (records_remaining > 0) {
                                show_next = true;
                            };

                            if (offset == 0) {
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
                                    if (each_entry.userId == user.id && each_entry.arenaOfValorMatchId == each_match.id) {
                                        //console.log('true')
                                        temp_match.isJoined = true;
                                    }
                                })

                                all_created_match.push(temp_match)
                            })
                            let pkt = {
                                page_info: {
                                    has_results: has_results
                                    , page_number: page_number
                                    , show_next: show_next
                                    , show_prev: show_prev
                                    , records_remaining: records_remaining
                                    , offset: offset
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

arenaOfValor.player.match_entry = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let getplayer = false
            let total_joined = 0
            //console.log(input.hasSixthPlayer + ' ' + input.sixth_player)
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
                        connection.db.ArenaOfValorMatchEntry.findOne({
                            where: {
                                [Op.and]: [{ arenaOfValorMatchId: input.match_id }, { userId: user.id }, { metadata: { refund_amount: null } }]
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
                                    connection.db.ArenaOfValorMatchEntryHistory.findOne({
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
                                                if ((input.hasFirstPlayer == 'true' && found_group.metadata.hasFirstPlayer) || (input.hasSecondPlayer == 'true' && found_group.metadata.hasSecondPlayer) || (input.hasThirdPlayer == 'true' && found_group.metadata.hasThirdPlayer) || (input.hasForthPlayer == 'true' && found_group.metadata.hasForthPlayer) || (input.hasFifthPlayer == 'true' && found_group.metadata.hasFifthPlayer)) {
                                                    h.render_xhr(req, res, { e: 6, m: 'Slot has already booked!' })
                                                }
                                                else {
                                                    connection.db.ArenaOfValorMatch.findOne({
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
                                                            if (input.hasFirstPlayer == "true" && input.hasSecondPlayer == "true" && input.hasThirdPlayer == "true") {
                                                                temp_entry.metadata.hasExtraOne = true,
                                                                    temp_entry.metadata.extra_one = input.extra_one
                                                                temp_entry1.metadata.hasExtraOne = true,
                                                                    temp_entry1.metadata.extra_one = input.extra_one
                                                            }

                                                            if (input.hasFirstPlayer == "true" && input.hasSecondPlayer == "true" && input.hasThirdPlayer == "true" && input.hasForthPlayer == "true" && input.hasFifthPlayer == "true") {
                                                                temp_entry.metadata.hasExtraOne = true,
                                                                    temp_entry.metadata.extra_one = input.extra_one
                                                                temp_entry.metadata.hasExtraTwo = true,
                                                                    temp_entry.metadata.extra_two = input.extra_two
                                                                temp_entry1.metadata.hasExtraOne = true,
                                                                    temp_entry1.metadata.extra_one = input.extra_one
                                                                temp_entry1.metadata.hasExtraTwo = true,
                                                                    temp_entry1.metadata.extra_two = input.extra_two
                                                            }

                                                            if (getplayer) {
                                                                let promo_active = false;
                                                                if (temp_entry.metadata.paid <= parseInt(user.metadata.total_balance)) {
                                                                    if (parseInt(match.metadata.total_player) > parseInt(match.metadata.total_joined)) {
                                                                        temp_entry.metadata.team_no = parseInt(input.team_no)
                                                                        temp_entry.matchId = match.id
                                                                        temp_entry.userId = user.id
                                                                        connection.db.ArenaOfValorMatchEntry.create(temp_entry).catch((error) => {
                                                                            console.log(error);
                                                                            h.render_xhr(req, res, { e: 1 });
                                                                        })
                                                                            .then(created => {
                                                                                if (created) {
                                                                                    connection.db.ArenaOfValorMatchEntryHistory.findOne({
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
                                                                                                                            if (user.metadata.promo_shared_id) {
                                                                                                                                connection.db.User.findOne({
                                                                                                                                    where: {
                                                                                                                                        id: user.metadata.promo_shared_id
                                                                                                                                    }
                                                                                                                                }).catch((error) => {
                                                                                                                                    console.log(error);
                                                                                                                                    h.render_xhr(req, res, { e: 1 });
                                                                                                                                })
                                                                                                                                    .then(find_share => {
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
                                                                                                connection.db.ArenaOfValorMatchEntryHistory.create(temp_entry1)
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
                                                                                                                            if (user.metadata.promo_shared_id) {
                                                                                                                                connection.db.User.findOne({
                                                                                                                                    where: {
                                                                                                                                        id: user.metadata.promo_shared_id
                                                                                                                                    }
                                                                                                                                }).catch((error) => {
                                                                                                                                    console.log(error);
                                                                                                                                    h.render_xhr(req, res, { e: 1 });
                                                                                                                                })
                                                                                                                                    .then(find_share => {
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
                                                connection.db.ArenaOfValorMatch.findOne({
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

                                                        if (input.hasFirstPlayer == "true" && input.hasSecondPlayer == "true" && input.hasThirdPlayer == "true") {
                                                            temp_entry.metadata.hasExtraOne = true,
                                                                temp_entry.metadata.extra_one = input.extra_one
                                                            temp_entry1.metadata.hasExtraOne = true,
                                                                temp_entry1.metadata.extra_one = input.extra_one
                                                        }

                                                        if (input.hasFirstPlayer == "true" && input.hasSecondPlayer == "true" && input.hasThirdPlayer == "true" && input.hasForthPlayer == "true" && input.hasFifthPlayer == "true") {
                                                            temp_entry.metadata.hasExtraOne = true,
                                                                temp_entry.metadata.extra_one = input.extra_one
                                                            temp_entry.metadata.hasExtraTwo = true,
                                                                temp_entry.metadata.extra_two = input.extra_two
                                                            temp_entry1.metadata.hasExtraOne = true,
                                                                temp_entry1.metadata.extra_one = input.extra_one
                                                            temp_entry1.metadata.hasExtraTwo = true,
                                                                temp_entry1.metadata.extra_two = input.extra_two
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
                                                                                connection.db.ArenaOfValorMatchEntryHistory.findOne({
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
                                                                                                                    if (user.metadata.promo_shared_id) {
                                                                                                                        connection.db.User.findOne({
                                                                                                                            where: {
                                                                                                                                id: user.metadata.promo_shared_id
                                                                                                                            }
                                                                                                                        }).catch((error) => {
                                                                                                                            console.log(error);
                                                                                                                            h.render_xhr(req, res, { e: 1 });
                                                                                                                        })
                                                                                                                            .then(find_share => {
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
                                                                                        connection.db.ArenaOfValorMatchEntryHistory.create(temp_entry1)
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
                                                                                                                        if (user.metadata.promo_shared_id) {
                                                                                                                            connection.db.User.findOne({
                                                                                                                                where: {
                                                                                                                                    id: user.metadata.promo_shared_id
                                                                                                                                }
                                                                                                                            }).catch((error) => {
                                                                                                                                console.log(error);
                                                                                                                                h.render_xhr(req, res, { e: 1 });
                                                                                                                            })
                                                                                                                                .then(find_share => {
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


arenaOfValor.player.join_player_list_according_team = function (req, res) {
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
                    connection.db.ArenaOfValorMatchEntryHistory.findAll({
                        where: {
                            arenaOfValorMatchId: input.match_id
                        }
                    }).catch(function (err) {
                        Console.log(err)
                    })
                        .then(match_history => {
                            match_history.forEach(function (each_history) {
                                let temp_list = {
                                    team_no: each_history.team_no
                                }
                                if (each_history.metadata.hasFirstPlayer) {
                                    temp_list.hasFirstPlayer = each_history.metadata.hasFirstPlayer
                                    temp_list.first_player = each_history.metadata.first_player
                                };
                                if (each_history.metadata.hasSecondPlayer) {
                                    temp_list.hasSecondPlayer = each_history.metadata.hasSecondPlayer
                                    temp_list.second_player = each_history.metadata.second_player
                                };
                                if (each_history.metadata.hasThirdPlayer) {
                                    temp_list.hasThirdPlayer = each_history.metadata.hasThirdPlayer
                                    temp_list.third_player = each_history.metadata.third_player
                                };
                                if (each_history.metadata.hasForthPlayer) {
                                    temp_list.hasForthPlayer = each_history.metadata.hasForthPlayer
                                    temp_list.forth_player = each_history.metadata.forth_player
                                };
                                if (each_history.metadata.hasFifthPlayer) {
                                    temp_list.hasFifthPlayer = each_history.metadata.hasFifthPlayer
                                    temp_list.fifth_player = each_history.metadata.fifth_player
                                };
                                if (each_history.metadata.hasExtraOne) {
                                    temp_list.hasExtraOne = each_history.metadata.hasExtraOne
                                    temp_list.extra_one = each_history.metadata.extra_one
                                };
                                if (each_history.metadata.hasExtraTwo) {
                                    temp_list.hasExtraTwo = each_history.metadata.hasExtraTwo
                                    temp_list.extra_two = each_history.metadata.extra_two
                                };
                                join_list.push(temp_list)
                            })
                            h.render_xhr(req, res, { e: 0, m: join_list })

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

arenaOfValor.player.get_result_match_info = function (req, res) {
    h.process_post_input(req, res, function (req, res, body) {
        try {
            let input = qs.parse(body)
            const Op = h.Sequelize.Op;
            let result_info = []
            connection.db.User.findOne({
                where: {
                    [Op.and]: [{ id: input.secret_id }, { metadata: { jwt_token: input.jwt_token } }]
                }
            }).then(user => {
                if (user) {
                    connection.db.ArenaOfValorMatchEntry.findAll({
                        where: {
                            arenaOfValorMatchId: input.match_id
                        },
                        order: [['createdAt', 'DESC']],
                        include: [{ model: connection.db.User }]
                    }).then(matchEntry => {

                        matchEntry.forEach(function (each_entry) {
                            if (each_entry.user) {
                                let temp_match_player_info = {
                                    user_name: each_entry.user.metadata.user_name
                                }
                                if (each_entry.metadata.player_name) {
                                    temp_match_player_info.player_name = each_entry.metadata.player_name
                                };
                                if (each_entry.metadata.rank) {
                                    temp_match_player_info.rank = each_entry.metadata.rank
                                }
                                else {
                                    temp_match_player_info.rank = 100
                                };

                                if (each_entry.metadata.winning_money) {
                                    temp_match_player_info.winning_money = each_entry.metadata.winning_money
                                }
                                else {
                                    temp_match_player_info.winning_money = 0
                                };
                                if (each_entry.metadata.refunded) {
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

arenaOfValor.player.statastic_palyed_match_info = function (req, res) {
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
                    connection.db.ArenaOfValorMatchEntry.findAll({
                        where: {
                            userId: user.id
                        },
                        include: [{ model: connection.db.ArenaOfValorMatch }]
                    }).then(entry => {
                        entry.forEach(function (each_entry) {
                            if (each_entry.arena_of_valor_match) {
                                let tem_entry = {
                                    match_title: each_entry.arena_of_valor_match.metadata.title,
                                    palyed_on: each_entry.arena_of_valor_match.metadata.date + ', ' + each_entry.arena_of_valor_match.metadata.time,
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

exports.arenaOfValor = arenaOfValor;