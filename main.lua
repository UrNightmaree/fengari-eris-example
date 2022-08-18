--[[ Setting Up ]]--
local js = require 'js'
local new = js.new
local g = js.global

local jsext = require 'ext.jsext' -- Getting jsext.lua, see ext/jsext.lua

local Eris = require 'eris' -- Getting Eris package
require 'dotenv':config(); local process = g.process -- Setting up dotenv

--[[ Code ]]--
local bot = new(Eris,process.env.TOKEN,jsext.toJSObject {
  intents = jsext.toJSArray {
    'guildMessages'
  }
}) -- Setting up bot

bot:once('ready',function()
  print('Bot ready!')
  print('Logging in as'..bot.user.username..'#'..bot.user.discriminator)
end)

bot:on('messageCreate',function(_,msg) -- The '_' param is a JS 'this' object/keyword
  local sendMsg = function(ch,cn)
    bot:createMessage(ch,cn)
  end

  local content = msg.content
  local channel = msg.channel
  
  if content == 'ping' then
    sendMsg(channel.id,'Pong!')
  end
end)

bot:connect()
