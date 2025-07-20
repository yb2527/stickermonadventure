var namMember = new Array(
    "청춘러브레터",
    "전격고백",
    "금붕어",
    "행복은 메론사탕맛",
    "Sunday monday",
    "homebabyhome",
    "빙하기",
    "Look back",
);

var lstMember = new Array();
var parent = new Array();
var equal = new Array();
var rec = new Array();
var cmp1, cmp2;
var head1, head2;
var nrec;

var numQuestion;
var totalSize;
var finishSize;
var finishFlag;

// 리스트 초기화
function initList() {
    var n = 0;
    var mid, i;

    lstMember[n] = new Array();
    for (i = 0; i < namMember.length; i++) {
        lstMember[n][i] = i; // 항목을 인덱스로 초기화
    }
    parent[n] = -1;
    totalSize = 0;
    n++;

    for (i = 0; i < lstMember.length; i++) {
        if (lstMember[i].length >= 2) {
            mid = Math.ceil(lstMember[i].length / 2);

            lstMember[n] = lstMember[i].slice(0, mid);
            totalSize += lstMember[n].length;
            parent[n] = i;
            n++;

            lstMember[n] = lstMember[i].slice(mid, lstMember[i].length);
            totalSize += lstMember[n].length;
            parent[n] = i;
            n++;
        }
    }

    // equal 배열 초기화 (각 항목이 어떤 항목과 같은지 저장)
    for (i = 0; i < namMember.length; i++) {
        equal[i] = i; // 초기에는 자기 자신과 같다고 설정 (그룹 대표 인덱스)
        rec[i] = 0; // rec 배열 초기화
    }
    nrec = 0; // rec 배열의 현재 인덱스

    cmp1 = lstMember.length - 2;
    cmp2 = lstMember.length - 1;
    head1 = 0;
    head2 = 0;
    numQuestion = 1;
    finishSize = 0;
    finishFlag = 0;
}

// 정렬 처리
function sortList(flag) {
    var i, str;

    if (finishFlag === 1) { // 정렬이 이미 완료된 경우, 추가 호출 방지
        return;
    }

    // 현재 선택된 두 항목의 실제 인덱스 (namMember 기준)
    var currentCmp1 = lstMember[cmp1][head1];
    var currentCmp2 = lstMember[cmp2][head2];

    if (flag < 0) { // 왼쪽 선택 (cmp1 승리)
        rec[nrec++] = currentCmp1;
        finishSize++;
        head1++;
    } else if (flag > 0) { // 오른쪽 선택 (cmp2 승리)
        rec[nrec++] = currentCmp2;
        finishSize++;
        head2++;
    } else { // 같음 선택 (equal)
        rec[nrec++] = currentCmp1;
        rec[nrec++] = currentCmp2;
        finishSize += 2; // 두 항목이 모두 처리됨

        equal[currentCmp1] = currentCmp2;
        equal[currentCmp2] = currentCmp1; // 서로가 같다고 표시

        head1++;
        head2++;
    }

    while (head1 < lstMember[cmp1].length && head2 === lstMember[cmp2].length) {
        rec[nrec++] = lstMember[cmp1][head1++];
        finishSize++;
    }
    while (head2 < lstMember[cmp2].length && head1 === lstMember[cmp1].length) {
        rec[nrec++] = lstMember[cmp2][head2++];
        finishSize++;
    }


    if (head1 === lstMember[cmp1].length && head2 === lstMember[cmp2].length) {
        // 현재 비교 중인 두 서브리스트의 병합이 완료됨
        for (i = 0; i < nrec; i++) { // nrec (현재 rec에 채워진 개수) 만큼만 복사
            lstMember[parent[cmp1]][i] = rec[i];
        }
        lstMember[parent[cmp1]].length = nrec; // 정확한 길이로 조정

        lstMember.pop(); // cmp2 리스트 제거
        lstMember.pop(); // cmp1 리스트 제거
        cmp1 -= 2;
        cmp2 -= 2;
        head1 = 0;
        head2 = 0;
        nrec = 0; // rec 배열 초기화

        if (cmp1 < 0) { // 모든 정렬 단계가 완료됨
        }
    }

    if (cmp1 < 0) { // 모든 정렬 완료
        str = "Battle No." + (numQuestion - 1) + "<br>" + Math.floor(finishSize * 100 / totalSize) + "% sorted.";
        document.getElementById("battleNumber").innerHTML = str;
        showResult(); // 최종 결과 표시
        finishFlag = 1; // 정렬 완료 플래그 설정
    } else {
        showImage(); // 다음 비교 항목 표시
    }
}

// 결과 출력
function showResult() {
    var ranking = 1;
    var sameRank = 1;
    var str = "";
    var i;

    str += "<table class='result-table' align='center'>";
    str += "<thead><tr><th>순위</th><th>이름</th></tr></thead>";

    str += "<tbody>";
    for (i = 0; i < namMember.length; i++) {
        if (i > 0 && equal[lstMember[0][i]] === lstMember[0][i - 1]) {
        } else {
            ranking = i + 1;
        }

        str += "<tr><td>" + ranking + "</td><td>" + namMember[lstMember[0][i]] + "</td></tr>";

    }
    str += "</tbody>";
    str += "</table>";
    document.getElementById("resultField").innerHTML = str;
}


function showImage() {
    var str0 = "Battle No." + numQuestion + "<br>" + Math.floor(finishSize * 100 / totalSize) + "% sorted.";
    var str1 = toNameFace(lstMember[cmp1][head1]);
    var str2 = toNameFace(lstMember[cmp2][head2]);

    document.getElementById("battleNumber").innerHTML = str0;
    document.getElementById("leftField").innerHTML = str1;
    document.getElementById("rightField").innerHTML = str2;

    numQuestion++;
}

function toNameFace(n) {
    return namMember[n];
}