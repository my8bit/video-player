class PlaylistController {
  /** @ngInject */
  constructor(streamService) {
    this.streamService = streamService;
    this.videos = this.streamService.getVideos();
    this.selected = this.videos[0];
    this.streamService.setActive(this.selected.id);
  }

  selectVideo() {
    this.streamService.setActive(this.selected[0]);
  }
}

export const Playlist = {
  templateUrl: 'app/components/Playlist/Playlist.html',
  controller: PlaylistController
};
