wVideoUploader.directive('wUpload', ['checkVideoStatusFactory', 'fileUpload', '$http', '$rootScope', '$interval', function(fileUpload, $http, checkVideoStatusFactory, $rootScope, $interval){
		return {
			restrict: 'EA', // As directive and as web component
			scope: {}, // Creates an isolated Scope
			templateUrl: 'templates/wUpload.html', // Template Path

			controller: ['$scope', 'checkVideoStatusFactory', '$interval', function($scope, checkVideoStatusFactory, $interval) {
				$scope.uploading = false;
				$scope.fail = false;
				$scope.percentage = 0;
				$scope.abortupload = false;
				$scope.processing = false;
				$rootScope.videoStatus = 'not assigned';

				$scope.checkVideoStatus = function(){
					var interval = $interval(function() {
						checkVideoStatusFactory.getData();
					}, 1000);

					$rootScope.$watch('processingPercentage', function() {
						$scope.processingPercentage = $rootScope.processingPercentage;
					});

					var unregister = $rootScope.$watch('videoStatus', function(){
						// console.log($rootScope.videoStatus);
						if ($rootScope.videoStatus == 'ready') {
							$interval.cancel(interval);
							$scope.processing = false;
							$scope.uploading = false;
							$scope.percentage = 0;
							$('.percentage-value').css('left', '0%');

							var embedVideo = '<div class="wistia_embed wistia_async_' + $rootScope.whash + '" style="width:640px;height:360px;"></div>';
							$('#wistia-container').append(embedVideo);
							unregister();
						}else if ($rootScope.videoStatus == 'failed') {
							$scope.uploading = false;
							$scope.processing = false;
							$scope.percentage = 0;
							$('.percentage-value').css('left', '0%');
							$scope.fail = true;
						};
					});
				}

				$scope.options = {
					url: 'https://upload.wistia.com/',
					type: 'POST',
					formData: [{
						name: 'api_password',
						value: '56ca3bfc3c800fe62b28d0ae4e4b94ac60218e91381f82e382ad6be6ec84ac5a'	//put your key
					}],
					acceptFileTypes: /(\.|\/)(mp4|avi|ogg)$/i,

					add: function(e, data) {
						console.log('ADD');
						console.log(data);
						$scope.uploading = false;
						$scope.processing = false;
						$scope.fail = false;
						$rootScope.videoStatus = 'not assigned';

						if (data.files[0]) {
							$scope.uploading = true; // Displaying the progress bar
							$scope.jqXHR = data.submit();
							$scope.$apply();
						};
					},
					fail: function() {
						console.log('FAIL');
						$scope.uploading = false;
						$scope.processing = false;
						$scope.percentage = 0;
						$('.percentage-value').css('left', '0%');

						if ($scope.jqXHR.statusText != 'abort') {
							$scope.fail = true; // Displaying the error message if not aborted
						};

						$scope.$apply();
					},
					progressall: function (e, data) {
						console.log('PROGRESSALL');
						if ($scope.abortupload) {
							$scope.jqXHR.abort();
							$scope.abortupload = false;
							return;
						};

						$scope.fileSize = parseFloat((data.total / 1024) / 1024).toFixed(1);
						$scope.fileTotalUploaded = parseFloat((data.loaded / 1024) / 1024).toFixed(1);

						$scope.percentage = parseInt(data.loaded / data.total * 100, 10);

						if ($scope.percentage <= 96) {
							$('.percentage-value').css('left', $scope.percentage + '%');
						}else if($scope.percentage == 100){
							$scope.processing = true;
						};
						$scope.$apply();
					},
					done: function(e, data) {
						console.log('DONE');
						$rootScope.whash = data.result.hashed_id;
						$scope.fail = false;

						$scope.checkVideoStatus();

						$scope.$apply();
					},
					abort: function(e, data){
						console.log('ABORTED');
					}
				};
			}],

			link: function(scope, element, attrs) {
				$('#fileupload').fileupload(scope.options);
				$('#abortupload').bind('click', function(){
					scope.abortupload = true;
				});
			}
		}
}]);
