// 초기 상태
let crateMatrix = []; // 이중배열 자료구조
let pointCompass = [0, 0]; // 초기 좌표
let objData = []; // 문제 Data
let overText = true; // 문자 초과
let matchText = true; // 문자 중복
let emptyValue = false;
let emptyCaption = false;
let choiceData = [];


// DOM

// 공통영역
const $matrix = document.querySelector('.matrix');
const $solveExam = document.querySelector('.solve-exam');
const $createExam = document.querySelector('.create-exam');

// 문제 출제 좌표 관련
const $pointCompass = document.querySelector('.point-of-the-compass');
const $dirX = document.getElementById('dirX');

// 문제 출제 text
const $createValue = document.querySelector('.create-value');
const $createCaption = document.querySelector('.create-caption-value');
const $warningMaxInputText = document.querySelector('.warning-max-input-text');
const $warningMacthInputText = document.querySelector('.warning-macth-input-text');
const $warningEmtpyInputText = document.querySelector('.warning-empty-input-text');
const $warningEmtpyCaptionText = document.querySelector('.warning-empty-caption-text');

// 문제 출제 btn
const $btnCreateSubmit = document.querySelector('.btn-create-submit');
const $btnCreateInit = document.querySelector('.btn-create-init');
const $btnSolveExam = document.querySelector('.btn-solve-exam');
const $btnCrateExam = document.querySelector('.btn-create-exam');

// 문제풀이
const $solveExplan = document.querySelector('.solve-explan');
const $btnSolveSubmit = document.querySelector('.btn-solve-submit');
const $solveValue = document.querySelector('.solve-value');
const $warningMacthSolveText = document.querySelector('.warning-macth-solve-text');


// 랜더 함수
const render = () => {
  let htmlMatrix = '';
  crateMatrix.forEach((innerMatrix, yIndex) => {
    htmlMatrix += `<div class="y${yIndex}">`;
    innerMatrix.forEach((value, xIndex) => {
      const tempArr = [String(yIndex), String(xIndex)];
      htmlMatrix += `<div class="x${xIndex} contentBox ${pointCompass[0] === tempArr[1] && pointCompass[1] === tempArr[0] ? 'focusOn' : ''}">${value}</div>`;
    });
    htmlMatrix += '</div>';
  });
  $matrix.innerHTML = htmlMatrix;
};


// 최초 실행 랜더 함수
const firstRander = () => {
  crateMatrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));
  render();
};
window.onload = firstRander;

// data 저장 함수
const saveData = () => {
  objData = [...objData, {
    position: `${pointCompass[0]}${pointCompass[1]}`,
    direction: $dirX.checked,
    value: $createValue.value,
    caption: $createCaption.value,
    completed: false
  }];
};


// 초기화 함수
const initialize = () => {
  const initMatrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));
  crateMatrix = initMatrix;
  objData = [];
  render();
};


// 문자 삽입 함수
const setDataToMatrix = () => {
  const getValue = [...$createValue.value];
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


// 문자 중복 인터락
const interlockMatchText = () => {
  matchText = true;
  const tempMatrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));
  const getValue = [...$createValue.value];
  let matchCount = 0;

  getValue.forEach((value, i) => {
    if ($dirX.checked) {
      tempMatrix[+pointCompass[1]][+pointCompass[0] + i] = value;
    } else {
      tempMatrix[+pointCompass[1] + i][+pointCompass[0]] = value;
    }
  });

  tempMatrix.forEach((innerMatrix, yIndex) => {
    innerMatrix.forEach((value, xIndex) => {
      if (value !== '' && crateMatrix[yIndex][xIndex] !== '') {
        if (value !== crateMatrix[yIndex][xIndex]) matchCount += 1;
      }
    });
  });

  matchText = matchCount === 0 || false;
  $warningMacthInputText.textContent = matchText ? '' : `동일하지 않은 문자가 ${matchCount}개 존재합니다.`;
};


// 문자 입력 초과 인터락
const interlockMaxText = () => {
  overText = true;

  if ($dirX.checked && $createValue.value.length > crateMatrix[0].length - +pointCompass[0]) {
    overText = false;
    $warningMaxInputText.textContent = `글자 수를 초과하였습니다 ${crateMatrix[0].length - +pointCompass[0]}자 이내로 입력해 주세요.`;
  }

  if (!$dirX.checked && $createValue.value.length > crateMatrix.length - +pointCompass[1]) {
    overText = false;
    $warningMaxInputText.textContent = `글자 수를 초과하였습니다 ${crateMatrix.length - +pointCompass[1]}자 이내로 입력해 주세요.`;
  }

  if (overText) $warningMaxInputText.textContent = '';
};


