const Sequelize = require('sequelize');

let connection = {
    db:{}
};

// connection.db.sequelize = new Sequelize({
//     database: process.env.database_name,
//     username: process.env.user_name,
//     password: process.env.password,
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     // dialectOptions: {
//     //   ssl: {
//     //     require: true,
//     //     rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//     //   }
//     // },
//     logging: false
//   });
connection.db.sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER_NAME, process.env.DB_PASSWORD, {
  host: 'khelo.czvbazyjxv8r.ap-south-1.rds.amazonaws.com',
  port: 5432,
  dialect: 'postgres',
  logging: false
});
  connection.db.sequelize
  .authenticate()
  .then(() => {
      //console.error('DB Creation done'); 
      connection.db.User = connection.db.sequelize.define('user',{
        metadata:{
          type:Sequelize.JSONB,
          allowNull:false
        },
      });

      // Password Reset Tokens
      connection.db.ResetToken = connection.db.sequelize.define('reset_token',{
        token:{
            type:Sequelize.STRING
            ,allowNull:false
            ,unique:false               
        }
        ,active:{
            type:Sequelize.BOOLEAN
            ,allowNull:false
            ,defaultValue:true,
        }            
        ,metadata:{
            type:Sequelize.JSONB
        }
    });
    //different_type_of_game
    connection.db.Game = connection.db.sequelize.define('game',{
      name:{
          type:Sequelize.STRING
          ,allowNull:true
          ,unique:true                
      }
      ,map:{
        type:Sequelize.STRING
        ,allowNull:true
        ,unique:true                
      }           
      ,metadata:{
          type:Sequelize.JSONB
      }
  });
  //solo, duo, squard
  connection.db.PlayingType = connection.db.sequelize.define('playing_type',{
    type:{
        type:Sequelize.STRING
        ,allowNull:false
        ,unique:true                
    }           
    ,metadata:{
        type:Sequelize.JSONB
    }
  });

  //admin
  connection.db.Admin = connection.db.sequelize.define('admin',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //admin
  connection.db.Robi = connection.db.sequelize.define('robi',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //match
  connection.db.Match = connection.db.sequelize.define('match',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //Entry match
  connection.db.MatchEntry = connection.db.sequelize.define('match_entry',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //ludo match
  connection.db.LudoMatch = connection.db.sequelize.define('ludo_match',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //Entry ludo match
  connection.db.LudoMatchEntry = connection.db.sequelize.define('ludo_match_entry',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  connection.db.AccountingEntry = connection.db.sequelize.define('accounting_entry',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //Rules
 connection.db.Rule = connection.db.sequelize.define('rule',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //Payment_number
  connection.db.PaymentNumber = connection.db.sequelize.define('payment_number',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //Slider
  connection.db.Slider = connection.db.sequelize.define('slider',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  
  //popup status
  connection.db.PopupStatus = connection.db.sequelize.define('popup_status',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //popup
  connection.db.PopUp = connection.db.sequelize.define('pop_up',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //Entry match history
  connection.db.MatchEntryHistory = connection.db.sequelize.define('match_entry_history',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    },
    team_no:{
      type:Sequelize.STRING
      ,allowNull:true
      
  }
  });
  
  //motice
  connection.db.Notice = connection.db.sequelize.define('notice',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //support numbers
  connection.db.SupportNumber = connection.db.sequelize.define('support_number',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //all links
  connection.db.Link = connection.db.sequelize.define('link',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //Message
  connection.db.Message = connection.db.sequelize.define('message',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //Buy and sell
  connection.db.BuyAndSell = connection.db.sequelize.define('buy_and_sell',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //promoter
  connection.db.Promoter = connection.db.sequelize.define('promoter',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //promoter link
  connection.db.PromoterLink = connection.db.sequelize.define('promoter_link',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //promoter History
  connection.db.PromoterHistory = connection.db.sequelize.define('promoter_history',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });
  
  //arena of valor match
  connection.db.ArenaOfValorMatch = connection.db.sequelize.define('arena_of_valor_match',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //arena of valor match entry
  connection.db.ArenaOfValorMatchEntry = connection.db.sequelize.define('arena_of_valor_match_entry',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //Entry match history
  connection.db.ArenaOfValorMatchEntryHistory = connection.db.sequelize.define('arena_of_valor_match_entry_history',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    },
    team_no:{
      type:Sequelize.STRING
      ,allowNull:true
      
  }
  });

  //promoter slider
  connection.db.PromoterSlider = connection.db.sequelize.define('promoter_slider',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //tournament
  connection.db.Tournament = connection.db.sequelize.define('tournament',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

   //Ludo App Slider
   connection.db.LudoAppSlider = connection.db.sequelize.define('ludo_app_slider',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });

  //admin to user message
  connection.db.AdminToUserMessage = connection.db.sequelize.define('admin_to_user_message',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });


  //account log
  connection.db.AccountUpdateLog = connection.db.sequelize.define('account_update_log',{
    metadata:{
      type:Sequelize.JSONB,
      allowNull:false
    }
  });


    //forign key
    connection.db.ResetToken.belongsTo(connection.db.User);

    connection.db.Match.belongsTo(connection.db.Game);
    connection.db.Match.belongsTo(connection.db.PlayingType);
    connection.db.Match.belongsTo(connection.db.Admin);

    connection.db.MatchEntry.belongsTo(connection.db.User);
    connection.db.MatchEntry.belongsTo(connection.db.Match);

    connection.db.AccountingEntry.belongsTo(connection.db.User)
    connection.db.AccountingEntry.belongsTo(connection.db.Admin)
    
    connection.db.LudoMatch.belongsTo(connection.db.Game);
    connection.db.LudoMatch.belongsTo(connection.db.PlayingType);
    connection.db.LudoMatch.belongsTo(connection.db.Admin);

    connection.db.LudoMatchEntry.belongsTo(connection.db.User);
    connection.db.LudoMatchEntry.belongsTo(connection.db.LudoMatch);
    
    connection.db.Slider.belongsTo(connection.db.Admin)
    
    connection.db.PopUp.belongsTo(connection.db.Admin)
    
    connection.db.MatchEntryHistory.belongsTo(connection.db.Match);
    
    connection.db.Notice.belongsTo(connection.db.Admin);
    
     connection.db.Link.belongsTo(connection.db.Admin);
     
     connection.db.Message.belongsTo(connection.db.User)
    connection.db.Message.belongsTo(connection.db.Admin);
    
    connection.db.BuyAndSell.belongsTo(connection.db.Admin);
    
    connection.db.PromoterLink.belongsTo(connection.db.Promoter);
    connection.db.PromoterHistory.belongsTo(connection.db.Promoter);
    connection.db.PromoterSlider.belongsTo(connection.db.Promoter)
    
    connection.db.ArenaOfValorMatch.belongsTo(connection.db.Game);
    connection.db.ArenaOfValorMatch.belongsTo(connection.db.PlayingType);
    connection.db.ArenaOfValorMatch.belongsTo(connection.db.Admin);

    connection.db.ArenaOfValorMatchEntry.belongsTo(connection.db.User);
    connection.db.ArenaOfValorMatchEntry.belongsTo(connection.db.ArenaOfValorMatch);

    connection.db.ArenaOfValorMatchEntryHistory.belongsTo(connection.db.ArenaOfValorMatch);

    connection.db.LudoAppSlider.belongsTo(connection.db.Admin)

    connection.db.AdminToUserMessage.belongsTo(connection.db.User);
    connection.db.AdminToUserMessage.belongsTo(connection.db.Admin);

    connection.db.AccountUpdateLog.belongsTo(connection.db.User)
    connection.db.AccountUpdateLog.belongsTo(connection.db.Admin)



          connection.db.sequelize.sync().then(()=>{
              //console.log('Bug Fixed');
          }).catch(err => {
              //console.error('Unable to connect to the database:', err);
          });
  
  }).catch(err => {
      console.log('Unable to connect to the database:', err);
  });


exports.connection = connection;