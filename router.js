const express = require('express');
const route = express.Router();
let controller = require('./master').controller;
let buyAndSell = require('./buy_and_sell').buyAndSell;
let promoter = require('./promoter').promoter;
let arenaOfValor = require('./arena_of_valor').arenaOfValor;
let tournament = require('./tournament_admin').tournament;
let tournament_team = require('./tournament_player').tournament_team;
let ludoApp = require('./ludo_app').ludoApp;
let ludoAppAdmin = require('./ludo_app_admin').ludoAppAdmin;

route.post('/player/match_new_entry', controller.player.new_match_entry)
route.post('/player/get_joined_list', controller.player.get_joined_list)

route.get('/player/test', controller.player.test)
route.get('/player/update', controller.player.update_app)
route.post('/player/regitration', controller.player.user_regitration)
route.post('/player/get_token', controller.player.send_registration_token)
route.post('/player/login', controller.player.user_login)
route.post('/player/reset_request', controller.player.reset_pass_request)
route.post('/player/reset_password', controller.player.reset_password)
route.post('/player/refresh_token', controller.player.refresh_token)
route.post('/player/get_user_status', controller.player.check_user_status)
route.post('/player/get_profile_info', controller.player.get_profile_info)
route.post('/player/created_match_list', controller.player.get_created_match)
route.post('/player/created_match_list_cs', controller.player.get_created_match_cs)
route.post('/player/created_match_list_regular', controller.player.get_created_match_regular)
route.post('/player/created_match_list_cs_one', controller.player.get_created_match_cs_one)
route.post('/player/created_match_list_cs_two', controller.player.get_created_match_cs_two)
route.post('/player/separated_cs_list_one', controller.player.get_created_match_separated_cs_one)
route.post('/player/separated_cs_list_two', controller.player.get_created_match_separated_cs_two)
route.post('/player/created_match_list_regular_one', controller.player.get_created_match_regular_one)
route.post('/player/created_match_list_regular_two', controller.player.get_created_match_regular_two)
route.post('/player/ongoing_match_list', controller.player.get_ongoing_match)
route.post('/player/result_match_list', controller.player.get_result_match)
route.post('/player/result_match_list_one', controller.player.get_result_match_one)
route.post('/player/result_match_list_two', controller.player.get_result_match_two)
route.post('/player/match_entry', controller.player.joining_match)
route.post('/player/requested_add_withdraw_money', controller.player.add_withdraw_money_request)
route.post('/player/get_all_tranjection', controller.player.see_all_account_activity)
route.post('/player/get_all_orders', controller.player.see_all_order_list)
route.post('/player/joined_player_list', controller.player.check_join_players_list)
route.post('/player/get_result_match_info', controller.player.result_match_info)
route.post('/player/playing_match_list', controller.player.see_all_playing_match)
route.post('/player/show_rules', controller.player.get_rules)
route.post('/player/get_payment_number', controller.player.get_payment_number)
route.post('/player/get_support_number', controller.player.get_support_number)
route.post('/player/update_profile_info', controller.player.update_profile_info)
route.post('/player/get_room_info', controller.player.get_room_info)
route.post('/player/get_statastic_matches', controller.player.statastic_palyed_match_info)
route.post('/player/get_fireefire_rules', controller.player.get_freefire_rules)
route.post('/player/get_regular_match_length', controller.player.get_regular_match_length)
route.post('/player/get_cs_lover_match_length', controller.player.get_cs_lover_match_length)
route.post('/player/get_all_cs_lover_match_length', controller.player.get_all_cs_lover_match_length)
route.post('/player/separated_cs_match_length', controller.player.get_cs_lover_separated_match_length)
route.post('/player/get_full_map_length', controller.player.get_full_map_match_length)
route.post('/player/edit_joined_player', controller.player.edit_join_player)

