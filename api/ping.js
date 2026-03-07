import net from "net";

const project="vless-panel";

async function getServers(){

const url=`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/vpn_keys`;

const res=await fetch(url);
const data=await res.json();

let servers=[];

if(data.documents){

for(let doc of data.documents){

let f=doc.fields;

let key=f.key.stringValue;
let name=f.name.stringValue;

try{

const u=new URL(key);

servers.push({
name,
host:u.hostname,
port:parseInt(u.port || 443)
});

}catch{}

}

}

return servers;

}

function check(host,port){

return new Promise(resolve=>{

const start=Date.now();

const socket=new net.Socket();

socket.setTimeout(3000);

socket.connect(port,host,()=>{

const ping=Date.now()-start;

socket.destroy();

resolve({
status:"online",
ping
});

});

socket.on("error",()=>{
resolve({status:"offline",ping:null});
});

socket.on("timeout",()=>{
socket.destroy();
resolve({status:"offline",ping:null});
});

});

}

export default async fu
