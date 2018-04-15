import $ from 'jquery';
import Controls from './draw';

const controls = new Controls();

const $resume = $('#resume').hide();
const $pause = $('#pause');
const $restart = $('#restart');
const $randomize = $('#randomize');

function showResume() {
  $resume.show();
  $pause.hide();
}

function showPause() {
  $resume.hide();
  $pause.show();
}

$resume.click(() => {
  controls.resume();
  showPause();
});

$pause.click(() => {
  controls.pause();
  showResume();
});

$restart.click(() => {
  controls.restart();
  showPause();
});

$randomize.click(() => {
  controls.randomize();
  showPause();
});

controls.resume();
showPause();
