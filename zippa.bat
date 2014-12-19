@echo off
del "../zipApp/seguimi.zip"
"c:\Programmi\7-Zip\7z.exe" a "../zipApp/seguimi.zip" "*.html"
"c:\Programmi\7-Zip\7z.exe" a "../zipApp/seguimi.zip" "*.xml"
"c:\Programmi\7-Zip\7z.exe" a "../zipApp/seguimi.zip" "*.js"
"c:\Programmi\7-Zip\7z.exe" a "../zipApp/seguimi.zip" "lib"
"c:\Programmi\7-Zip\7z.exe" a "../zipApp/seguimi.zip" "res"
