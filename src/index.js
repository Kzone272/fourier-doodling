import {canvas, context, controls} from './draw.js'

document.getElementById("btnRandomize").addEventListener("click", function() {
  controls.randomize();
});
document.getElementById("btnStop").addEventListener("click", controls.pauseAnim);
document.getElementById("btnResume").addEventListener("click", controls.resumeAnim);

window.onload = function() {
  controls.startAnim();

  // canvas.addEventListener('DOMMouseScroll', handleScroll, false);
  // canvas.addEventListener('mousewheel', handleScroll, false);
}
