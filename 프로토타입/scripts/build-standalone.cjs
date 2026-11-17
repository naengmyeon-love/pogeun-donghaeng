const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="style\.css(?:\?[^"]*)?">/,()=>'<style>'+fs.readFileSync(path.join(dist,'style.css'),'utf8')+'</style>');
const scripts=[];
html=html.replace(/<script defer src="([a-z-]+\.js)(?:\?[^"]*)?"><\/script>/g,(_,name)=>{
  scripts.push('<script>'+fs.readFileSync(path.join(dist,name),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
  return '';
});
// Inline scripts run immediately: place them after the app and dialog elements.
html=html.replace('</body>',()=>scripts.join('\n')+'</body>');
fs.writeFileSync(path.join(root,'포근동행-프로토타입.html'),html);
console.log('단일 HTML 갱신 완료: 포근동행-프로토타입.html');
