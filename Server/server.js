/*
 Import Node
*/
const fs = require("fs");
const pathUtils = require('path');

var bodyParser = require('body-parser'); //post parser
var cookieSession = require('cookie-session'); //cookie in sessione vedi https://www.npmjs.com/package/cookie-session
var session = require('express-session'); //sessione https://www.npmjs.com/package/express-session
var express = require('express');
var app = express();
var uid = require('uid-safe');
var cookieParser = require('cookie-parser');
var MemcachedStore = require("connect-memcached")(session);

/*
 Import classi di supporto
*/


/*
  Altre funzioni di utilità interne
*/
function ClasseGestServer(){}
ClasseGestServer.prototype.getPortaThread = ()=>{return 8081;};
ClasseGestServer.prototype.getSetupCors = ()=>{'localhost:8081';};
let paramServer = new ClasseGestServer(); 

function controlliIniziali(req, res, next) {
  console.log("--");
  console.log("  " + process.pid);
  console.log("  " + paramServer.getPortaThread());
  console.log(req.session);
  console.log("--");
  //se richiesta non passa da proxy esco
  if (req.headers.host != 'localhost:8081') {
    res.status(403);
    res.end("Vietato");
  }
  
  next();
  //se non c'è sessione esco
  //
  //ATTENZIONE:i path dei file sono relativi alla variabile process.cwd(), in questo caso la directory di cluster
  /*
  console.log(req.session);
  console.log(req.session.utente);
  if (!req.session.utente) {
    fs.readFile("../Server/static/html/loginPage.html", 'utf8', function (err, data) {
      res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.end( data );
    });
  } else {
    //se ok gestisci la chiamata
    console.log("sssss");
    next();
  }
  */
}

/*
 middleware, occhio all'ordine
*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// per sessione
app.use(cookieParser());
//indico presenza di reverse proxy HTTPS a monte
app.set('trust proxy', 1);
//sessione
app.use(session({
  name: 'aNerT54dFGJHTY565r444,mdmnb___v',
  //genid: function(req) {console.log("--Crea id--");return uid.sync(18);}, // use UUIDs for session IDs
  secret: 'keyboard cat',
  key: 'test',
  proxy: 'true',
  resave: false,
  saveUninitialized: false , 
  cookie: {secure: true} ,
  store: new MemcachedStore({
    hosts: ["127.0.0.1:11211"],
    secret: "123, easy as ABC. ABC, easy as 123" // Optionally use transparent encryption for memcache session data
  })
}));

/***************************/
/*******Start server********/
/***************************/
app.listen(paramServer.getPortaThread(), function () {
  console.log(`--server in ascolto su porta ${paramServer.getPortaThread()} e pid ${process.pid}--`);
  console.log(`--Script schedulato da posizione ${process.cwd()}--`);
  console.log("");
});


//GET solo richieste da proxy, gestisco login
app.get('*', function(req,res,next){ 
  if (!req.url.includes('/effettuaLogin') ) {
    controlliIniziali(req, res, next);
  } else {
    next();
  }
});
//POST solo richieste da proxy
app.post('*', function(req,res,next){
  controlliIniziali(req, res, next);
});

//PUT e DELETE proibite
app.put('*', function (req, res) { res.status(403); res.end("Vietato"); });
app.delete('*', function (req, res) { res.status(403); res.end("Vietato"); });

/*
app.get('/effettuaLogin', function(req, res, next){
  console.log(req.query.username);
  console.log(req.query.psw);
  //se user e psw ok creo sessione e mando a login , altrimenti re-inserire utente e psw
  if (req.query.username === 'pippo' && req.query.psw === 'zobeide'){
    console.log("entra");
    req.session.utente = req.query.username;
    //salvo sessione e redirect
    req.session.save(function(err) {
      console.log(req.session);
      res.redirect('/index');
    });
  } else {
    controlliIniziali(req, res, next); 
  }
});
*/

//Pagina applicazione
app.get('/index', function (req, res) {
   fs.readFile( "../App/build/index.html", 'utf8', function (err, data) {
       res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
       res.header('Access-Control-Allow-Methods', 'GET');
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       res.end( data );
   });
});

//Javascript compilato per applicazione
app.get('/crmGestionale.js' , function (req,res){
  fs.readFile( "../App/build/crmGestionale.js", 'utf8', function (err, data) {
    res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.end( data );
  });  
});

//File JavaScript\CSS statici
app.get('/static/:fileStatico.:estensione', function (req,res){
  const pathFile = `../App/source/static/${req.params.fileStatico}.${req.params.estensione}`;
  var rs = fs.createReadStream(pathFile);
  res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200, { "Content-Type": contentTypeForFile(pathFile)});
  rs.pipe(res);
});

