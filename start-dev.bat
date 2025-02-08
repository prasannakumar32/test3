@echo off
start cmd /k "cd %~dp0 && node src/proxyServer.js"
start cmd /k "cd %~dp0 && npm start"