route.post('/player/get_created_ludo_match', controller.player.get_created_ludo_match)
route.post('/player/getcreated_paginated_ludo_list', controller.player.get_created_paginated_ludo_match)
route.post('/player/get_ongoing_ludo_match', controller.player.get_ongoing_ludo_match)
route.post('/player/get_result_ludo_match', controller.player.get_result_ludo_match)
route.post('/player/ludo_paginated_result_list', controller.player.get_paginated_ludo_result_list)
route.post('/player/get_ludo_match_length', controller.player.ludo_match_length)
route.post('/player/get_all_ludo_match_length', controller.player.all_ludo_match_length)
route.post('/player/join_ludo_match', controller.player.join_ludo_match)
route.post('/player/get_ludo_match_join_list', controller.player.ludo_match_join_list)
route.post('/player/get_ludo_rules', controller.player.get_ludo_rules)
route.post('/player/ludo_result_info', controller.player.ludo_result_match_info)
route.post('/player/upload_image', controller.player.ludo_upload_image)
route.post('/player/ludo_image_upload', controller.player.new_ludo_upload_image)
route.post('/player/get_youtube_link', controller.player.get_ludo_links)
route.post('/player/ludo_match_statastic', controller.player.statastic_palyed_ludo_match_info)
route.post('/player/get_ludo_image', controller.player.view_ludo_image)
route.post('/player/get_ready', controller.player.ready_for_match)

//slider
route.post('/player/get_slider_list', controller.player.show_slider_list)

//popup
route.post('/player/get_popup_status', controller.player.check_popup_status)
route.post('/player/get_popup', controller.player.pop_up_show)

//notice
route.post('/player/get_notice', controller.player.get_all_notice)

//top player list
route.post('/player/get_top_players_list', controller.player.top_player_list)

//get supprt number
route.post('/player/get_all_support_numbers', controller.player.get_all_support_numbers)

//upcoming match list
route.post('/player/get_upcoming_match', controller.player.upcoming_match_list)
route.post('/player/get_upcoming_ludo_match', controller.player.upcoming_ludo_match_list)

//get links
route.post('/player/get_link', controller.player.get_links) 

//join list according team
route.post('/player/check_join_team', controller.player.join_player_list_according_team)

// join tournament
route.post('/player/tournament_entry', controller.player.joining_torunament_match)

//tournament match length
route.post('/player/get_tournament_match_length', controller.player.get_tournament_match_length)

//get created tournament match_list
route.post('/player/get_created_tournament_match_list', controller.player.get_created_match_tournament)

//tournament_join_list
route.post('/player/tournament_join_list', controller.player.get_tournament_joined_list)

//tour nament statastic
route.post('/player/tournament_statastic_info', controller.player.statastic_palyed_tournament_match_info)

//get tournament rules
route.post('/player/get_tournament_rules', controller.player.get_tournament_rules)

//get all type rules
route.post('/player/get_all_type_rules', controller.player.get_rules_according_type)

//freefire premium match length
route.post('/player/get_freefire_premium_match_length', controller.player.get_freefire_premium_match_length)

//freefire grand match length
route.post('/player/get_freefire_grand_match_length', controller.player.get_freefire_grand_match_length)

//read message
route.post('/player/read_a_message', controller.player.read_message)

//get msg from admin
route.post('/player/read_admin_message', controller.player.read_message_from_admin)




//admin