// 문제 출제 빈 문자 인터락
const interlockEmptyValue = () => {
  emptyValue = $createValue.value || false;
  $warningEmtpyInputText.textContent = emptyValue ? '' : '값을 입력하세요';
};


// 문제 출제 빈 문자 인터락
const interlockEmptyCaption = () => {
  emptyCaption = $createCaption.value || false;
  $warningEmtpyCaptionText.textContent = emptyValue ? '' : '값을 입력하세요';
};


// 문제 풀기 랜더링 함수
const renderingExam = () => {
  const tempPosition = objData.map(({ position }) => position);
  document.querySelectorAll('.contentBox').forEach(content => {
    if (content.textContent === '') {
      content.classList.add('black-matrix');
    } else {
      content.classList.add('hide-text');
    }
    const tempText = `${content.className.match(/[0-9]+/)}${content.parentElement.className.match(/[0-9]+/)}`;
    tempPosition.forEach(value => {
      if (value === tempText) content.classList.add('in-exam');
    });
  });
};


// 정답 맞추기 랜더링 함수
const renderingMatchingSolution = () => {
  const tempObj = objData.filter(obj => obj.completed === true);
  let tempArr = [];
  tempObj.forEach(obj => {
    for (let i = 0; i < obj.value.length; i++) {
      if (obj.direction) {
        tempArr = [...tempArr, +obj.position + i * 10];
      } else {
        tempArr = [...tempArr, +obj.position + i];
      }
    }
  });

  document.querySelectorAll('.contentBox').forEach(content => {
    const tempText = `${content.className.match(/[0-9]+/)}${content.parentElement.className.match(/[0-9]+/)}`;
    tempArr.forEach(value => {
      if (value === +tempText) {
        content.classList.remove('in-exam');
        content.classList.remove('hide-text');
        content.classList.add('completed');
      }
    });
  });
};


// 문제 풀기 설명 함수
const setSolveExplan = () => {
  $solveExplan.textContent = '';
  if (choiceData.length) {
    choiceData.forEach(obj => {
      $solveExplan.textContent += `${obj.direction ? '가로열쇠 : ' : '세로열쇠 : '}${obj.caption}`;
    });
  }
};


// data 선택 함수
const getChoiceData = () => {
  choiceData = objData.filter(obj => !obj.completed && obj.position === `${pointCompass[0]}${pointCompass[1]}`);
};


// 정답 확인 함수
const matchingSolution = () => {
  choiceData.forEach(obj => {
    obj.completed = obj.value === $solveValue.value || false;
  });
  $warningMacthSolveText.textContent = choiceData.some(obj => obj.completed === true) ? '정답입니다' : '오답입니다';
  renderingMatchingSolution();
  getChoiceData();
  setSolveExplan();
};


// 좌표 취득 함수
const getPointOfCompass = target => {
  document.querySelectorAll('.contentBox').forEach(content => {
    content.classList.remove('focusOn');
  });
  pointCompass = [`${target.className.match(/[0-9]+/)}`, `${target.parentElement.className.match(/[0-9]+/)}`];
  $pointCompass.innerHTML = `X축 좌표 : ${pointCompass[0]}<br>Y축 좌표 : ${pointCompass[1]}`;
  target.classList.add('focusOn');

  getChoiceData();
  setSolveExplan();
};


// 문제풀이 버튼 이벤트
$btnSolveExam.onclick = () => {
  $solveExam.classList.remove('hidden');
  $createExam.classList.add('hidden');
  renderingExam();
};


// 출제하기 버튼 이벤트
$btnCrateExam.onclick = () => {
  $solveExam.classList.add('hidden');
  $createExam.classList.remove('hidden');
  render();
};


// 좌표 취득 이벤트
$matrix.onclick = ({ target }) => {
  if (!target.matches('.contentBox')) return;
  getPointOfCompass(target);
};


// 초기화 이벤트
$btnCreateInit.onclick = () => {
  initialize();
};


// 문제 출제 text 입력 이벤트
$createValue.onblur = () => {
  interlockMaxText();
  if (!overText) return;
  interlockMatchText();
  interlockEmptyValue();
  interlockEmptyCaption();
};


// 문제 출제 이벤트
$btnCreateSubmit.onclick = () => {
  interlockEmptyValue();
  interlockEmptyCaption();
  if (!overText || !matchText || !emptyValue || !emptyCaption) return;
  setDataToMatrix();
  saveData();
  $createValue.value = '';
  $createCaption.value = '';
};


// 정답 확인 이벤트
$btnSolveSubmit.onclick = () => {
  matchingSolution();
  $solveValue.value = '';
};
