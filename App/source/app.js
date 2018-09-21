//jquery
const $ = require('jquery');

//react
const React = require('react');
const ReactDOM = require('react-dom');

//import componenti custom
const GestioneBreadcrumb = require('./component/GestioneBreadcrumb');
const DefinisciButtonGroup = require('./component/DefinisciButtonGroup');
const GestioneStatistiche = require('./component/GestioneStatistiche');
const DefinisciButtonToolbar = require('./component/DefinisciButtonToolbar');
const DefinisciForm = require('./component/DefinisciForm');

//import bootstrap
const Panel = require('react-bootstrap/lib/Panel');

//import gif durante caricamento
const Loading = require('react-loading-animation');

/**Funzioni e variabili utili alla app */
var tastiAzione = [];
var azioniNoBreadcrump = [];
var scelteTabelleContenutoRisorsa = [];
var scelteTabelleAnagrafica = [];
var scelteTabelleUlterioriFiltri = [];
var tastiAzioneTabella = [];
//verifico se pagina richiesta si riferisce a tabella
function seTabella(daCercare){
  const result = 
  scelteTabelleContenutoRisorsa.toString().includes(daCercare) || 
  scelteTabelleAnagrafica.toString().includes(daCercare) || 
  scelteTabelleUlterioriFiltri.toString().includes(daCercare) ? true : false ;
  return result;
}


//https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
//document ready
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    document.body.onbeforeunload = (e) => { 
      $.post('/rimuoviSessione', { ora: Date.now().toString(), fase: 'Bbefore' }); };
  }
}
//funzioni da stabilire a livello di windows o document

//xhr per variabili globali app
$.get('/propsInitApp', function(result){
  tastiAzione = result.tastiAzione;
  azioniNoBreadcrump = result.azioniNoBreadcrump;
  scelteTabelleContenutoRisorsa = result.scelteTabelleContenutoRisorsa;
  scelteTabelleAnagrafica = result.scelteTabelleAnagrafica;
  scelteTabelleUlterioriFiltri = result.scelteTabelleUlterioriFiltri;
  tastiAzioneTabella = result.tastiAzioneTabella;
});

function creaNuoveBriciole(bricOld, newPage){
  //verifico se la pagina è stata gia attraversata:in caso considero l'array da inizio alla posizione della briciola già presente
  let bricNew = [] ;
  let giaPresente = -1;
  for (let i = 0;i < bricOld.length;i++){
    bricNew.push(bricOld[i]);
    if (bricOld[i] == newPage){
      giaPresente = i;
    }
  }
  bricNew.push(newPage);
  //verifico se l'azione è già presente:in caso considero l'array da inizio alla posizione della briciola già presente 
  if (giaPresente >= 0){
    bricNew = bricNew.slice(0, giaPresente + 1);
  }
  return bricNew;
}

