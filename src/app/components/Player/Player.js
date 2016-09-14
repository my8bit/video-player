class PlayerController {
  /** @ngInject */
  constructor(streamService) {
    this.streamService = streamService;
    streamService.onChange(this.changeSrc.bind(this));
    streamService.getActive();
  }

  changeSrc(src) {
    this.src = src;
  }

  setCommands(play, pause) {
    this.streamService.setCommands(play, pause);
  }
}

export const Player = function () {
  return {
    templateUrl: 'app/components/Player/Player.html',
    restrict: 'E',
    controller: PlayerController,
    bindToController: true,
    controllerAs: '$ctrl',
    link: (scope, element, attrs, ctrl) => {
      const videoEl = element.find('video')[0];
      ctrl.setCommands(videoEl.play, videoEl.pause);
    }
  };
};
