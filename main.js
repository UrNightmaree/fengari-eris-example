"use strict";

/*
  This script is taken from daurnimator/fengari-electron-example
  and modified a bit by UrNightmaree

  All credits goes to daurnimator
*/

import path from "path";
import { fileURLToPath } from 'url';

import {
  FENGARI_COPYRIGHT,
  to_luastring,
  lua,
  lauxlib,
  lualib
} from 'fengari';

const {
  LUA_ERRSYNTAX,
  LUA_OK,
  LUA_REGISTRYINDEX,
  lua_pcall,
  lua_pop,
  lua_pushstring,
  lua_setglobal,
  lua_setfield,
  lua_tojsstring
} = lua;

const {
  LUA_LOADED_TABLE,
  luaL_checkstack,
  luaL_getsubtable,
  luaL_loadfile,
  luaL_newstate,
  luaL_requiref
} = lauxlib;

const {
  luaL_openlibs
} = lualib;

import {
  luaopen_js,
  push,
  tojs
} from 'fengari-interop';
import { link } from "fs";


const L = luaL_newstate();

/* open standard libraries */
luaL_openlibs(L);
/* js lib */
luaL_requiref(L, to_luastring("js"), luaopen_js, 0);
lua_pop(L, 1); /* remove lib */

const linkLibrary = async (lib,reqname) => {
  luaL_getsubtable(L,LUA_REGISTRYINDEX,LUA_LOADED_TABLE);
  push(L,lib);
  lua_setfield(L,-2,to_luastring(reqname));
  lua_pop(L,1);
}

/*

How to link a JS library?

It's easy. Just do this:

```js
import lib from 'libname';
// Other import...

let reqname = 'lib';

linkLibrary(lib,reqname)
// Other function call...

```

*/

/* Register JS library to Lua */

import eris from 'eris';
import dotenv from 'dotenv';

linkLibrary(eris,'eris')
linkLibrary(dotenv,'dotenv')

/* End of Code */

lua_pushstring(L, to_luastring(FENGARI_COPYRIGHT));
lua_setglobal(L, to_luastring("_COPYRIGHT"));

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
let ok = luaL_loadfile(L, to_luastring(path.join(__dirname, "main.lua")));

if (ok === LUA_ERRSYNTAX) {
	throw new SyntaxError(lua_tojsstring(L, -1));
}
if (ok === LUA_OK) {
	/* Push process.argv[2:] */
	luaL_checkstack(L, process.argv.length-2, null);
	for (let i=2; i<process.argv.length; i++) {
		push(L, process.argv[i]);
	}
	ok = lua_pcall(L, process.argv.length-2, 0, 0);
}
if (ok !== LUA_OK) {
	let e = tojs(L, -1);
	lua_pop(L, 1);
	throw e;
}
