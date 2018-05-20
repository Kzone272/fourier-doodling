import $ from 'jquery';
import Controls from './Controls';

const controls = new Controls();

const $resume = $('#resume').hide();
const $pause = $('#pause');
const $restart = $('#restart');
const $randomize = $('#randomize');
const $square = $('#square');

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

$square.click(() => {
  controls.square();
  showPause();
});

controls.resume();
showPause();
