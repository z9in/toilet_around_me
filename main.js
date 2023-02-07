
      let geocoder = new kakao.maps.services.Geocoder();
      let container = document.getElementById('map');
      let inputBox = document.getElementById('input');
      let buttons = document.getElementById('submit');

      document.getElementById('input').addEventListener('keydown',(e)=>{
        if(e.keyCode==13) {
          return finding(e.target.value)
        }
      })
      buttons.addEventListener('click',()=>{
        return finding(inputBox.value)
      })
      function finding(values='안양'){
        inputBox.value=''
        geocoder.addressSearch(values, function(result, status) { 
        return maping(result)
      })
      }
      // console.log(result)
      function maping(result) {
      var options = {
        center: new kakao.maps.LatLng(result[0].y, result[0].x),
        level: 3,
      }
      var map = new kakao.maps.Map(container, options)
      return marking(map)
      }
      finding()
      


      

        function marking(map) {
            fetch('./kyunggi_toilets.json')
            .then((res) => res.json())
            .then((data) => {
              coords = data.map((e) => [
                {
                  title: e.PBCTLT_PLC_NM,
                  lat1: e.REFINE_WGS84_LAT,
                  lat2: e.REFINE_WGS84_LOGT
                },
              ])   
              var imageSrc =
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';  
              for (var i = 0; i <coords.length; i++) {
        
                // 마커 이미지의 이미지 크기 입니다
                var imageSize = new kakao.maps.Size(20, 30)
                // 마커 이미지를 생성합니다
                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)
                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                  map: map, // 마커를 표시할 지도
                  title: coords[i][0].title,

                  position: new kakao.maps.LatLng(coords[i][0].lat1,coords[i][0].lat2),  // 마커를 표시할 위치
                  image: markerImage, // 마커 이미지
                })
              }  
              kakao.maps.event.addListener(map, 'click', function(e) {        
            // 클릭한 위도, 경도 정보를 가져옵니다 
                var latlng = e.latLng;
                return roadViewing(latlng)             
            });
            
            // window.addEventListener('click',(e)=>{
            //     if(Boolean(e.target.title)==true) {
            //         document.getElementById('titleA').innerText=`${e.target.title}`
            //     }else {
            //         document.getElementById('titleA').innerText=``
            //     }
                
            // })

            function roadViewing(latlng) {
                var roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
                if(Boolean(latlng)==true) {
                    var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
                    var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
                    var position = new kakao.maps.LatLng(latlng.getLat(),latlng.getLng());
                    // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
                    roadviewClient.getNearestPanoId(position, 50, function(panoId) {
                   roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행 
                })
                }else {                    
                    roadviewContainer.innerHTML = '클릭하면 주변 사진을 확인하실 수 있습니다.'
                }
            }
            roadViewing()
            })     
        }
       