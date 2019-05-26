copy ..\..\src\js\videocall.js .
call uglifyjs videocall.js -o videocall.min.js -c -m --source-map "root='http://cureanywhere.com/src',url='C:/Debug/videocall.min.js.map',filename='videocall.min.js.map'"

copy /y videocall.min.js.map C:\Debug\
move /y videocall.min.js.map ..\..\src\js\
del videocall.js 