route.post('/admin/test', controller.admin.test)
route.post('/admin/login', controller.admin.login)
route.post('/admin/refresh_token', controller.admin.refresh_token)
route.post('/admin/get_games', controller.admin.get_all_games)
route.post('/admin/play_type', controller.admin.get_all_playing_type)
route.post('/admin/add_new_match', controller.admin.add_match)
route.post('/admin/new_add_new_match', controller.admin.new_add_match)
route.post('/admin/add_automated_cs_match', controller.admin.add_automated_cs_match)
route.post('/admin/move_to_ongoing', controller.admin.match_move_to_ongoing)
route.post('/admin/back_to_created_list', controller.admin.match_back_to_created_list)
route.post('/admin/get_created_matches_list', controller.admin.get_created_match)
route.post('/admin/get_automated_cs_match_list', controller.admin.get_created_automated_cs_match)
route.post('/admin/get_edit_match_info', controller.admin.get_edit_match_info)
route.post('/admin/delete_match', controller.admin.remove_match)
route.post('/admin/get_ongoing_matches_list', controller.admin.get_ongoing_match)
route.post('/admin/move_to_result', controller.admin.match_move_to_result)
route.post('/admin/get_result_matches_list', controller.admin.get_result_match)
route.post('/admin/get_result_match_info', controller.admin.result_match_info)
route.post('/admin/each_player_result_info', controller.admin.get_each_player_result_update_info)
route.post('/admin/giving_match_result', controller.admin.giving_result)
route.post('/admin/get_add_money_request', controller.admin.show_add_money_request)
route.post('/admin/get_withdraw_money_request', controller.admin.show_withdraw_money_request)
route.post('/admin/get_withdraw_money_request_type', controller.admin.show_withdraw_money_request_type)
route.post('/admin/accepted_add_money', controller.admin.add_money_accepted)
route.post('/admin/rejected_add_money', controller.admin.add_money_rejected)
route.post('/admin/accepted_withdraw_money', controller.admin.withdraw_money_accepted)
route.post('/admin/rejected_withdraw_money', controller.admin.withdraw_money_rejected)
route.post('/admin/update_rules', controller.admin.update_rules)
route.post('/admin/get_user', controller.admin.get_user)
route.post('/admin/get_all_add_withdraw_history_bu_admin', controller.admin.get_all_add_withdraw_list_by_admin)
route.post('/admin/block_unblock_user', controller.admin.block_and_unblock_an_user)
route.post('/admin/update_user_balance', controller.admin.edit_user_balance)
route.post('/admin/update_payment_number', controller.admin.update_payment_number)
route.post('/admin/update_support_number', controller.admin.update_support_number)
route.post('/admin/get_rules', controller.admin.get_rules)
route.post('/admin/update_room_info', controller.admin.update_room_id_pass)
route.post('/admin/NotificationForall', controller.admin.send_notification_to_all)
route.post('/admin/get_fireefire_rules', controller.player.get_freefire_rules)
route.post('/admin/update_freefire_rules', controller.admin.update_freefire_rules)
route.post('/admin/update_match_info', controller.admin.update_match_info)
route.post('/admin/refunded', controller.admin.give_refund)
route.post('/admin/delete_match', controller.admin.remove_match)
route.post('/admin/search_account_activity', controller.admin.get_search_account_activity)
route.post('/admin/get_daily_profit_freefire', controller.admin.get_account_statastic_freefire)

route.post('/admin/add_ludo_match', controller.admin.add_ludo_match)
route.post('/admin/add_new_ludo_match', controller.admin.add_new_ludo_match)
route.post('/admin/edit_ludo_match', controller.admin.edit_ludo_match)
route.post('/admin/get_created_ludo_match_list', controller.admin.get_created_ludo_match)
route.post('/admin/update_ludo_roomcode', controller.admin.update_ludo_match_roomcode)
route.post('/admin/remove_ludo_match', controller.admin.remove_ludo_match)
route.post('/admin/move_ludo_ongoing', controller.admin.ludo_match_move_to_ongoing)
route.post('/admin/move_ludo_result', controller.admin.ludo_match_move_to_result)
route.post('/admin/get_ongoing_ludo_match_list', controller.admin.get_ongoing_ludo_match)
route.post('/admin/get_result_ludo_match_list', controller.admin.get_result_ludo_match)
route.post('/admin/get_ludo_result_info', controller.admin.ludo_result_match_info)
route.post('/admin/update_ludo_result', controller.admin.giving_ludo_result)
route.post('/admin/give_ludo_refund', controller.admin.give_ludo_refund)
route.post('/admin/update_ludo_rules', controller.admin.update_ludo_rules)
route.post('/admin/update_youtube_link', controller.admin.update_ludo_links)
route.post('/admin/update_result_done', controller.admin.update_ludo_result_done)
route.post('/admin/check_ludo_join_list', controller.admin.ludo_join_list)
route.post('/admin/view_ludo_image', controller.admin.show_ludo_image)
route.post('/admin/get_user_ludo_statastic', controller.admin.get_datewise_ludo_statastic)
route.post('/admin/get_add_amount_history', controller.admin.get_datewise_add_money_history)
route.post('/admin/get_daily_profit_ludo', controller.admin.get_account_statastic_ludo)

