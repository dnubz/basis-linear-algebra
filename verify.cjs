const assert=require('node:assert/strict');
const fs=require('node:fs');
const katex=require('katex');
const {Q,rref,eigen}=require('./docs/engine.js');
let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
eq(Q.parse('-1.25').toString(),'-5/4');eq(Q.parse('2/-6').toString(),'-1/3');assert.throws(()=>Q.parse('1/0'));checks++;
let r=rref([['1','2','5'],['3','4','11']]);eq(r.type,'unique');eq(r.matrix.map(row=>row.map(String)),[['1','0','1'],['0','1','2']]);
r=rref([['1','1','1','3'],['2','2','2','6']],3);eq(r.type,'infinite');eq(r.rank,1);eq(r.free,[1,2]);
r=rref([['1','1','2'],['2','2','5']]);eq(r.type,'none');eq(r.matrix.map(row=>row.map(String)),[['1','1','0'],['0','0','1']]);
r=rref([['0','1','2'],['1','0','3']]);eq(r.matrix.map(row=>row.map(String)),[['1','0','3'],['0','1','2']]);assert(r.steps.some(s=>s.label.includes('leftrightarrow')));checks++;
r=rref([['1/2','1/3','2'],['1','-1','1']]);eq(r.matrix.map(row=>row.map(String)),[['1','0','14/5'],['0','1','9/5']]);
eq(rref([['0','0','0'],['0','0','0']]).type,'infinite');
eq(eigen(4,1,2,3).values,[5,2]);eq(eigen(0,-1,1,0).complex,true);eq(eigen(0,-1,1,0).imag,1);eq(eigen(2,1,0,2).repeated,true);eq(eigen(2,1,0,2).scalar,false);eq(eigen(2,0,0,2).scalar,true);eq(eigen(0,0,0,0).scalar,true);
// Check vector residuals across matrices with real, repeated, and zero roots.
for(const m of [[3,1,0,2],[4,1,2,3],[1,0,0,-1],[2,1,0,2],[0,1,0,0],[0,0,1,0],[-2,3,0,-4],[1e-8,0,0,2e-8]]){const e=eigen(...m);e.values.forEach((l,i)=>{const v=e.vectors[i];assert(Math.hypot(m[0]*v[0]+m[1]*v[1]-l*v[0],m[2]*v[0]+m[3]*v[1]-l*v[1])<1e-10);checks++;});}
// Check exact RREF invariance for deterministic rectangular cases.
let seed=3741;const rand=()=>{seed=(seed*16807)%2147483647;return seed%9-4;};
for(let k=0;k<50;k++){const rows=2+k%3,n=2+(k>>1)%3;const a=Array.from({length:rows},()=>Array.from({length:n+1},()=>String(rand())));const out=rref(a,n),again=rref(out.matrix,n);eq(out.matrix.map(row=>row.map(String)),again.matrix.map(row=>row.map(String)));if(out.type!=='none'){const x=Array.from({length:n},()=>new Q(0));out.pivots.forEach((p,i)=>x[p]=out.matrix[i][n]);a.forEach(row=>eq(row.slice(0,n).reduce((sum,v,i)=>sum.add(Q.parse(v).mul(x[i])),new Q(0)).toString(),Q.parse(row[n]).toString()));}}
const html=fs.readFileSync('docs/index.html','utf8');let formulas=0;for(const match of html.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){katex.renderToString(match[1]??match[2],{throwOnError:true,strict:false});formulas++;}
console.log(`Passed ${checks} algebra checks; ${formulas} lesson formulas rendered without errors.`);
