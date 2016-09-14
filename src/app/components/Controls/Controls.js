class ControlsController {
  /** @ngInject */
  constructor(streamService) {
    this.streamService = streamService;
    this.$onInit = () => {
      // console.log(this.PlayerController);
    };
  }

  play() {
    console.log('Play fired');
    this.streamService.play();
  }

  volumeChanged() {
    console.log(this.volume);
  }

  stop() {
    console.log('Stop fired');
  }

  fastForward() {
    console.log('Fast-forward fired');
  }

}

export const Controls = {
  templateUrl: 'app/components/Controls/Controls.html',
  controller: ControlsController,
  require: {
    PlayerController: '^hlsPlayer'
  }
};