route.post('/admin/get_sub_admins', controller.admin.get_sub_admin)
route.post('/admin/block_unblock_sub_admin', controller.admin.block_unblock_sub_admin)
route.post('/admin/check_sub_admin_status', controller.admin.get_sub_admin_status)

//sliders

route.post('/admin/create_slider', controller.admin.add_new_slider)
route.post('/admin/get_slider_list', controller.admin.show_slider_list)
route.post('/admin/active_inactive_slider', controller.admin.active_inactive_slider)


//add admin
route.post('/admin/check_add_admin_permission', controller.admin.add_admin_option)
route.post('/admin/add_new_admin', controller.admin.add_a_admin)

//pop up
route.post('/admin/update_popup_status', controller.admin.update_popup_status)
route.post('/admin/get_popup_status', controller.admin.get_popup_status)
route.post('/admin/add_popup', controller.admin.add_new_pop_up)

//withdraw info
route.post('/admin/get_withdraw_info_history', controller.admin.get_withdraw_history)

//add notice
route.post('/admin/add_new_notice', controller.admin.create_notice)

//update support number
route.post('/admin/update_support_numbers', controller.admin.update_all_support_number)

//update message in ludo match
route.post('/admin/update_ludo_message', controller.admin.add_a_message)

//join_player_list
route.post('/admin/check_joined_player', controller.admin.join_player_list)

//remove_user_from_join_list
route.post('/admin/remove_user', controller.admin.remove_user_from_match)

//refund before match
route.post('/admin/refund_before_match', controller.admin.refound_before_match)

//all types account activity
route.post('/admin/see_accept_and_rejected_list', controller.admin.show_all_account_activity)

//add link
route.post('/admin/add_link', controller.admin.add_new_link)

//image notification
route.post('/admin/send_image_notifications', controller.admin.send_iamge_notification_to_all)

//free fire match notification
route.post('/admin/send_match_notification', controller.admin.notification_for_match)

//ludo match notification
route.post('/admin/notification_for_ludo_match', controller.admin.notification_for_ludo_match)

//remove before ludo match start
route.post('/admin/remove_user_from_ludo', controller.admin.remove_user_from_ludo_match)

//refund befor ludo match start
route.post('/admin/refund_before_ludo_start', controller.admin.refund_user_from_ludo_match)

//add money info
route.post('/admin/get_add_info_history', controller.admin.get_add_money_history)

//update note admin free fire
route.post('/admin/update_admin_note_freefire', controller.admin.update_a_note_for_admin_free_fire)

//update note admin ludo
route.post('/admin/update_admin_note_ludo', controller.admin.update_a_note_for_admin_ludo)

//update tournament rules
route.post('/admin/update_tournament_rules', controller.admin.update_tournament_rules)

//update all rules
route.post('/admin/update_all_rules', controller.admin.update_rules_according_type)

//message send
route.post('/admin/send_message', controller.admin.send_message_to_client)

//get sub admin withdraw history
route.post('/admin/get_sub_admin_withdraw_history', controller.admin.get_todays_withdaw_history)

