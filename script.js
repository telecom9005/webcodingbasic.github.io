const currentTime = new Date();
let year = currentTime.getFullYear(); // 현재 연도
let month = currentTime.getMonth() + 1; // 월
let date = currentTime.getDate(); // 일
let hours = currentTime.getHours(); // 시
let minutes = currentTime.getMinutes(); // 분

// 시간 조건에 따른 hours 값 조정
if (5 <= hours && hours < 8)
    hours = 5;
else if (8 <= hours && hours < 11)
    hours = 8;
else if (11 <= hours && hours < 14)
    hours = 11;
else if (14 <= hours && hours < 17)
    hours = 14;
else if (17 <= hours && hours < 20)
    hours = 17;
else if (20 <= hours && hours < 23)
    hours = 20;
else if (23 <= hours || hours < 5) {
    hours = 23;
    // 날짜를 하루 전으로 설정
    currentTime.setDate(currentTime.getDate() - 1);
    // 날짜 정보를 업데이트
    year = currentTime.getFullYear();
    month = currentTime.getMonth() + 1;
    date = currentTime.getDate();
}

// 앞에 0을 붙이기
month = month < 10 ? `0${month}` : month;
date = date < 10 ? `0${date}` : date;
hours = hours < 10 ? `0${hours}` : hours;
minutes = minutes < 10 ? `0${minutes}` : minutes;
var shortyear = year % 100;

// HTML 요소 업데이트
//document.getElementById('year').innerText = `현재 시간 : ${shortyear}년`;
document.getElementById('month').innerText = `현재 시간 : ${month}월`;
document.getElementById('date').innerText = `${date}일`; // 일 추가
document.getElementById('hours').innerText = `${hours}시`;
document.getElementById('minutes').innerText = `${minutes}분`;


let nx = "91";	//용상동 X 좌표(위도)
let ny = "105";	//용상동 Y 좌표(경도)
let baseDate = `${year}${month}${date}`;	//조회하고싶은 날짜
let baseTime = `${hours}${minutes}`;	//조회하고싶은 시간
let fore = `예보 시간 : ${month}월 ${date}일 ${hours}시 00분`;
var forecast = document.getElementById('forecast');
        forecast.textContent = fore;


let apikey = 'O98yLFgkSaUSG4OV5ydFEfhSE0hNCUWmCypCqZ7IyQjm5J3h9SKEq1WzHAIM0%2FZaLHKp5dgSC5%2BOAP78megY4w%3D%3D';
var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'; /*단기예보조회 주소*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apikey; /*API 인증키*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /*페이지 수*/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /*한 페이지 결과 수*/
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /*데이터 타입*/
queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(baseDate); /*발표일자*/
queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(baseTime); /*발표시각*/
queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(nx); 
queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(ny); 


xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        var items = response.response.body.items.item;
        // HTML에 출력할 문자열 초기화
        var outputHtml = '';

        // 각 예보 시간(fcstTime)마다 category가 "TMP"인 항목 찾기 및 출력 문자열 구성
        items.forEach(function(item) {
            if (item.category === "TMP") {
                outputHtml += `예보 시간: ${item.fcstTime.slice(0, 2)}시, 예보 값: ${item.fcstValue}°C, `;
            }
            if (item.category === "WSD") {
                // 풍속 값이 정수일 때 .0을 추가하기 위해 수정
                let wsdValue = parseFloat(item.fcstValue);
                let wsdValueFixed = Number.isInteger(wsdValue) ? wsdValue.toFixed(1) : wsdValue.toString();
                outputHtml += `풍속: ${wsdValueFixed}m/s, `;
            }
            if (item.category === "POP") {
                outputHtml += `강수 확률: ${item.fcstValue}%, `;
            }
            if (item.category === "REH") {
                outputHtml += `습도: ${item.fcstValue}, `;
            }
            if (item.category === "SKY") {
                outputHtml += `하늘 상태: ${item.fcstValue}, `;
            }
            if (item.category === "PTY") {
                outputHtml += `강수 형태: ${item.fcstValue}<br>`;
            }
        });
        
        // HTML 요소에 출력 문자열 설정
        var weatherElement = document.getElementById('fcst-value');
        //weatherElement.innerHTML = outputHtml;

        // 예보 시간을 저장할 배열 초기화
        var forecastTimes = [];
        var tmpValues = [];
        var skyValues = [];
        var ptyValues = [];
        var popValues = [];
        var rehValues = [];
        var wsdValues = [];

        // 각 예보 항목을 순회하며 예보 시간만 배열에 추가
        items.forEach(function(item) {
            // 예보 시간이 배열에 없는 경우에만 추가 (중복 제거)
            if (forecastTimes.indexOf(item.fcstTime) === -1) {
                forecastTimes.push(item.fcstTime);
            }
            if (item.category === "TMP") {
                tmpValues.push(item.fcstValue); // TMP 값 추가
            }
            if (item.category === "SKY") {
                skyValues.push(item.fcstValue); // SKY 값 추가
            }
            if (item.category === "PTY") {
                ptyValues.push(item.fcstValue); // PTY 값 추가
            }
            if (item.category === "POP") {
                popValues.push(item.fcstValue); // POP 값 추가
            }
            if (item.category === "REH") {
                rehValues.push(item.fcstValue); // REH 값 추가
            }
            if (item.category === "WSD") {
                let wsdValue = parseFloat(item.fcstValue);
                let wsdValueFixed = Number.isInteger(wsdValue) ? wsdValue.toFixed(1) : wsdValue.toString();
                wsdValues.push(wsdValueFixed); // WSD 값 추가
            }
        });
        console.log(wsdValues);
        // "time" 클래스를 가진 모든 요소 선택
        var times = document.getElementsByClassName('time');
        var tmps = document.getElementsByClassName('tmp');
        var skys = document.getElementsByClassName('sky');
        var pops = document.getElementsByClassName('pop');
        var rehs = document.getElementsByClassName('reh');
        var wsds = document.getElementsByClassName('wsd');

        // 예보 시간 배열과 박스 요소를 순회하며 예보 시간을 클래스에 할당
        for (var i = 0; i < forecastTimes.length && i < times.length && i < tmps.length; i++) {
            // 예보 시간 형식을 HH시로 변경
            var timeFormatted = forecastTimes[i].slice(0, 2) + '시';
            var tmpFormatted = '온도: ' + tmpValues[i] + '°C';
            var popFormatted = '강수 확률:' + popValues[i] + '%';
            var rehFormatted = '습도: ' + rehValues[i] + '%';
            var wsdFormatted = '풍속: ' + wsdValues[i] + 'm/s';
            // 해당 클래스에 예보 시간 텍스트 설정
            times[i].textContent = timeFormatted;
            tmps[i].textContent = tmpFormatted;
            pops[i].textContent = popFormatted;
            rehs[i].textContent = rehFormatted;
            wsds[i].textContent = wsdFormatted;
            if (skyValues[i] === '1' && ptyValues[i] === '0') { //하늘 상태가 맑음(1)이고, 강수형태가 없음(0)일 경우
                skys[i].src = 'images/clear.png';
            }
            else if (ptyValues[i] === '1' || ptyValues[i] === '2'){ //강수형태가 비(1), 비/눈(2)일 경우
                skys[i].src = 'images/rain.png';
            }
            else if (ptyValues[i] === '3') {  //강수형태가 눈(3)일 경우 
                skys[i].src = 'images/snow.png';
            }
            else { //위의 경우가 아닐경우
                skys[i].src = 'images/clouds.png';
            }
        }
    }
};
xhr.send('');