const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');
const root=path.resolve(__dirname,'..');const cli=path.join(root,'bin/cli.cjs');
function run(args,env={}) { return spawnSync(process.execPath,[cli,...args],{encoding:'utf8',env:{...process.env,...env}}); }
test('help, marketplace root, and invalid command',()=>{assert.equal(run(['--help']).status,0);assert.equal(run(['path']).stdout.trim(),root);assert.equal(run(['invalid']).status,1);});
test('installer passes paths as single arguments and stops on failure',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'plugin npm test '));
 try {
 const hook=path.join(temp,'mock.cjs');const log=path.join(temp,'calls.jsonl');
 fs.writeFileSync(hook,`require('fs').appendFileSync(process.env.CALL_LOG,JSON.stringify(process.argv.slice(1))+'\\n');process.exit(Number(process.env.MOCK_STATUS||0));`);
 const env={CODEX_BIN:process.execPath,NODE_OPTIONS:'--require '+JSON.stringify(hook),CALL_LOG:log};
 // NODE_OPTIONS belongs to mock children only, not the installer itself.
 const runner=`process.env.NODE_OPTIONS=process.env.MOCK_OPTIONS;require(${JSON.stringify(cli)});`;
 // -e changes argv layout, so set the normal command explicitly.
 const normalRunner=`process.argv=['node',${JSON.stringify(cli)},'install'];`+runner;
 function invoke(status) {return spawnSync(process.execPath,['-e',normalRunner],{encoding:'utf8',env:{...process.env,CODEX_BIN:process.execPath,MOCK_OPTIONS:env.NODE_OPTIONS,CALL_LOG:log,MOCK_STATUS:String(status)}});}
 let result=invoke(0);assert.equal(result.status,0,result.stderr);
 let calls=fs.readFileSync(log,'utf8').trim().split('\n').map(JSON.parse).map(args=>[path.basename(args[0]),...args.slice(1)]);assert.deepEqual(calls,[['plugin','marketplace','add',root],['plugin','add','progress-checklist@progress-checklist-local']]);
 fs.writeFileSync(log,'');result=invoke(7);assert.equal(result.status,7);assert.equal(fs.readFileSync(log,'utf8').trim().split('\n').length,1);
 } finally {fs.rmSync(temp,{recursive:true,force:true});}
});