//check sub-admin withdraw_history
route.post('/admin/check_sub_admin_withdraw_history', controller.admin.check_subadmin_todays_withdaw_history)

//sub admin withdraw history
route.post('/admin/sub_admin_withdraw_history', controller.admin.get_sub_admin_withdraw_history)

// sub admin datewise withdraw history
route.post('/admin/get_subadmin_withdraw_daily_history', controller.admin.get_datewise_withdraw_history)

// datewise add history
route.post('/admin/get_add_money_daily_history', controller.admin.get_datewise_add_history)

//add promoter
route.post('/admin/add_promoter', controller.admin.add_a_promoter)

//get promoter list
route.post('/admin/get_promoter_list', controller.admin.get_promoter_list)

//update promoter info
route.post('/admin/update_promoter_info', controller.admin.update_promoter_info)

//user avobe 500 balance
route.post('/admin/get_user_avobe_500_info', controller.admin.player_account_avobe_five_hundrad)
route.post('/admin/income_from_refer', controller.admin.get_total_refer_earn)
route.post('/admin/get_freefire_earn_history', controller.admin.get_total_freefire_earn_history)
route.post('/admin/get_ludo_earn_history', controller.admin.get_total_ludo_earn_history)
route.post('/admin/get_add_withdraw_history', controller.admin.get_add_withdraw_history)

// admin to user messages
route.post('/admin/send_a_message_to_user', controller.admin.add_new_message)

//sub admin host history
route.post('/admin/sub_admin_host_history', controller.admin.get_subadmin_host_history)

//dashboard
route.post('/admin/get_total_user', controller.admin.dashboard_total_user)

route.post('/admin/get_new_user', controller.admin.dashboard_new_join_user)
route.post('/admin/get_pass_change_req', controller.admin.dashboard_pass_change_request)
route.post('/admin/get_new_active_user', controller.admin.dashboard_new_active_user)
route.post('/admin/get_old_active_user', controller.admin.dashboard_old_active_user)
route.post('/admin/get_today_firefire_join', controller.admin.dashboard_today_firefire_join)
route.post('/admin/get_today_ludo_join', controller.admin.dashboard_today_ludo_join)
route.post('/admin/get_today_profit', controller.admin.dashboard_today_profit)
route.post('/admin/get_monthly_profit', controller.admin.dashboard_month_profit)


//***************************************************buy and sell***************************************************************************************

//add products
route.post('/admin/buy-and-sell/add_products', buyAndSell.admin.add_new_product)

//get products
route.post('/admin/buy-and-sell/get_all_products', buyAndSell.admin.get_products)


// update amount
route.post('/admin/buy-and-sell/update_percent_amount', buyAndSell.admin.update_percentage)

// remove product
route.post('/admin/buy-and-sell/remove_product', buyAndSell.admin.delete_product)


//client section


// remove product
route.post('/player/buy-and-sell/get_product_list', buyAndSell.player.get_shop_product_list)


//################################# Promoter Admin ################################################
route.post('/promoter-admin/login', promoter.admin.login)
route.post('/promoter-admin/add_a_link', promoter.admin.add_a_link)
route.post('/promoter-admin/add_new_history', promoter.admin.add_promoter_history)
route.post('/promoter-admin/get_profile', promoter.admin.get_profile)
route.post('/promoter-admin/get_links', promoter.admin.get_links)
route.post('/promoter-admin/get_memories', promoter.admin.get_memories)
route.post('/promoter-admin/add_slider', promoter.admin.add_new_promoter_slider)
route.post('/promoter-admin/get_active_sliders', promoter.admin.aget_sliders)
route.post('/promoter-admin/delete_slider', promoter.admin.remove_slider)

//################################# Promoter Client ################################################
route.post('/promoter-client/get_promoter_info', promoter.client.get_promoter_info)
route.post('/promoter-client/get_links', promoter.client.get_promoter_links)
route.post('/promoter-client/get_histories', promoter.client.get_promoter_history)
route.post('/promoter-client/get_sliders', promoter.client.get_sliders)

