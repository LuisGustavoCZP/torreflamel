/* Sistema que controla requisiçoes para um servidor, por padrão não leva argumentos */
/* console.log(document.location); */
let ortoPath = document.location.origin;
if(ortoPath.includes("8080")) ortoPath = ortoPath.replace("8080", "8000");
else if(ortoPath.endsWith("/")) ortoPath = ortoPath.slice(0, ortoPath.lastIndexOf("/"));
//document.location.origin.replace("8080", "8000/")
function requestSys (url="http://localhost:8000/" /* ortoPath */) //"https://vacsina.servegame.com:8000/"
{
    /* Nas duas funções de criação abaixo a informação é definida por um objeto e seus atributos */
    /* Função que cria uma query string para ser colocada na rota */
    function createQuery (infos) {
        if(!infos) return "";
        const infokeys = Object.keys(infos);
        if(infokeys.length == 0) return "";
        let query = "?";
        infokeys.forEach((key, i) => 
        {
            query += `${i>0?"&":""}${key}=${infos[key]}`;
        });
        console.log(query);
        return query;
    }
    /* Função que cria uma params string para ser colocada na rota */
    function createParams (infos) {
        
        //console.log(infos);
        if(!infos) return "";
        const infokeys = Object.keys(infos);
        if(infokeys.length == 0) return "";
        let params = "";
        infokeys.forEach((key, i) => 
        {
            params += `${infos[key]}`;
        });
        //console.log(params);
        return params;
    }

    /* Função que faz a verificação da resposta do servidor, retornando true = sucess, false = failed  */
    function verifySession (resp) 
    {
        //console.log(resp);
        if(resp == null) {
            return false;
        }
        return true;
    }

    /* Função que faz um post na rota com um body e as funções de sucesso ou falha */
    async function post (path, body, onsucess = ()=>{}, onfail = ()=>{}, params){
        return fetch(`${url}${params?createParams(params)+"/":""}${path}`, 
        {
            method: 'post',
            mode: 'cors',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(resp => 
        {
            if(verifySession(resp)) { 
                //console.log(resp);
                onsucess(resp); 
            } else onfail (resp);
        })
        .catch(resp => { console.log(resp); onfail(resp); });
    }

    /*  
        Função que faz um post na rota com um info e as funções de sucesso ou falha 
        O parametro info deve conter um objeto nesse modelo:
            { params:{...}, query:{...} }
        Caso nenhuma informação seja passada, o objeto pode ser vazio. Ex : {}
        Caso só params seja usado a query não precisa estar presente no objeto e vice versa. Ex : { params:{...} }
    */
    async function get (path, info, onsucess = (d)=>{}, onfail = (r, u)=>{})
    {
        const params = info.params ? info.params.sessionData != "" ? createParams(info.params)+"/" : "no/" : ""; 
        //console.log(params);
        const urlFinal = info ? `${url}${params}${path}/${createQuery(info.query)}` : `${url}${path}/`;
        //console.log(urlFinal);
        return fetch(urlFinal, 
        {
            method: 'get',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(resp => 
        {
            if(verifySession(resp)) { 
                //console.log(resp);
                onsucess(resp); 
            } else throw new Error("Sessão inválida");
        })
        .catch(resp => { console.log(resp); onfail(resp, true); });
    }

    function URL () {
        return url;
    }

    return { post, get, URL };
}

const RequestSys = requestSys ();

export { RequestSys, requestSys };