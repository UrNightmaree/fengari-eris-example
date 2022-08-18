local jsext = {}

local js = require 'js'
local new = js.new
local g = js.global

jsext.toJSArray = function(tbl)
  if type(tbl) ~= 'table' then
    error('Expected table, got '..type(tbl),1)
    os.exit(1)
  end

  local a = new(g.Array)

  for i,v in pairs(tbl) do
    if not tostring(i):find('^%D+$') then
      a[i - 1] = v
    end
  end

  return a
end

jsext.toJSObject = function(tbl)
  if type(tbl) ~= 'table' then
    error('Expected table, got '..type(tbl),1)
    os.exit(1)
  end

  local o = new(g.Object)

  for i,v in pairs(tbl) do
    if not tostring(i):find('^%d+$') then
      o[i] = v
    end
  end

  return o
end

jsext.toJSString = function(s)
  if type(s) ~= 'string' then
    error('Expected string, got '..type(s),1)
    os.exit(1)
  end

  return new(g.String,s)
end

jsext.config = function()
  for i, v in pairs(jsext) do
    if i ~= 'config' then
     _G[i] =  v
    end
  end
end

return jsext
