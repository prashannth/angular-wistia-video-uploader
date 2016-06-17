wVideoUploader.factory('checkVideoStatusFactory', function($http, $rootScope){
	return {
		getData: function(){
			$http.get('https://api.wistia.com/v1/medias.json', {
				params: {
					hashed_id: $rootScope.whash,
					api_password: '56ca3bfc3c800fe62b28d0ae4e4b94ac60218e91381f82e382ad6be6ec84ac5a'	//put your key
				}
			}).success(function(data) {
				$rootScope.videoStatus = data[0].status;
				$rootScope.processingPercentage = parseInt(data[0].progress * 100, 10);
			}).error(function(){
				console.log('Error');
			});
		}
	}
});
