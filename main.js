// 초기 상태
let crateMatrix = []; // 이중배열 자료구조
let pointCompass = [0, 0]; // 초기 좌표
let objData = []; // 문제 Data

// DOM

// 공통영역
const $matrix = document.querySelector('.matrix');
const $solveExam = document.querySelector('.solve-exam');
const $crateExam = document.querySelector('.crate-exam');

// 문제 출제 좌표 관련
const $pointCompass = document.querySelector('.point-of-the-compass');
const $dirX = document.getElementById('dirX');

// 문제 출제 text
const $crateValue = document.querySelector('.crate-value');
const $crateCaption = document.querySelector('.crate-caption-value');
const $warningMaxInputText = document.querySelector('.warning-max-input-text');
const $warningMacthInputText = document.querySelector('.warning-macth-input-text');
const $warningEmtpyInputText = document.querySelector('.warning-empty-input-text');
const $warningEmtpyCaptionText = document.querySelector('.warning-empty-caption-text');

// 문제 출제 btn
const $btnCrateSubmit = document.querySelector('.btn-crate-submit');
const $btnCrateInit = document.querySelector('.btn-crate-init');
const $btnSolveExam = document.querySelector('.btn-solve-exam');
const $btnCrateExam = document.querySelector('.btn-crate-exam');


// 랜더 함수
const render = () => {
  let htmlMatrix = '';
  crateMatrix.forEach((innerMatrix, yIndex) => {
    htmlMatrix += `<div class="y${yIndex}">`;
    innerMatrix.forEach((value, xIndex) => {
      htmlMatrix += `<div class="x${xIndex} contentBox">${value}</div>`;
    });
    htmlMatrix += '</div>';
  });
  $matrix.innerHTML = htmlMatrix;
};


// 최초 실행 시 랜더 함수
const firstRander = () => {
  crateMatrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));
  render();
};
window.onload = firstRander;


// 좌표 취득 함수
const getPointOfCompass = target => {
  pointCompass = [`${target.className.match(/[0-9]+/)}`, `${target.parentElement.className.match(/[0-9]+/)}`];
  $pointCompass.innerHTML = `X축 좌표 : ${pointCompass[0]}<br>Y축 좌표 : ${pointCompass[1]}`;
};


// 문자 삽입 함수
const setDataToMatrix = () => {
  const getValue = [...$crateValue.value];
  const tempMatrix = [...crateMatrix];

  getValue.forEach((value, i) => {
    if ($dirX.checked) {
      tempMatrix[+pointCompass[1]][+pointCompass[0] + i] = value;
    } else {
      tempMatrix[+pointCompass[1] + i][+pointCompass[0]] = value;
    }
  });
  crateMatrix = tempMatrix;
  render();
};


// 좌표 취득 이벤트
$matrix.onclick = ({ target }) => {
  if (!target.matches('.contentBox')) return;
  getPointOfCompass(target);
};


// 문제 출제 이벤트
$btnCrateSubmit.onclick = () => {
  setDataToMatrix();
};
