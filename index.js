var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 3000))
app.use(express.static(__dirname + '/public'))

// app.get('/', function(request, response) {
//   response.sendfile('public/index.html', {root: __dirname })
// })

app.listen(app.get('port'), function() {
  console.log("Angular Wistia Video Uploader is running at localhost:" + app.get('port'))
})
