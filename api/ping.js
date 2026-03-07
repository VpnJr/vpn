import net from "net";

function check(host, port){
  return new Promise((resolve)=>{

    const start = Date.now();
    const socket = new net.Socket();

    socket.setTimeout(3000);

    socket.connect(port, host, ()=>{

      const ping = Date.now() - start;

      socket.destroy();

      resolve({
        status:"online",
        ping: ping
      });

    });

    socket.on("error", ()=>{
      resolve({
        status:"offline",
        ping:null
      });
    });

    socket.on("timeout", ()=>{
      socket.destroy();
      resolve({
        status:"offline",
        ping:null
      });
    });

  });
}

export default async function handler(req,res){

const servers=[

{
name:"Germany 1",
host:"194.87.25.230",
port:443
},

{
name:"Germany 2",
host:"194.87.25.231",
port:443
}

];

let result=[];

for(let s of servers){

const r = await check(s.host,s.port);

result.push({
...s,
...r
});

}

res.json(result);

}