//Inizio App
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        intestazione: '',
        isLoading:true, //sempre a true
        tasti: [] ,
        utente: '',
        pagina: '',
        azione: '',
        tabella: '',
        briciole: [],
        disattivaBriciole: false //per default le briciole sono abilitate
      };  
    //metodi per gestire cambio di uno stato specifico, scatenabili da componenti esterni
    this.cambioPaginaDefinisciAzione = this.cambioPaginaDefinisciAzione.bind(this);
    this.cambioPagina = this.cambioPagina.bind(this);
    this.disattivaBriciole = this.disattivaBriciole.bind(this);
    this.gestisciAzioneTabella = this.gestisciAzioneTabella.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("WillReceiveProps");
    console.log(nextProps);
  }
  
  cambioPaginaDefinisciAzione(newPage) {
    //cambio pagina e definisco azione:aggiorno le variabili di stato coinvolte(pagina, breadcrumb, azione)
    this.setState({ pagina: newPage , briciole:creaNuoveBriciole(this.state.briciole, newPage) , azione:newPage});    
  }

  disattivaBriciole(newPage){
    let result = false;
    if (seTabella(newPage) && azioniNoBreadcrump.toString().includes(this.state.azione)){
      result = true;
    }
    return result;
  }

  gestisciAzioneTabella(tastoPremuto){
    let oggettoModifica = {};
    if (tastoPremuto === 'Termina'){
      oggettoModifica.disattivaBriciole = false;
      oggettoModifica.tabella = '';
      oggettoModifica.pagina = this.state.briciole[this.state.briciole.length - 2];
      oggettoModifica.briciole = this.state.briciole.slice(0, this.state.briciole.length - 1);
    }
    if (oggettoModifica){
      this.setState(oggettoModifica);
    }
   
  }

  cambioPagina(newPage) {
    //se le briciole sono disattivate questa funzione non esegue nulla
    if (this.state.disattivaBriciole){
      return;
    }
    //cambio pagina:aggiorno le variabili di stato coinvolte(pagina, breadcrumb, breadcrumb disattive);se torno a Home azzero azione
    this.setState(newPage != 'Home' ? { pagina: newPage , 
                                        briciole:creaNuoveBriciole(this.state.briciole, newPage) , 
                                        disattivaBriciole:this.disattivaBriciole(newPage)} 
                                      : 
                                      { pagina: newPage , 
                                        briciole:creaNuoveBriciole(this.state.briciole, newPage) , 
                                        azione:'' , 
                                        disattivaBriciole:false});
  }

  render() {
    return (
      this.state.isLoading ?
      <Loading/>
        :
      <div className="container">
        <h1>{this.state.intestazione.trim()}</h1>
        <div className="w3-panel w3-orange">
          <h5 className="w3-opacity">Accesso con utente {this.state.utente.trim()}</h5>
        </div>
        <GestioneBreadcrumb briciole={this.state.briciole} disattivo={this.state.disattivaBriciole} callbackParent={this.cambioPagina}/>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">{this.state.pagina}</Panel.Title>
          </Panel.Heading>
            {
              (this.state.pagina == 'Home' &&
              <Panel.Body>
                <DefinisciButtonToolbar tasti={this.state.tasti} callbackParent={this.cambioPaginaDefinisciAzione} />
              </Panel.Body>
              )
              ||
              ( tastiAzione.toString().includes(this.state.pagina) &&
              <Panel.Body>
                <h2>Contenuti e risorse</h2>
                <DefinisciButtonToolbar tasti={scelteTabelleContenutoRisorsa} callbackParent={this.cambioPagina} />
                <br />
                <h2>Anagrafica</h2>
                <DefinisciButtonToolbar tasti={scelteTabelleAnagrafica} callbackParent={this.cambioPagina} />
                <br />
                <h2>Ulteriori filtri su Contenuti</h2>
                <DefinisciButtonToolbar tasti={scelteTabelleUlterioriFiltri} callbackParent={this.cambioPagina} />
              </Panel.Body>
              )
              ||
              (seTabella(this.state.pagina) && 
              <Panel.Body>
                <h2>{this.state.azione} {this.state.pagina}</h2>
                {azioniNoBreadcrump.toString().includes(this.state.azione) &&
                <DefinisciButtonToolbar tasti={tastiAzioneTabella} callbackParent={this.gestisciAzioneTabella}/>}
                <DefinisciForm tabella={this.state.pagina}/>
              </Panel.Body>
              )
              ||
              (this.state.pagina == 'Statistiche' &&
              <Panel.Body> 
               <GestioneStatistiche/>
              </Panel.Body> 
              )
            }
        </Panel>      
      </div>
    );
  }

  componentDidMount(){
    //simulo chiamata asincrona per valorizzare bottoni, ok solo per primo caricamento.
    //Posso invocare setState solo dopo aver "montato" il componente
    //setState(...): Can only update a mounted or mounting component
    let istanza = this;
    $.get('/propsApp', function(result){
      istanza.setState({
        intestazione: result.intestazione,
        isLoading: false, //non ho bisogno di altri dati per visualizzare l'app 
        tasti: result.tasti ,
        utente: result.utente,
        pagina: result.pagina,
        azione: result.azione,
        tabella: result.tabella,
        briciole: result.briciole
      });
    });
  }

  componentDidUpdate() {
    //console.log(`${Date.now()} stato aggiornato`);
  }
}

//render App
ReactDOM.render(
  <App />,
  document.getElementById('react-application')
);







