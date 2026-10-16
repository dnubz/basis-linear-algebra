(function(root){
'use strict';
const abs=n=>n<0n?-n:n;
function gcd(a,b){a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b];}return a||1n;}
class Q{
 constructor(n,d=1n){n=BigInt(n);d=BigInt(d);if(!d)throw Error('A fraction cannot have a zero denominator.');if(d<0n){n=-n;d=-d;}let g=gcd(n,d);this.n=n/g;this.d=d/g;}
 static parse(s){s=String(s).trim();if(s.length>24)throw Error('Use numbers with at most 24 characters.');if(/^[+-]?\d+\/[+-]?\d+$/.test(s)){let [n,d]=s.split('/');return new Q(n,d);}if(!/^[+-]?(?:\d+(?:\.\d{0,6})?|\.\d{1,6})$/.test(s))throw Error('Enter an integer, decimal (up to 6 places), or fraction such as 2/3.');let sign=s.startsWith('-')?-1n:1n;s=s.replace(/^[+-]/,'');let [a,b='']=s.split('.');return new Q(sign*BigInt((a||'0')+b),10n**BigInt(b.length));}
 add(q){return new Q(this.n*q.d+q.n*this.d,this.d*q.d);} sub(q){return new Q(this.n*q.d-q.n*this.d,this.d*q.d);} mul(q){return new Q(this.n*q.n,this.d*q.d);} div(q){return new Q(this.n*q.d,this.d*q.n);} neg(){return new Q(-this.n,this.d);} get zero(){return this.n===0n;} toString(){return this.d===1n?String(this.n):this.n+'/'+this.d;} tex(){return this.d===1n?String(this.n):(this.n<0n?'-':'')+'\\frac{'+abs(this.n)+'}{'+this.d+'}';}
}
function rref(input,coefficientCols=input[0].length-1){
 const a=input.map(row=>row.map(v=>v instanceof Q?v:Q.parse(v))),steps=[],pivots=[];
 const snap=label=>steps.push({label,matrix:a.map(row=>row.map(v=>v.toString()))});snap('Initial augmented matrix');let r=0;
 for(let c=0;c<a[0].length&&r<a.length;c++){
  let p=r;while(p<a.length&&a[p][c].zero)p++;if(p===a.length)continue;
  if(p!==r){[a[p],a[r]]=[a[r],a[p]];snap('R_{'+(r+1)+'} \\leftrightarrow R_{'+(p+1)+'}');}
  let pivot=a[r][c];if(pivot.toString()!=='1'){a[r]=a[r].map(v=>v.div(pivot));snap('R_{'+(r+1)+'} \\leftarrow ('+new Q(1n).div(pivot).tex()+')R_{'+(r+1)+'}');}
  for(let i=0;i<a.length;i++)if(i!==r&&!a[i][c].zero){let f=a[i][c];a[i]=a[i].map((v,j)=>v.sub(f.mul(a[r][j])));snap('R_{'+(i+1)+'} \\leftarrow R_{'+(i+1)+'} - ('+f.tex()+')R_{'+(r+1)+'}');}
  if(c<coefficientCols)pivots.push(c);r++;
 }
 const inconsistent=a.some(row=>row.slice(0,coefficientCols).every(v=>v.zero)&&!row[coefficientCols].zero);
 return {matrix:a,steps,pivots,rank:pivots.length,free:Array.from({length:coefficientCols},(_,i)=>i).filter(i=>!pivots.includes(i)),type:inconsistent?'none':pivots.length===coefficientCols?'unique':'infinite'};
}
function eigen(a,b,c,d){
 const scale=Math.max(Math.abs(a),Math.abs(b),Math.abs(c),Math.abs(d));if(![a,b,c,d].every(Number.isFinite)||scale>1e6)throw Error('Use finite matrix entries between −1,000,000 and 1,000,000.');
 const t=a+d,det=a*d-b*c,disc=(a-d)*(a-d)+4*b*c,tol=1e-12*Math.max(scale*scale,1e-300);
 if(disc < -tol)return{trace:t,det,disc,complex:true,real:t/2,imag:Math.sqrt(-disc)/2,values:[]};
 const repeated=Math.abs(disc)<=tol;const sq=Math.sqrt(Math.max(0,disc));let l1=(t+(t>=0?sq:-sq))/2,l2=l1===0?0:det/l1;let values=repeated?[t/2]:[Math.max(l1,l2),Math.min(l1,l2)];
 const scalar=repeated&&Math.abs(b)<=1e-12*Math.max(scale,1e-300)&&Math.abs(c)<=1e-12*Math.max(scale,1e-300)&&Math.abs(a-d)<=1e-12*Math.max(scale,1e-300);
 const vectors=values.map(l=>{let r1=[a-l,b],r2=[c,d-l],r=Math.hypot(...r1)>Math.hypot(...r2)?r1:r2;let v=[-r[1],r[0]],len=Math.hypot(...v);return len>0?v.map(x=>x/len):[1,0];});return{trace:t,det,disc,complex:false,values,vectors,repeated,scalar};
}
root.Algebra={Q,rref,eigen};if(typeof module!=='undefined')module.exports=root.Algebra;
})(typeof window==='undefined'?globalThis:window);