//File ICO
app.get('/favicon.ico', function (req,res){
  const pathFile = '../App/source/static/img/Bokehlicia-Captiva-Web-telegram.ico';
 
  var rs = fs.createReadStream(pathFile);

  rs.on('error', function () {
    res.set('Content-Type', 'text/plain');
    res.status(404).end('ICO Not found');
  });

  res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200, { "Content-Type": "image/ico"});
  rs.pipe(res); 
});

//prova chiamata asincrona
app.get('/chiamataAsynch' , function (req,res){
  let result = {errore:"" , handle:`Risposta ${Date.now().toString()}` };
  res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200 , { "Content-Type": "application/json"});
  res.end( JSON.stringify(result) + '\n' );
});

//props App
app.get('/propsApp' , function (req , res){
  function scelteTastiIniziali() {
    return ['Visualizza', 'Inserisci', 'Modifica', 'Cancella', 'Statistiche'];
  }

  let props =
  {
    intestazione: 'Crm Gestione Bot Telegram',
    isLoading:true, //sempre a true
    tasti: scelteTastiIniziali() ,
    utente: 'pippo',
    pagina: 'Home',
    azione: '',
    tabella: '',
    briciole: ['Home']
  };
  res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200 , { "Content-Type": "application/json"});
  res.end( JSON.stringify(props) + '\n' ); 
});

//spedisci al client altre proprietà utili
app.get('/propsInitApp' , function (req,res){
  /**Funzioni utili alla app */
  function tastiAzione() {
    return ['Visualizza', 'Inserisci', 'Modifica', 'Cancella'];
  }

  function azioniNoBreadcrump() {
    return [ 'Inserisci', 'Modifica', 'Cancella']; 
  }

  function scelteTabelleContenutoRisorsa() {
    return ['Contenuto', 'Risorsa'];
  }

  function scelteTabelleAnagrafica() {
    return ['Categoria Risorsa', 'Tipologia Argomento'];
  }

  function scelteTabelleUlterioriFiltri() {
    return ['Contesto Geografico Contenuti'];
  }

  function tastiAzioneTabella() {
    return ['Esegui', 'Reset', 'Termina'];
  }

  let propsInitApp = {
    tastiAzione:tastiAzione(),
    azioniNoBreadcrump:azioniNoBreadcrump(),
    scelteTabelleContenutoRisorsa:scelteTabelleContenutoRisorsa(),
    scelteTabelleAnagrafica:scelteTabelleAnagrafica(),
    scelteTabelleUlterioriFiltri:scelteTabelleUlterioriFiltri(),
    tastiAzioneTabella:tastiAzioneTabella()
  };
  res.header('Access-Control-Allow-Origin', paramServer.getSetupCors());
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200 , { "Content-Type": "application/json"});
  res.end( JSON.stringify(propsInitApp) + '\n' ); 
});

//impostazione form tabella richiesta
app.post('/impostaForm', function (req,res){
  console.log ("--impostaForm--");
  for (let paramBody in req.body){
    console.log(`  ${paramBody}:${req.body[paramBody]}`);
  }
  const props = 
  [ 
    {"type":"FormGroup" , 
     "props": {"key":1}, 
     "children": [
            {"type":"ControlLabel" , "props": {"key":0}, "children":"Campo1 " + req.body.tabella},
            {"type":"FormControl" , "props": {"type": "text", "placeholder": "Inserisci Campo 1" , "key":1}, "children":""},
            {"type":"FormControl.Feedback" , "props": {"key":2}, "children":""},
            {"type":"HelpBlock" , "props": {"key":3}, "children":"Inserire il testo campo1"}
        ]
    } ,
    {"type":"FormGroup" , 
    "props": {"key":2}, 
    "children": [
           {"type":"ControlLabel" , "props": {"key":0}, "children":"Campo2 " + req.body.tabella},
           {"type":"FormControl" , "props": {"type": "text", "placeholder": "Inserisci Campo 2" , "key":1}, "children":""},
           {"type":"FormControl.Feedback" , "props": {"key":2}, "children":""},
           {"type":"HelpBlock" , "props": {"key":3}, "children":"Inserire il testo campo2"}
       ]
   }
  ];
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200 , { "Content-Type": "application/json"});
  res.end( JSON.stringify(props) + '\n' );
});

app.post('/rimuoviSessione', function (req,res){
  console.log ("--Invocata rimuovi sessione--");
  req.session.destroy((err)=>{console.log("--Sessione cancellata--");});
});  

function contentTypeForFile (filePath){
  var ext = pathUtils.extname(filePath);
  switch (ext.toLowerCase()){
    case '.html':return 'text/html';
    case '.js': return 'text/javascript';
    case '.css': return 'text/css';
    case '.jpg': case '.jpeg' : return 'image/jpeg';
    default: return 'text/plain';
  }
}