//***************************************************Arena Of Valor***************************************************************************************

//admin
route.post('/admin/arena-of-valor/add_match', arenaOfValor.admin.add_arena_of_valor_match)
route.post('/admin/arena-of-valor/edit_match', arenaOfValor.admin.edit_arena_of_valor_match)
route.post('/admin/arena-of-valor/delete_match', arenaOfValor.admin.remove_arena_of_match)
route.post('/admin/arena-of-valor/get_created_match_list', arenaOfValor.admin.get_created_arena_of_valor_match)
route.post('/admin/arena-of-valor/move_to_ongoing', arenaOfValor.admin.arena_of_valor_match_move_to_ongoing)
route.post('/admin/arena-of-valor/update_roomcode', arenaOfValor.admin.update_arena_of_valor_match_roomcode)
route.post('/admin/arena-of-valor/get_ongoing_list', arenaOfValor.admin.get_ongoing_arena_of_valor_match)
route.post('/admin/arena-of-valor/move_to_result', arenaOfValor.admin.arena_of_valor_match_move_to_result)
route.post('/admin/arena-of-valor/get_result_list', arenaOfValor.admin.get_result_arena_of_valor_match)
route.post('/admin/arena-of-valor/get_result_match_info', arenaOfValor.admin.result_match_info)
route.post('/admin/arena-of-valor/get_each_result_match_info', arenaOfValor.admin.get_each_player_result_update_info)
route.post('/admin/arena-of-valor/giving_result', arenaOfValor.admin.giving_result)
route.post('/admin/arena-of-valor/giving_refund', arenaOfValor.admin.give_refund)
route.post('/admin/arena-of-valor/update_nodes', arenaOfValor.admin.update_a_note_for_admin)




//player
route.post('/player/arena-of-valor/get_match_length', arenaOfValor.player.get_match_length)
route.post('/player/arena-of-valor/get_each_type_match_length', arenaOfValor.player.get_each_match_length)
route.post('/player/arena-of-valor/get_created_match_list', arenaOfValor.player.get_created_match_list)
route.post('/player/arena-of-valor/get_ongoing_match_list', arenaOfValor.player.get_ongoing_match)
route.post('/player/arena-of-valor/get_result_match_list', arenaOfValor.player.get_paginated_result_list)
route.post('/player/arena-of-valor/match_entry', arenaOfValor.player.match_entry)
route.post('/player/arena-of-valor/join_player_list', arenaOfValor.player.join_player_list_according_team)
route.post('/player/arena-of-valor/result_match_info', arenaOfValor.player.get_result_match_info)
route.post('/player/arena-of-valor/statastic_match_info', arenaOfValor.player.statastic_palyed_match_info)
//iioooo

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Ludo App%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
route.post('/ludo-app/v1/user-login', ludoApp.app.ludo_login)
route.post('/ludo-app/v1/user-profile-info', ludoApp.app.get_profile_info)
route.post('/ludo-app/v1/user-ludo-statastic', ludoApp.app.statastic_palyed_ludo_match_info)
route.post('/ludo-app/v1/get-slider-list', ludoApp.app.show_slider_list)

//admin
route.post('/admin/ludo-app/v1/upload-slider', ludoAppAdmin.admin.add_new_slider)
route.post('/admin/ludo-app/v1/slider-list', ludoAppAdmin.admin.show_slider_list)
route.post('/admin/ludo-app/v1/active-inactive-slider', ludoAppAdmin.admin.active_inactive_slider)

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Tournament %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//admin
route.post('/admin/tournament/add_new_tournament', tournament.admin.add_a_tournament)
route.post('/admin/tournament/get_tournament_list', tournament.admin.get_tournament_list)

//player
route.post('/player/tournament/get_tournament_list', tournament_team.player.get_tournament_list)

module.exports = route