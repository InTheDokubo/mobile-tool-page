const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function setup(){
  const nodes=new Map(),timers=[];
  const element=()=>({children:[],classList:{add(){}},setAttribute(){},append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},innerHTML:'',textContent:''});
  const context={document:{querySelector(s){if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)},createElement:element},structuredClone,Math,setTimeout(fn){timers.push(fn)}};
  vm.createContext(context);
  vm.runInContext(source.replace(/\}\)\(\);\s*$/,'globalThis.api={G,init,choose,selectTarget,attack,defend,combinedAttribute,validArmor,useItem,confirmExchange,cards};})();'),context);
  const a=context.api;a.init();timers.length=0;a.G.turn=0;
  return {a,timers,nodes,card:id=>structuredClone(a.cards.find(c=>c.id===id))};
}
const tests={
  'initial values'(){const {a}=setup();assert.equal(a.G.players[0].gold,20);assert.equal(a.G.players[0].hand.length,9)},
  'attribute composition'(){const {a}=setup();const mix=(...attrs)=>a.combinedAttribute(attrs.map(attr=>({attr})));assert.equal(mix('light','fire'),'fire');assert.equal(mix('light','dark'),'none');assert.equal(mix('fire','water'),'none');assert.equal(mix('light','light'),'light');assert.equal(mix('none','fire'),'none')},
  'inspect unusable card without selecting'(){const {a,card,nodes}=setup();a.G.players[0].hand=[card('plate')];a.choose(0);assert.equal(a.G.selected.length,0);assert.match(nodes.get('#preview').innerHTML,/鋼の鎧/)},
  'self target and selection toggle'(){const {a,card}=setup();a.G.players[0].hand=[card('hammer')];a.selectTarget(0);assert.equal(a.G.target,0);a.choose(0);assert.equal(a.G.selected.length,1);a.choose(0);assert.equal(a.G.selected.length,0)},
  'rainbow keeps other guards through confirmation'(){const {a,card,timers}=setup();a.G.players[0].hand=[card('rainbow'),card('wall')];a.attack(1,0,[card('ray')],false);a.choose(0);a.choose(1);a.defend();assert.equal(a.G.pending.guards.length,2);timers.shift()();assert.equal(a.G.players[0].hp,40)},
  'removing rainbow removes incompatible guards'(){const {a,card}=setup();a.G.players[0].hand=[card('rainbow'),card('wall')];a.attack(1,0,[card('ray')],false);a.choose(0);a.choose(1);a.choose(0);assert.equal(a.G.selected.length,0)},
  'exchange conserves total and consumes once'(){const {a,card}=setup();const p=a.G.players[0];p.hand=[card('trade')];a.useItem(0,p.hand[0],0);Object.assign(a.G.exchange.draft,{hp:50,mp:10,gold:10});assert.equal(a.confirmExchange(),true);assert.equal(p.hp+p.mp+p.gold,70);assert.equal(p.hand.length,1);assert.equal(a.confirmExchange(),false)},
  'invalid exchange rejected without consuming'(){const {a,card}=setup();const p=a.G.players[0];p.hand=[card('trade')];a.useItem(0,p.hand[0],0);a.G.exchange.draft.hp=999;assert.equal(a.confirmExchange(),false);assert.equal(p.hp,40);assert.equal(p.hand[0].id,'trade')},
  'restart invalidates pending damage'(){const {a,card,timers}=setup();a.attack(1,0,[card('hammer')],false);a.defend();const stale=timers.shift();a.init();stale();assert.equal(a.G.players[0].hp,40);assert.equal(a.G.pending,null)},
  'sale never steals a card'(){const {a,card}=setup();a.G.players[0].hand=[card('sell')];const n=a.G.players[1].hand.length;a.useItem(0,a.G.players[0].hand[0],0);assert.equal(a.G.players[1].hand.length,n);assert.equal(a.G.players[0].hand[0].id,'sell')}
};
for(const [name,test] of Object.entries(tests)){test();console.log('PASS',name)}
