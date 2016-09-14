import angular from 'angular';
//  import 'normalize-css';
import './index.scss';
import {Playlist} from './app/components/Playlist/Playlist';
import {Player} from './app/components/Player/Player';
import {Controls} from './app/components/Controls/Controls';
import {StreamService} from './app/services/stream';

angular
  .module('app', [])
  .config($sceDelegateProvider => {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://www.w3schools.com/**',
      'http://www.sample-videos.com/**',
      'blob:http://dashif.org/**',
      'http://dashif.org/**',
      'http://rdmedia.bbc.co.uk/**',
      'http://demo.unified-streaming.com/**',
      'http://localhost:3000/**',
      'blob:http://localhost:3000/**'
    ]);
  })
  .service('streamService', StreamService)
  .component('hlsPlaylist', Playlist)
  .component('hlsPlayerControls', Controls)
  .directive('hlsPlayer', Player);
