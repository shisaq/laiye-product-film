// 页面约定（Lemo-Opuscar core）：window.render(t)、DUR、EV、TEXTS、READY。一般不用改这个文件，改 film.js。
import { W, H, EV, LANG, camTransform, anchors, visibleTexts } from './kit.js';
import * as F from './film.js';

const Q = new URLSearchParams(location.search), CAM1 = Q.has('cam1');
const world = document.getElementById('world'), mg = document.getElementById('mg'), hud = document.getElementById('hud');
const blur = document.getElementById('blur'), mbg = document.getElementById('mbg');

window.DUR = F.DUR;
window.EV = EV.slice().sort((a, b) => a.t - b.t);

function render(t) {
  const S = F.frame(t);
  // 1. 先不套镜头，画出界面并量好所有锚点（此时量到的就是世界坐标）
  world.style.transform = mg.style.transform = 'none';
  world.innerHTML = S.world || '';
  const A = anchors(world).all();
  // 2. 镜头（?cam1：固定在 1× 全景，和参考帧对照界面时用）
  const cam = CAM1 ? [W / 2, H / 2, 1] : F.cam.at(t, A);
  world.style.transform = mg.style.transform = camTransform(cam);
  // 3. 甩镜时的运动模糊：由镜头速度算出，加在没有变换的外层上
  const prev = F.cam.at(t - 1 / (F.FPS || 30), A), vx = (cam[0] - prev[0]) * cam[2], vy = (cam[1] - prev[1]) * cam[2];
  const whip = F.cam.whipping(t), bx = whip ? Math.min(30, Math.max(0, Math.abs(vx) - 26) * .3) : 0, by = whip ? Math.min(30, Math.max(0, Math.abs(vy) - 26) * .3) : 0;
  mbg.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`);
  blur.style.filter = bx > .6 || by > .6 ? 'url(#mb)' : '';
  // 4. 世界空间 MG 和屏幕空间 HUD
  mg.innerHTML = S.mg ? S.mg(A, cam) : '';
  hud.innerHTML = S.hud || '';
  window.DBG = { t, cam, A };
}

window.render = render;
window.TEXTS = t => { render(t); return visibleTexts(); };

// 字体：按语言加载用得到的品牌字体；加载失败在控制台报错，check.mjs 也会查
const faces = ['400 40px "LY Mono"', '400 40px "LY Sans EN"', '600 40px "LY Sans EN"', '400 40px "LY Display ZH"']
  .concat(LANG === 'zh' ? ['400 40px "LY Sans ZH"', '500 40px "LY Sans ZH"', '700 40px "LY Sans ZH"'] : ['600 40px "LY Display EN"', '700 40px "LY Display EN"']);
await Promise.all(faces.map(f => document.fonts.load(f).catch(e => console.error(`font failed: ${f} (${e.message})`))));
for (const f of document.fonts) if (f.status === 'error') console.error(`font failed: ${f.family} ${f.weight}`);
await Promise.all((F.ASSETS || []).map(src => { const im = new Image(); im.src = src; return im.decode().catch(() => console.error('image failed: ' + src)); }));

render(+(Q.get('t') || 0));
window.READY = true;
